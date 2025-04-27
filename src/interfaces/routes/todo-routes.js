const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo-controller');
const { validateTodo, validateId } = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');


router.get('/todos', authMiddleware, todoController.getAllTodos);
router.get('/todos/:id', authMiddleware, validateId, todoController.getTodoById);
router.post('/todos', authMiddleware, validateTodo, todoController.createTodo);
router.put('/todos/:id', authMiddleware, validateId, validateTodo, todoController.updateTodo);
router.patch('/todos/:id/status', authMiddleware, validateId, validateTodo, todoController.updateTodoStatus);
router.delete('/todos/:id', authMiddleware, validateId, todoController.deleteTodo);

module.exports = router;