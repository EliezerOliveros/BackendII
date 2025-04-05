import userModel from '../models/user.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/config.js';

class UserService {
  async register({ first_name, last_name, email, age, password }) {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const newUser = new userModel({ first_name, last_name, email, age, password });
    return await newUser.save();
  }

  async login({ email, password }) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Contraseña incorrecta');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      CONFIG.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user };
  }

  async getById(id) {
    return userModel.findById(id).select('-password');
  }

  async getAll() {
    return userModel.find().select('-password');
  }

  async delete(id) {
    return userModel.findByIdAndDelete(id);
  }
}

export const userService = new UserService();
