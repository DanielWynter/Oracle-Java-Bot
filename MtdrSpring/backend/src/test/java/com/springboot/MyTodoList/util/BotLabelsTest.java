package com.springboot.MyTodoList.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BotLabelsTest {

    @Test
    void viewTasks_hasCorrectLabel() {
        assertEquals("📋 Ver Tasks", BotLabels.VIEW_TASKS.getLabel());
    }

    @Test
    void showMainScreen_hasCorrectLabel() {
        assertEquals("Show Main Screen", BotLabels.SHOW_MAIN_SCREEN.getLabel());
    }

    @Test
    void filterByAssignee_hasCorrectLabel() {
        assertEquals("👤 Por Asignado", BotLabels.FILTER_BY_ASSIGNEE.getLabel());
    }

    @Test
    void filterBySprint_hasCorrectLabel() {
        assertEquals("🏃 Por Sprint", BotLabels.FILTER_BY_SPRINT.getLabel());
    }

    @Test
    void allTasks_hasCorrectLabel() {
        assertEquals("📋 Todas las Tasks", BotLabels.ALL_TASKS.getLabel());
    }

    @Test
    void mainMenu_hasCorrectLabel() {
        assertEquals("🏠 Menú Principal", BotLabels.MAIN_MENU.getLabel());
    }

    @Test
    void noSprintFilter_hasCorrectLabel() {
        assertEquals("✖️ Sin filtro de Sprint", BotLabels.NO_SPRINT_FILTER.getLabel());
    }

    @Test
    void allEnumValues_haveNonNullLabels() {
        for (BotLabels label : BotLabels.values()) {
            assertNotNull(label.getLabel(), "Label should not be null for: " + label.name());
            assertFalse(label.getLabel().isBlank(), "Label should not be blank for: " + label.name());
        }
    }
}
