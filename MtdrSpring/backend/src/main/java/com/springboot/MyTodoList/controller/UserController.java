package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Transactional
public class UserController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public List<User> getAll() {
        return entityManager.createQuery("SELECT u FROM User u", User.class).getResultList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        User user = entityManager.find(User.class, id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        entityManager.persist(user);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        User existing = entityManager.find(User.class, id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        user.setUserId(id);
        User merged = entityManager.merge(user);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = entityManager.find(User.class, id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        entityManager.remove(user);
        return ResponseEntity.noContent().build();
    }
}
