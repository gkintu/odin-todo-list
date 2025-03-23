import  { saveToLocalStorage, loadFromLocalStorage} from './storage';

const renderProjects = () => {
    const projects = loadFromLocalStorage();
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    projects.forEach((project, index) => {
        const projectItem = document.createElement('li');
        projectItem.textContent = project.name;
        projectItem.addEventListener('click', () => renderTodos(index));
        projectList.appendChild(projectItem);
    });
};

const renderTodos = (projectIndex) => {
    const projects = loadFromLocalStorage();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

        // Update global variable to track current project
        window.currentProjectIndex = projectIndex;

    projects[projectIndex].todos.forEach((todo, index) => {
        const todoItem = document.createElement('li');
        todoItem.textContent = `${todo.title} (Due: ${todo.dueDate})`;
        todoList.appendChild(todoItem);
    });
};

export { renderProjects, renderTodos};