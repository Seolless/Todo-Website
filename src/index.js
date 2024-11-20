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
    const removeThis = document.querySelector(".todo-menu-wrapper");
    document
      .getElementById("createTodo")
      .removeEventListener("click", () => this.addTodo());
    removeThis.remove();
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
  renderCreateMenu(e) {
    const projectId = e.target.parentNode.id.replace("project-", "");
    const createMenu = document.createElement("div");
    createMenu.classList.add("todo-menu-wrapper");
    createMenu.innerHTML = `<div class=todo-menu><input type="text" placeholder="Title" id="createTitle"></input><input type="text" placeholder="Description" id="createDescription"></input><input type="date" id="createDate"></input><input type="range" id="createPriority"></input><button id="createTodo">Submit</button></div>`;
    document.getElementById("content").appendChild(createMenu);
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
          editButton.addEventListener("click", (e) => this.editTodo(e));
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
