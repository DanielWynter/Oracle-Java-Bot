package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Analytic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalyticRepository extends JpaRepository<Analytic, Long> {
}