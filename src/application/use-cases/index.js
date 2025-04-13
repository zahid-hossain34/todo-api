const getTodos = require('./todo/get-all-todos');
const getTodoById = require('./todo/get-todo-by-id');
const createTodo = require('./todo/create-todo');
const updateTodo = require('./todo/update-todo');
const updateTodoStatus = require('./todo/update-todo-status');
const deleteTodo = require('./todo/delete-todo');

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo
};