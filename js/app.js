/*======================================================
    TAREAS
    APP
======================================================*/

import { TaskController } from "./controllers/TaskController.js";
import { TaskView } from "./views/TaskView.js";
import { Modal } from "./components/Modal.js";
import { Filters } from "./components/Filters.js";
import { ProgressBar } from "./components/ProgressBar.js";
import { CalendarView } from "./components/CalendarView.js";
import { HomeView } from "./components/HomeView.js";
import { StorageService } from "./services/StorageService.js";
import { Helpers } from "./utils/Helpers.js";

export class App {

    constructor() {

        this.controller = new TaskController();

        this.view = new TaskView();

        this.modal = new Modal();

        this.filters = new Filters();

        this.progress = new ProgressBar();

        this.calendar = new CalendarView();

        this.home = new HomeView();

        this.init();

    }

    /*==========================================
        INICIALIZAR
    ==========================================*/

    init() {

        this.render();

        this.bindEvents();

        this.bindSidebar();

        this.bindTheme();

        this.bindSettings();

        this.switchView("inicio");

    }

    /*==========================================
        RENDER
    ==========================================*/

    render(tasks = null) {

        const list = tasks || this.controller.getAll();

        this.view.render(list);

        this.progress.update(

            this.controller.getStats()

        );

        this.calendar.render(

            this.controller.getAll()

        );

        this.home.render(

            this.controller.getAll(),

            {

                onToggle: id => {

                    this.controller.toggle(id);

                    this.render();

                },

                onDaySelect: day => this.goToDay(day)

            }

        );

    }

    /*==========================================
        EVENTOS
    ==========================================*/

    bindEvents() {

        /*=========================
            NUEVA TAREA
        =========================*/

        document

            .getElementById("btnNewTask")

            ?.addEventListener("click", () => {

                this.modal.open();

            });

        /*=========================
            GUARDAR
        =========================*/

        this.modal.onSubmit((id, data) => {

            if (id) {

                this.controller.update(id, data);

            } else {

                this.controller.create(data);

            }

            this.modal.close();

            this.render();

        });

        /*=========================
            TARJETAS
        =========================*/

        this.view.bindEvents({

            onToggle: id => {

                this.view.animateComplete(id, () => {

                    this.controller.toggle(id);

                    this.render();

                });

            },

            onEdit: id => {

                const task = this.controller.getById(id);

                this.modal.open(task);

            },

            onDelete: id => {

                const ok = confirm(

                    "¿Eliminar esta tarea?"

                );

                if (!ok) return;

                this.view.removeCard(id);

                setTimeout(() => {

                    this.controller.delete(id);

                    this.progress.update(this.controller.getStats());

                    this.calendar.render(this.controller.getAll());

                }, 300);

            }

        });

        /*=========================
            FILTROS
        =========================*/

        this.filters.onChange(filters => {

            this.applyFilters(filters);

        });

        this.filters.onClear(() => {

            this.render();

        });

    }

    /*==========================================
        FILTRAR
    ==========================================*/

    applyFilters(filters) {

        let tasks = this.controller.getAll();

        if (filters.search) {

            tasks = tasks.filter(task =>

                task.title

                    .toLowerCase()

                    .includes(

                        filters.search.toLowerCase()

                    )

                ||

                task.description

                    .toLowerCase()

                    .includes(

                        filters.search.toLowerCase()

                    )

            );

        }

        if (filters.priority) {

            tasks = tasks.filter(task =>

                task.priority === filters.priority

            );

        }

        if (filters.category) {

            tasks = tasks.filter(task =>

                task.category === filters.category

            );

        }

        if (filters.day) {

            tasks = tasks.filter(task =>

                task.day === filters.day

            );

        }

        if (filters.status) {

            if (filters.status === "Pendiente") {

                tasks = tasks.filter(

                    task => !task.completed

                );

            }

            if (filters.status === "Completada") {

                tasks = tasks.filter(

                    task => task.completed

                );

            }

        }

        this.view.render(tasks);

        this.progress.update(this.controller.getStats());

    }

    /*==========================================
        NAVEGACIÓN DEL SIDEBAR
    ==========================================*/

    bindSidebar() {

        const items = document.querySelectorAll(".sidebar nav li");

        const sidebar = document.querySelector(".sidebar");

        const overlay = document.getElementById("sidebarOverlay");

        const menuToggle = document.getElementById("btnMenuToggle");

        const closeBtn = document.getElementById("btnCloseSidebar");

        const openSidebar = () => {

            sidebar?.classList.add("active");

            overlay?.classList.add("active");

        };

        const closeSidebar = () => {

            sidebar?.classList.remove("active");

            overlay?.classList.remove("active");

        };

        menuToggle?.addEventListener("click", openSidebar);

        closeBtn?.addEventListener("click", closeSidebar);

        overlay?.addEventListener("click", closeSidebar);

        window.addEventListener("resize", () => {

            if (window.innerWidth > 992) {

                closeSidebar();

            }

        });

        items.forEach(item => {

            item.addEventListener("click", () => {

                items.forEach(i => i.classList.remove("active"));

                item.classList.add("active");

                this.switchView(item.dataset.view);

                if (window.innerWidth <= 992) {

                    closeSidebar();

                }

            });

        });

    }

