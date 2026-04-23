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

    // Getters y Setters...
}