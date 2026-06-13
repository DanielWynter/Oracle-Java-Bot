package com.springboot.MyTodoList.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BotMessagesTest {

    @Test
    void botRegisteredMessage_isNotEmpty() {
        assertFalse(BotMessages.BOT_REGISTERED_STARTED.getMessage().isBlank());
    }

    @Test
    void helloMessage_containsBotName() {
        assertTrue(BotMessages.HELLO_MYTODO_BOT.getMessage().contains("MyTodoList Bot"));
    }

    @Test
    void byeMessage_isNotEmpty() {
        assertFalse(BotMessages.BYE.getMessage().isBlank());
    }

    @Test
    void allMessages_haveNonNullValues() {
        for (BotMessages msg : BotMessages.values()) {
            assertNotNull(msg.getMessage(), "Message should not be null for: " + msg.name());
            assertFalse(msg.getMessage().isBlank(), "Message should not be blank for: " + msg.name());
        }
    }
}
