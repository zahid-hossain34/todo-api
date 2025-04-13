const TodoRepository = require('../../../infrastructure/repositories/todo-repository');

async function getTodoById(id) {
  const todo = await TodoRepository.findById(id);
  if (!todo) {
    throw new Error('Todo not found');
  }
  return todo;
}

module.exports = getTodoById;