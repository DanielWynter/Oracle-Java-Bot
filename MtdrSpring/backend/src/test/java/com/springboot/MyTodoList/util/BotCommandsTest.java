package com.springboot.MyTodoList.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BotCommandsTest {

    @Test
    void startCommand_isCorrect() {
        assertEquals("/start", BotCommands.START_COMMAND.getCommand());
    }

    @Test
    void hideCommand_isCorrect() {
        assertEquals("/hide", BotCommands.HIDE_COMMAND.getCommand());
    }

    @Test
    void todoListCommand_isCorrect() {
        assertEquals("/todolist", BotCommands.TODO_LIST.getCommand());
    }

    @Test
    void addItemCommand_isCorrect() {
        assertEquals("/additem", BotCommands.ADD_ITEM.getCommand());
    }

    @Test
    void llmCommand_isCorrect() {
        assertEquals("/llm", BotCommands.LLM_REQ.getCommand());
    }

    @Test
    void allCommands_startWithSlash() {
        for (BotCommands cmd : BotCommands.values()) {
            assertTrue(cmd.getCommand().startsWith("/"),
                "Command should start with '/': " + cmd.name());
        }
    }

    @Test
    void allCommands_haveNonNullValues() {
        for (BotCommands cmd : BotCommands.values()) {
            assertNotNull(cmd.getCommand());
            assertFalse(cmd.getCommand().isBlank());
        }
    }
}
