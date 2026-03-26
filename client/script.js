let tasks = []

function addTask() {
    const taskText = document.getElementById("todoTask").value

    tasks.push({
        text: taskText,
        completed: false
    })

    document.getElementById("taskList").innerHTML += `<li>${taskText}</li>`
}


// --------------------
// Lag notat
// --------------------
function createNote() {
    const title = document.getElementById("noteTitle").value
    const content = document.getElementById("noteContent").value

    fetch("http://127.0.0.1:5000/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    })
}


// --------------------
// Lag todo
// --------------------
function createTodo() {
    const title = document.getElementById("todoTitle").value

    fetch("http://127.0.0.1:5000/api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, tasks })
    })
}


// --------------------
// Hent data
// --------------------
function loadData() {
    fetch("http://127.0.0.1:5000/api/data")
        .then(res => res.json())
        .then(data => {
            document.getElementById("output").textContent =
                JSON.stringify(data, null, 2)
        })
}