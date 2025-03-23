import { saveToLocalStorage, loadFromLocalStorage } from './storage';

const renderProjects = () => {
    const projects = loadFromLocalStorage();
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    projects.forEach((project, index) => {
        const projectItem = document.createElement('li');
        projectItem.textContent = project.name;
        projectItem.dataset.index = index; // Store the index for reference
        projectItem.addEventListener('click', () => {
            // Update currently selected project
            document.querySelectorAll('#project-list li').forEach(item => {
                item.classList.remove('selected');
            });
            projectItem.classList.add('selected');
            renderTodos(index);
        });
        projectList.appendChild(projectItem);
    });
    
    // Select the first project by default if available
    if (projects.length > 0) {
        const firstProject = projectList.querySelector('li');
        if (firstProject) {
            firstProject.classList.add('selected');
        }
    }
};

const renderTodos = (projectIndex) => {
    const projects = loadFromLocalStorage();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    // Update global variable to track current project
    window.currentProjectIndex = projectIndex;

    if (projects[projectIndex]) {
        projects[projectIndex].todos.forEach((todo, index) => {
            const todoItem = document.createElement('li');
            todoItem.innerHTML = `
                <span class="${todo.completed ? 'completed' : ''}">${todo.title}</span>
                <span class="due-date">Due: ${todo.dueDate}</span>
            `;
            
            // Add a checkbox for completion
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => {
                projects[projectIndex].todos[index].completed = checkbox.checked;
                saveToLocalStorage(projects);
                renderTodos(projectIndex);
            });
            
            todoItem.prepend(checkbox);
            todoList.appendChild(todoItem);
        });
    }
};

export { renderProjects, renderTodos };