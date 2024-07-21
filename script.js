const taskInput = document.getElementById('task-input');
const datetimeInput = document.getElementById('datetime-input');
const addTaskButton = document.getElementById('add-task-button');
const taskList = document.getElementById('task-list');

addTaskButton.addEventListener('click', addTask);

// Load tasks from local storage when the page is loaded
window.addEventListener('load', loadTasks);

function addTask() {
    const taskText = taskInput.value.trim();
    const taskDatetime = datetimeInput.value;

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const task = {
        text: taskText,
        datetime: taskDatetime,
        completed: false
    };

    // Save task to local storage
    saveTask(task);

    // Add task to the list
    renderTask(task);

    taskInput.value = '';
    datetimeInput.value = '';
}

function renderTask(task) {
    const listItem = document.createElement('li');
    const taskContent = document.createElement('span');
    taskContent.textContent = `${task.text} - ${new Date(task.datetime).toLocaleString()}`;

    const taskButtons = document.createElement('div');
    taskButtons.classList.add('task-buttons');

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.addEventListener('click', () => {
        task.completed = !task.completed;
        listItem.classList.toggle('completed');
        updateTask(task);
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        const newTaskText = prompt('Edit task:', task.text);
        const newTaskDatetime = prompt('Edit date and time:', task.datetime);
        if (newTaskText !== null && newTaskDatetime !== null) {
            task.text = newTaskText;
            task.datetime = newTaskDatetime;
            taskContent.textContent = `${task.text} - ${new Date(task.datetime).toLocaleString()}`;
            updateTask(task);
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(listItem);
        deleteTask(task);
    });

    taskButtons.appendChild(completeButton);
    taskButtons.appendChild(editButton);
    taskButtons.appendChild(deleteButton);

    listItem.appendChild(taskContent);
    listItem.appendChild(taskButtons);
    
    if (task.completed) {
        listItem.classList.add('completed');
    }

    taskList.appendChild(listItem);
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(updatedTask) {
    const tasks = getTasks();
    const index = tasks.findIndex(task => task.datetime === updatedTask.datetime && task.text === updatedTask.text);
    if (index !== -1) {
        tasks[index] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function deleteTask(deletedTask) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.datetime !== deletedTask.datetime || task.text !== deletedTask.text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => renderTask(task));
}
