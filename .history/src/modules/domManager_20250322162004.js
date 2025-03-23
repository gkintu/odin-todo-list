import TodoManager from './todoManager';
import { format, parseISO } from 'date-fns';

// DOM manipulation module
const DomManager = (() => {
  // Cache DOM elements
  const cacheDOM = () => {
    return {
      projectsList: document.getElementById('projects-list'),
      todosList: document.getElementById('todos-list'),
      addProjectForm: document.getElementById('add-project-form'),
      addTodoForm: document.getElementById('add-todo-form'),
      todoDetails: document.getElementById('todo-details'),
      projectTitle: document.getElementById('current-project-title'),
      mainContent: document.getElementById('main-content')
    };
  };
  
  // Initialize the DOM
  const initialize = () => {
    const dom = cacheDOM();
    
    // Load data from localStorage
    if (!TodoManager.loadFromLocalStorage()) {
      // If no data, initialize with default project
      TodoManager.initialize();
    }
    
    // Render projects and todos
    renderProjects();
    renderTodos(TodoManager.getAllProjects()[0].id); // Show default project
    
    // Set up event listeners
    setupEventListeners();
  };
  
  // Set up event listeners
  const setupEventListeners = () => {
    const dom = cacheDOM();
    
    // Project form submission
    dom.addProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectName = document.getElementById('project-name').value;
      const projectDesc = document.getElementById('project-description').value;
      
      if (projectName.trim() !== '') {
        TodoManager.addProject(projectName, projectDesc);
        renderProjects();
        dom.addProjectForm.reset();
      }
    });
    
    // Todo form submission
    dom.addTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const title = document.getElementById('todo-title').value;
      const description = document.getElementById('todo-description').value;
      const dueDate = document.getElementById('todo-due-date').value;
      const priority = document.getElementById('todo-priority').value;
      const notes = document.getElementById('todo-notes').value;
      const projectId = document.getElementById('todo-project').value;
      
      if (title.trim() !== '' && dueDate) {
        TodoManager.addTodo(title, description, dueDate, priority, projectId, notes);
        renderTodos(projectId);
        dom.addTodoForm.reset();
        
        // Hide the form
        document.getElementById('add-todo-container').classList.add('hidden');
      }
    });
    
    // Show add todo form button
    document.getElementById('show-add-todo').addEventListener('click', () => {
      document.getElementById('add-todo-container').classList.toggle('hidden');
      
      // Update project dropdown
      const projectSelect = document.getElementById('todo-project');
      const currentProjectId = dom.projectTitle.dataset.projectId;
      
      // Set the current project as selected
      if (projectSelect && currentProjectId) {
        projectSelect.value = currentProjectId;
      }
    });
    
    // Close todo details
    document.getElementById('close-todo-details').addEventListener('click', () => {
      dom.todoDetails.classList.add('hidden');
    });
  };
  
  // Render projects list
  const renderProjects = () => {
    const dom = cacheDOM();
    const projects = TodoManager.getAllProjects();
    
    dom.projectsList.innerHTML = '';
    
    // Populate projects dropdown in todo form
    const projectSelect = document.getElementById('todo-project');
    projectSelect.innerHTML = '';
    
    projects.forEach(project => {
      // Add to sidebar list
      const projectItem = document.createElement('li');
      projectItem.classList.add('project-item');
      projectItem.dataset.projectId = project.id;
      
      projectItem.innerHTML = `
        <span>${project.name}</span> - <span class="todo-count">(${project.todos.length})</span>
        ${project.id !== projects[0].id ? '<button class="delete-project-btn">×</button>' : ''}
      `;
      
      projectItem.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-project-btn')) {
          // Delete project
          if (confirm('Delete this project and all its todos?')) {
            TodoManager.deleteProject(project.id);
            renderProjects();
            renderTodos(projects[0].id);
          }
        } else {
          // Show project todos
          renderTodos(project.id);
          
          // Highlight selected project
          document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
          });
          projectItem.classList.add('active');
        }
      });
      
      dom.projectsList.appendChild(projectItem);
      
      // Add to dropdown
      const option = document.createElement('option');
      option.value = project.id;
      option.textContent = project.name;
      projectSelect.appendChild(option);
    });
    
    // Highlight default project if none selected
    if (!document.querySelector('.project-item.active') && projects.length > 0) {
      document.querySelector('.project-item').classList.add('active');
    }
  };
  
  // Render todos for a specific project
  const renderTodos = (projectId) => {
    const dom = cacheDOM();
    const project = TodoManager.getProject(projectId);
    
    if (!project) return;
    
    // Update project title
    dom.projectTitle.textContent = project.name;
    dom.projectTitle.dataset.projectId = project.id;
    
    // Clear todos list
    dom.todosList.innerHTML = '';
    
    if (project.todos.length === 0) {
      dom.todosList.innerHTML = '<div class="empty-state">No todos yet. Create one by clicking the "+" button.</div>';
      return;
    }
    
    // Sort todos: incomplete first, then by priority, then by due date
    const sortedTodos = [...project.todos].sort((a, b) => {
      // Completed items at the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Sort by priority (high, medium, low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Sort by due date
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    
    // Create todo items
    sortedTodos.forEach(todo => {
      const todoItem = document.createElement('div');
      todoItem.classList.add('todo-item');
      todoItem.dataset.id = todo.id;
      todoItem.dataset.projectId = todo.projectId;
      
      if (todo.completed) {
        todoItem.classList.add('completed');
      }
      
      // Color based on priority
      todoItem.classList.add(`priority-${todo.priority}`);
      
      // Format the date
      const formattedDate = TodoManager.formatDate(todo.dueDate);
      
      todoItem.innerHTML = `
        <div class="todo-checkbox">
          <input type="checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''}>
          <label for="todo-${todo.id}"></label>
        </div>
        <div class="todo-content">
          <h3 class="todo-title">${todo.title}</h3>
          <p class="todo-date">${formattedDate}</p>
        </div>
        <div class="todo-actions">
          <button class="edit-todo-btn">Edit</button>
          <button class="delete-todo-btn">Delete</button>
        </div>
      `;
      
      // Set up event listeners
      const checkbox = todoItem.querySelector(`#todo-${todo.id}`);
      checkbox.addEventListener('change', () => {
        TodoManager.toggleTodoComplete(todo.id, project.id);
        todoItem.classList.toggle('completed');
      });
      
      const editBtn = todoItem.querySelector('.edit-todo-btn');
      editBtn.addEventListener('click', () => {
        showTodoDetails(todo, project);
      });
      
      const deleteBtn = todoItem.querySelector('.delete-todo-btn');
      deleteBtn.addEventListener('click', () => {
        if (confirm('Delete this todo?')) {
          TodoManager.deleteTodo(todo.id, project.id);
          renderTodos(project.id);
        }
      });
      
      todoItem.addEventListener('click', (e) => {
        // Prevent clicks on buttons or checkbox from triggering this
        if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('label')) {
          showTodoDetails(todo, project);
        }
      });
      
      dom.todosList.appendChild(todoItem);
    });
  };
  
  // Show todo details in edit modal
  const showTodoDetails = (todo, project) => {
    const dom = cacheDOM();
    
    // Populate the details form
    const detailsForm = document.getElementById('edit-todo-form');
    
    detailsForm.querySelector('#edit-title').value = todo.title;
    detailsForm.querySelector('#edit-description').value = todo.description;
    detailsForm.querySelector('#edit-due-date').value = todo.dueDate;
    detailsForm.querySelector('#edit-priority').value = todo.priority;
    detailsForm.querySelector('#edit-notes').value = todo.notes;
    
    // Clear the checklist
    const checklistContainer = document.getElementById('checklist-items');
    checklistContainer.innerHTML = '';
    
    // Add checklist items
    if (todo.checklist && todo.checklist.length > 0) {
      todo.checklist.forEach(item => {
        addChecklistItemToDOM(item, checklistContainer, todo);
      });
    }
    
    // Set up checklist add button
    const addChecklistBtn = document.getElementById('add-checklist-item');
    addChecklistBtn.onclick = () => {
      const input = document.getElementById('new-checklist-item');
      if (input.value.trim() !== '') {
        // Update the model
        todo.addChecklistItem(input.value);
        
        // Get the newly added item (last in the array)
        const newItem = todo.checklist[todo.checklist.length - 1];
        
        // Add to DOM
        addChecklistItemToDOM(newItem, checklistContainer, todo);
        
        // Save changes
        TodoManager.saveToLocalStorage();
        
        // Clear input
        input.value = '';
      }
    };
    
    // Set up form submission
    detailsForm.onsubmit = (e) => {
      e.preventDefault();
      
      // Update todo with form values
      const updates = {
        title: detailsForm.querySelector('#edit-title').value,
        description: detailsForm.querySelector('#edit-description').value,
        dueDate: detailsForm.querySelector('#edit-due-date').value,
        priority: detailsForm.querySelector('#edit-priority').value,
        notes: detailsForm.querySelector('#edit-notes').value
      };
      
      TodoManager.updateTodo(todo.id, project.id, updates);
      renderTodos(project.id);
      
      // Hide details panel
      dom.todoDetails.classList.add('hidden');
    };
    
    // Set up cancel button
    document.getElementById('cancel-edit').onclick = () => {
      dom.todoDetails.classList.add('hidden');
    };
    
    // Show the details panel
    dom.todoDetails.classList.remove('hidden');
  };
  
  // Helper for adding checklist items to the DOM
  const addChecklistItemToDOM = (item, container, todo) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('checklist-item');
    itemElement.dataset.id = item.id;
    
    itemElement.innerHTML = `
      <input type="checkbox" id="check-${item.id}" ${item.checked ? 'checked' : ''}>
      <label for="check-${item.id}">${item.text}</label>
      <button class="delete-checklist-item">×</button>
    `;
    
    // Set up checkbox change
    const checkbox = itemElement.querySelector(`#check-${item.id}`);
    checkbox.addEventListener('change', () => {
      todo.toggleChecklistItem(item.id);
      TodoManager.saveToLocalStorage();
    });
    
    // Set up delete button
    const deleteBtn = itemElement.querySelector('.delete-checklist-item');
    deleteBtn.addEventListener('click', () => {
      todo.removeChecklistItem(item.id);
      itemElement.remove();
      TodoManager.saveToLocalStorage();
    });
    
    container.appendChild(itemElement);
  };
  
  return {
    initialize
  };
})();

export default DomManager;