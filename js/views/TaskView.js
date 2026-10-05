/*======================================================
    TAREAS
    TASK VIEW
======================================================*/

import { Helpers } from "../utils/Helpers.js";

export class TaskView {

    constructor(containerId = "taskContainer") {

        this.container = document.getElementById(containerId);

    }

    /*==========================================
        RENDER
    ==========================================*/

    render(tasks = []) {

        if (!this.container) return;

        if (!tasks.length) {

            this.renderEmpty();

            return;

        }

        this.container.innerHTML = tasks
            .map(task => this.createCard(task))
            .join("");

    }

    /*==========================================
        CARD
    ==========================================*/

    createCard(task) {

        return `

        <article class="task-card ${task.completed ? "task-completed" : ""}"
                 data-id="${task.id}">

            <div class="task-header">

                <div>

                    <h3 class="task-title">

                        ${task.title}

                    </h3>

                    <p class="task-description">

                        ${task.description || "Sin descripción"}

                    </p>

                </div>

            </div>

            <div class="task-badges">

                <span class="badge ${Helpers.priorityClass(task.priority)}">

                    ${task.priority}

                </span>

                <span class="badge badge-category">

                    <i class="fa-solid ${Helpers.categoryIcon(task.category)}"></i>

                    ${task.category}

                </span>

                <span class="badge badge-day">

                    <i class="fa-solid fa-calendar-day"></i>

                    ${task.day}

                </span>

            </div>

            <div class="task-footer">

                <div class="task-info">

                    <span>

                        <i class="fa-solid fa-clock"></i>

                        ${Helpers.formatDate(task.createdAt)}

                    </span>

                </div>

                <div class="task-actions">

                    <button
                        class="btn-check"
                        data-action="toggle"
                        data-id="${task.id}">
                        <i class="fa-solid fa-check"></i>
                    </button>

                    <button
                        class="btn-edit"
                        data-action="edit"
                        data-id="${task.id}">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="btn-delete"
                        data-action="delete"
                        data-id="${task.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </div>

        </article>

        `;

    }

    /*==========================================
        VACÍO
    ==========================================*/

    renderEmpty() {

        this.container.innerHTML = `

        <div class="empty fade-in">

            <i class="fa-solid fa-clipboard-list"></i>

            <h2>No hay tareas registradas</h2>

            <p>Presiona "Nueva tarea" para comenzar.</p>

        </div>

        `;

    }

    /*==========================================
        EVENTOS
    ==========================================*/

    bindEvents(callbacks = {}) {

        this.container.addEventListener("click", e => {

            const button = e.target.closest("[data-action]");

            if (!button) return;

            const action = button.dataset.action;

            const id = button.dataset.id;

            switch (action) {

                case "toggle":

                    callbacks.onToggle?.(id);

                    break;

                case "edit":

                    callbacks.onEdit?.(id);

                    break;

                case "delete":

                    callbacks.onDelete?.(id);

                    break;

            }

        });

    }

    /*==========================================
        ANIMACIÓN
    ==========================================*/

    animateCard(id) {

        const card = this.container.querySelector(

            `[data-id="${id}"]`

        );

        if (!card) return;

        card.classList.add("scale-in");

        setTimeout(() => {

            card.classList.remove("scale-in");

        }, 350);

    }

    /*==========================================
        ANIMAR COMPLETADO
    ==========================================*/

    animateComplete(id, callback) {

        const card = this.container.querySelector(

            `[data-id="${id}"]`

        );

        if (!card) {

            callback();

            return;

        }

        card.classList.add("completing");

        setTimeout(() => {

            callback();

        }, 450);

    }

    /*==========================================
        ELIMINAR
    ==========================================*/

    removeCard(id) {

        const card = this.container.querySelector(

            `[data-id="${id}"]`

        );

        if (!card) return;

        card.style.opacity = "0";

        card.style.transform = "translateX(40px)";

        setTimeout(() => {

            card.remove();

            if (!this.container.children.length) {

                this.renderEmpty();

            }

        }, 300);

    }

    /*==========================================
        ESTADÍSTICAS
    ==========================================*/

    updateStats(stats) {

        const total = document.getElementById("totalTasks");

        const completed = document.getElementById("completedTasks");

        const pending = document.getElementById("pendingTasks");

        const progress = document.getElementById("progressPercent");

        const bar = document.getElementById("progressBar");

        if (total) total.textContent = stats.total;

        if (completed) completed.textContent = stats.completed;

        if (pending) pending.textContent = stats.pending;

        if (progress) progress.textContent = stats.progress + "%";

        if (bar) {

            bar.style.width = stats.progress + "%";

        }

    }

}