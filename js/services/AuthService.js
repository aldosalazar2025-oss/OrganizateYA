/*======================================================
    TAREAS
    AUTH SERVICE
======================================================*/

import {

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    onAuthStateChanged,

    signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./FirebaseService.js";

export class AuthService {

    /*==========================================
        REGISTRARSE
    ==========================================*/

    static register(email, password) {

        return createUserWithEmailAndPassword(auth, email, password);

    }

    /*==========================================
        INICIAR SESIÓN
    ==========================================*/

    static login(email, password) {

        return signInWithEmailAndPassword(auth, email, password);

    }

    /*==========================================
        CERRAR SESIÓN
    ==========================================*/

    static logout() {

        return signOut(auth);

    }

    /*==========================================
        OBSERVAR ESTADO DE SESIÓN
    ==========================================*/

    static onChange(callback) {

        return onAuthStateChanged(auth, callback);

    }

    /*==========================================
        USUARIO ACTUAL
    ==========================================*/

    static currentUser() {

        return auth?.currentUser ?? null;

    }

    /*==========================================
        MENSAJES DE ERROR EN ESPAÑOL
    ==========================================*/

    static friendlyError(code = "") {

        const messages = {

            "auth/email-already-in-use": "Ese correo ya está registrado.",

            "auth/invalid-email": "El correo no es válido.",

            "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",

            "auth/missing-password": "Escribe una contraseña.",

            "auth/user-not-found": "No existe una cuenta con ese correo.",

            "auth/wrong-password": "Contraseña incorrecta.",

            "auth/invalid-credential": "Correo o contraseña incorrectos.",

            "auth/too-many-requests": "Demasiados intentos. Intenta más tarde."

        };

        return messages[code] || "Ha ocurrido un error. Inténtalo de nuevo.";

    }

}
