package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Sprint;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
@Transactional
public class SprintController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public List<Sprint> getAll() {
        return entityManager.createQuery("SELECT s FROM Sprint s", Sprint.class).getResultList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sprint> getById(@PathVariable Long id) {
        Sprint sprint = entityManager.find(Sprint.class, id);
        return sprint != null ? ResponseEntity.ok(sprint) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Sprint> create(@RequestBody Sprint sprint) {
        entityManager.persist(sprint);
        return new ResponseEntity<>(sprint, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sprint> update(@PathVariable Long id, @RequestBody Sprint sprint) {
        Sprint existing = entityManager.find(Sprint.class, id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        sprint.setSprintId(id);
        Sprint merged = entityManager.merge(sprint);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Sprint sprint = entityManager.find(Sprint.class, id);
        if (sprint == null) {
            return ResponseEntity.notFound().build();
        }
        entityManager.remove(sprint);
        return ResponseEntity.noContent().build();
    }
}
