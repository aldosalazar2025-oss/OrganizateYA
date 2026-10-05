/*======================================================
    TAREAS
    STORAGE SERVICE
======================================================*/

import { CONFIG } from "../config/config.js";
import { Task } from "../models/Task.js";
import { CloudSyncService } from "./CloudSyncService.js";

export class StorageService {

    /*==========================================
        USUARIO ACTIVO (para sincronizar con la nube)
    ==========================================*/

    static currentUserId = null;

    static setUser(uid) {

        this.currentUserId = uid;

    }

    /*==========================================
        GUARDAR TAREAS
    ==========================================*/

    static saveTasks(tasks) {

        const data = tasks.map(task => task.toJSON());

        localStorage.setItem(
            CONFIG.STORAGE_KEY,
            JSON.stringify(data)
        );

        if (this.currentUserId) {

            CloudSyncService.push(this.currentUserId, data);

        }

    }

    /*==========================================
        REEMPLAZAR CACHÉ LOCAL (DESDE LA NUBE)
    ==========================================*/

    static replaceLocalTasks(tasksData = []) {

        localStorage.setItem(
            CONFIG.STORAGE_KEY,
            JSON.stringify(tasksData)
        );

    }

    /*==========================================
        CARGAR TAREAS
    ==========================================*/

    static loadTasks() {

        const data = localStorage.getItem(CONFIG.STORAGE_KEY);

        if (!data) {

            return [];

        }

        try {

            const tasks = JSON.parse(data);

            return tasks.map(task => Task.fromJSON(task));

        } catch (error) {

            console.error(error);

            return [];

        }

    }

    /*==========================================
        ELIMINAR TODAS LAS TAREAS
    ==========================================*/

    static clearTasks() {

        localStorage.removeItem(CONFIG.STORAGE_KEY);

    }

    /*==========================================
        GUARDAR TEMA
    ==========================================*/

    static saveTheme(theme) {

        localStorage.setItem(

            CONFIG.THEME_KEY,

            theme

        );

    }

    /*==========================================
        CARGAR TEMA
    ==========================================*/

    static loadTheme() {

        return (

            localStorage.getItem(CONFIG.THEME_KEY)

            ||

            "light"

        );

    }

    /*==========================================
        EXPORTAR DATOS
    ==========================================*/

    static exportData() {

        return {

            version: CONFIG.VERSION,

            exportedAt: new Date().toISOString(),

            tasks: this.loadTasks().map(

                task => task.toJSON()

            )

        };

    }

    /*==========================================
        IMPORTAR DATOS
    ==========================================*/

    static importData(data) {

        if (!data.tasks) {

            return false;

        }

        const tasks = data.tasks.map(

            task => Task.fromJSON(task)

        );

        this.saveTasks(tasks);

        return true;

    }

    /*==========================================
        INFORMACIÓN
    ==========================================*/

    static getTotalTasks() {

        return this.loadTasks().length;

    }

    static hasTasks() {

        return this.getTotalTasks() > 0;

    }

}