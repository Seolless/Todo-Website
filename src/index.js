import "./styles.css";

class Todos {
  constructor() {
    this.todoList = [];
    this.el = document.getElementById("todoList");
  }
  init() {
    this.loadSave();
    this.render();
    this.assignEvents();
  }
  sortTodos() {
    for (let i = 0; i < this.todoList.length; i++) {
      const element = this.todoList[i];
      for (let i = 0; i < element.todos.length; i++) {
        const todo = element.todos[i];
        todo.id = i;
      }
    }
  }
  assignEvents() {
    document
      .getElementById("createProject")
      .addEventListener("click", () => this.addProject());
  }
  saveTodos() {
    localStorage.setItem("todoList", JSON.stringify(this.todoList));
  }
  loadSave() {
    if (localStorage.getItem("todoList")) {
      this.todoList = JSON.parse(localStorage.getItem("todoList"));
    }
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
    const project = projectId;
    const date = document.getElementById("createDate").value;
    const priority = document.getElementById("createPriority").value;
    const todo = new Todo(title, description, priority, date, project);
    for (let i = 0; i < this.todoList.length; i++) {
      const element = this.todoList[i];
      if (element.name == todo.assignedProject) {
        todo.id = this.todoList[i].todos.length;
        this.todoList[i].todos.push(todo);
        this.saveTodos();
        this.render();
        break;
      }
    }
    this.closeMenu();
  }
  removeTodo(e) {
    const project = e.target.parentNode.closest("ul");
    const projectId = project.id.replace("project-", "");
    const index = e.target.id.replace("delete-btn-", "");
    for (let i = 0; i < this.todoList.length; i++) {
      const element = this.todoList[i];
      if (element.name == projectId) {
        this.todoList[i].todos.splice(index, 1);
      }
    }
    this.sortTodos();
    this.saveTodos();
    this.render();
  }
  editTodo(index, projectId) {
    const title = document.getElementById("createTitle").value;
    const description = document.getElementById("createDescription").value;
    const project = projectId;
    const date = document.getElementById("createDate").value;
    const priority = document.getElementById("createPriority").value;
    for (let i = 0; i < this.todoList.length; i++) {
      const element = this.todoList[i];
      if (element.name == projectId) {
        element.todos[index].title = title;
        element.todos[index].description = description;
        element.todos[index].date = date;
        element.todos[index].priority = priority;
        break;
      }
    }
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
  renderEditMenu(e) {
    const project = e.target.parentNode.closest("ul");
    const projectId = project.id.replace("project-", "");
    const index = e.target.id.replace("edit-btn-", "");
    let todo;
    for (let i = 0; i < this.todoList.length; i++) {
      const element = this.todoList[i];
      if (element.name == projectId) {
        todo = element.todos[index];
      }
    }

    const editMenu = document.createElement("div");
    editMenu.classList.add("todo-menu-wrapper");
    editMenu.innerHTML = `<div class=todo-menu><div id="closeMenu">✖</div><div class="menu-section"><h1 class="menu-text">Title</h1><input type="text" placeholder="Title" class="input-field" id="createTitle"></div><div class="menu-section"><h1 class="menu-text">Description</h1><input type="text" placeholder="Description" class="input-field" id="createDescription"></div><div class="menu-section"><h1 class="menu-text">Date / Time</h1><div class="flex time-wrapper"><input type="date" class="text-center input-field" id="createDate"><input type="time" class="text-center input-field" id="createTime"></div></div><div class="menu-section"><h1 class="menu-text">Priority</h1><input type="range" class="input-field" id="createPriority"></div><div class="menu-section"><button class="input-field" id="editTodo">Edit</button></div></div>`;
    document.getElementById("content").appendChild(editMenu);

    document.getElementById("createTitle").value = todo.title;
    document.getElementById("createDescription").value = todo.description;
    document.getElementById("createDate").value = todo.date;
    document.getElementById("createPriority").value = todo.priority;
    document
      .getElementById("editTodo")
      .addEventListener("click", () => this.editTodo(index, projectId));
  }
  renderCreateMenu(e) {
    const projectId = e.target.parentNode.id.replace("project-", "");
    const createMenu = document.createElement("div");
    createMenu.classList.add("todo-menu-wrapper");
    createMenu.innerHTML = `<div class=todo-menu><div id="closeMenu">✖</div><div class="menu-section"><h1 class="menu-text">Title</h1><input type="text" placeholder="Title" class="input-field" id="createTitle"></div><div class="menu-section"><h1 class="menu-text">Description</h1><input type="text" placeholder="Description" class="input-field" id="createDescription"></div><div class="menu-section"><h1 class="menu-text">Date / Time</h1><div class="flex time-wrapper"><input type="date" class="text-center input-field" id="createDate"><input type="time" class="text-center input-field" id="createTime"></div></div><div class="menu-section"><h1 class="menu-text">Priority</h1><input type="range" class="input-field" id="createPriority"></div><div class="menu-section"><button class="input-field" id="createTodo">Add</button></div></div>`;
    document.getElementById("content").appendChild(createMenu);
    document
      .getElementById("createTodo")
      .addEventListener("click", () => this.addTodo(projectId));
    document
      .getElementById("closeMenu")
      .addEventListener("click", () => this.closeMenu());
  }
  render() {
    if (this.el.childNodes) {
      this.el.replaceChildren();
    }

    if (this.todoList.length == 0) {
      return;
    }
    for (let i = 0; i < this.todoList.length; i++) {
      const project = this.todoList[i];
      const newProject = document.createElement("ul");
      newProject.id = `project-${project.name}`;
      newProject.classList.add("project");
      newProject.innerHTML = `<p class="project-name">${project.name}</p><button id="todoMenuBtn">+</button>`;
      this.el.appendChild(newProject);
      const menuButton = newProject.querySelector("#todoMenuBtn");
      menuButton.addEventListener("click", (e) => this.renderCreateMenu(e));
      if (project.todos) {
        for (let i = 0; i < project.todos.length; i++) {
          const element = project.todos[i];

          const todo = document.createElement("li");
          todo.classList.add("todo");
          todo.innerHTML = `<div class="todoWrapper"><p>${element.title}</p><div class="todo-btns"><button id="edit-btn-${element.id}" class="edit-btn">Edit</button><button id="delete-btn-${element.id}" class="delete-btn">Delete</button></div></div>`;
          document.getElementById(`project-${project.name}`).appendChild(todo);
          const deleteButton = todo.querySelector(".delete-btn");
          deleteButton.addEventListener("click", (e) => {
            this.removeTodo(e);
          });
          const editButton = todo.querySelector(".edit-btn");
          editButton.addEventListener("click", (e) => this.renderEditMenu(e));
        }
      }
    }
  }
}

document
  .getElementById("clear")
  .addEventListener("click", () => localStorage.removeItem("todoList"));

const todoApp = new Todos();
todoApp.init();

class Todo {
  constructor(title, desctiption, priority, expieryDate, assignedProject) {
    this.title = title;
    this.desctiption = desctiption;
    this.priority = priority;
    this.expieryDate = expieryDate;
    this.assignedProject = assignedProject;
    this.id = 0;
    this.isCompleted = false;
  }
}
class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }
}
console.log(document.querySelector("input"));