    /*==========================================
        CAMBIAR DE VISTA
    ==========================================*/

    switchView(view = "inicio") {

        const home = document.getElementById("homeSection");

        const dashboard = document.getElementById("dashboardSection");

        const progress = document.getElementById("progressSection");

        const filters = document.getElementById("filtersContainer");

        const tasks = document.getElementById("taskContainer");

        const calendarView = document.getElementById("calendarSection");

        const settings = document.getElementById("settingsSection");

        const sections = [

            home,

            dashboard,

            progress,

            filters,

            tasks,

            calendarView,

            settings

        ];

        sections.forEach(section => section?.classList.add("hidden"));

        switch (view) {

            case "tareas":

                filters?.classList.remove("hidden");

                tasks?.classList.remove("hidden");

                break;

            case "estadisticas":

                dashboard?.classList.remove("hidden");

                progress?.classList.remove("hidden");

                break;

            case "calendario":

                this.calendar.render(this.controller.getAll());

                calendarView?.classList.remove("hidden");

                break;

            case "configuracion":

                settings?.classList.remove("hidden");

                break;

            default:

                home?.classList.remove("hidden");

        }

    }

    /*==========================================
        IR A UN DÍA DESDE INICIO
    ==========================================*/

    goToDay(day) {

        document

            .querySelectorAll(".sidebar nav li")

            .forEach(item => item.classList.remove("active"));

        document

            .querySelector('.sidebar nav li[data-view="tareas"]')

            ?.classList.add("active");

        this.switchView("tareas");

        if (window.innerWidth <= 992) {

            document.querySelector(".sidebar")?.classList.remove("active");

            document.getElementById("sidebarOverlay")?.classList.remove("active");

        }

        if (this.filters.day) {

            this.filters.day.value = day;

        }

        this.applyFilters(

            this.filters.getFilters()

        );

    }

    /*==========================================
        TEMA OSCURO / CLARO
    ==========================================*/

    bindTheme() {

        const saved = StorageService.loadTheme();

        if (saved === "dark") {

            document.body.classList.add("dark");

        }

        this.updateThemeIcon();

        const toggle = () => {

            document.body.classList.toggle("dark");

            StorageService.saveTheme(

                document.body.classList.contains("dark")

                    ? "dark"

                    : "light"

            );

            this.updateThemeIcon();

        };

        document

            .getElementById("themeButton")

            ?.addEventListener("click", toggle);

        document

            .getElementById("themeButtonSettings")

            ?.addEventListener("click", toggle);

    }

    updateThemeIcon() {

        const dark = document.body.classList.contains("dark");

        document

            .querySelectorAll("#themeButton i, #themeButtonSettings i")

            .forEach(icon => {

                icon.className = dark

                    ? "fa-solid fa-sun"

                    : "fa-solid fa-moon";

            });

    }

    /*==========================================
        CONFIGURACIÓN: EXPORTAR / IMPORTAR / LIMPIAR
    ==========================================*/

    bindSettings() {

        document

            .getElementById("btnExportExcel")

            ?.addEventListener("click", () => {

                const tasks = this.controller.getAll();

                if (!tasks.length) {

                    this.notifyEmptySchedule();

                    return;

                }

                Helpers.exportScheduleExcel(tasks);

                this.notifyExportSuccess("Excel");

            });

        document

            .getElementById("btnExportPDF")

            ?.addEventListener("click", () => {

                const tasks = this.controller.getAll();

                if (!tasks.length) {

                    this.notifyEmptySchedule();

                    return;

                }

                Helpers.exportSchedulePDF(tasks);

                this.notifyExportSuccess("PDF");

            });

        document

            .getElementById("btnClearCompleted")

            ?.addEventListener("click", () => {

                const ok = confirm(

                    "¿Eliminar todas las tareas completadas? Esta acción no se puede deshacer."

                );

                if (!ok) return;

                this.controller.clearCompleted();

                this.render();

            });

    }

    /*==========================================
        NOTIFICACIONES DE EXPORTACIÓN
    ==========================================*/

    notifyExportSuccess(format) {

        if (typeof Swal === "undefined") return;

        Swal.fire({

            icon: "success",

            title: "¡Horario exportado!",

            text: `Tu horario semanal se descargó en formato ${format}.`,

            confirmButtonColor: "#2563EB",

            timer: 2600,

            timerProgressBar: true

        });

    }

    notifyEmptySchedule() {

        if (typeof Swal === "undefined") {

            alert("No hay tareas registradas para generar el horario.");

            return;

        }

        Swal.fire({

            icon: "info",

            title: "Sin tareas",

            text: "Aún no tienes tareas registradas para generar el horario semanal.",

            confirmButtonColor: "#2563EB"

        });

    }

}
