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
    setInterval(() => {
      this.updateTimers();
    }, 1000);
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
  getRemainingTime(expiryDate, expiryTime) {
    let expiryDateTime;
    const now = new Date();
    if (expiryDate && expiryTime) {
      expiryDateTime = new Date(`${expiryDate}T${expiryTime}`);
    } else if (expiryDate) {
      expiryDateTime = new Date(`${expiryDate}`);
    } else if (expiryTime) {
      //I have no clue why i had to add an extra month but whatever.
      const nowDate = `${now.getFullYear()}-${
        now.getMonth() + 1
      }-${now.getDate()}`;
      expiryDateTime = new Date(`${nowDate}T${expiryTime}`);
    } else {
      return "No Date";
    }

    const timeDifference = expiryDateTime - now;
    if (timeDifference <= 0) {
      return "Due";
    }

    const seconds = Math.floor((timeDifference / 1000) % 60);
    const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (days >= 1) {
      return `${days} Days`;
    } else if (hours) {
      return `${hours}h ${minutes}m`;
    } else if (minutes) {
      return `${minutes}m ${seconds}s`;
    }

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  completeTodo(e, index) {
    const projectEl = e.target.parentNode.closest("ul");
    const projectId = projectEl.id.replace("project-", "");
    this.todoList.forEach((project) => {
      if (project.name == projectId) {
        project.todos[index].isCompleted = project.todos[index].isCompleted
          ? false
          : true;
      }
    });
    this.saveTodos();
    this.render();
    this.updateTimers();
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
        this.updateTimers();
        document.getElementById("createAssigned").value = "";
        console.log(`Added ${JSON.stringify(this.todoList)}`);
      } else {
        console.log("Project already exists");
      }
    }
  }
  //TODO:
  addTodo(projectId) {
    let title = document.getElementById("createTitle").value;
    const description = document.getElementById("createDescription").value;
    const projectName = projectId;
    const expiryDate = document.getElementById("createDate").value;
    const expiryTime = document.getElementById("createTime").value;
    const priority = document.getElementById("createPriority").value;
    if (!title) {
      title = "New Todo";
    }
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
        this.updateTimers();
      }
    });

    this.closeMenu();
  }
  removeTodo(e) {
    const projectEl = e.target.parentNode.closest("ul");
    const projectId = projectEl.id.replace("project-", "");
    const index = e.target.id.replace("delete-btn-", "");

    this.todoList.forEach((project) => {
      if (project.name == projectId) {
        project.todos.splice(index, 1);
      }
    });
    this.saveTodos();
    this.render();
    this.updateTimers();
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
        project.todos[index].expiryTime = expiryTime;
        project.todos[index].priority = priority;
      }
    });
    this.closeMenu();
    this.saveTodos();
    this.render();
    this.updateTimers();
  }
  updateTimers() {
    this.todoList.forEach((project) => {
      project.todos.forEach((todo, i) => {
        const timer = document.getElementById(
          `timer-${todo.assignedProject}-${i}`
        );
        let remainingTime;
        if (todo.isCompleted) {
          remainingTime = "Completed!";
        } else {
          remainingTime = this.getRemainingTime(
            todo.expiryDate,
            todo.expiryTime
          );
        }

        timer.innerHTML = remainingTime;
      });
    });
  }
  expandTodo(projectName, i, e) {
    if (
      e.target.classList.contains("edit-btn") ||
      e.target.classList.contains("delete-btn") ||
      e.target.classList.contains("todo-checkbox")
    ) {
      return;
    }
    this.todoList.forEach((project) => {
      if (project.name == projectName) {
        project.todos[i].isExpanded = project.todos[i].isExpanded
          ? false
          : true;
        this.saveTodos();
        this.render();
        this.updateTimers();
      }
    });
  }
  deleteProject(projectName) {
    this.todoList.forEach((project, i) => {
      if (project.name == projectName) {
        this.todoList.splice(i, 1);
        this.saveTodos();
        this.render();
        this.updateTimers();
      }
    });
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
      newProject.innerHTML = `<p class="project-name">${project.name}</p><button class="delete-project">Delete Project</button>`;
      this.el.appendChild(newProject);

      const deleteProjectButton = newProject.querySelector(".delete-project");
      deleteProjectButton.addEventListener("click", () =>
        this.deleteProject(project.name)
      );

      project.todos.forEach((element, i) => {
        const todo = document.createElement("li");
        todo.classList.add("todo");
        todo.id = `todo-${element.assignedProject}-${i}`;
        todo.innerHTML = `<div class="todoWrapper">
        <div class="todoInnerWrapper">
        <div class="todo-checkbox ${
          element.isCompleted ? "checked" : ""
        }"></div><p class="${element.isCompleted ? "completed" : ""}">${
          element.title
        }</p><p class="todo-time" id="timer-${project.name}-${i}"></p>
          <div class="todo-btns">
            <button id="edit-btn-${i}" class="edit-btn">Edit</button>
            <button id="delete-btn-${i}" class="delete-btn">Delete</button>
          </div>
          </div>
          <div class="${element.isExpanded ? "expanded" : ""}"><p class="${
          element.isExpanded ? "description" : "mx-0"
        }">${
          element.description && element.isExpanded ? element.description : ""
        }</p>`;
        document.getElementById(`project-${project.name}`).appendChild(todo);

        todo.addEventListener("click", (e) =>
          this.expandTodo(element.assignedProject, i, e)
        );

        const deleteButton = todo.querySelector(".delete-btn");
        deleteButton.addEventListener("click", (e) => {
          this.removeTodo(e);
        });
        const editButton = todo.querySelector(".edit-btn");
        editButton.addEventListener("click", (e) => this.renderEditMenu(e));
        const todoCheckbox = todo.querySelector(".todo-checkbox");
        todoCheckbox.addEventListener("click", (e) => this.completeTodo(e, i));
      });

      const menuButton = document.createElement("button");
      menuButton.id = "todoMenuBtn";
      menuButton.innerHTML = "Create Todo";
      newProject.appendChild(menuButton);
      menuButton.addEventListener("click", (e) => this.renderCreateMenu(e));
    });
  }
}

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
    this.isExpanded = false;
  }
}
class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }
}
