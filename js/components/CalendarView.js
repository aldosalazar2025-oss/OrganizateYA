/*======================================================
    TAREAS
    CALENDAR VIEW COMPONENT
======================================================*/

import { CONFIG } from "../config/config.js";
import { Helpers } from "../utils/Helpers.js";

export class CalendarView {

    constructor(containerId = "calendarGrid") {

        this.container = document.getElementById(containerId);

    }

    /*==========================================
        RENDER
    ==========================================*/

    render(tasks = []) {

        if (!this.container) return;

        this.container.innerHTML = CONFIG.DAYS

            .map(day => this.createDayColumn(day, tasks))

            .join("");

    }

    /*==========================================
        COLUMNA DE DÍA
    ==========================================*/

    createDayColumn(day, tasks) {

        const dayTasks = tasks.filter(task => task.day === day);

        return `

        <div class="calendar-day">

            <h3>${day}</h3>

            <div class="calendar-day-tasks">

                ${dayTasks.length
                    ? dayTasks.map(task => this.createItem(task)).join("")
                    : '<p class="calendar-empty">Sin tareas</p>'
                }

            </div>

        </div>

        `;

    }

    /*==========================================
        ITEM
    ==========================================*/

    createItem(task) {

        return `

        <div class="calendar-item ${task.completed ? "completed" : ""}">

            <span
                class="calendar-dot"
                style="background:${Helpers.priorityColor(task.priority)}">

            </span>

            <span>${task.title}</span>

        </div>

        `;

    }

}
