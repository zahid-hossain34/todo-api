const TodoRepository = require('../../../infrastructure/repositories/todo-repository');

async function deleteTodo(id) {
  const deleted = await TodoRepository.deleteById(id);
  if (!deleted) {
    throw new Error('Todo not found');
  }
  return true;
}

module.exports = deleteTodo;