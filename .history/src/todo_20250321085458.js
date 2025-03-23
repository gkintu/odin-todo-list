const createTodo = (title, dueDate, priority = 'medium', description = '', completed = false) => {
    return {
      title,
      dueDate,
      priority,
      description,
      completed
    };
  };
  
  export default createTodo;