// Selectors
const inputbx = document.querySelector('#inputbx');
const list = document.querySelector('#list');
const notificationBtn = document.querySelector('#notification-btn');

// Todo list array
let todoListValue = [];

// Function to get todo list from local storage
const getTodoListFromLS = () => {
  return JSON.parse(localStorage.getItem("todoData")) || [];
}

// Function to add todo list to local storage
const addTodoListToLS = (todo) => {
  localStorage.setItem("todoData", JSON.stringify(todo));
}

// Function to add todo item to list
const addTodoItem = (inputValue, done = false) => {
  const listItem = document.createElement("li");
  listItem.innerHTML = `${inputValue}<i></i>`;

  if (done) {
    listItem.classList.add('done');
  }

  listItem.addEventListener("click", function(){
    this.classList.toggle('done');
    updateTodoItemInLS(inputValue, this.classList.contains('done'));
  })

  listItem.querySelector('i').addEventListener("click", function(){
    listItem.remove();
    removeTodoItemFromLS(inputValue);
  })

  list.appendChild(listItem);
}

// Function to update todo item in local storage
const updateTodoItemInLS = (inputValue, done) => {
  todoListValue = getTodoListFromLS();
  todoListValue = todoListValue.map(item => {
    if (item.value === inputValue) {
      item.done = done;
    }
    return item;
  });
  addTodoListToLS(todoListValue);
}

// Function to remove todo item from local storage
const removeTodoItemFromLS = (inputValue) => {
  todoListValue = getTodoListFromLS();
  todoListValue = todoListValue.filter(item => item.value !== inputValue);
  addTodoListToLS(todoListValue);
}

// Load existing todo items from local storage
todoListValue = getTodoListFromLS();
todoListValue.forEach(item => addTodoItem(item.value, item.done));

// Event listener for input box
inputbx.addEventListener("keyup", function(event){
  if(event.key === "Enter") {
    const inputValue = this.value.trim();

    if(inputValue !== "") {
      todoListValue = getTodoListFromLS();
      todoListValue.push({ value: inputValue, done: false });
      addTodoListToLS(todoListValue);
      addTodoItem(inputValue);
      this.value = "";
    }
  }
})

// Notification permission
Notification.requestPermission().then((result) => {
  console.log(result);
});

// Function to ask notification permission
function askNotificationPermission() {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return;
  }
  Notification.requestPermission().then((permission) => {
    // set the button to shown or hidden, depending on what the user answers
    notificationBtn.style.display = permission === "granted" ? "none" : "block";
  });
}

// Function to show notifications for not done tasks
function showNotifications() {
  const notDoneTasks = todoListValue.filter(task => !task.done);
  notDoneTasks.forEach(task => {
    const notification = new Notification("To do list", { body: `Task "${task.value}" is not done yet.` });
    notification.addEventListener("close", function(){
      setTimeout(showNotifications, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
    });
  });
}

// Event listener for visibility change
let lastActiveTime = new Date().getTime();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    const currentTime = new Date().getTime();
    const inactiveTime = currentTime - lastActiveTime;
    if (inactiveTime > 2 * 60 * 60 * 1000) { // 2 hours in milliseconds
      showNotifications();
    }
  } else {
    lastActiveTime = new Date().getTime();
  }
});

// Show notifications when the page loads
showNotifications();
