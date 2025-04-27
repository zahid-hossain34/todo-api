const TodoRepository = require('../../infrastructure/repositories/todo-repository');

async function getAllTodos({ userId, completed, sort, order, page, limit }) {
  return await TodoRepository.findAll({ userId, completed, sort, order, page, limit });
}

module.exports = getAllTodos;