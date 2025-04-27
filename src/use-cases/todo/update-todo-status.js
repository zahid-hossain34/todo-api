const TodoRepository = require('../../infrastructure/repositories/todo-repository');

async function updateTodoStatus(id, userId, completed) {
  const todo = await TodoRepository.findById(id, userId);
  if (!todo) {
    throw new Error('Todo not found');
  }
  if (completed) {
    todo.markAsCompleted();
  } else {
    todo.update({ completed });
  }
  return await TodoRepository.save(todo);
}

module.exports = updateTodoStatus;