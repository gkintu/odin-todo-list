const saveToLocalStorage = (projects) => {
    localeStorage.setItem('projects', JSON.stringify(projects));

}

const loadFromLocalStorage = () => {
    const data = localStorage.getItem('projects');
    return data ? JSON.parse(data): [];
};

export { saveToLocalStorage, loadFromLocalStorage};

