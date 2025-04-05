import { userService } from '../services/user.service.js';
import { sendEmail } from '../services/email.service.js';
import { getEmailTemplate } from '../utils/emailTemplates.js';
import { EMAIL_TYPES } from '../constants/email.types.js';

export const registerUser = async (req, res) => {
  try {
    const user = await userService.register(req.body);

    // 📩 Enviar correo de bienvenida
    await sendEmail({
      to: user.email,
      ...getEmailTemplate(EMAIL_TYPES.WELCOME, {
        first_name: user.first_name,
      }),
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    res.status(400).json({
      error: 'Error al registrar usuario',
      details: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.login({ email, password });

    res.status(200).json({ token, user, message: 'Login exitoso' });
  } catch (error) {
    res.status(400).json({
      error: 'Error al iniciar sesión',
      details: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener los datos del usuario',
      details: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener los usuarios',
      details: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userService.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar el usuario',
      details: error.message,
    });
  }
};
