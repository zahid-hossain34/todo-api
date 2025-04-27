const bcrypt = require('bcrypt');
const UserRepository = require('../../infrastructure/repositories/user-repository');
const { signToken } = require('../../utils/jwt');

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await UserRepository.findByEmail(email.toLowerCase());
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = signToken(user._id.toString());
  return { user, token };
}

module.exports = loginUser;