/*======================================================
    TAREAS
    MODAL COMPONENT
======================================================*/

import { Validator } from "../utils/Validator.js";

export class Modal {

    constructor(modalId = "taskModal") {

        this.modal = document.getElementById(modalId);

        this.form = this.modal?.querySelector("form");

        this.title = this.modal?.querySelector(".modal-title");

        this.submitButton = this.form?.querySelector(
            'button[type="submit"]'
        );

        this.currentId = null;

        this.bindClose();

        this.bindKeyboard();

    }

    /*==========================================
        ABRIR
    ==========================================*/

    open(task = null) {

        if (!this.modal) return;

        this.currentId = task?.id || null;

        this.fill(task);

        this.updateMode();

        this.modal.classList.add("active");

        requestAnimationFrame(() => {

            this.form?.title?.focus();

        });

    }

    /*==========================================
        CERRAR
    ==========================================*/

    close() {

        if (!this.modal) return;

        this.modal.classList.remove("active");

        setTimeout(() => {

            this.reset();

        }, 250);

    }

    /*==========================================
        MODO
    ==========================================*/

    updateMode() {

        const editing = !!this.currentId;

        if (this.title) {

            this.title.textContent = editing

                ? "Editar tarea"

                : "Nueva tarea";

        }

        if (this.submitButton) {

            this.submitButton.innerHTML = editing

                ? '<i class="fa-solid fa-floppy-disk"></i> Actualizar'

                : '<i class="fa-solid fa-plus"></i> Crear';

        }

    }

    /*==========================================
        LLENAR
    ==========================================*/

    fill(task = null) {

        this.form.reset();

        Validator.clearErrors();

        if (!task) return;

        this.form.title.value = task.title;

        this.form.description.value = task.description;

        this.form.category.value = task.category;

        this.form.priority.value = task.priority;

        this.form.day.value = task.day;

    }

    /*==========================================
        LIMPIAR
    ==========================================*/

    reset() {

        this.currentId = null;

        this.form.reset();

        Validator.clearErrors();

        this.updateMode();

    }

    /*==========================================
        DATOS
    ==========================================*/

    getData() {

        return {

            title: this.form.title.value.trim(),

            description: this.form.description.value.trim(),

            category: this.form.category.value,

            priority: this.form.priority.value,

            day: this.form.day.value

        };

    }

    /*==========================================
        VALIDAR
    ==========================================*/

    validate() {

        const result = Validator.validateTask(

            this.getData()

        );

        Validator.clearErrors();

        if (!result.valid) {

            Validator.showErrors(result.errors);

        }

        return result;

    }

    /*==========================================
        SUBMIT
    ==========================================*/

    onSubmit(callback) {

        this.form.addEventListener("submit", e => {

            e.preventDefault();

            const validation = this.validate();

            if (!validation.valid) return;

            this.loading(true);

            callback(

                this.currentId,

                this.getData()

            );

            setTimeout(() => {

                this.loading(false);

            }, 300);

        });

    }

    /*==========================================
        LOADING
    ==========================================*/

    loading(state = true) {

        if (!this.submitButton) return;

        this.submitButton.disabled = state;

        this.submitButton.innerHTML = state

            ? '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...'

            : (this.currentId

                ? '<i class="fa-solid fa-floppy-disk"></i> Actualizar'

                : '<i class="fa-solid fa-plus"></i> Crear');

    }

    /*==========================================
        CERRAR
    ==========================================*/

    bindClose() {

        this.modal?.querySelectorAll(".modal-close, .modal-cancel")

            .forEach(button => {

                button.addEventListener("click", () => {

                    this.close();

                });

            });

        this.modal?.addEventListener("click", e => {

            if (e.target === this.modal) {

                this.close();

            }

        });

    }

    /*==========================================
        ESC
    ==========================================*/

    bindKeyboard() {

        document.addEventListener("keydown", e => {

            if (

                e.key === "Escape" &&

                this.modal.classList.contains("active")

            ) {

                this.close();

            }

        });

    }

}