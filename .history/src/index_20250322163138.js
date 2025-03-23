import './styles.css';
import TodoManager from './modules/todoManager';
import DomManager from './modules/domManager';

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the DOM manager which will handle all UI interactions
  DomManager.initialize();
  
  // Set up additional event listeners that weren't set in DomManager
  
  // Toggle project form
  const showAddProjectBtn = document.getElementById('show-add-project');
  const addProjectContainer = document.getElementById('add-project-container');
  const cancelAddProjectBtn = document.getElementById('cancel-add-project');
  
  showAddProjectBtn.addEventListener('click', () => {
    addProjectContainer.classList.toggle('hidden');
  });
  
  cancelAddProjectBtn.addEventListener('click', () => {
    addProjectContainer.classList.add('hidden');
    document.getElementById('add-project-form').reset();
  });
  
  // Toggle todo form
  const cancelAddTodoBtn = document.getElementById('cancel-add-todo');
  
  cancelAddTodoBtn.addEventListener('click', () => {
    document.getElementById('add-todo-container').classList.add('hidden');
    document.getElementById('add-todo-form').reset();
  });
});

// For debugging in development
if (process.env.NODE_ENV !== 'production') {
  window.TodoManager = TodoManager; // Make TodoManager accessible from console
}