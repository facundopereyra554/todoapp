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

            

            tarea.task_items.map((subTarea, index) => {
            
                let subTaskCheckbox = document.createElement("input");
                subTaskCheckbox.type = "checkbox";
                subTaskCheckbox.classList.add("subTaskCheckbox");
                subTaskCheckbox.id = `subTaskCheckbox-${index}`;
                subTaskCheckbox.dataset.subTareaId = subTarea.ti_id;
                subTaskDiv.appendChild(subTaskCheckbox);
            
                let subTaskLabel = document.createElement("label");
                subTaskLabel.classList.add("subTaskLabel");
                subTaskLabel.textContent = subTarea.item;
                subTaskLabel.setAttribute("for", `subTaskCheckbox-${index}`);
                subTaskDiv.appendChild(subTaskLabel);
            
                subTaskCheckbox.addEventListener("change", (event) => {
                    const subTareaID = event.target.dataset.subTareaId;
                    if (event.target.checked) {
                        marcarSubTarea(subTareaID,state=true);
                    }else{
                        marcarSubTarea(subTareaID,state=false);
                    }
                });
            
                subTaskDiv.appendChild(document.createElement("br"));
                subTaskDiv.appendChild(document.createElement("br"));
            });


            let addSubTaskBtn = document.querySelector(".addSubTask");
            


            addSubTaskBtn.addEventListener("click", () => {
                addSubTask(tarea.task_id)
            });

            let addTaskBtn = document.querySelector(".addTask")
        
            addTaskBtn.addEventListener("click", ()=>{
                addTask(categoryID)
            })


        });


    })
    .catch(err => console.log(err));
};





function marcarSubTarea(subTareaID,state) {
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
    let taskBox = document.querySelector(".taskBox");
    let modal = document.querySelector(".modal-container");
    let closeBtn = document.querySelector(".closeBtn");
    modal.style.display = "none";

    taskBox.addEventListener("click", (event) => {
        if (event.target.classList.contains("taskText")) {
            modal.style.display = "flex";
        }
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
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
    // let taskDueDate = prompt("Ingrese la fecha de vencimiento de la tarea (dd/mm/aaaa):");

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







