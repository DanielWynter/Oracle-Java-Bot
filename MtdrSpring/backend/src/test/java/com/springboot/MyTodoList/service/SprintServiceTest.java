package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SprintServiceTest {

    @Mock
    private SprintRepository sprintRepository;

    @InjectMocks
    private SprintService sprintService;

    @Test
    void findAll_returnsAllSprints() {
        Sprint s1 = new Sprint(); s1.setSprintId(1L); s1.setSprintName("Sprint 0");
        Sprint s2 = new Sprint(); s2.setSprintId(2L); s2.setSprintName("Sprint 1");
        when(sprintRepository.findAll()).thenReturn(List.of(s1, s2));

        List<Sprint> result = sprintService.findAll();

        assertEquals(2, result.size());
        assertEquals("Sprint 0", result.get(0).getSprintName());
    }

    @Test
    void findById_whenExists_returnsSprint() {
        Sprint sprint = new Sprint();
        sprint.setSprintId(1L);
        sprint.setSprintName("Sprint 2");
        sprint.setStartDate(LocalDate.of(2025, 2, 1));
        sprint.setEndDate(LocalDate.of(2025, 2, 14));
        when(sprintRepository.findById(1L)).thenReturn(Optional.of(sprint));

        Optional<Sprint> result = sprintService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Sprint 2", result.get().getSprintName());
        assertEquals(LocalDate.of(2025, 2, 1), result.get().getStartDate());
    }

    @Test
    void findById_whenNotExists_returnsEmpty() {
        when(sprintRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Sprint> result = sprintService.findById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void save_persistsSprint() {
        Sprint sprint = new Sprint(); sprint.setSprintName("Sprint 3");
        when(sprintRepository.save(sprint)).thenReturn(sprint);

        Sprint saved = sprintService.save(sprint);

        assertNotNull(saved);
        assertEquals("Sprint 3", saved.getSprintName());
    }

    @Test
    void update_whenExists_updatesSprint() {
        Sprint sprint = new Sprint(); sprint.setSprintName("Sprint Updated");
        when(sprintRepository.existsById(1L)).thenReturn(true);
        when(sprintRepository.save(sprint)).thenReturn(sprint);

        Sprint result = sprintService.update(1L, sprint);

        assertNotNull(result);
        assertEquals(1L, result.getSprintId());
    }

    @Test
    void update_whenNotExists_returnsNull() {
        when(sprintRepository.existsById(99L)).thenReturn(false);

        Sprint result = sprintService.update(99L, new Sprint());

        assertNull(result);
        verify(sprintRepository, never()).save(any());
    }

    @Test
    void deleteById_whenExists_returnsTrue() {
        when(sprintRepository.existsById(1L)).thenReturn(true);

        boolean result = sprintService.deleteById(1L);

        assertTrue(result);
        verify(sprintRepository).deleteById(1L);
    }

    @Test
    void deleteById_whenNotExists_returnsFalse() {
        when(sprintRepository.existsById(99L)).thenReturn(false);

        boolean result = sprintService.deleteById(99L);

        assertFalse(result);
    }
}
