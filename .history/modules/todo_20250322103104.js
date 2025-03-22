// Todo factory function
export const Todo = (title, description, dueDate, priority, notes = "", checklist = [], projectId = "default", completed = false) => {
    // Generate a unique ID for each todo
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    return {
      id,
      title,
      description,
      dueDate,
      priority,
      notes,
      checklist,
      projectId,
      completed,
      
      // Methods will be added when retrieved from localStorage
      toggleComplete() {
        this.completed = !this.completed;
      },
      
      updatePriority(newPriority) {
        this.priority = newPriority;
      },
      
      updateDueDate(newDate) {
        this.dueDate = newDate;
      },
      
      addChecklistItem(item) {
        this.checklist.push({
          text: item,
          checked: false,
          id: Date.now().toString(36)
        });
      },
      
      toggleChecklistItem(itemId) {
        const item = this.checklist.find(item => item.id === itemId);
        if (item) {
          item.checked = !item.checked;
        }
      },
      
      removeChecklistItem(itemId) {
        this.checklist = this.checklist.filter(item => item.id !== itemId);
      }
    };
  };