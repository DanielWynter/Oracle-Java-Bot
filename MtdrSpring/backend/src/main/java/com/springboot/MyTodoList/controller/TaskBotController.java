package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.config.BotProps;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.service.UserService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class TaskBotController implements SpringLongPollingBot, LongPollingSingleThreadUpdateConsumer {

    private static final Logger logger = LoggerFactory.getLogger(TaskBotController.class);

    private enum BotState {
        IDLE,
        AWAITING_FILTER_TYPE,
        AWAITING_ASSIGNEE,
        AWAITING_SPRINT_AFTER_ASSIGNEE,
        AWAITING_SPRINT_ONLY
    }

    private static class ChatSession {
        BotState state = BotState.IDLE;
        Long selectedUserId = null;
        String selectedUserName = null;
        Map<String, Long> userMap = new HashMap<>();
        Map<String, Long> sprintMap = new HashMap<>();
    }

    private final Map<Long, ChatSession> sessions = new ConcurrentHashMap<>();

    private final TelegramClient telegramClient;
    private final BotProps botProps;
    private final TaskService taskService;
    private final UserService userService;
    private final SprintService sprintService;

    public TaskBotController(BotProps botProps, TaskService taskService,
                             UserService userService, SprintService sprintService) {
        this.botProps = botProps;
        this.taskService = taskService;
        this.userService = userService;
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

        String text = update.getMessage().getText().trim();
        long chatId = update.getMessage().getChatId();
        ChatSession session = sessions.computeIfAbsent(chatId, id -> new ChatSession());

        if ("/start".equals(text)
                || BotLabels.SHOW_MAIN_SCREEN.getLabel().equals(text)
                || BotLabels.MAIN_MENU.getLabel().equals(text)) {
            session.state = BotState.IDLE;
            sendMainMenu(chatId);
            return;
        }

        switch (session.state) {
            case IDLE:
                if (BotLabels.VIEW_TASKS.getLabel().equals(text)) {
                    session.state = BotState.AWAITING_FILTER_TYPE;
                    sendFilterMenu(chatId);
                }
                break;

            case AWAITING_FILTER_TYPE:
                handleFilterTypeSelection(chatId, text, session);
                break;

            case AWAITING_ASSIGNEE:
                handleAssigneeSelection(chatId, text, session);
                break;

            case AWAITING_SPRINT_AFTER_ASSIGNEE:
                handleSprintAfterAssignee(chatId, text, session);
                break;

            case AWAITING_SPRINT_ONLY:
                handleSprintOnlySelection(chatId, text, session);
                break;

            default:
                sendMainMenu(chatId);
                break;
        }
    }

    // ── Step 1: Main menu ──────────────────────────────────────────────────────

    private void sendMainMenu(long chatId) {
        ReplyKeyboardMarkup keyboard = ReplyKeyboardMarkup.builder()
            .resizeKeyboard(true)
            .keyboardRow(new KeyboardRow(BotLabels.VIEW_TASKS.getLabel()))
            .build();
        send(chatId, "¡Hola! Soy el bot de gestión de tareas. Selecciona una opción:", keyboard, null);
    }

    // ── Step 2: Filter type menu ───────────────────────────────────────────────

    private void sendFilterMenu(long chatId) {
        ReplyKeyboardMarkup keyboard = ReplyKeyboardMarkup.builder()
            .resizeKeyboard(true)
            .keyboardRow(new KeyboardRow(
                BotLabels.FILTER_BY_ASSIGNEE.getLabel(),
                BotLabels.FILTER_BY_SPRINT.getLabel()))
            .keyboardRow(new KeyboardRow(
                BotLabels.ALL_TASKS.getLabel(),
                BotLabels.MAIN_MENU.getLabel()))
            .build();
        send(chatId, "¿Cómo deseas filtrar las tasks?", keyboard, null);
    }

    private void handleFilterTypeSelection(long chatId, String text, ChatSession session) {
        if (BotLabels.FILTER_BY_ASSIGNEE.getLabel().equals(text)) {
            List<User> users = userService.findAll();
            if (users.isEmpty()) {
                send(chatId, "No hay usuarios registrados.", null, null);
                session.state = BotState.IDLE;
                sendMainMenu(chatId);
                return;
            }
            session.userMap.clear();
            users.forEach(u -> session.userMap.put(u.getUsername(), u.getUserId()));
            session.state = BotState.AWAITING_ASSIGNEE;
            sendDynamicKeyboard(chatId, "Selecciona un asignado:", new ArrayList<>(session.userMap.keySet()));

        } else if (BotLabels.FILTER_BY_SPRINT.getLabel().equals(text)) {
            List<Sprint> sprints = sprintService.findAll();
            if (sprints.isEmpty()) {
                send(chatId, "No hay sprints registrados.", null, null);
                session.state = BotState.IDLE;
                sendMainMenu(chatId);
                return;
            }
            session.sprintMap.clear();
            sprints.forEach(s -> session.sprintMap.put(s.getSprintName(), s.getSprintId()));
            session.state = BotState.AWAITING_SPRINT_ONLY;
            sendDynamicKeyboard(chatId, "Selecciona un Sprint:", new ArrayList<>(session.sprintMap.keySet()));

        } else if (BotLabels.ALL_TASKS.getLabel().equals(text)) {
            session.state = BotState.IDLE;
            sendTaskList(chatId, null, null, null, null);

        } else if (BotLabels.MAIN_MENU.getLabel().equals(text)) {
            session.state = BotState.IDLE;
            sendMainMenu(chatId);
        }
    }

    // ── Step 3a: Assignee selected → ask for sprint ────────────────────────────

    private void handleAssigneeSelection(long chatId, String text, ChatSession session) {
        Long userId = session.userMap.get(text);
        if (userId == null) {
            send(chatId, "No reconocí ese usuario. Intenta de nuevo.", null, null);
            return;
        }
        session.selectedUserId = userId;
        session.selectedUserName = text;

        List<Sprint> sprints = sprintService.findAll();
        if (sprints.isEmpty()) {
            session.state = BotState.IDLE;
            sendTaskList(chatId, userId, text, null, null);
            return;
        }
        session.sprintMap.clear();
        sprints.forEach(s -> session.sprintMap.put(s.getSprintName(), s.getSprintId()));

        List<String> options = new ArrayList<>(session.sprintMap.keySet());
        options.add(0, BotLabels.NO_SPRINT_FILTER.getLabel());

        session.state = BotState.AWAITING_SPRINT_AFTER_ASSIGNEE;
        sendDynamicKeyboard(chatId,
            "Asignado: <b>" + text + "</b>\n¿También filtrar por Sprint?",
            options);
    }

    // ── Step 3b: Sprint selected after assignee ────────────────────────────────

    private void handleSprintAfterAssignee(long chatId, String text, ChatSession session) {
        session.state = BotState.IDLE;
        if (BotLabels.NO_SPRINT_FILTER.getLabel().equals(text)) {
            sendTaskList(chatId, session.selectedUserId, session.selectedUserName, null, null);
        } else {
            Long sprintId = session.sprintMap.get(text);
            if (sprintId == null) {
                send(chatId, "No reconocí ese sprint. Mostrando sin filtro de sprint.", null, null);
                sendTaskList(chatId, session.selectedUserId, session.selectedUserName, null, null);
            } else {
                sendTaskList(chatId, session.selectedUserId, session.selectedUserName, sprintId, text);
            }
        }
    }

    // ── Step 3c: Sprint selected directly ─────────────────────────────────────

    private void handleSprintOnlySelection(long chatId, String text, ChatSession session) {
        session.state = BotState.IDLE;
        Long sprintId = session.sprintMap.get(text);
        if (sprintId == null) {
            send(chatId, "No reconocí ese sprint. Intenta de nuevo.", null, null);
            return;
        }
        sendTaskList(chatId, null, null, sprintId, text);
    }

    // ── Task list renderer ─────────────────────────────────────────────────────

    private void sendTaskList(long chatId,
                               Long filterUserId, String filterUserName,
                               Long filterSprintId, String filterSprintName) {
        List<Task> tasks = taskService.findAll();

        if (filterUserId != null) {
            final Long uid = filterUserId;
            tasks = tasks.stream()
                .filter(t -> t.getAssignee() != null && uid.equals(t.getAssignee().getUserId()))
                .collect(Collectors.toList());
        }
        if (filterSprintId != null) {
            final Long sid = filterSprintId;
            tasks = tasks.stream()
                .filter(t -> t.getSprint() != null && sid.equals(t.getSprint().getSprintId()))
                .collect(Collectors.toList());
        }

        StringBuilder header = new StringBuilder("<b>📋 Tasks");
        if (filterUserName != null) header.append(" — 👤 ").append(filterUserName);
        if (filterSprintName != null) header.append(" — 🏃 ").append(filterSprintName);
        header.append("</b>\n\n");

        if (tasks.isEmpty()) {
            send(chatId, header + "No se encontraron tasks con ese filtro.", null, null);
            sendMainMenu(chatId);
            return;
        }

        List<Task> todo       = filterByStatus(tasks, "todo");
        List<Task> inProgress = filterByStatus(tasks, "in-progress");
        List<Task> blocked    = filterByStatus(tasks, "blocked");
        List<Task> done       = filterByStatus(tasks, "done");

        StringBuilder sb = new StringBuilder(header);
        appendGroup(sb, "⏳ Por hacer",    todo);
        appendGroup(sb, "🔄 En progreso", inProgress);
        appendGroup(sb, "🚫 Bloqueadas",  blocked);
        appendGroup(sb, "✅ Completadas", done);

        send(chatId, sb.toString(), null, "HTML");
        sendMainMenu(chatId);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private List<Task> filterByStatus(List<Task> tasks, String status) {
        return tasks.stream()
            .filter(t -> status.equalsIgnoreCase(t.getStatus()))
            .collect(Collectors.toList());
    }

    private void appendGroup(StringBuilder sb, String title, List<Task> tasks) {
        if (tasks.isEmpty()) return;
        sb.append("<b>").append(title).append("</b> (").append(tasks.size()).append(")\n");
        for (Task t : tasks) {
            String priority = t.getPriority() != null ? t.getPriority().toLowerCase() : "medium";
            String dot = "high".equals(priority) ? "🔴" : "low".equals(priority) ? "🟢" : "🟡";
            sb.append(dot).append(" ").append(t.getTaskName());
            if (t.getAssignee() != null) sb.append(" (").append(t.getAssignee().getUsername()).append(")");
            sb.append("\n");
        }
        sb.append("\n");
    }

    private void sendDynamicKeyboard(long chatId, String prompt, List<String> options) {
        List<KeyboardRow> rows = new ArrayList<>();
        for (int i = 0; i < options.size(); i += 2) {
            KeyboardRow row = new KeyboardRow();
            row.add(options.get(i));
            if (i + 1 < options.size()) row.add(options.get(i + 1));
            rows.add(row);
        }
        rows.add(new KeyboardRow(BotLabels.MAIN_MENU.getLabel()));

        ReplyKeyboardMarkup keyboard = ReplyKeyboardMarkup.builder()
            .resizeKeyboard(true)
            .keyboard(rows)
            .build();
        send(chatId, prompt, keyboard, "HTML");
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
