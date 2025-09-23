import { getBoolLS } from "./utils";

export const getTodos = () => {
  let todos = JSON.parse(localStorage.getItem("todolist") || "[]");
  if (!getBoolLS("todo_show_history")) {
    todos = todos.filter((todo) => !todo.done);
  }
  return todos;
};

const setTODOLS = (arr) => {
  localStorage.setItem("todolist", JSON.stringify(arr));
};

export const addTodo = (str) => {
  const todos = getTodos();
  if (Array.isArray(todos)) {
    todos.unshift({
      name: str,
      done: false,
      time: new Date().getTime(),
    });
    setTODOLS(todos);
  } else {
    const res = prompt(
      "Todo corrupted! Please backup the list and let us know when we can reset the list by typing 'CONFIRM'"
    );
    if (res.toLowerCase() == "confirm") {
      localStorage.removeItem("todolist");
    }
  }
};

export const toggleTodo = (todototoggle) => {
  const todos = getTodos();
  for (let todo of todos) {
    if (todo.time == todototoggle.time) {
      console.log(todo);
      todo.done = !todo.done;
    }
  }
  setTODOLS(todos);
};

export const removeCompletedTodo = () => {
  let todos = getTodos();
  todos = todos.filter((todo) => !todo.done);
  setTODOLS(todos);
};
