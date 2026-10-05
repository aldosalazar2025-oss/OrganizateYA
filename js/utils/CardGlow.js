/*======================================================
    TAREAS
    EFECTO DE BRILLO QUE SIGUE AL CURSOR
    (Puramente visual — no afecta datos ni lógica)
======================================================*/

function attachGlow(selector) {

    document.addEventListener("mousemove", e => {

        const target = e.target.closest(selector);

        if (!target) return;

        const rect = target.getBoundingClientRect();

        const x = ((e.clientX - rect.left) / rect.width) * 100;

        const y = ((e.clientY - rect.top) / rect.height) * 100;

        target.style.setProperty("--mx", `${x}%`);

        target.style.setProperty("--my", `${y}%`);

    });

}

attachGlow(".task-card");

attachGlow(".dashboard .card");
