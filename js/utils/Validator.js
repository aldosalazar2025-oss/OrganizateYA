/*======================================================
    TAREAS
    VALIDATOR
======================================================*/

import { CONFIG } from "../config/config.js";

export class Validator {

    /*==========================================
        VALIDAR TAREA COMPLETA
    ==========================================*/

    static validateTask(data) {

        const errors = {};

        const title = this.validateTitle(data.title);

        if (!title.valid) {

            errors.title = title.message;

        }

        const description = this.validateDescription(data.description);

        if (!description.valid) {

            errors.description = description.message;

        }

        const category = this.validateCategory(data.category);

        if (!category.valid) {

            errors.category = category.message;

        }

        const priority = this.validatePriority(data.priority);

        if (!priority.valid) {

            errors.priority = priority.message;

        }

        const day = this.validateDay(data.day);

        if (!day.valid) {

            errors.day = day.message;

        }

        return {

            valid: Object.keys(errors).length === 0,

            errors

        };

    }

    /*==========================================
        TÍTULO
    ==========================================*/

    static validateTitle(title = "") {

        title = title.trim();

        if (!title) {

            return {

                valid: false,

                message: "El título es obligatorio."

            };

        }

        if (title.length < 3) {

            return {

                valid: false,

                message: "Debe tener al menos 3 caracteres."

            };

        }

        if (title.length > 100) {

            return {

                valid: false,

                message: "Máximo 100 caracteres."

            };

        }

        return {

            valid: true

        };

    }

    /*==========================================
        DESCRIPCIÓN
    ==========================================*/

    static validateDescription(description = "") {

        if (description.trim().length > 500) {

            return {

                valid: false,

                message: "Máximo 500 caracteres."

            };

        }

        return {

            valid: true

        };

    }

    /*==========================================
        CATEGORÍA
    ==========================================*/

    static validateCategory(category) {

        if (!CONFIG.CATEGORIES.includes(category)) {

            return {

                valid: false,

                message: "Categoría inválida."

            };

        }

        return {

            valid: true

        };

    }

    /*==========================================
        PRIORIDAD
    ==========================================*/

    static validatePriority(priority) {

        if (!CONFIG.PRIORITIES.includes(priority)) {

            return {

                valid: false,

                message: "Prioridad inválida."

            };

        }

        return {

            valid: true

        };

    }

    /*==========================================
        DÍA
    ==========================================*/

    static validateDay(day) {

        if (!CONFIG.DAYS.includes(day)) {

            return {

                valid: false,

                message: "Día inválido."

            };

        }

        return {

            valid: true

        };

    }

    /*==========================================
        MOSTRAR ERRORES
    ==========================================*/

    static showErrors(errors = {}) {

        document.querySelectorAll(".error-text").forEach(el => {

            el.remove();

        });

        document.querySelectorAll(".input-error").forEach(el => {

            el.classList.remove("input-error");

        });

        Object.entries(errors).forEach(([field, message]) => {

            const input = document.querySelector(`[name="${field}"]`);

            if (!input) return;

            input.classList.add("input-error");

            const error = document.createElement("small");

            error.className = "error-text";

            error.textContent = message;

            input.insertAdjacentElement("afterend", error);

        });

    }

    /*==========================================
        LIMPIAR ERRORES
    ==========================================*/

    static clearErrors() {

        document.querySelectorAll(".error-text").forEach(el => {

            el.remove();

        });

        document.querySelectorAll(".input-error").forEach(el => {

            el.classList.remove("input-error");

        });

    }

}