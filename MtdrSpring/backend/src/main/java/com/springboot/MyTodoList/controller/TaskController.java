package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
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
        // Re-attach relations so persist() doesn't see detached entities
        if (task.getSprint() != null && task.getSprint().getSprintId() != null) {
            Sprint sprint = entityManager.find(Sprint.class, task.getSprint().getSprintId());
            task.setSprint(sprint);
            if (sprint != null && sprint.getProject() != null) {
                task.setProject(sprint.getProject());
            }
        } else {
            task.setSprint(null);
        }
        if (task.getAssignee() != null && task.getAssignee().getUserId() != null) {
            task.setAssignee(entityManager.getReference(User.class, task.getAssignee().getUserId()));
        } else {
            task.setAssignee(null);
        }
        if (task.getProject() == null) {
            task.setProject(null);
        }
        task.setTaskId(null); // ensure it's treated as new
        entityManager.persist(task);
        entityManager.flush();

        Task response = new Task();
        response.setTaskId(task.getTaskId());
        response.setTaskName(task.getTaskName());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setCreatedAt(task.getCreatedAt());
        response.setHours(task.getHours());
        response.setTaskType(task.getTaskType());
        response.setPriority(task.getPriority());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task task) {
        Task existing = entityManager.find(Task.class, id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        existing.setTaskName(task.getTaskName());
        existing.setDescription(task.getDescription());
        existing.setStatus(task.getStatus());
        existing.setTaskType(task.getTaskType());
        existing.setHours(task.getHours());
        existing.setTotalTime(task.getTotalTime());
        existing.setPriority(task.getPriority());

        if ("done".equalsIgnoreCase(task.getStatus())) {
            if (existing.getFinishedAt() == null) {
                existing.setFinishedAt(task.getFinishedAt());
            }
        } else {
            existing.setFinishedAt(null);
        }

        if (task.getSprint() != null && task.getSprint().getSprintId() != null) {
            existing.setSprint(entityManager.getReference(Sprint.class, task.getSprint().getSprintId()));
        }
        if (task.getAssignee() != null && task.getAssignee().getUserId() != null) {
            existing.setAssignee(entityManager.getReference(User.class, task.getAssignee().getUserId()));
        }

        entityManager.flush();

        Task response = new Task();
        response.setTaskId(existing.getTaskId());
        response.setTaskName(existing.getTaskName());
        response.setDescription(existing.getDescription());
        response.setStatus(existing.getStatus());
        response.setTaskType(existing.getTaskType());
        response.setHours(existing.getHours());
        response.setTotalTime(existing.getTotalTime());
        response.setPriority(existing.getPriority());
        response.setCreatedAt(existing.getCreatedAt());
        response.setFinishedAt(existing.getFinishedAt());
        return ResponseEntity.ok(response);
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
