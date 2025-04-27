const { sendResponse } = require('../../utils/apiResponse');
const {
  registerUser,
  loginUser
} = require("../../use-cases/index");

const userController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      const user = await registerUser({ email, password, name });
      sendResponse(res, 201, user, 'User registered successfully');
    } catch (error) {
      sendResponse(res, error.message.includes('Email already registered') ? 409 : 400, null, error.message);
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await loginUser({ email, password });
      sendResponse(res, 200, { user: user, token }, 'Login successful');
    } catch (error) {
      sendResponse(res, 401, null, error.message);
    }
  }
};

module.exports = userController;