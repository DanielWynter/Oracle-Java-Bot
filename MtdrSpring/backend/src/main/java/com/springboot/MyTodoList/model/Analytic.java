package com.springboot.MyTodoList.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ANALYTICS", schema = "DEV")
@SequenceGenerator(name = "analytic_seq", sequenceName = "DEV.ANALYTIC_SEQ", allocationSize = 1)
public class Analytic {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "analytic_seq")
    @Column(name = "ANALYTIC_ID")
    private Long analyticId;

    @Column(name = "PREVIOUS_STATUS")
    private String previousStatus;

    @Column(name = "NEW_STATUS")
    private String newStatus;

    @Column(name = "CHANGE_TIMESTAMP")
    private LocalDateTime changeTimestamp;

    @Column(name = "TASKS_COMPLETED")
    private Integer tasksCompleted;

    @Column(name = "COMMITS_COUNT")
    private Integer commitsCount;

    @ManyToOne
    @JoinColumn(name = "PROJECT_ID")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "TASK_ID")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    public Long getAnalyticId() {
        return analyticId;
    }

    public void setAnalyticId(Long analyticId) {
        this.analyticId = analyticId;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(String previousStatus) {
        this.previousStatus = previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public LocalDateTime getChangeTimestamp() {
        return changeTimestamp;
    }

    public void setChangeTimestamp(LocalDateTime changeTimestamp) {
        this.changeTimestamp = changeTimestamp;
    }

    public Integer getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(Integer tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }

    public Integer getCommitsCount() {
        return commitsCount;
    }

    public void setCommitsCount(Integer commitsCount) {
        this.commitsCount = commitsCount;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
