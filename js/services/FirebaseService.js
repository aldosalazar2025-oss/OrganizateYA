/*======================================================
    TAREAS
    FIREBASE SERVICE
    Inicializa Firebase (Auth + Firestore) usando el SDK
    modular servido desde CDN, sin necesidad de npm/build.
======================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "../config/firebase-config.js";

/*==========================================
    ¿ESTÁ CONFIGURADO?
==========================================*/

export const isFirebaseConfigured = Boolean(

    firebaseConfig.apiKey &&

    !firebaseConfig.apiKey.startsWith("TU_")

);

/*==========================================
    INICIALIZAR
==========================================*/

let app = null;

let auth = null;

let db = null;

if (isFirebaseConfigured) {

    try {

        app = initializeApp(firebaseConfig);

        auth = getAuth(app);

        db = getFirestore(app);

    } catch (error) {

        console.error("No se pudo inicializar Firebase:", error);

    }

}

export { app, auth, db };
