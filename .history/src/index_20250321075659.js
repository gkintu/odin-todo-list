console.log('Webpwwwwwwwck loaded successfully!');

import './styles.css';
import createProject from './project';
import createTodo from './todo';
import { saveToLocalStorage, loadFromLocalStorage } from './storage';
import { renderProjects } from './dom';

// Load projects from storage or create a default one
let projects = loadFromLocalStorage();
if (projects.length === 0) {
  projects.push(createProject('Default'));
  saveToLocalStorage(projects);
}

renderProjects();