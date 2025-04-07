const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { validateTodo, validateId } = require('../middlewares/validate');

router.get('/todos', todoController.getAllTodos);
router.post('/todos', validateTodo, todoController.createTodo);
router.get('/todos/:id', validateId, todoController.getTodoById);
router.put('/todos/:id', validateId, validateTodo, todoController.updateTodo);
router.patch('/todos/:id', validateId, validateTodo, todoController.updateTodoStatus);
router.delete('/todos/:id', validateId, todoController.deleteTodo);

module.exports = router;