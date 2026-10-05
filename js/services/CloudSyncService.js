/*======================================================
    TAREAS
    CLOUD SYNC SERVICE
    Guarda y recupera las tareas de cada usuario en
    Firestore, dentro de la colección "usuarios".
======================================================*/

import {

    doc,

    getDoc,

    setDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./FirebaseService.js";

export class CloudSyncService {

    /*==========================================
        DESCARGAR TAREAS DEL USUARIO
        Devuelve null si el usuario aún no tiene
        datos guardados en la nube.
    ==========================================*/

    static async pull(uid) {

        if (!db || !uid) return null;

        try {

            const ref = doc(db, "usuarios", uid);

            const snap = await getDoc(ref);

            if (!snap.exists()) return null;

            return snap.data().tasks ?? [];

        } catch (error) {

            console.error("No se pudieron descargar las tareas:", error);

            return null;

        }

    }

    /*==========================================
        SUBIR TAREAS DEL USUARIO
    ==========================================*/

    static async push(uid, tasks) {

        if (!db || !uid) return;

        try {

            const ref = doc(db, "usuarios", uid);

            await setDoc(ref, {

                tasks,

                updatedAt: new Date().toISOString()

            }, { merge: true });

        } catch (error) {

            console.error("No se pudieron guardar las tareas en la nube:", error);

        }

    }

}
