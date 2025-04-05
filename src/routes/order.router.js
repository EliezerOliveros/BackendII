import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';

const router = Router();

router.get('/', orderController.getAll);           // Obtener todas las órdenes
router.get('/:id', orderController.getById);       // Obtener una orden por ID
router.post('/', orderController.create);          // Crear nueva orden
router.put('/:id', orderController.update);        // Actualizar una orden
router.delete('/:id', orderController.delete);     // Eliminar una orden

export default router;
