package com.springboot.MyTodoList.util;

public enum BotLabels {

	SHOW_MAIN_SCREEN("Show Main Screen"),
	VIEW_TASKS("📋 Ver Tasks"),
	ALL_SPRINTS("🌐 Todos los sprints"),
	DASH("-");

	private String label;

	BotLabels(String enumLabel) {
		this.label = enumLabel;
	}

	public String getLabel() {
		return label;
	}

}
