package com.springboot.MyTodoList.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class SprintModelTest {

    @Test
    void sprintGettersAndSetters_workCorrectly() {
        Sprint sprint = new Sprint();
        LocalDate start = LocalDate.of(2025, 2, 1);
        LocalDate end   = LocalDate.of(2025, 2, 14);

        sprint.setSprintId(1L);
        sprint.setSprintName("Sprint 0");
        sprint.setStartDate(start);
        sprint.setEndDate(end);
        sprint.setStatus("active");

        assertEquals(1L, sprint.getSprintId());
        assertEquals("Sprint 0", sprint.getSprintName());
        assertEquals(start, sprint.getStartDate());
        assertEquals(end, sprint.getEndDate());
        assertEquals("active", sprint.getStatus());
    }

    @Test
    void sprintDuration_endAfterStart() {
        Sprint sprint = new Sprint();
        sprint.setStartDate(LocalDate.of(2025, 2, 1));
        sprint.setEndDate(LocalDate.of(2025, 2, 14));

        assertTrue(sprint.getEndDate().isAfter(sprint.getStartDate()));
    }

    @Test
    void sprintWithNullFields_doesNotThrow() {
        Sprint sprint = new Sprint();

        assertNull(sprint.getSprintId());
        assertNull(sprint.getSprintName());
        assertNull(sprint.getStartDate());
        assertNull(sprint.getEndDate());
        assertNull(sprint.getStatus());
    }

    @Test
    void sprintProject_canBeSetAndRetrieved() {
        Sprint sprint = new Sprint();
        Project project = new Project();
        project.setProjectName("MyTodoList");

        sprint.setProject(project);

        assertNotNull(sprint.getProject());
        assertEquals("MyTodoList", sprint.getProject().getProjectName());
    }
}
