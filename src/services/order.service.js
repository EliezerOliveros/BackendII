import { Order } from '../models/order.model.js';

class OrderService {
  async getAll() {
    return Order.find(); // populate se hace automáticamente por el middleware en el modelo
  }

  async getById(id) {
    return Order.findById(id); // también autopopulado
  }

  async create(orderData) {
    // Calcular totalPrice automáticamente si no se proporciona
    if (!orderData.totalPrice && orderData.products?.length) {
      orderData.totalPrice = orderData.products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
    }

    return Order.create(orderData);
  }

  async update(id, updateData) {
    return Order.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return Order.findByIdAndDelete(id);
  }
}

export const orderService = new OrderService();
