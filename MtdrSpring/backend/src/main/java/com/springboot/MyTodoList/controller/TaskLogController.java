package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.TaskLog;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task-logs")
@Transactional
public class TaskLogController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public List<TaskLog> getAll() {
        return entityManager.createQuery("SELECT l FROM TaskLog l", TaskLog.class).getResultList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskLog> getById(@PathVariable Long id) {
        TaskLog log = entityManager.find(TaskLog.class, id);
        return log != null ? ResponseEntity.ok(log) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<TaskLog> create(@RequestBody TaskLog log) {
        entityManager.persist(log);
        return new ResponseEntity<>(log, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskLog> update(@PathVariable Long id, @RequestBody TaskLog log) {
        TaskLog existing = entityManager.find(TaskLog.class, id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        log.setLogId(id);
        TaskLog merged = entityManager.merge(log);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        TaskLog log = entityManager.find(TaskLog.class, id);
        if (log == null) {
            return ResponseEntity.notFound().build();
        }
        entityManager.remove(log);
        return ResponseEntity.noContent().build();
    }
}
