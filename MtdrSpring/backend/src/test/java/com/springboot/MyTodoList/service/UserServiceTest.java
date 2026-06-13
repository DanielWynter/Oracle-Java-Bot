package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.UserRepository;
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
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void findAll_returnsAllUsers() {
        User u1 = new User(); u1.setUserId(1L); u1.setUsername("Daniel");
        User u2 = new User(); u2.setUserId(2L); u2.setUsername("Guille");
        when(userRepository.findAll()).thenReturn(List.of(u1, u2));

        List<User> result = userService.findAll();

        assertEquals(2, result.size());
        assertEquals("Daniel", result.get(0).getUsername());
    }

    @Test
    void findById_whenExists_returnsUser() {
        User user = new User(); user.setUserId(1L); user.setUsername("Luciano");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = userService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Luciano", result.get().getUsername());
    }

    @Test
    void findById_whenNotExists_returnsEmpty() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<User> result = userService.findById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void save_persistsUser() {
        User user = new User(); user.setUsername("Esteban"); user.setEmail("e@test.com");
        when(userRepository.save(user)).thenReturn(user);

        User saved = userService.save(user);

        assertNotNull(saved);
        assertEquals("Esteban", saved.getUsername());
    }

    @Test
    void update_whenExists_updatesUser() {
        User user = new User(); user.setUsername("Updated");
        when(userRepository.existsById(1L)).thenReturn(true);
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.update(1L, user);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
    }

    @Test
    void update_whenNotExists_returnsNull() {
        when(userRepository.existsById(99L)).thenReturn(false);

        User result = userService.update(99L, new User());

        assertNull(result);
    }

    @Test
    void deleteById_whenExists_returnsTrue() {
        when(userRepository.existsById(1L)).thenReturn(true);

        boolean result = userService.deleteById(1L);

        assertTrue(result);
        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteById_whenNotExists_returnsFalse() {
        when(userRepository.existsById(99L)).thenReturn(false);

        boolean result = userService.deleteById(99L);

        assertFalse(result);
        verify(userRepository, never()).deleteById(any());
    }
}
