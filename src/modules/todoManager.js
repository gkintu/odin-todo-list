import { Todo } from './todo';
import { Project } from './project';
import { format, parseISO } from 'date-fns';

// Main application logic
const TodoManager = (() => {
  let projects = [];
  
  // Initialize with default project
  const initialize = () => {
    if (projects.length === 0) {
      addProject('Default', 'Default project for all todos');
    }
    return projects;
  };
  
  // Add a new project
  const addProject = (name, description) => {
    const project = Project(name, description);
    projects.push(project);
    saveToLocalStorage();
    return project;
  };
  
  // Delete a project
  const deleteProject = (projectId) => {
    projects = projects.filter(project => project.id !== projectId);
    saveToLocalStorage();
  };
  
  // Get project by ID
  const getProject = (projectId) => {
    return projects.find(project => project.id === projectId);
  };
  
  // Get all projects
  const getAllProjects = () => {
    return projects;
  };
  
  // Add a new todo to a project
  const addTodo = (title, description, dueDate, priority, projectId, notes = "", checklist = []) => {
    const project = getProject(projectId) || projects[0]; // Default to first project if not found
    const todo = Todo(title, description, dueDate, priority, notes, checklist, project.id);
    project.addTodo(todo);
    saveToLocalStorage();
    return todo;
  };
  
  // Delete a todo
  const deleteTodo = (todoId, projectId) => {
    const project = getProject(projectId);
    if (project) {
      project.removeTodo(todoId);
      saveToLocalStorage();
    }
  };
  
  // Update a todo
  const updateTodo = (todoId, projectId, updates) => {
    const project = getProject(projectId);
    if (!project) return null;
    
    const todo = project.getTodo(todoId);
    if (!todo) return null;
    
    // Apply all updates to the todo
    Object.keys(updates).forEach(key => {
      todo[key] = updates[key];
    });
    
    saveToLocalStorage();
    return todo;
  };
  
  // Toggle todo completion status
  const toggleTodoComplete = (todoId, projectId) => {
    const project = getProject(projectId);
    if (!project) return;
    
    const todo = project.getTodo(todoId);
    if (todo) {
      todo.toggleComplete();
      saveToLocalStorage();
    }
  };
  
  // Get all todos from all projects
  const getAllTodos = () => {
    return projects.flatMap(project => 
      project.todos.map(todo => ({...todo, projectName: project.name}))
    );
  };
  
  // Save to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('todoApp_projects', JSON.stringify(projects));
  };
  
  // Load from localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedProjects = JSON.parse(localStorage.getItem('todoApp_projects'));
      
      if (savedProjects && Array.isArray(savedProjects)) {
        // Restore methods to projects and todos
        projects = savedProjects.map(project => {
          const restoredProject = Project(project.name, project.description);
          restoredProject.id = project.id;
          
          // Restore todos with their methods
          if (project.todos && Array.isArray(project.todos)) {
            project.todos.forEach(todo => {
              const restoredTodo = Todo(
                todo.title,
                todo.description,
                todo.dueDate,
                todo.priority,
                todo.notes,
                todo.checklist || [],
                todo.projectId,
                todo.completed
              );
              restoredTodo.id = todo.id;
              restoredProject.addTodo(restoredTodo);
            });
          }
          
          return restoredProject;
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    
    return false;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  return {
    initialize,
    addProject,
    deleteProject,
    getProject,
    getAllProjects,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodoComplete,
    getAllTodos,
    saveToLocalStorage,
    loadFromLocalStorage,
    formatDate
  };
})();

export default TodoManager;