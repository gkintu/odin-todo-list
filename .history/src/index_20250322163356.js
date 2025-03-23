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

  // Mobile sidebar toggle
  const toggleSidebarBtn = document.createElement('button');
  toggleSidebarBtn.className = 'toggle-sidebar';
  toggleSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>';
  document.body.appendChild(toggleSidebarBtn);
  
  toggleSidebarBtn.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
  });
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768 && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !toggleSidebarBtn.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });

// For debugging in development
if (process.env.NODE_ENV !== 'production') {
  window.TodoManager = TodoManager; // Make TodoManager accessible from console
}