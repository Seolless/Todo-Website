import "./styles.css";

class Todos {
  constructor() {
    this.todoList = [];
    this.el = document.getElementById("todoList");
    this.currentDate = Date.now();
  }
  init() {
    this.loadSave();
    this.render();
    this.assignEvents();
  }
  assignEvents() {
    if (document.getElementById("createProject")) {
      document
        .getElementById("createProject")
        .addEventListener("click", () => this.addProject());
    }
  }
  saveTodos() {
    localStorage.setItem("todoList", JSON.stringify(this.todoList));
  }
  loadSave() {
    if (localStorage.getItem("todoList")) {
      this.todoList = JSON.parse(localStorage.getItem("todoList"));
    }
  }
  completeTodo(e, index) {
    const project = e.target.parentNode.closest("ul");
    const projectId = project.id.replace("project-", "");
    for (let i = 0; i < this.todoList.length; i++) {
      const element = this.todoList[i];
      if (element.name == projectId) {
        this.todoList[i].todos[index].isCompleted = this.todoList[i].todos[
          index
        ].isCompleted
          ? false
          : true;
      }
    }
    console.log(JSON.stringify(this.todoList));
    this.saveTodos();
    this.render();
  }
  addProject() {
    const projectName = document.getElementById("createAssigned").value;
    let match = false;
    if (projectName) {
      for (let i = 0; i < this.todoList.length; i++) {
        const element = this.todoList[i];
        if (element.name == projectName) {
          match = true;
          break;
        }
      }
      if (!match) {
        const project = new Project(projectName);
        this.todoList.push(project);
        this.saveTodos();
        this.render();
        console.log(`Added ${JSON.stringify(this.todoList)}`);
      } else {
        console.log("Project already exists");
      }
    }
  }
  //TODO:
  addTodo(projectId) {
    const title = document.getElementById("createTitle").value;
    const description = document.getElementById("createDescription").value;
    const projectName = projectId;
    const expiryDate = document.getElementById("createDate").value;
    const expiryTime = document.getElementById("createTime").value;
    const priority = document.getElementById("createPriority").value;
    const todo = new Todo(
      title,
      description,
      priority,
      expiryDate,
      expiryTime,
      projectName
    );
    this.todoList.forEach((project) => {
      if (project.name == todo.assignedProject) {
        project.todos.push(todo);
        this.saveTodos();
        this.render();
      }
    });
    this.closeMenu();
  }
  removeTodo(e) {
    const projectEl = e.target.parentNode.closest("ul");
    const projectId = project.id.replace("project-", "");
    const index = e.target.id.replace("delete-btn-", "");

    this.todoList.forEach((project) => {
      if (project.name == projectId) {
        project.todos.splice(index, 1);
      }
    });
    this.saveTodos();
    this.render();
  }
  editTodo(index, projectName) {
    const title = document.getElementById("createTitle").value;
    const description = document.getElementById("createDescription").value;
    const expiryDate = document.getElementById("createDate").value;
    const expiryTime = document.getElementById("createTime").value;
    const priority = document.getElementById("createPriority").value;

    this.todoList.forEach((project) => {
      if (project.name == projectName) {
        project.todos[index].title = title;
        project.todos[index].description = description;
        project.todos[index].expiryDate = expiryDate;
        project.todos[index].time = expiryTime;
        project.todos[index].priority = priority;
      }
    });
    this.closeMenu();
    this.saveTodos();
    this.render();
  }
  closeMenu() {
    if (document.getElementById("editTodo")) {
      document
        .getElementById("editTodo")
        .removeEventListener("click", () => this.editTodo());
    } else if (document.getElementById("createTodo")) {
      document
        .getElementById("createTodo")
        .removeEventListener("click", () => this.addTodo());
    }

    const removeMenu = document.querySelector(".todo-menu-wrapper");
    removeMenu.remove();
  }
  renderMenu(type, todo = null) {
    const menu = document.createElement("div");
    menu.classList.add("todo-menu-wrapper");
    menu.innerHTML = `
    <div class=todo-menu>
      <div id="closeMenu">✖</div>
        <div class="menu-section">
          <h1 class="menu-text">Title</h1>
          <input type="text" placeholder="Title" class="input-field" id="createTitle" value="${
            todo ? todo.title : ""
          }">
        </div>
        <div class="menu-section">
          <h1 class="menu-text">Description</h1>
          <textarea placeholder="Description" class="input-field" id="createDescription" value="${
            todo ? todo.description : ""
          }"></textarea>
        </div>
        <div class="menu-section">
          <h1 class="menu-text">Date / Time</h1>
          <div class="flex time-wrapper">
            <input type="date" class="text-center input-field" id="createDate" value="${
              todo ? todo.expiryDate : ""
            }">
            <input type="time" class="text-center input-field" id="createTime" value="${
              todo ? todo.expiryTime : ""
            }">
          </div>
        </div>
        <div class="menu-section">
          <h1 class="menu-text">Priority</h1>
          <input type="range" class="input-field" id="createPriority" value="${
            todo ? todo.priority : ""
          }">
        </div>
        <div class="menu-section">
          <button class="input-field" id="${type}Todo">${
      type === "edit" ? "Edit" : "Add"
    }</button>
        </div>
    </div>`;
    document.getElementById("content").appendChild(menu);
    document
      .getElementById("closeMenu")
      .addEventListener("click", () => this.closeMenu());
  }
  renderEditMenu(e) {
    const project = e.target.parentNode.closest("ul");
    const projectId = project.id.replace("project-", "");
    const index = e.target.id.replace("edit-btn-", "");
    let todo;
    this.todoList.forEach((project) => {
      if (project.name == projectId) {
        todo = project.todos[index];
      }
    });
    this.renderMenu("edit", todo);

    document
      .getElementById("editTodo")
      .addEventListener("click", () => this.editTodo(index, projectId));
  }
  renderCreateMenu(e) {
    const projectId = e.target.parentNode.id.replace("project-", "");
    this.renderMenu("create");

    document
      .getElementById("createTodo")
      .addEventListener("click", () => this.addTodo(projectId));
  }
  render() {
    if (this.el.childNodes) {
      this.el.replaceChildren();
    }

    if (this.todoList.length == 0) {
      return;
    }
    this.todoList.forEach((project) => {
      const newProject = document.createElement("ul");
      newProject.id = `project-${project.name}`;
      newProject.classList.add("project");
      newProject.innerHTML = `<p class="project-name">${project.name}</p><button id="todoMenuBtn">+</button>`;
      this.el.appendChild(newProject);
      const menuButton = newProject.querySelector("#todoMenuBtn");
      menuButton.addEventListener("click", (e) => this.renderCreateMenu(e));

      project.todos.forEach((element, i) => {
        const todo = document.createElement("li");
        todo.classList.add("todo");
        todo.innerHTML = `<div class="todoWrapper"><div class="todo-checkbox ${
          element.isCompleted ? "checked" : ""
        }"></div><p>${
          element.title
        }</p><div class="todo-btns"><button id="edit-btn-${i}" class="edit-btn">Edit</button><button id="delete-btn-${i}" class="delete-btn">Delete</button></div></div>`;
        document.getElementById(`project-${project.name}`).appendChild(todo);
        const deleteButton = todo.querySelector(".delete-btn");
        deleteButton.addEventListener("click", (e) => {
          this.removeTodo(e);
        });
        const editButton = todo.querySelector(".edit-btn");
        editButton.addEventListener("click", (e) => this.renderEditMenu(e));
        const todoCheckbox = todo.querySelector(".todo-checkbox");
        todoCheckbox.addEventListener("click", (e) => this.completeTodo(e, i));
      });
    });
  }
}

document
  .getElementById("clear")
  .addEventListener("click", () => localStorage.removeItem("todoList"));
const todoApp = new Todos();
todoApp.init();

class Todo {
  constructor(
    title,
    description,
    priority,
    expiryDate,
    expiryTime,
    assignedProject
  ) {
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.expiryDate = expiryDate;
    this.expiryTime = expiryTime;
    this.assignedProject = assignedProject;
    this.isCompleted = false;
  }
}
class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }
}
