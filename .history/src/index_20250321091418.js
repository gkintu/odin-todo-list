import './styles.css';
import createProject from './project';
import createTodo from './todo';
import { saveToLocalStorage, loadFromLocalStorage } from './storage';
import { renderProjects, renderTodos } from './dom';

// Load projects from storage or create a default one
let projects = loadFromLocalStorage();
if (projects.length === 0) {
  projects.push(createProject('Default'));
  saveToLocalStorage(projects);
}

// Track the currently selected project
let currentProjectIndex = 0;

// Initial render
renderProjects();
renderTodos(currentProjectIndex);  // Use the correct variable

// Set up event listeners
document.getElementById('add-project-btn').addEventListener('click', () => {
  const projectName = document.getElementById('new-project-input').value;
  if (projectName.trim()) {
    projects.push(createProject(projectName));
    saveToLocalStorage(projects);
    renderProjects();
    document.getElementById('new-project-input').value = '';
  }
});

// Set up event listener for adding todos
document.getElementById('add-todo-btn').addEventListener('click', () => {
  const todoTitle = document.getElementById('new-todo-title').value;
  const todoDueDate = document.getElementById('new-todo-date').value;
  
  if (todoTitle.trim() && todoDueDate) {
    projects[currentProjectIndex].todos.push(createTodo(todoTitle, todoDueDate));
    saveToLocalStorage(projects);
    renderTodos(currentProjectIndex);
    document.getElementById('new-todo-title').value = '';
    document.getElementById('new-todo-date').value = '';
  }
});
