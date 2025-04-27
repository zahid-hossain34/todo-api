const bcrypt = require('bcrypt');
const User = require('../../domain/entities/userEntities');
const UserRepository = require('../../infrastructure/repositories/user-repository');

async function registerUser({ email, password, name }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email: email.toLowerCase(),
    password: hashedPassword,
    name
  });
  return await UserRepository.save(user);
}

module.exports = registerUser;