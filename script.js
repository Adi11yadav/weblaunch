let tasks = JSON.parse(localStorage.getItem("taskForgeTasks")) || [];
let currentFilter = "all";
let sortByDue = false;

const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const sortBtn = document.getElementById("sortBtn");

addTaskBtn.addEventListener("click", addTask);
filterBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  })
);
sortBtn.addEventListener("click", () => {
  sortByDue = !sortByDue;
  renderTasks();
});

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (!text) return alert("Please enter a task.");

  const task = {
    id: Date.now(),
    text,
    completed: false,
    dueDate,
    priority,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "Low";
}

function renderTasks() {
  let filtered = [...tasks];

  if (currentFilter === "completed") {
    filtered = filtered.filter(t => t.completed);
  } else if (currentFilter === "pending") {
    filtered = filtered.filter(t => !t.completed);
  }

  if (sortByDue) {
    filtered.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
  }

  taskList.innerHTML = "";
  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    const content = document.createElement("div");
    content.innerHTML = `
      <strong>${task.text}</strong><br/>
      <span class="task-meta">
        Due: ${task.dueDate || "No date"} |
        Priority: <span class="priority-${task.priority}">${task.priority}</span>
      </span>
    `;

    const btns = document.createElement("div");
    btns.className = "task-buttons";

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = "✓";
    completeBtn.onclick = () => toggleComplete(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.onclick = () => deleteTask(task.id);

    btns.appendChild(completeBtn);
    btns.appendChild(deleteBtn);

    li.appendChild(content);
    li.appendChild(btns);

    taskList.appendChild(li);
  });
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("taskForgeTasks", JSON.stringify(tasks));
}

renderTasks();
