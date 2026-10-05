/*======================================================
    TAREAS
    MODELO DE TAREA
======================================================*/

export class Task{

    constructor({

        id = null,

        title = "",

        description = "",

        category = "Otros",

        priority = "Media",

        day = "Lunes",

        completed = false,

        createdAt = null,

        updatedAt = null

    } = {}){

        this.id = id ?? this.generateId();

        this.title = title.trim();

        this.description = description.trim();

        this.category = category;

        this.priority = priority;

        this.day = day;

        this.completed = completed;

        this.createdAt = createdAt ?? new Date().toISOString();

        this.updatedAt = updatedAt ?? new Date().toISOString();

    }

    /*==================================================
        ID
    ==================================================*/

    generateId(){

        return Date.now().toString(36) +

               Math.random().toString(36).substring(2,8);

    }

    /*==================================================
        COMPLETAR
    ==================================================*/

    toggleCompleted(){

        this.completed = !this.completed;

        this.touch();

    }

    /*==================================================
        ACTUALIZAR
    ==================================================*/

    update(data={}){

        if(data.title !== undefined)
            this.title = data.title.trim();

        if(data.description !== undefined)
            this.description = data.description.trim();

        if(data.category !== undefined)
            this.category = data.category;

        if(data.priority !== undefined)
            this.priority = data.priority;

        if(data.day !== undefined)
            this.day = data.day;

        this.touch();

    }

    /*==================================================
        FECHA MODIFICACIÓN
    ==================================================*/

    touch(){

        this.updatedAt = new Date().toISOString();

    }

    /*==================================================
        PRIORIDAD
    ==================================================*/

    isHighPriority(){

        return this.priority === "Alta";

    }

    isMediumPriority(){

        return this.priority === "Media";

    }

    isLowPriority(){

        return this.priority === "Baja";

    }

    /*==================================================
        ESTADO
    ==================================================*/

    isCompleted(){

        return this.completed;

    }

    isPending(){

        return !this.completed;

    }

    /*==================================================
        SERIALIZAR
    ==================================================*/

    toJSON(){

        return {

            id:this.id,

            title:this.title,

            description:this.description,

            category:this.category,

            priority:this.priority,

            day:this.day,

            completed:this.completed,

            createdAt:this.createdAt,

            updatedAt:this.updatedAt

        };

    }

    /*==================================================
        RECONSTRUIR
    ==================================================*/

    static fromJSON(data){

        return new Task(data);

    }

}