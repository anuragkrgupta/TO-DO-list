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
const addTodoItem = (inputValue) => {
  let listItem = document.createElement("li");
  listItem.innerHTML = `${inputValue}<i></i>`;

  listItem.addEventListener("click", function(){
    this.classList.toggle('done');
  })

  listItem.querySelector('i').addEventListener("click", function(){
    listItem.remove();
    removeTodoItemFromLS(inputValue);
  })

  list.appendChild(listItem);
}

// Function to remove todo item from local storage
const removeTodoItemFromLS = (inputValue) => {
  todoListValue = getTodoListFromLS();
  todoListValue = todoListValue.filter(item => item !== inputValue);
  addTodoListToLS(todoListValue);
}

// Load existing todo items from local storage
todoListValue = getTodoListFromLS();
todoListValue.forEach(item => addTodoItem(item));

// Event listener for input box
inputbx.addEventListener("keyup", function(event){
  if(event.key === "Enter") {
    let inputValue = this.value.trim();

    if(inputValue !== "") {
      todoListValue = getTodoListFromLS();
      todoListValue.push(inputValue);
      addTodoListToLS(todoListValue);
      addTodoItem(inputValue);
      this.value = "";
    }
  }
})