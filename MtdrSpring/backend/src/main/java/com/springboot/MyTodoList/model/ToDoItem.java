package com.springboot.MyTodoList.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TODO_ITEMS", schema = "DEV")
@SequenceGenerator(name = "todo_seq", sequenceName = "DEV.TODO_SEQ", allocationSize = 1)
public class ToDoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "todo_seq")
    @Column(name = "ID")
    private Integer id;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DONE")
    private Boolean done;

    @Column(name = "CREATION_TS")
    private LocalDateTime creation_ts;

    // Getters y Setters
    public Integer getID() {
        return id;
    }

    public void setID(Integer id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean isDone() {
        return done;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }

    public LocalDateTime getCreation_ts() {
        return creation_ts;
    }

    public void setCreation_ts(LocalDateTime creation_ts) {
        this.creation_ts = creation_ts;
    }
}