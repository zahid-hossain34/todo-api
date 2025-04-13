const { sendResponse } = require("../../../utils/apiResponse");
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
} = require("../../../application/use-cases/index");

const todoController = {
  async getTodos(req, res) {
    try {
      const { completed, sort, order, page, limit } = req.query;
      const {
        todos,
        total,
        page: pageNum,
        limit: limitNum,
      } = await getTodos({
        completed,
        sort,
        order,
        page,
        limit,
      });
      const message =
        todos.length === 0
          ? "No todos found yet"
          : "Todos retrieved successfully";
      sendResponse(
        res,
        200,
        todos.map((t) => t.toJSON()),
        message,
        pageNum,
        limitNum,
        total
      );
    } catch (error) {
      sendResponse(
        res,
        error.message === "Todo not found" ? 404 : 500,
        null,
        error.message
      );
    }
  },

  async getTodoById(req, res) {
    try {
      const todo = await getTodoById(req.validatedId);
      sendResponse(res, 200, todo.toJSON(), "Todo retrieved successfully");
    } catch (error) {
      sendResponse(
        res,
        error.message === "Todo not found" ? 404 : 500,
        null,
        error.message
      );
    }
  },

  async createTodo(req, res) {
    try {
      const { title, description } = req.body;
      const todo = await createTodo({
        title: title.trim(),
        description: description.trim(),
      });
      sendResponse(res, 201, todo.toJSON(), "Todo created successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  },

  async updateTodo(req, res) {
    try {
      const { title, description, completed } = req.body;
      const todo = await updateTodo(req.validatedId, {
        title: title?.trim(),
        description: description?.trim(),
        completed,
      });
      sendResponse(res, 200, todo.toJSON(), "Todo updated successfully");
    } catch (error) {
      sendResponse(
        res,
        error.message === "Todo not found" ? 404 : 500,
        null,
        error.message
      );
    }
  },

  async updateTodoStatus(req, res) {
    try {
      const { completed } = req.body;
      const todo = await updateTodoStatus(req.validatedId, completed);
      sendResponse(res, 200, todo.toJSON(), "Todo status updated successfully");
    } catch (error) {
      sendResponse(
        res,
        error.message === "Todo not found" ? 404 : 500,
        null,
        error.message
      );
    }
  },

  async deleteTodo(req, res) {
    try {
      await deleteTodo(req.validatedId);
      sendResponse(res, 200, null, "Todo deleted successfully");
    } catch (error) {
      sendResponse(
        res,
        error.message === "Todo not found" ? 404 : 500,
        null,
        error.message
      );
    }
  },
};

module.exports = todoController;
