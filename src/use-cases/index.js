const getAllTodos = require('./todo/get-all-todos');
const getTodoById = require('./todo/get-todo-by-id');
const createTodo = require('./todo/create-todo');
const updateTodo = require('./todo/update-todo');
const updateTodoStatus = require('./todo/update-todo-status');
const deleteTodo = require('./todo/delete-todo');
const loginUser = require('./auth/login-user');
const registerUser = require('./auth/register-user');

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
  loginUser,
  registerUser
};