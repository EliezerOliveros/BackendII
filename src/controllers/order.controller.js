import { orderService } from '../services/order.service.js';
import { userService } from '../services/user.service.js';
import { businessService } from '../services/business.service.js';
import { orderDto } from '../dtos/order.dto.js';
import { sendEmail } from '../services/email.service.js';
import { getEmailTemplate } from '../utils/emailTemplates.js';
import { EMAIL_TYPES } from '../constants/email.types.js';

class OrderController {
  async getAll(req, res) {
    try {
      const orders = await orderService.getAll();
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener las órdenes',
        details: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await orderService.getById(id);

      if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener la orden',
        details: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const { error } = orderDto.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Datos inválidos',
          details: error.details.map((e) => e.message),
        });
      }

      const userId = req.user.id;
      const { business: businessId, products: orderedItems } = req.body;

      const user = await userService.getById(userId);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      const business = await businessService.getById({ id: businessId });
      if (!business) return res.status(404).json({ error: 'Catálogo no encontrado' });

      const finalProducts = [];

      for (const item of orderedItems) {
        const product = business.products.find(
          (p) => p._id.toString() === item.productId
        );

        if (!product) {
          return res.status(404).json({
            error: `Producto con ID ${item.productId} no encontrado`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`,
          });
        }

        product.stock -= item.quantity;

        finalProducts.push({
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });
      }

      await business.save();

      const totalPrice = finalProducts.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      );

      const orderNumber = await orderService.getOrderNumber();

      const order = await orderService.create({
        number: orderNumber,
        business: businessId,
        user: userId,
        products: finalProducts,
        totalPrice,
      });

      await sendEmail({
        to: user.email,
        ...getEmailTemplate(EMAIL_TYPES.CREATED_ORDER, {
          first_name: user.first_name,
          orderNumber,
          businessName: business.name,
          products: finalProducts,
          totalPrice,
        }),
      });

      res.status(201).json({ order });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Error al crear la orden',
        details: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedOrder = await orderService.update(id, req.body);

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      res.status(200).json({ order: updatedOrder });
    } catch (error) {
      res.status(500).json({
        error: 'Error al actualizar la orden',
        details: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await orderService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      res.status(200).json({ message: 'Orden eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({
        error: 'Error al eliminar la orden',
        details: error.message,
      });
    }
  }

  async resolve(req, res) {
    try {
      const { id } = req.params;
      const { resolve } = req.body;

      const order = await orderService.getById(id);
      if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'La orden ya fue resuelta' });
      }

      if (!['cancelled', 'completed'].includes(resolve)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      order.status = resolve;
      const updatedOrder = await orderService.update(id, order);

      res.status(200).json({ order: updatedOrder });
    } catch (error) {
      res.status(500).json({
        error: 'Error al resolver la orden',
        details: error.message,
      });
    }
  }
}

export const orderController = new OrderController();
