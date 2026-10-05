/*======================================================
    TAREAS
    HELPERS
======================================================*/

import { CONFIG } from "../config/config.js";

export class Helpers {

    /*==========================================
        GENERAR ID
    ==========================================*/

    static generateId() {

        return Date.now().toString(36) +
               Math.random().toString(36).substring(2, 8);

    }

    /*==========================================
        FECHA LEGIBLE
    ==========================================*/

    static formatDate(date) {

        return new Intl.DateTimeFormat("es-ES", {

            day: "2-digit",

            month: "long",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        }).format(new Date(date));

    }

    /*==========================================
        CAPITALIZAR
    ==========================================*/

    static capitalize(text = "") {

        return text.charAt(0).toUpperCase() +

               text.slice(1).toLowerCase();

    }

    /*==========================================
        COLOR PRIORIDAD
    ==========================================*/

    static priorityColor(priority) {

        switch (priority) {

            case "Alta":

                return "#EF4444";

            case "Media":

                return "#F59E0B";

            case "Baja":

                return "#10B981";

            default:

                return "#2563EB";

        }

    }

    /*==========================================
        CLASE PRIORIDAD
    ==========================================*/

    static priorityClass(priority) {

        switch (priority) {

            case "Alta":

                return "badge-high";

            case "Media":

                return "badge-medium";

            case "Baja":

                return "badge-low";

            default:

                return "";

        }

    }

    /*==========================================
        ICONO CATEGORÍA
    ==========================================*/

    static categoryIcon(category) {

        const icons = {

            Estudio: "fa-book",

            Trabajo: "fa-briefcase",

            Personal: "fa-user",

            Salud: "fa-heart-pulse",

            Compras: "fa-cart-shopping",

            Finanzas: "fa-wallet",

            Ocio: "fa-gamepad",

            Otros: "fa-folder"

        };

        return icons[category] || "fa-folder";

    }

    /*==========================================
        PORCENTAJE
    ==========================================*/

    static percentage(current, total) {

        if (total === 0) {

            return 0;

        }

        return Math.round(

            (current / total) * 100

        );

    }

    /*==========================================
        BUSCAR TEXTO
    ==========================================*/

    static contains(text = "", search = "") {

        return text

            .toLowerCase()

            .includes(

                search.toLowerCase()

            );

    }

    /*==========================================
        COPIA PROFUNDA
    ==========================================*/

    static clone(data) {

        return JSON.parse(

            JSON.stringify(data)

        );

    }

    /*==========================================
        DESCARGAR JSON
    ==========================================*/

    static downloadJSON(data, filename = "tareas.json") {

        const blob = new Blob(

            [

                JSON.stringify(data, null, 2)

            ],

            {

                type: "application/json"

            }

        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = filename;

        a.click();

        URL.revokeObjectURL(url);

    }

    /*==========================================
        ESPERAR
    ==========================================*/

    static sleep(ms) {

        return new Promise(resolve =>

            setTimeout(resolve, ms)

        );

    }

    /*==========================================
        CONSTRUIR FILAS DEL HORARIO SEMANAL
    ==========================================*/

    static buildScheduleRows(tasks = []) {

        return CONFIG.DAYS.flatMap(day => {

            const dayTasks = tasks.filter(task => task.day === day);

            if (dayTasks.length === 0) {

                return [{

                    "Día": day,

                    "Tarea": "— Sin tareas —",

                    "Categoría": "-",

                    "Prioridad": "-",

                    "Estado": "-"

                }];

            }

            return dayTasks.map(task => ({

                "Día": day,

                "Tarea": task.title,

                "Categoría": task.category,

                "Prioridad": task.priority,

                "Estado": task.completed ? "Completada" : "Pendiente"

            }));

        });

    }

    /*==========================================
        EXPORTAR HORARIO SEMANAL A EXCEL
    ==========================================*/

    static exportScheduleExcel(tasks = [], filename = "tareas-horario-semanal.xlsx") {

        const rows = this.buildScheduleRows(tasks);

        const worksheet = XLSX.utils.json_to_sheet(rows);

        worksheet["!cols"] = [
            { wch: 12 },
            { wch: 34 },
            { wch: 16 },
            { wch: 12 },
            { wch: 14 }
        ];

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Horario Semanal");

        XLSX.writeFile(workbook, filename);

    }

    /*==========================================
        EXPORTAR HORARIO SEMANAL A PDF
    ==========================================*/

    static exportSchedulePDF(tasks = [], filename = "tareas-horario-semanal.pdf") {

        const rows = this.buildScheduleRows(tasks);

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({ orientation: "landscape" });

        doc.setFontSize(18);

        doc.setTextColor(37, 99, 235);

        doc.text("Tareas — Horario Semanal", 14, 18);

        doc.setFontSize(10);

        doc.setTextColor(100, 116, 139);

        doc.text(
            `Generado el ${this.formatDate(new Date())}`,
            14,
            25
        );

        doc.autoTable({

            startY: 32,

            head: [["Día", "Tarea", "Categoría", "Prioridad", "Estado"]],

            body: rows.map(row => [
                row["Día"],
                row["Tarea"],
                row["Categoría"],
                row["Prioridad"],
                row["Estado"]
            ]),

            headStyles: {
                fillColor: [37, 99, 235],
                textColor: 255,
                fontStyle: "bold"
            },

            alternateRowStyles: {
                fillColor: [245, 247, 251]
            },

            styles: {
                fontSize: 10,
                cellPadding: 6
            },

            columnStyles: {
                0: { fontStyle: "bold", textColor: [37, 99, 235] }
            }

        });

        doc.save(filename);

    }

}