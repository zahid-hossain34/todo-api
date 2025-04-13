const Todo = require('../../../domain/entities/todo');
const TodoRepository = require('../../../infrastructure/repositories/todo-repository');

async function createTodo({ title, description }) {
  const todo = new Todo({ title, description });
  return await TodoRepository.save(todo);
}

module.exports = createTodo;