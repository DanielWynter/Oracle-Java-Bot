package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Task;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@Transactional
public class TaskController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public List<Task> getAll() {
        return entityManager.createQuery("SELECT t FROM Task t", Task.class).getResultList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        Task task = entityManager.find(Task.class, id);
        return task != null ? ResponseEntity.ok(task) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task task) {
        entityManager.persist(task);
        return new ResponseEntity<>(task, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task task) {
        Task existing = entityManager.find(Task.class, id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        task.setTaskId(id);
        Task merged = entityManager.merge(task);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Task task = entityManager.find(Task.class, id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        entityManager.remove(task);
        return ResponseEntity.noContent().build();
    }
}
