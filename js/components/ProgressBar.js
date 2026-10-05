/*======================================================
    TAREAS
    PROGRESS BAR COMPONENT
======================================================*/

export class ProgressBar {

    constructor() {

        this.bar = document.getElementById("progressBar");

        this.percent = document.getElementById("progressPercent");

        this.total = document.getElementById("totalTasks");

        this.completed = document.getElementById("completedTasks");

        this.pending = document.getElementById("pendingTasks");

        this.high = document.getElementById("highPriority");

    }

    /*==========================================
        ACTUALIZAR
    ==========================================*/

    update(stats) {

        if (this.bar) {

            this.bar.style.width = `${stats.progress}%`;

            this.bar.setAttribute(

                "aria-valuenow",

                stats.progress

            );

        }

        if (this.percent) {

            this.animateValue(

                this.percent,

                stats.progress,

                "%"

            );

        }

        if (this.total) {

            this.animateValue(

                this.total,

                stats.total

            );

        }

        if (this.completed) {

            this.animateValue(

                this.completed,

                stats.completed

            );

        }

        if (this.pending) {

            this.animateValue(

                this.pending,

                stats.pending

            );

        }

        if (this.high) {

            this.animateValue(

                this.high,

                stats.high

            );

        }

    }

    /*==========================================
        ANIMAR VALOR
    ==========================================*/

    animateValue(element, value, suffix = "") {

        const current = parseInt(element.dataset.value || 0);

        const duration = 400;

        const start = performance.now();

        const step = now => {

            const progress = Math.min(

                (now - start) / duration,

                1

            );

            const result = Math.round(

                current +

                (value - current) * progress

            );

            element.textContent = result + suffix;

            if (progress < 1) {

                requestAnimationFrame(step);

            } else {

                element.dataset.value = value;

            }

        };

        requestAnimationFrame(step);

    }

    /*==========================================
        REINICIAR
    ==========================================*/

    reset() {

        this.update({

            total: 0,

            completed: 0,

            pending: 0,

            high: 0,

            progress: 0

        });

    }

}