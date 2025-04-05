import Joi from "joi";

export const productDto = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).required(), 
});

export const businessDto = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(10).max(500).required(),
  products: Joi.array().items(productDto).min(1).required(),
});
