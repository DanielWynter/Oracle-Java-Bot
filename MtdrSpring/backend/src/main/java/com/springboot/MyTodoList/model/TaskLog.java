package com.springboot.MyTodoList.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TASK_LOGS", schema = "DEV")
@SequenceGenerator(name = "log_seq", sequenceName = "DEV.LOG_SEQ", allocationSize = 1)
public class TaskLog {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "log_seq")
    @Column(name = "LOG_ID")
    private Long logId;

    @Column(name = "LOG_TIMESTAMP")
    private LocalDateTime logTimestamp;

    @Column(name = "LOG_CONTENT")
    private String logContent;

    @ManyToOne
    @JoinColumn(name = "TASK_ID")
    private Task task;

    // Getters y Setters...
}