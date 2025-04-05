import { Business } from "../models/business.model.js";

class BusinessService {
  async getAll() {
    return Business.find();
  }

  async getById({ id }) {
    return Business.findById(id);
  }

  async create({ business, owner }) {
    return Business.create({ ...business, owner });
  }

  async update({ id, business, userId }) {
    const existing = await Business.findById(id);
    if (!existing) return null;

    // Validar si el usuario actual es el dueño
    if (existing.owner?.toString() !== userId) {
      const error = new Error("No tienes permiso para editar este grupo de productos");
      error.status = 403;
      throw error;
    }

    Object.assign(existing, business);
    return existing.save();
  }

  async addProduct(id, product) {
    const business = await Business.findById(id);
    if (!business) return null;

    business.products.push(product);
    return await business.save();
  }
}

export const businessService = new BusinessService();
