package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.TaskLog;
import com.springboot.MyTodoList.repository.TaskLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskLogService {

    @Autowired
    private TaskLogRepository taskLogRepository;

    public List<TaskLog> findAll() {
        return taskLogRepository.findAll();
    }

    public Optional<TaskLog> findById(Long id) {
        return taskLogRepository.findById(id);
    }

    public TaskLog save(TaskLog taskLog) {
        return taskLogRepository.save(taskLog);
    }

    public TaskLog update(Long id, TaskLog taskLog) {
        if (taskLogRepository.existsById(id)) {
            taskLog.setLogId(id);
            return taskLogRepository.save(taskLog);
        }
        return null;
    }

    public boolean deleteById(Long id) {
        if (taskLogRepository.existsById(id)) {
            taskLogRepository.deleteById(id);
            return true;
        }
        return false;
    }
}