/*======================================================
    TAREAS
    MAIN
    Controla la pantalla de acceso (login/registro) y
    arranca la aplicación solo cuando hay sesión activa.
======================================================*/

import { AuthService } from "./services/AuthService.js";
import { CloudSyncService } from "./services/CloudSyncService.js";
import { StorageService } from "./services/StorageService.js";
import { isFirebaseConfigured } from "./services/FirebaseService.js";
import { App } from "./app.js";

const authSection = document.getElementById("authSection");
const authLoading = document.getElementById("authLoading");
const authTabs = document.getElementById("authTabs");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const configWarning = document.getElementById("firebaseConfigWarning");
const sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");
const authUserEmail = document.getElementById("authUserEmail");

let appStarted = false;

/*==========================================
    SERVICE WORKER (PWA / ANDROID)
==========================================*/

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .catch(() => {
                // Si falla el registro (p.ej. abierto sin servidor), la app sigue funcionando igual
            });

    });

}

/*==========================================
    CAMBIAR ENTRE VISTAS
==========================================*/

function showAuthScreen() {

    authSection.classList.remove("hidden");

    sidebar.classList.add("hidden");

    main.classList.add("hidden");

}

function showApp() {

    authSection.classList.add("hidden");

    sidebar.classList.remove("hidden");

    main.classList.remove("hidden");

}

/*==========================================
    ARRANCAR LA APP TRAS INICIAR SESIÓN
==========================================*/

async function startApp(user) {

    StorageService.setUser(user.uid);

    if (authUserEmail) {

        authUserEmail.textContent = user.email;

    }

    const cloudTasks = await CloudSyncService.pull(user.uid);

    if (cloudTasks !== null) {

        StorageService.replaceLocalTasks(cloudTasks);

    } else {

        StorageService.replaceLocalTasks([]);

    }

    showApp();

    if (!appStarted) {

        appStarted = true;

        new App();

    }

}

/*==========================================
    ESTADO DE FIREBASE SIN CONFIGURAR
==========================================*/

if (!isFirebaseConfigured) {

    configWarning?.classList.remove("hidden");

    loginForm?.querySelector("button[type=submit]")?.setAttribute("disabled", "true");

    registerForm?.querySelector("button[type=submit]")?.setAttribute("disabled", "true");

    authLoading?.classList.add("hidden");

}

/*==========================================
    OBSERVAR SESIÓN
==========================================*/

if (isFirebaseConfigured) {

    AuthService.onChange(user => {

        authLoading?.classList.add("hidden");

        if (user) {

            startApp(user);

        } else {

            showAuthScreen();

        }

    });

}

/*==========================================
    TABS LOGIN / REGISTRO
==========================================*/

authTabs?.addEventListener("click", e => {

    const tab = e.target.closest(".auth-tab");

    if (!tab) return;

    document

        .querySelectorAll(".auth-tab")

        .forEach(t => t.classList.remove("active"));

    tab.classList.add("active");

    const target = tab.dataset.tab;

    loginForm.classList.toggle("hidden", target !== "login");

    registerForm.classList.toggle("hidden", target !== "register");

});

/*==========================================
    FORMULARIO: INICIAR SESIÓN
==========================================*/

loginForm?.addEventListener("submit", async e => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;

    const errorBox = document.getElementById("loginError");

    errorBox.textContent = "";

    try {

        await AuthService.login(email, password);

    } catch (error) {

        errorBox.textContent = AuthService.friendlyError(error.code);

    }

});

/*==========================================
    FORMULARIO: CREAR CUENTA
==========================================*/

registerForm?.addEventListener("submit", async e => {

    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();

    const password = document.getElementById("registerPassword").value;

    const errorBox = document.getElementById("registerError");

    errorBox.textContent = "";

    try {

        await AuthService.register(email, password);

    } catch (error) {

        errorBox.textContent = AuthService.friendlyError(error.code);

    }

});

/*==========================================
    CERRAR SESIÓN
==========================================*/

document

    .getElementById("btnLogout")

    ?.addEventListener("click", async () => {

        await AuthService.logout();

        StorageService.setUser(null);

        window.location.reload();

    });
