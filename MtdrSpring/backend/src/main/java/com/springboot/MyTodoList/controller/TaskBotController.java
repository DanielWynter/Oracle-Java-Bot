package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.config.BotProps;
import com.springboot.MyTodoList.model.Task;
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

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskBotController implements SpringLongPollingBot, LongPollingSingleThreadUpdateConsumer {

    private static final Logger logger = LoggerFactory.getLogger(TaskBotController.class);

    private final TelegramClient telegramClient;
    private final BotProps botProps;
    private final TaskService taskService;

    public TaskBotController(BotProps botProps, TaskService taskService) {
        this.botProps = botProps;
        this.taskService = taskService;
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

        if ("/start".equals(text) || BotLabels.SHOW_MAIN_SCREEN.getLabel().equals(text)) {
            sendMainMenu(chatId);
        } else if (BotLabels.VIEW_TASKS.getLabel().equals(text)) {
            sendTaskList(chatId);
        }
    }

    private void sendMainMenu(long chatId) {
        ReplyKeyboardMarkup keyboard = ReplyKeyboardMarkup.builder()
            .resizeKeyboard(true)
            .keyboardRow(new KeyboardRow(BotLabels.VIEW_TASKS.getLabel()))
            .build();

        send(chatId, "¡Hola! Soy el bot de gestión de tareas. Selecciona una opción:", keyboard, null);
    }

    private void sendTaskList(long chatId) {
        List<Task> tasks = taskService.findAll();

        if (tasks.isEmpty()) {
            send(chatId, "No hay tasks registradas.", null, null);
            return;
        }

        List<Task> todo       = filter(tasks, "todo");
        List<Task> inProgress = filter(tasks, "in-progress");
        List<Task> blocked    = filter(tasks, "blocked");
        List<Task> done       = filter(tasks, "done");

        StringBuilder sb = new StringBuilder("<b>📋 Todas las Tasks</b>\n\n");
        appendGroup(sb, "⏳ Por hacer",    todo);
        appendGroup(sb, "🔄 En progreso", inProgress);
        appendGroup(sb, "🚫 Bloqueadas",  blocked);
        appendGroup(sb, "✅ Completadas", done);

        send(chatId, sb.toString(), null, "HTML");
    }

    private List<Task> filter(List<Task> tasks, String status) {
        return tasks.stream()
            .filter(t -> status.equalsIgnoreCase(t.getStatus()))
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
