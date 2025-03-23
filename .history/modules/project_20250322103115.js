// Project factory function
export const Project = (name, description = "") => {
    // Generate a unique ID for each project
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    return {
      id,
      name,
      description,
      todos: [],
      
      // Methods will be added when retrieved from localStorage
      addTodo(todo) {
        this.todos.push(todo);
      },
      
      removeTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
      },
      
      getTodo(todoId) {
        return this.todos.find(todo => todo.id === todoId);
      }
    };
  };