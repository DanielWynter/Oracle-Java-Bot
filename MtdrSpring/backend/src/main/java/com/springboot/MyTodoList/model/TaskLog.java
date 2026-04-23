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

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
    }

    public LocalDateTime getLogTimestamp() {
        return logTimestamp;
    }

    public void setLogTimestamp(LocalDateTime logTimestamp) {
        this.logTimestamp = logTimestamp;
    }

    public String getLogContent() {
        return logContent;
    }

    public void setLogContent(String logContent) {
        this.logContent = logContent;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }
}
