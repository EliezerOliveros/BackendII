import { Router } from 'express';
import passport from 'passport';

import { businessController } from '../controllers/business.controller.js';
import { validateDto } from '../middlewares/validate-dto.middleware.js';
import { businessDto } from '../dtos/business.dto.js';
import { authorizeRole } from '../middlewares/authorize-role.middleware.js';

const router = Router();

// Obtener todos los productos 
router.get('/', businessController.getAll);

// Obtener producto por ID
router.get('/:id', businessController.getById);

// Crear un nuevo producto (solo admin)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRole('admin'),
  validateDto(businessDto),
  businessController.create
);

// Actualizar producto existente 
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validateDto(businessDto),
  businessController.update
);

export default router;
