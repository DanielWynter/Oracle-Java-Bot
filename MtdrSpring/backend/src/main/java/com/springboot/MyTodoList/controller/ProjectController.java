package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Project;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Transactional
public class ProjectController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public List<Project> getAll() {
        return entityManager.createQuery("SELECT p FROM Project p", Project.class).getResultList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        Project project = entityManager.find(Project.class, id);
        return project != null ? ResponseEntity.ok(project) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Project> create(@RequestBody Project project) {
        entityManager.persist(project);
        return new ResponseEntity<>(project, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable Long id, @RequestBody Project project) {
        Project existing = entityManager.find(Project.class, id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        project.setProjectId(id);
        Project merged = entityManager.merge(project);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Project project = entityManager.find(Project.class, id);
        if (project == null) {
            return ResponseEntity.notFound().build();
        }
        entityManager.remove(project);
        return ResponseEntity.noContent().build();
    }
}
