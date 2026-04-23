package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Team;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@Transactional
public class TeamController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public List<Team> getAll() {
        return entityManager.createQuery("SELECT t FROM Team t", Team.class).getResultList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getById(@PathVariable Long id) {
        Team team = entityManager.find(Team.class, id);
        return team != null ? ResponseEntity.ok(team) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Team> create(@RequestBody Team team) {
        entityManager.persist(team);
        return new ResponseEntity<>(team, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> update(@PathVariable Long id, @RequestBody Team team) {
        Team existing = entityManager.find(Team.class, id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        team.setTeamId(id);
        Team merged = entityManager.merge(team);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Team team = entityManager.find(Team.class, id);
        if (team == null) {
            return ResponseEntity.notFound().build();
        }
        entityManager.remove(team);
        return ResponseEntity.noContent().build();
    }
}
