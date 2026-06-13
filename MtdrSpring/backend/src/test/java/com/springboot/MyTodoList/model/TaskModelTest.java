package com.springboot.MyTodoList.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class TaskModelTest {

    @Test
    void taskGettersAndSetters_workCorrectly() {
        Task task = new Task();
        LocalDateTime now = LocalDateTime.now();

        task.setTaskId(1L);
        task.setTaskName("Implement login");
        task.setDescription("Build JWT login flow");
        task.setStatus("in-progress");
        task.setPriority("high");
        task.setTaskType("feature");
        task.setHours(8.0);
        task.setTotalTime(6.5);
        task.setCreatedAt(now);
        task.setFinishedAt(now.plusDays(1));

        assertEquals(1L, task.getTaskId());
        assertEquals("Implement login", task.getTaskName());
        assertEquals("Build JWT login flow", task.getDescription());
        assertEquals("in-progress", task.getStatus());
        assertEquals("high", task.getPriority());
        assertEquals("feature", task.getTaskType());
        assertEquals(8.0, task.getHours());
        assertEquals(6.5, task.getTotalTime());
        assertEquals(now, task.getCreatedAt());
        assertEquals(now.plusDays(1), task.getFinishedAt());
    }

    @Test
    void taskAssignee_canBeSetAndRetrieved() {
        Task task = new Task();
        User user = new User(); user.setUserId(1L); user.setUsername("Daniel");

        task.setAssignee(user);

        assertNotNull(task.getAssignee());
        assertEquals("Daniel", task.getAssignee().getUsername());
    }

    @Test
    void taskSprint_canBeSetAndRetrieved() {
        Task task = new Task();
        Sprint sprint = new Sprint(); sprint.setSprintId(2L); sprint.setSprintName("Sprint 2");

        task.setSprint(sprint);

        assertNotNull(task.getSprint());
        assertEquals("Sprint 2", task.getSprint().getSprintName());
    }

    @Test
    void taskWithNullFields_doesNotThrow() {
        Task task = new Task();

        assertNull(task.getTaskId());
        assertNull(task.getTaskName());
        assertNull(task.getStatus());
        assertNull(task.getPriority());
        assertNull(task.getAssignee());
        assertNull(task.getSprint());
    }

    @Test
    void taskPriority_allValidValues() {
        Task task = new Task();

        task.setPriority("low");
        assertEquals("low", task.getPriority());

        task.setPriority("medium");
        assertEquals("medium", task.getPriority());

        task.setPriority("high");
        assertEquals("high", task.getPriority());
    }
}
