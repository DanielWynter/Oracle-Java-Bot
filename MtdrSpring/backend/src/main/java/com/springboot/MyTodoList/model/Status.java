package com.springboot.MyTodoList.model;

public enum Status {
    TO_DO("To do"),
    IN_PROGRESS("In progress"),
    DONE("Completed"),
    STOPPED("Stopped");

    private final String label;

    Status(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
