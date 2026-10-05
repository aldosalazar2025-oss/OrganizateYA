/*======================================================
    TAREAS
    FILTERS COMPONENT
======================================================*/

export class Filters {

    constructor() {

        this.search = document.getElementById("searchTask");

        this.priority = document.getElementById("filterPriority");

        this.category = document.getElementById("filterCategory");

        this.day = document.getElementById("filterDay");

        this.status = document.getElementById("filterStatus");

        this.clear = document.getElementById("btnClearFilters");

    }

    /*==========================================
        OBTENER FILTROS
    ==========================================*/

    getFilters() {

        return {

            search: this.search?.value.trim() || "",

            priority: this.priority?.value || "",

            category: this.category?.value || "",

            day: this.day?.value || "",

            status: this.status?.value || ""

        };

    }

    /*==========================================
        LIMPIAR
    ==========================================*/

    reset() {

        if (this.search) this.search.value = "";

        if (this.priority) this.priority.value = "";

        if (this.category) this.category.value = "";

        if (this.day) this.day.value = "";

        if (this.status) this.status.value = "";

    }

    /*==========================================
        CAMBIOS
    ==========================================*/

    onChange(callback) {

        const controls = [

            this.search,

            this.priority,

            this.category,

            this.day,

            this.status

        ];

        controls.forEach(control => {

            if (!control) return;

            const event = control.tagName === "INPUT"

                ? "input"

                : "change";

            control.addEventListener(event, () => {

                callback(this.getFilters());

            });

        });

    }

    /*==========================================
        BOTÓN LIMPIAR
    ==========================================*/

    onClear(callback) {

        if (!this.clear) return;

        this.clear.addEventListener("click", () => {

            this.reset();

            callback(this.getFilters());

        });

    }

}