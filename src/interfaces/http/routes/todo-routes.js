const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo-controller');
const { validateTodo, validateId } = require('../middleWares/validate');

router.get('/todos', todoController.getTodos);
router.get('/todos/:id', validateId, todoController.getTodoById);
router.post('/todos', validateTodo, todoController.createTodo);
router.put('/todos/:id', validateId, validateTodo, todoController.updateTodo);
router.patch('/todos/:id/status', validateId, validateTodo, todoController.updateTodoStatus);
router.delete('/todos/:id', validateId, todoController.deleteTodo);

module.exports = router;