package com.springboot.MyTodoList.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TASKS", schema = "DEV")
@SequenceGenerator(name = "task_seq", sequenceName = "DEV.TASK_SEQ", allocationSize = 1)
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "task_seq")
    @Column(name = "TASK_ID")
    private Long taskId;

    @Column(name = "TASK_NAME")
    private String taskName;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "HOURS")
    private Double hours;

    @ManyToOne
    @JoinColumn(name = "SPRINT_ID")
    private Sprint sprint;

    @ManyToOne
    @JoinColumn(name = "PROJECT_ID")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "ASSIGNEE_USER_ID")
    private User assignee;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getHours() {
        return hours;
    }

    public void setHours(Double hours) {
        this.hours = hours;
    }

    public Sprint getSprint() {
        return sprint;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }
}
