package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Analytic;
import com.springboot.MyTodoList.repository.AnalyticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnalyticService {

    @Autowired
    private AnalyticRepository analyticRepository;

    public List<Analytic> findAll() {
        return analyticRepository.findAll();
    }

    public Optional<Analytic> findById(Long id) {
        return analyticRepository.findById(id);
    }

    public Analytic save(Analytic analytic) {
        return analyticRepository.save(analytic);
    }

    public Analytic update(Long id, Analytic analytic) {
        if (analyticRepository.existsById(id)) {
            analytic.setAnalyticId(id);
            return analyticRepository.save(analytic);
        }
        return null;
    }

    public boolean deleteById(Long id) {
        if (analyticRepository.existsById(id)) {
            analyticRepository.deleteById(id);
            return true;
        }
        return false;
    }
}