let categoryBox = document.querySelector(".categoryBox");
let categoryBtn = document.querySelector(".addCategory");

const getTaskCount = async (categoryId) => {
    // Fetch tasks for the specific category and return the count
    const res = await fetch(`http://127.0.0.1:5000/tasks/?category_id=${categoryId}`);
    const data = await res.json();
    return data.length;
};

let catchCategories = () => {
    fetch("http://127.0.0.1:5000/categories/")
    .then(res => res.json())
    .then(async data => {
        for (let categoria of data) {
            const taskCount = await getTaskCount(categoria.category_id);
            
            // Create category text element
            let taskText = document.createElement("a");
            taskText.classList.add("categoryText");
            taskText.setAttribute("href", `tasks.html?category_id=${categoria.category_id}`);
            taskText.setAttribute("data-category-id", categoria.category_id);
            taskText.textContent = categoria.name;

            // Create due task span
            let dueTaskSpan = document.createElement("span");
            let categoryDescription = `Descripción: ${categoria.description}`;
            dueTaskSpan.textContent = categoryDescription;
            dueTaskSpan.classList.add("dueTaskSpan");
            
            // Create task count circle
            let taskCountCircle = document.createElement("div");
            taskCountCircle.classList.add("taskCountCircle");
            taskCountCircle.textContent = taskCount;  // Here, taskCount is dynamically fetched
            
            // Append elements
            taskText.appendChild(document.createElement("br"));
            taskText.appendChild(dueTaskSpan);
            taskText.appendChild(taskCountCircle);  // Append the task count circle
            categoryBox.appendChild(taskText);
        }

        categoryBtn.addEventListener("click", () => addCategory());
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