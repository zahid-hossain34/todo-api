const TodoRepository = require('../../infrastructure/repositories/todo-repository');

async function getTodoById(id, userId) {
  const todo = await TodoRepository.findById(id, userId);
  if (!todo) {
    throw new Error('Todo not found');
  }
  return todo;
}

module.exports = getTodoById;