let categoryBox = document.querySelector(".categoryBox");
let categoryBtn = document.querySelector(".addCategory");

let catchCategories = () => {
    fetch("http://127.0.0.1:5000/categories/")
    .then(res => res.json())
    .then(data => {
        data.map(categoria => {
            let taskText = document.createElement("a");
            taskText.classList.add("categoryText"); 
            taskText.setAttribute("href", `tasks.html?category_id=${categoria.category_id}`);
            taskText.setAttribute("data-category-id", categoria.category_id);
            taskText.textContent = categoria.name;
            let dueTaskSpan = document.createElement("span");
            let categoryDescription = `Descripción: ${categoria.description}`;
            dueTaskSpan.textContent = categoryDescription;
            dueTaskSpan.classList.add("dueTaskSpan");
            taskText.appendChild(document.createElement("br"));
            taskText.appendChild(dueTaskSpan);
            categoryBox.appendChild(taskText);
        });

        categoryBtn.addEventListener("click", () => addCategory())



    })
    .catch(err => console.log(err));
};

catchCategories();

let addCategory = () => {
    let categoryName = prompt("Ingrese el nombre de la categoría");
    let categoryDescription = prompt("Ingrese la descripción de la categoría");
    let category = {
        name: categoryName,
        description: categoryDescription
    };
    fetch("http://127.0.0.1:5000/categories/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    })
    .then(res => res.json())
    .then(data => {
        location.reload();
    })
    .catch(err => console.log(err));
}






