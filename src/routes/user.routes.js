import express from 'express';
import passport from 'passport';

import {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  deleteUser
} from '../controllers/users.controller.js';

import { validateDto } from '../middlewares/validate-dto.middleware.js'; 
import { userDto, loginDto } from '../dtos/user.dto.js';

const router = express.Router();

// Registro y login con DTOs
router.post('/register', validateDto(userDto), registerUser);
router.post('/login', validateDto(loginDto), loginUser);

// Usuario actual (JWT requerido)
router.get('/current', passport.authenticate('jwt', { session: false }), getCurrentUser);

// (Opcional) Rutas para admin
router.get('/', passport.authenticate('jwt', { session: false }), getAllUsers);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteUser);

export default router;
