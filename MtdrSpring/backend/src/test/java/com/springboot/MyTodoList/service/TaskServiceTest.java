package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void findAll_returnsAllTasks() {
        Task t1 = new Task(); t1.setTaskId(1L); t1.setTaskName("Task A");
        Task t2 = new Task(); t2.setTaskId(2L); t2.setTaskName("Task B");
        when(taskRepository.findAll()).thenReturn(List.of(t1, t2));

        List<Task> result = taskService.findAll();

        assertEquals(2, result.size());
        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void findAll_whenEmpty_returnsEmptyList() {
        when(taskRepository.findAll()).thenReturn(List.of());

        List<Task> result = taskService.findAll();

        assertTrue(result.isEmpty());
    }

    @Test
    void findById_whenExists_returnsTask() {
        Task task = new Task(); task.setTaskId(1L); task.setTaskName("Fix bug");
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        Optional<Task> result = taskService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Fix bug", result.get().getTaskName());
    }

    @Test
    void findById_whenNotExists_returnsEmpty() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Task> result = taskService.findById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void save_persistsAndReturnsTask() {
        Task task = new Task(); task.setTaskName("New feature");
        when(taskRepository.save(task)).thenReturn(task);

        Task saved = taskService.save(task);

        assertNotNull(saved);
        assertEquals("New feature", saved.getTaskName());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void update_whenExists_updatesTask() {
        Task task = new Task(); task.setTaskName("Updated");
        when(taskRepository.existsById(1L)).thenReturn(true);
        when(taskRepository.save(task)).thenReturn(task);

        Task result = taskService.update(1L, task);

        assertNotNull(result);
        assertEquals(1L, result.getTaskId());
        verify(taskRepository).save(task);
    }

    @Test
    void update_whenNotExists_returnsNull() {
        when(taskRepository.existsById(99L)).thenReturn(false);

        Task result = taskService.update(99L, new Task());

        assertNull(result);
        verify(taskRepository, never()).save(any());
    }

    @Test
    void deleteById_whenExists_returnsTrue() {
        when(taskRepository.existsById(1L)).thenReturn(true);

        boolean result = taskService.deleteById(1L);

        assertTrue(result);
        verify(taskRepository).deleteById(1L);
    }

    @Test
    void deleteById_whenNotExists_returnsFalse() {
        when(taskRepository.existsById(99L)).thenReturn(false);

        boolean result = taskService.deleteById(99L);

        assertFalse(result);
        verify(taskRepository, never()).deleteById(any());
    }
}
