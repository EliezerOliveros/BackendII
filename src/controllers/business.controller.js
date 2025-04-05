import { businessService } from "../services/business.service.js";

class BusinessController {
  async getAll(req, res) {
    try {
      const businesses = await businessService.getAll();
      res.status(200).json({ businesses });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener los productos",
        details: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const business = await businessService.getById({ id });

      if (!business) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.status(200).json({ business });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener el producto",
        details: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const business = await businessService.create({
        business: req.body,
        owner: req.user.id,
      });

      res.status(201).json({ business });
    } catch (error) {
      res.status(500).json({
        error: "Error al crear el producto",
        details: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const updated = await businessService.update({
        id,
        business: req.body,
        userId: req.user.id,
      });

      if (!updated) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.status(200).json({ business: updated });
    } catch (error) {
      const status = error.status || 500;
      res.status(status).json({
        error: "Error al actualizar el producto",
        details: error.message,
      });
    }
  }

  async addProduct(req, res) {
    try {
      const { id } = req.params;
      const product = req.body;

      const updated = await businessService.addProduct(id, product);

      if (!updated) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.status(200).json({ business: updated });
    } catch (error) {
      res.status(500).json({
        error: "Error al agregar producto",
        details: error.message,
      });
    }
  }
}

export const businessController = new BusinessController();
