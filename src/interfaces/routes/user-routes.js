const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const { validateUser } = require('../middlewares/validate');

router.post('/register', validateUser, userController.register);
router.post('/login', validateUser, userController.login);

module.exports = router;