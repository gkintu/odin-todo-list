const createTodo = (title, description, dueDate, priority) => {
    return {title, description, dueDate, priority, completed: false};
};

export default createTodo;