
let categoryBox = document.querySelector(".categoryBox");

let catchCategories = () => {
    fetch("http://127.0.0.1:5000/categories/")
    .then(res => res.json())
    .then(data => {
        data.map(categoria => {
            let taskText = document.createElement("a");
            taskText.classList.add("categoryText"); 
            taskText.setAttribute("href", "../templates/tasks.html");
            taskText.setAttribute("data-category-id", categoria.category_id);
            taskText.textContent = categoria.name;
            let dueTaskSpan = document.createElement("span");
            let categoryDescription = `Descripción: ${categoria.description}`;
            dueTaskSpan.textContent = categoryDescription;
            dueTaskSpan.classList.add("dueTaskSpan");
            taskText.appendChild(document.createElement("br"));
            taskText.appendChild(dueTaskSpan);
            categoryBox.appendChild(taskText);

            taskText.addEventListener("click", () => {
                let categoryID = taskText.getAttribute("data-category-id");
                obtenerTareas(categoryID);
            });
        });
    })
    .catch(err => console.log(err));
};

let obtenerTareas = (categoryID) => {
    let url = `http://127.0.0.1:5000/tasks/?category_id=${categoryID}`;
    let taskBox = document.querySelector(".taskBox");
    console.log(url);
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
        });
    })
    .catch(err => console.log(err));
};

catchCategories();
