// * DOM Elements
const modal = document.querySelector(".modal");
const openModalBtn = document.querySelector(".open-modal-btn");
const saveBtn = document.querySelector(".save");
const cancelBtn = document.querySelector(".cancel");
const taskList = document.querySelector(".task-list");
const taskText = document.querySelector("#task-text");
const total = document.querySelector("#total");
const complete = document.querySelector("#complete");
const pending = document.querySelector("#pending");
const modalHeading = document.querySelector(".modal h1");
// * Varibal
let currentEditid = null;

// * Listening Events
openModalBtn.addEventListener("click", () => {
  modal.classList.add("show");

  setTimeout(() => {
    taskText.focus();
  }, 50);
});

cancelBtn.addEventListener("click", () => {
  modal.classList.remove("show");

  taskText.value = "";
});

saveBtn.addEventListener("click", handleInput);

taskText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleInput();
  }
});

taskList.addEventListener("click", (e) => {
  const parentTask = e.target.closest(".task");
  const taskId = parentTask.getAttribute("data-id");
  //
  if (e.target.closest(".check")) {
    toggleTask(taskId);
  }
  //
  if (e.target.closest(".delete")) {
    delteTask(taskId);
  }
  //
  if (e.target.closest(".edit")) {
    editTask(taskId);
  }
});
// * Functions
//
function handleInput() {
  const textValue = taskText.value.trim();

  if (textValue === "") {
    //
    Swal.fire({
      iconHtml: `<i class="fas fa-warning warning-icon"></i>`,
      title: "Wait a moment!",
      html: `<p class="warning-text">You forgot to write your task. Go back and write it</p>`,
      confirmButtonColor: "#6c5dd3",
      background: "#2a2a36",
      customClass: {
        icon: "warning-icon",
        title: "warning-title",
      },
    }).then(() => {
      taskText.focus();
    });
    return null;
  }

  if (currentEditid) {
    arrayOfTasks = arrayOfTasks.map((task) => {
      if (task.id === currentEditid) {
        return {
          ...task,
          text: textValue,
        };
      }
      return task;
    });
    Swal.fire({
      title: "Task Added",
      html: `<p class="add-task-text">Changes saved successfully.</p>`,
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
      background: "#2a2a36",
      color: "#fff",
      iconColor: "#2ecc71",
      width: "380px",
      padding: "0.5rem 1rem",
      customClass: {
        title: "add-task-title",
      },
    });
    currentEditid = null;
  } else {
    addTask(textValue);
    Swal.fire({
      title: "Task Added",
      html: `<p class="add-task-text">New task has been successfully added.</p>`,
      icon: "success",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
      background: "#2a2a36",
      color: "#fff",
      iconColor: "#2ecc71",
      width: "380px",
      padding: "0.5rem 1rem",
      customClass: {
        title: "add-task-title",
      },
    });
  }

  saveAndRender();
  clearInput();
}
//
function clearInput() {
  taskText.value = "";
  modal.classList.remove("show");
}
//
let arrayOfTasks = JSON.parse(localStorage.getItem("tasks")) || [];
//
function addTask(textValue) {
  const newTask = {
    id: Date.now().toString(),
    text: textValue,
    complete: false,
    creatAt: new Date(),
  };
  //
  arrayOfTasks.push(newTask);
  //
  saveAndRender();
}
//
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
  renderTasks();
}
//
function renderTasks() {
  taskList.innerHTML = "";

  arrayOfTasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.setAttribute("data-id", task.id);

    const displayDate = new Date(task.creatAt).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (task.complete) {
      taskDiv.className = "task done";
    }

    taskDiv.innerHTML += `
      <div class="task-text">${task.text}</div>
      <div class="task-tools">
        <div class="task-btn delete">
          <i class="fas fa-trash"></i>
        </div>
        <div class="task-btn edit">
          <i class="fas fa-edit"></i>
        </div>
        <div class="task-btn check">
          <i class="${task.complete ? "fas fa-undo" : "fas fa-check"}"></i>
        </div>
      </div>
      <div class="task-details">
        <div class="task-date">
          <i class="fas fa-calendar"></i>
          <span>${displayDate}</span>
        </div>
        <div class="task-toggle">${task.complete ? "Complete" : "Not Complete"}</div>
      </div>
     `;

    taskList.appendChild(taskDiv);
  });

  if (arrayOfTasks.length === 0) {
    taskList.innerHTML = `
        <div class="empty">
          <i class="fas fa-clipboard-list"></i>
          <h2>There are no tasks yet!</h2>
          <p>Start by adding a new task using the field above</p>
        </div>
    `;
  }

  updatStats();
}
//
function updatStats() {
  total.innerHTML = arrayOfTasks.length;
  complete.innerHTML = arrayOfTasks.filter((task) => task.complete).length;
  pending.innerHTML = arrayOfTasks.filter((task) => !task.complete).length;
}
//
function toggleTask(id) {
  arrayOfTasks = arrayOfTasks.map((task) => {
    if (task.id === id) {
      const updatedStatus = !task.complete;

      if (updatedStatus) {
        showToast("Task Complete", "Great job! Task is done.", "#2ecc71");
      } else {
        showToast("Task Restored", "Task moved back to pending", "#f39c12");
      }

      return {
        ...task,
        complete: updatedStatus,
      };
    }

    return task;
  });

  saveAndRender();
}
//
function delteTask(id) {
  Swal.fire({
    title: "Are you sure",
    html: `<p class="delete-warning-text">You want to delete this task?</p>`,
    icon: "warning",
    iconColor: "#e74c3c",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#222",
    cancelButtonText: "No",
    background: "#2a2a36",
    color: "#a0a0ab",
    customClass: {
      title: "delete-warning-title",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      arrayOfTasks = arrayOfTasks.filter((task) => task.id !== id);
      saveAndRender();

      showToast("Deleted", "Your task has been removed", "#e74c3c");
    }
  });
}
//
function editTask(id) {
  const taskToEdit = arrayOfTasks.find((task) => {
    return task.id === id;
  });

  if (taskToEdit) {
    currentEditid = id;
    taskText.value = taskToEdit.text;
    setTimeout(() => {
      taskText.focus();
    }, 50);
    modalHeading.textContent = "Edit Task";
    modal.classList.add("show");
  }
}

// * Help Functions
function showToast(title, text, color) {
  Swal.fire({
    title: title,
    html: `<p class="success-completed-text" >${text}</p>`,
    icon: "success",
    timer: 1000,
    timerProgressBar: true,
    showConfirmButton: false,
    background: "#2a2a36",
    iconColor: color,
    customClass: {
      title: "success-completed-title",
    },
    didOpen: () => {
      Swal.getTitle().style.color = color;
    },
  });
}
// !
renderTasks();
