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
        task.setStatus(Status.IN_PROGRESS);
        task.setPriority(Priority.HIGH);
        task.setTaskType("feature");
        task.setHours(8.0);
        task.setTotalTime(6.5);
        task.setCreatedAt(now);
        task.setFinishedAt(now.plusDays(1));

        assertEquals(1L, task.getTaskId());
        assertEquals("Implement login", task.getTaskName());
        assertEquals("Build JWT login flow", task.getDescription());
        assertEquals(Status.IN_PROGRESS, task.getStatus());
        assertEquals(Priority.HIGH, task.getPriority());
        assertEquals("feature", task.getTaskType());
        assertEquals(8.0, task.getHours());
        assertEquals(6.5, task.getTotalTime());
        assertEquals(now, task.getCreatedAt());
        assertEquals(now.plusDays(1), task.getFinishedAt());
    }

    @Test
    void taskAssignee_canBeSetAndRetrieved() {
        Task task = new Task();
        User user = new User();
        user.setUserId(1L);
        user.setUsername("Daniel");

        task.setAssignee(user);

        assertNotNull(task.getAssignee());
        assertEquals("Daniel", task.getAssignee().getUsername());
    }

    @Test
    void taskSprint_canBeSetAndRetrieved() {
        Task task = new Task();
        Sprint sprint = new Sprint();
        sprint.setSprintId(2L);
        sprint.setSprintName("Sprint 2");

        task.setSprint(sprint);

        assertNotNull(task.getSprint());
        assertEquals("Sprint 2", task.getSprint().getSprintName());
    }

    @Test
    void taskDefaultPriority_isMedium() {
        Task task = new Task();

        assertEquals(Priority.MEDIUM, task.getPriority());
    }

    @Test
    void taskPriority_allValidValues() {
        Task task = new Task();

        task.setPriority(Priority.LOW);
        assertEquals(Priority.LOW, task.getPriority());

        task.setPriority(Priority.MEDIUM);
        assertEquals(Priority.MEDIUM, task.getPriority());

        task.setPriority(Priority.HIGH);
        assertEquals(Priority.HIGH, task.getPriority());

        task.setPriority(Priority.CRITICAL);
        assertEquals(Priority.CRITICAL, task.getPriority());
    }

    @Test
    void taskStatus_allValidValues() {
        Task task = new Task();

        task.setStatus(Status.TO_DO);
        assertEquals(Status.TO_DO, task.getStatus());

        task.setStatus(Status.IN_PROGRESS);
        assertEquals(Status.IN_PROGRESS, task.getStatus());

        task.setStatus(Status.DONE);
        assertEquals(Status.DONE, task.getStatus());

        task.setStatus(Status.STOPPED);
        assertEquals(Status.STOPPED, task.getStatus());
    }
}
