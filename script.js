let inputbx = document.querySelector('#inputbx');
let list = document.querySelector('#list');
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
  let listItem = document.createElement("li");
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
    let inputValue = this.value.trim();

    if(inputValue !== "") {
      todoListValue = getTodoListFromLS();
      todoListValue.push({ value: inputValue, done: false });
      addTodoListToLS(todoListValue);
      addTodoItem(inputValue);
      this.value = "";
    }
  }
})
