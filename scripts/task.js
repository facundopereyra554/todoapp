let taskBox = document.querySelector(".taskBox");
let subTaskDiv = document.querySelector(".subTask");



let obtenerTareas = (categoryID) => {
    let url = `http://127.0.0.1:5000/tasks/?category_id=${categoryID}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        data.map(tarea => {
            let taskText = document.createElement("p");
            taskText.classList.add("taskText");
            taskText.textContent = tarea.name;
            let dueTaskSpan = document.createElement("span");
            let dueTask = `Fecha de Vencimiento: ${tarea.due_date}`;
            dueTaskSpan.textContent = dueTask;
            dueTaskSpan.classList.add("dueTaskSpan");
            taskText.appendChild(document.createElement("br"));
            taskText.appendChild(dueTaskSpan);
            taskBox.appendChild(taskText);
            taskText.setAttribute("data-task-id", tarea.task_id);          

        });

        // Añadir event listener al botón general para añadir tarea
        let addTaskBtn = document.querySelector(".addTask");
        addTaskBtn.addEventListener("click", () => {
            addTask(categoryID);
        });
    })
    .catch(err => console.log(err));
};

function marcarSubTarea(subTareaID, state) {
    const url = `http://127.0.0.1:5000/task_items/${subTareaID}`;
    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: state })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Estado actualizado:", data);
    })
    .catch(error => {
        console.error("Error al marcar la sub-tarea:", error);
    });
}

const urlParams = new URLSearchParams(window.location.search);
const categoryID = urlParams.get("category_id");

if (categoryID) {
    obtenerTareas(categoryID);
} else {
    console.log("No se ha proporcionado un ID de categoría.");
}
document.addEventListener("DOMContentLoaded", () => {
    let modal = document.querySelector(".modal-container");
    let closeBtn = document.querySelector(".closeBtn");
    let subTaskBtn = document.querySelector(".addSubTask")

    modal.style.display = "none";
    
    let currentTaskID = null; // Variable para almacenar el ID de la tarea actual

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("taskText")) {
            modal.style.display = "flex";
            catchSubTask(event.target);
            currentTaskID = event.target.dataset.taskId;
        }   
    });

    subTaskBtn.addEventListener("click", () => {
        if (currentTaskID !== null) {
            addSubTask(currentTaskID);
        } else {
            console.error("No se ha seleccionado una tarea.");
        }
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        currentTaskID = null; // Reiniciar el ID de la tarea actual
        subTaskDiv.innerHTML = ''; // Limpiar el contenido de subTaskDiv
    });
});

let addSubTask = (id) => {
    let subTask = prompt("Ingrese el nombre de la tarea:");
    if (subTask !== null && subTask.trim() !== "") {
        let url = `http://127.0.0.1:5000/task_items/`;
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                item: subTask,
                task_id: id
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Tarea creada:", data);
            location.reload();
        })
        .catch(error => {
            console.error("Error al crear la tarea:", error);
        });
    } else {
        alert("El nombre de la tarea no puede estar vacío.");
    }
}

let addTask = (categoryID) => {
    let taskName = prompt("Ingrese el nombre de la tarea:");
    fetch("http://127.0.0.1:5000/tasks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: taskName,
            due_date: "2024-04-05",
            category_id: +categoryID
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Tarea creada:", data);
    })
    .catch(error => {
        console.error("Error al crear la tarea:", error);
    });
}


let catchSubTask = (taskTextElement) => {
    
    let task_id = taskTextElement.dataset.taskId;

    let url = `http://127.0.0.1:5000/tasks/${task_id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {

        if (data.task_items.length === 0) {
            subTaskDiv.innerHTML = '';
            return; // Salir de la función si no hay elementos
        }

        data.task_items.map(subTarea => {
            let subTaskCheckbox = document.createElement("input");
            subTaskCheckbox.type = "checkbox";
            subTaskCheckbox.classList.add("subTaskCheckbox");
            subTaskCheckbox.dataset.subTareaId = subTarea.ti_id;
            if (subTarea.completed) {
                subTaskCheckbox.checked = true;
            }
            subTaskDiv.appendChild(subTaskCheckbox);

            let subTaskLabel = document.createElement("label");
            subTaskLabel.classList.add("subTaskLabel");
            subTaskLabel.textContent = subTarea.item;
            subTaskDiv.appendChild(subTaskLabel);

            subTaskCheckbox.addEventListener("change", (event) => {
                console.log(event.target.checked);
                const subTareaID = event.target.dataset.subTareaId;
                if (event.target.checked) {
                    marcarSubTarea(subTareaID, true);
                } else {
                    marcarSubTarea(subTareaID, false);
                }
            });

            subTaskDiv.appendChild(document.createElement("br"));
            subTaskDiv.appendChild(document.createElement("br"));
        });
    })
    .catch(err => console.log(err));
};
