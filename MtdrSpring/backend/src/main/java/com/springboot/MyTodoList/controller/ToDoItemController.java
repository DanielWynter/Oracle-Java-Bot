package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.ToDoItem;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todo-items")
@Transactional
public class ToDoItemController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public List<ToDoItem> getAll() {
        return entityManager.createQuery("SELECT t FROM ToDoItem t", ToDoItem.class).getResultList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ToDoItem> getById(@PathVariable Integer id) {
        ToDoItem item = entityManager.find(ToDoItem.class, id);
        return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ToDoItem> create(@RequestBody ToDoItem item) {
        entityManager.persist(item);
        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ToDoItem> update(@PathVariable Integer id, @RequestBody ToDoItem item) {
        ToDoItem existing = entityManager.find(ToDoItem.class, id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        item.setID(id);
        ToDoItem merged = entityManager.merge(item);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        ToDoItem item = entityManager.find(ToDoItem.class, id);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        entityManager.remove(item);
        return ResponseEntity.noContent().build();
    }
}
