package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Analytic;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@Transactional
public class AnalyticController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public List<Analytic> getAll() {
        return entityManager.createQuery("SELECT a FROM Analytic a", Analytic.class).getResultList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Analytic> getById(@PathVariable Long id) {
        Analytic analytic = entityManager.find(Analytic.class, id);
        return analytic != null ? ResponseEntity.ok(analytic) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Analytic> create(@RequestBody Analytic analytic) {
        entityManager.persist(analytic);
        return new ResponseEntity<>(analytic, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Analytic> update(@PathVariable Long id, @RequestBody Analytic analytic) {
        Analytic existing = entityManager.find(Analytic.class, id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        analytic.setAnalyticId(id);
        Analytic merged = entityManager.merge(analytic);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Analytic analytic = entityManager.find(Analytic.class, id);
        if (analytic == null) {
            return ResponseEntity.notFound().build();
        }
        entityManager.remove(analytic);
        return ResponseEntity.noContent().build();
    }
}
