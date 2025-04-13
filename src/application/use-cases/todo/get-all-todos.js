const TodoRepository = require('../../../infrastructure/repositories/todo-repository');

async function getAllTodos({ completed, sort, order, page, limit }) {
  return await TodoRepository.findAll({ completed, sort, order, page, limit });
}

module.exports = getAllTodos;