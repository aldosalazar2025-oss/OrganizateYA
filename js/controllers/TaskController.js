/*======================================================
    TAREAS
    TASK CONTROLLER
======================================================*/

import { Task } from "../models/Task.js";
import { StorageService } from "../services/StorageService.js";

export class TaskController {

    constructor() {

        this.tasks = StorageService.loadTasks();

    }

    /*==========================================
        CRUD
    ==========================================*/

    getAll() {

        return [...this.tasks];

    }

    getById(id) {

        return this.tasks.find(task => task.id === id);

    }

    create(taskData) {

        const task = new Task(taskData);

        this.tasks.push(task);

        this.save();

        return task;

    }

    update(id, data) {

        const task = this.getById(id);

        if (!task) return null;

        task.update(data);

        this.save();

        return task;

    }

    delete(id) {

        const index = this.tasks.findIndex(task => task.id === id);

        if (index === -1) return false;

        this.tasks.splice(index, 1);

        this.save();

        return true;

    }

    toggle(id) {

        const task = this.getById(id);

        if (!task) return null;

        task.toggleCompleted();

        this.save();

        return task;

    }

    save() {

        StorageService.saveTasks(this.tasks);

    }

    /*==========================================
        BUSCADOR
    ==========================================*/

    search(text = "") {

        text = text.toLowerCase().trim();

        if (!text) {

            return this.getAll();

        }

        return this.tasks.filter(task =>

            task.title.toLowerCase().includes(text) ||

            task.description.toLowerCase().includes(text)

        );

    }

    /*==========================================
        FILTROS
    ==========================================*/

    filter(options = {}) {

        return this.tasks.filter(task => {

            if (options.priority &&
                task.priority !== options.priority) {

                return false;

            }

            if (options.category &&
                task.category !== options.category) {

                return false;

            }

            if (options.day &&
                task.day !== options.day) {

                return false;

            }

            if (options.completed !== undefined &&
                task.completed !== options.completed) {

                return false;

            }

            return true;

        });

    }

    /*==========================================
        ESTADÍSTICAS
    ==========================================*/

    getStats() {

        const total = this.tasks.length;

        const completed = this.tasks.filter(

            task => task.completed

        ).length;

        const pending = total - completed;

        const high = this.tasks.filter(

            task => task.priority === "Alta"

        ).length;

        const medium = this.tasks.filter(

            task => task.priority === "Media"

        ).length;

        const low = this.tasks.filter(

            task => task.priority === "Baja"

        ).length;

        const progress = total === 0

            ? 0

            : Math.round((completed / total) * 100);

        return {

            total,

            completed,

            pending,

            high,

            medium,

            low,

            progress

        };

    }

    /*==========================================
        ORDENAR
    ==========================================*/

    sortBy(field = "createdAt", order = "asc") {

        const tasks = [...this.tasks];

        tasks.sort((a, b) => {

            let valueA = a[field];

            let valueB = b[field];

            if (typeof valueA === "string") {

                valueA = valueA.toLowerCase();

                valueB = valueB.toLowerCase();

            }

            if (valueA < valueB) {

                return order === "asc" ? -1 : 1;

            }

            if (valueA > valueB) {

                return order === "asc" ? 1 : -1;

            }

            return 0;

        });

        return tasks;

    }

    /*==========================================
        LIMPIAR COMPLETADAS
    ==========================================*/

    clearCompleted() {

        this.tasks = this.tasks.filter(

            task => !task.completed

        );

        this.save();

    }

}