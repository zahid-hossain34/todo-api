const TodoRepository = require('../../../infrastructure/repositories/todo-repository');

async function updateTodo(id, { title, description, completed }) {
  const todo = await TodoRepository.findById(id);
  if (!todo) {
    throw new Error('Todo not found');
  }
  todo.update({ title, description, completed });
  return await TodoRepository.save(todo);
}

module.exports = updateTodo;