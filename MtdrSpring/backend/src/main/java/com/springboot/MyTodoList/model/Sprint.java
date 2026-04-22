package com.springboot.MyTodoList.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "SPRINTS", schema = "DEV")
@SequenceGenerator(name = "sprint_seq", sequenceName = "DEV.SPRINT_SEQ", allocationSize = 1)
public class Sprint {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sprint_seq")
    @Column(name = "SPRINT_ID")
    private Long sprintId;

    @Column(name = "SPRINT_NAME")
    private String sprintName;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "END_DATE")
    private LocalDate endDate;

    @Column(name = "STATUS")
    private String status;

    @ManyToOne
    @JoinColumn(name = "PROJECT_ID")
    private Project project;

    // Getters y Setters...
}