package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.config.BotProps;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.util.BotLabels;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;
import org.telegram.telegrambots.longpolling.BotSession;
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer;
import org.telegram.telegrambots.longpolling.starter.AfterBotRegistration;
import org.telegram.telegrambots.longpolling.starter.SpringLongPollingBot;
import org.telegram.telegrambots.longpolling.util.LongPollingSingleThreadUpdateConsumer;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.generics.TelegramClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class TaskBotController implements SpringLongPollingBot, LongPollingSingleThreadUpdateConsumer {

    private static final Logger logger = LoggerFactory.getLogger(TaskBotController.class);

    private static final String STATE_AWAITING_SPRINT = "AWAITING_SPRINT";

    // Per-user conversation state and sprint options
    private final Map<Long, String> userState = new ConcurrentHashMap<>();
    private final Map<Long, Map<String, Long>> userSprintOptions = new ConcurrentHashMap<>();

    private final TelegramClient telegramClient;
    private final BotProps botProps;
    private final TaskService taskService;
    private final SprintService sprintService;

    public TaskBotController(BotProps botProps, TaskService taskService, SprintService sprintService) {
        this.botProps = botProps;
        this.taskService = taskService;
        this.sprintService = sprintService;
        this.telegramClient = new OkHttpTelegramClient(botProps.getToken());
    }

    @Override
    public String getBotToken() {
        return botProps.getToken();
    }

    @Override
    public LongPollingUpdateConsumer getUpdatesConsumer() {
        return this;
    }

    @Override
    public void consume(Update update) {
        if (!update.hasMessage() || !update.getMessage().hasText()) return;

        String text = update.getMessage().getText();
        long chatId = update.getMessage().getChatId();
        String state = userState.getOrDefault(chatId, "");

        if ("/start".equals(text) || BotLabels.SHOW_MAIN_SCREEN.getLabel().equals(text)) {
            userState.remove(chatId);
            userSprintOptions.remove(chatId);
            sendMainMenu(chatId);

        } else if (BotLabels.VIEW_TASKS.getLabel().equals(text)) {
            askForSprint(chatId);

        } else if (STATE_AWAITING_SPRINT.equals(state)) {
            handleSprintSelection(chatId, text);
        }
    }

    // ── Main menu ────────────────────────────────────────────────────────────

    private void sendMainMenu(long chatId) {
        ReplyKeyboardMarkup keyboard = ReplyKeyboardMarkup.builder()
            .resizeKeyboard(true)
            .keyboardRow(new KeyboardRow(BotLabels.VIEW_TASKS.getLabel()))
            .build();
        send(chatId, "¡Hola! Soy el bot de gestión de tareas. Selecciona una opción:", keyboard, null);
    }

    // ── Sprint selection ─────────────────────────────────────────────────────

    private void askForSprint(long chatId) {
        List<Sprint> sprints = sprintService.findAll();

        // Build name → id map and store it for this user
        Map<String, Long> options = new ConcurrentHashMap<>();
        for (Sprint s : sprints) {
            options.put(s.getSprintName(), s.getSprintId());
        }
        userSprintOptions.put(chatId, options);
        userState.put(chatId, STATE_AWAITING_SPRINT);

        // Build keyboard: one row per sprint + "All" at the top
        List<KeyboardRow> rows = new ArrayList<>();
        rows.add(new KeyboardRow(BotLabels.ALL_SPRINTS.getLabel()));
        for (Sprint s : sprints) {
            rows.add(new KeyboardRow(s.getSprintName()));
        }

        ReplyKeyboardMarkup keyboard = ReplyKeyboardMarkup.builder()
            .resizeKeyboard(true)
            .keyboard(rows)
            .build();

        send(chatId, "¿De qué sprint deseas ver las tasks?", keyboard, null);
    }

    private void handleSprintSelection(long chatId, String text) {
        userState.remove(chatId);
        Map<String, Long> options = userSprintOptions.remove(chatId);

        List<Task> tasks;
        String header;

        if (BotLabels.ALL_SPRINTS.getLabel().equals(text)) {
            tasks = taskService.findAll();
            header = "todos los sprints";
        } else if (options != null && options.containsKey(text)) {
            Long sprintId = options.get(text);
            tasks = taskService.findBySprintId(sprintId);
            header = text;
        } else {
            send(chatId, "Opción no reconocida. Usa /start para volver al menú.", null, null);
            return;
        }

        sendTaskList(chatId, tasks, header);
    }

    // ── Task list ─────────────────────────────────────────────────────────────

    private void sendTaskList(long chatId, List<Task> tasks, String sprintLabel) {
        if (tasks.isEmpty()) {
            send(chatId, "No hay tasks en <b>" + sprintLabel + "</b>.", null, "HTML");
            return;
        }

        List<Task> todo       = filter(tasks, "todo", "to-do", "to_do", "pending");
        List<Task> inProgress = filter(tasks, "in-progress", "inprogress", "in progress", "in_progress");
        List<Task> blocked    = filter(tasks, "blocked");
        List<Task> done       = filter(tasks, "done", "completed", "finished");

        StringBuilder sb = new StringBuilder();
        sb.append("<b>📋 Tasks · ").append(sprintLabel).append("</b>\n\n");
        appendGroup(sb, "⏳ Por hacer",    todo);
        appendGroup(sb, "🔄 En progreso", inProgress);
        appendGroup(sb, "🚫 Bloqueadas",  blocked);
        appendGroup(sb, "✅ Completadas", done);

        // Show main menu keyboard again so the user can navigate back
        ReplyKeyboardMarkup keyboard = ReplyKeyboardMarkup.builder()
            .resizeKeyboard(true)
            .keyboardRow(new KeyboardRow(BotLabels.VIEW_TASKS.getLabel()))
            .build();

        send(chatId, sb.toString(), keyboard, "HTML");
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private List<Task> filter(List<Task> tasks, String... statuses) {
        return tasks.stream()
            .filter(t -> {
                if (t.getStatus() == null) return false;
                for (String s : statuses) {
                    if (s.equalsIgnoreCase(t.getStatus())) return true;
                }
                return false;
            })
            .collect(Collectors.toList());
    }

    private void appendGroup(StringBuilder sb, String title, List<Task> tasks) {
        if (tasks.isEmpty()) return;
        sb.append("<b>").append(title).append("</b> (").append(tasks.size()).append(")\n");
        for (Task t : tasks) {
            String priority = t.getPriority() != null ? t.getPriority().toLowerCase() : "medium";
            String dot;
            if ("high".equals(priority))     dot = "🔴";
            else if ("low".equals(priority)) dot = "🟢";
            else                             dot = "🟡";
            sb.append(dot).append(" ").append(t.getTaskName()).append("\n");
        }
        sb.append("\n");
    }

    private void send(long chatId, String text, ReplyKeyboardMarkup keyboard, String parseMode) {
        try {
            SendMessage.SendMessageBuilder<?, ?> builder = SendMessage.builder()
                .chatId(chatId)
                .text(text);
            if (keyboard != null)  builder.replyMarkup(keyboard);
            if (parseMode != null) builder.parseMode(parseMode);
            telegramClient.execute(builder.build());
        } catch (Exception e) {
            logger.error("Error sending Telegram message", e);
        }
    }

    @AfterBotRegistration
    public void afterRegistration(BotSession botSession) {
        logger.info("Bot registered and running: {}", botSession.isRunning());
    }
}
