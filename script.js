// NMKRSPVLIDATA
// NMKRSPVLIDATA
// NMKRSPVLIDATA
// NMKRSPVLIDATA
const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");

let filter = '';
let todosJson = [];
const server = "https://todolist-q4hm.onrender.com";

window.onload = fetchTodos;

function fetchTodos() {
  fetch(`${server}/getTask`)
    .then(res => res.json())
    .then(data => {
      todosJson = data.map(todo => ({
        id: todo._id,
        name: todo.title,
        status: todo.status || "pending"
      }));
      showTodos();
    });
}

function getTodoHtml(todo, index) {
  if (filter && filter !== todo.status) return '';

  const checked = todo.status === "completed" ? "checked" : "";
  const listId = `todo-${index}`;

  if (!todo.name) return '';

  return `
    <li class="todo">
      <label for="${listId}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)">
        <i class="fa fa-times"></i>
      </button>
    </li>
  `;
}

function showTodos() {
  if (todosJson.length === 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo) {
  input.value = "";
  if (!todo) return;

  fetch(`${server}/postTask`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: todo, description: "This is a task description", status: "pending" })
  })
    .then(() => fetchTodos())
    .catch(err => console.error("Error adding todo:", err));
}

input.addEventListener("keyup", e => {
  const todo = input.value.trim();
  if (e.key === "Enter" && todo) {
    addTodo(todo);
  }
});

addButton.addEventListener("click", () => {
  const todo = input.value.trim();
  if (todo) {
    addTodo(todo);
  }
});

function updateStatus(checkbox) {
  const index = checkbox.id;
  const todo = todosJson[index];
  const newStatus = checkbox.checked ? "completed" : "pending";
  todo.status = newStatus;

  fetch(`${server}/updateStatus/${todo.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: newStatus })
  })
    .then(() => fetchTodos())
    .catch(err => console.error("Error updating status:", err));
}

function remove(button) {
  const index = button.dataset.index;
  const todoId = todosJson[index].id;

  fetch(`${server}/deleteTask`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: todoId })
  })
    .then(() => {
      todosJson.splice(index, 1);
      showTodos();
    })
    .catch(err => console.error("Error deleting todo:", err));
}

filters.forEach(el => {
  el.addEventListener("click", e => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  fetch(`${server}/deleteAll`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(() => {
      todosJson = [];
      showTodos();
    })
    .catch(err => console.error("Error deleting all todos:", err));
});
