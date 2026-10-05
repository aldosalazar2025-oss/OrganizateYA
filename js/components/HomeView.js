/*======================================================
    TAREAS
    HOME VIEW COMPONENT
======================================================*/

import { CONFIG } from "../config/config.js";

const DAY_COLORS = {

    Lunes: "#FFB4B4",

    Martes: "#FFD59E",

    Miércoles: "#FFF3A0",

    Jueves: "#A8E6CF",

    Viernes: "#B4D4FF",

    Sábado: "#C9B8FF",

    Domingo: "#FFB8E1"

};

const WEEKDAY_NAMES = [

    "Domingo", "Lunes", "Martes", "Miércoles",

    "Jueves", "Viernes", "Sábado"

];

const PRIORITY_BADGE = {

    Alta: "badge-high",

    Media: "badge-medium",

    Baja: "badge-low"

};

export class HomeView {

    constructor() {

        this.todayList = document.getElementById("todayTasksList");

        this.todayLabel = document.getElementById("todayLabel");

        this.weekOverview = document.getElementById("weekOverview");

    }

    /*==========================================
        DÍA ACTUAL
    ==========================================*/

    getTodayName() {

        return WEEKDAY_NAMES[new Date().getDay()];

    }

    /*==========================================
        RENDER
    ==========================================*/

    render(tasks = [], callbacks = {}) {

        const today = this.getTodayName();

        if (this.todayLabel) {

            this.todayLabel.textContent = today;

        }

        this.renderToday(tasks, today, callbacks);

        this.renderWeek(tasks, callbacks);

    }

    /*==========================================
        TAREAS DE HOY
    ==========================================*/

    renderToday(tasks, today, callbacks) {

        if (!this.todayList) return;

        const todayTasks = tasks.filter(

            task => task.day === today

        );

        if (!todayTasks.length) {

            this.todayList.innerHTML = `

            <p class="calendar-empty">

                No tienes tareas para hoy. ¡Buen momento para adelantar algo!

            </p>

            `;

            return;

        }

        this.todayList.innerHTML = todayTasks

            .map(task => this.createTodayItem(task))

            .join("");

        this.todayList

            .querySelectorAll("[data-today-check]")

            .forEach(button => {

                button.addEventListener("click", () => {

                    callbacks.onToggle?.(

                        button.dataset.todayCheck

                    );

                });

            });

    }

    createTodayItem(task) {

        return `

        <div class="today-item ${task.completed ? "completed" : ""}">

            <button
                class="today-check"
                data-today-check="${task.id}">

                <i class="fa-solid fa-check"></i>

            </button>

            <div>

                <strong>${task.title}</strong>

                <span class="badge ${PRIORITY_BADGE[task.priority] || ""}">

                    ${task.priority}

                </span>

            </div>

        </div>

        `;

    }

    /*==========================================
        VISTA SEMANAL
    ==========================================*/

    renderWeek(tasks, callbacks) {

        if (!this.weekOverview) return;

        this.weekOverview.innerHTML = CONFIG.DAYS

            .map(day => this.createWeekPill(day, tasks))

            .join("");

        this.weekOverview

            .querySelectorAll("[data-week-day]")

            .forEach(pill => {

                pill.addEventListener("click", () => {

                    callbacks.onDaySelect?.(

                        pill.dataset.weekDay

                    );

                });

            });

    }

    createWeekPill(day, tasks) {

        const count = tasks.filter(

            task => task.day === day

        ).length;

        const color = DAY_COLORS[day] || "var(--primary)";

        return `

        <button
            class="week-pill"
            data-week-day="${day}"
            style="background:${color}">

            <span class="week-pill-day">${day}</span>

            <span class="week-pill-count">${count}</span>

        </button>

        `;

    }

}
