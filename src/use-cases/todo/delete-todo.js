const TodoRepository = require('../../infrastructure/repositories/todo-repository');

async function deleteTodo(id, userId) {
  const deleted = await TodoRepository.deleteById(id, userId);
  if (!deleted) {
    throw new Error('Todo not found');
  }
  return true;
}

module.exports = deleteTodo;