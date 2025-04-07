const TodoService = require('../services/todoService');
const { sendResponse } = require('../utils/apiResponse');

const todoController = {
  async getAllTodos(req, res) {
    try {
      const { completed, sort, order, page, limit } = req.query;
      const { todos, page: pageNum, limit: limitNum, total } = await TodoService.getAllTodos({ 
        completed, 
        sort, 
        order, 
        page, 
        limit 
      });
      const message = todos.length === 0 ? 'No todos found yet' : 'Todos retrieved successfully';
      sendResponse(res, 200, todos, message, pageNum, limitNum, total);
    } catch (error) {
      sendResponse(res, 500, null, `Server error: ${error.message}`);
    }
  },

  async getTodoById(req, res) {
    try {
      const todo = await TodoService.getTodoById(req.validatedId);
      if (!todo) {
        return sendResponse(res, 404, null, `Todo with ID ${req.validatedId} not found`);
      }
      sendResponse(res, 200, todo, 'Todo retrieved successfully');
    } catch (error) {
      sendResponse(res, 500, null, `Server error: ${error.message}`);
    }
  },

  async createTodo(req, res) {
    try {
      const todoData = {
        title: req.body.title.trim(),
        description: req.body.description.trim()
      };
      const newTodo = await TodoService.createTodo(todoData);
      sendResponse(res, 201, newTodo, 'Todo created successfully');
    } catch (error) {
      sendResponse(res, 500, null, `Server error: ${error.message}`);
    }
  },

  async updateTodo(req, res) {
    try {
      const updateData = {};
      if (req.body.title) updateData.title = req.body.title.trim();
      if (req.body.description) updateData.description = req.body.description.trim();
      if (req.body.completed !== undefined) updateData.completed = req.body.completed;

      const updatedTodo = await TodoService.updateTodo(req.validatedId, updateData);
      
      if (!updatedTodo) return sendResponse(res, 404, null, 'Todo not found');
      sendResponse(res, 200, updatedTodo, 'Todo updated successfully');
    } catch (error) {
      sendResponse(res, 500, null, `Server error: ${error.message}`);
    }
  },

  async updateTodoStatus(req, res) {
    try {
      const updatedTodo = await TodoService.updateTodo(req.validatedId, { completed: req.body.completed });
      if (!updatedTodo) return sendResponse(res, 404, null, 'Todo not found');
      sendResponse(res, 200, null, 'Todo status updated successfully');
    } catch (error) {
      sendResponse(res, 500, null, `Server error: ${error.message}`);
    }
  },

  async deleteTodo(req, res) {
    try {
      const deleted = await TodoService.deleteTodo(req.validatedId);
      if (!deleted) return sendResponse(res, 404, null, 'Todo not found');
      sendResponse(res, 200, null, 'Todo deleted successfully');
    } catch (error) {
      sendResponse(res, 500, null, `Server error: ${error.message}`);
    }
  }
};

module.exports = todoController;