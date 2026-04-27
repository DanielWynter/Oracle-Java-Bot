package com.springboot.MyTodoList.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@Transactional
public class AIPriorityController {

    private static final Logger log = LoggerFactory.getLogger(AIPriorityController.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping("/suggest-priority")
    public ResponseEntity<Map<String, String>> suggestPriority(@RequestBody Map<String, Object> body) {
        String description = (String) body.getOrDefault("description", "");
        Object assigneeIdObj = body.get("assigneeId");

        String workloadContext = "No assignee selected.";
        if (assigneeIdObj != null) {
            try {
                Long assigneeId = Long.valueOf(assigneeIdObj.toString());
                List<Object[]> counts = entityManager.createQuery(
                    "SELECT t.status, COUNT(t) FROM Task t WHERE t.assignee.userId = :uid AND t.status <> 'done' GROUP BY t.status",
                    Object[].class
                ).setParameter("uid", assigneeId).getResultList();

                if (counts.isEmpty()) {
                    workloadContext = "The assignee has no active tasks.";
                } else {
                    StringBuilder sb = new StringBuilder("The assignee currently has: ");
                    for (Object[] row : counts) {
                        sb.append(row[1]).append(" '").append(row[0]).append("' task(s), ");
                    }
                    workloadContext = sb.toString().replaceAll(", $", ".");
                }
            } catch (Exception ignored) {}
        }

        String title = (String) body.getOrDefault("title", "");

        String prompt = String.format(
            "Based on the task name, description, and assignee workload below, suggest:\n" +
            "1. A priority level: low, medium, or high\n" +
            "2. A task type: feature, bug, issue, or enhancement\n" +
            "3. An estimated time in hours (integer, e.g. 1, 2, 4, 8)\n\n" +
            "Task name: %s\n" +
            "Task description: %s\n" +
            "Assignee workload: %s\n\n" +
            "Respond ONLY with valid JSON, no markdown, no extra text:\n" +
            "{\"priority\": \"low|medium|high\", \"type\": \"feature|bug|issue|enhancement\", \"hours\": N, \"reason\": \"one short sentence under 20 words\"}",
            title.isBlank() ? "Not provided." : title,
            description.isBlank() ? "No description provided." : description,
            workloadContext
        );

        try {
            String requestBody = mapper.writeValueAsString(Map.of(
                "model", "gpt-4o-mini",
                "max_tokens", 100,
                "messages", List.of(
                    Map.of("role", "system", "content",
                        "You are a project management assistant. Respond ONLY with valid JSON, no markdown, no extra text."),
                    Map.of("role", "user", "content", prompt)
                )
            ));

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + openaiApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("OpenAI status: {}", response.statusCode());
            log.info("OpenAI body: {}", response.body());

            JsonNode root = mapper.readTree(response.body());

            if (root.path("choices").isMissingNode() || root.path("choices").isEmpty()) {
                String errorMsg = root.path("error").path("message").asText("Unknown error from OpenAI.");
                log.error("OpenAI API error: {}", errorMsg);
                return ResponseEntity.ok(Map.of("priority", "medium", "reason", "AI error: " + errorMsg));
            }

            String text = root.path("choices").get(0)
                .path("message").path("content").asText();

            text = text.trim()
                .replaceAll("(?s)^```json\\s*", "")
                .replaceAll("(?s)^```\\s*", "")
                .replaceAll("\\s*```$", "")
                .trim();

            JsonNode result = mapper.readTree(text);

            String priority = result.path("priority").asText("medium").toLowerCase();
            if (!List.of("low", "medium", "high").contains(priority)) priority = "medium";

            String type = result.path("type").asText("feature").toLowerCase();
            if (!List.of("feature", "bug", "issue", "enhancement").contains(type)) type = "feature";

            int hours = result.path("hours").asInt(2);
            if (hours < 1) hours = 1;

            String reason = result.path("reason").asText("Based on task complexity and current workload.");

            return ResponseEntity.ok(Map.of(
                "priority", priority,
                "type", type,
                "hours", String.valueOf(hours),
                "reason", reason
            ));
        } catch (Exception e) {
            log.error("AI suggest-priority failed", e);
            return ResponseEntity.ok(Map.of("priority", "medium", "reason", "Could not reach AI service."));
        }
    }
}
