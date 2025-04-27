const TodoRepository = require('../../infrastructure/repositories/todo-repository');

async function updateTodo(id, userId, { title, description, completed }) {
  const todo = await TodoRepository.findById(id, userId);
  if (!todo) {
    throw new Error('Todo not found');
  }
  todo.update({ title, description, completed });
  return await TodoRepository.save(todo);
}

module.exports = updateTodo;