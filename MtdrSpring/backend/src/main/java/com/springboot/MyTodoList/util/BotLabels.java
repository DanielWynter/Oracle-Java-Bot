package com.springboot.MyTodoList.util;

public enum BotLabels {

	SHOW_MAIN_SCREEN("Show Main Screen"),
	VIEW_TASKS("📋 Ver Tasks"),
	FILTER_BY_ASSIGNEE("👤 Por Asignado"),
	FILTER_BY_SPRINT("🏃 Por Sprint"),
	ALL_TASKS("📋 Todas las Tasks"),
	MAIN_MENU("🏠 Menú Principal"),
	NO_SPRINT_FILTER("✖️ Sin filtro de Sprint"),
	DASH("-");

	private String label;

	BotLabels(String enumLabel) {
		this.label = enumLabel;
	}

	public String getLabel() {
		return label;
	}

}
