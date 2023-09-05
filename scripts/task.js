const urlParams = new URLSearchParams(window.location.search);
const categoryID = urlParams.get("category_id");

let taskBox = document.querySelector(".taskBox");
let subTaskDiv = document.querySelector(".subTask");



let catchTasks = (categoryID) => {
    let url = `http://127.0.0.1:5000/tasks/?category_id=${categoryID}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        data.map(tarea => {
            createTaskContainer(tarea)
        });

        let addTaskBtn = document.querySelector(".addTask");
        addTaskBtn.addEventListener("click", () => {
            addTask(categoryID);
        });
    })
    .catch(err => console.log(err));
};

let createTaskContainer = (tarea) =>{
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
}

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


document.addEventListener("DOMContentLoaded", () => {
    let modal = document.querySelector(".modal-container");
    let closeBtn = document.querySelector(".closeBtn");
    let subTaskBtn = document.querySelector(".addSubTask")

    modal.style.display = "none";
    
    let currentTaskID = null;

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
        currentTaskID = null; 
        subTaskDiv.innerHTML = ''; 
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
    let taskName = document.querySelector(".taskName").value;
    let taskDate = document.querySelector(".taskDate").value;
    console.log(taskName, taskDate)
    fetch("http://127.0.0.1:5000/tasks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: taskName,
            due_date: taskDate,
            category_id: +categoryID
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Tarea creada:", data);
    })
    .catch(error => {
        console.error("Error al crear la tarea:", error);
        alert("El nombre de la tarea y la fecha no puede estar vacío")
    });
}


let catchSubTask = (taskTextElement) => {
    
    let task_id = taskTextElement.dataset.taskId;
    
    let url = `http://127.0.0.1:5000/tasks/${task_id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        let infoTask = `<h3>${data.name}</h3><p>Fecha de creación: ${formatDate(data.creation_date)}</p><p>Fecha límite: ${formatDate(data.due_date)}</p>`;
        let detailBox = document.querySelector(".detailTask").innerHTML = infoTask;

        if (data.task_items.length === 0) {
            subTaskDiv.innerHTML = '';
            return;
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
 

if (categoryID) {
    catchTasks(categoryID);
} else {
    console.log("No se ha proporcionado un ID de categoría.");
}

function formatDate(inputDate) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const date = new Date(inputDate);
    
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}, ${dateNum} de ${month} ${year} ${hours}:${minutes}`;
}