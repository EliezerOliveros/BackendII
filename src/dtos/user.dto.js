import Joi from "joi";

export const userDto = Joi.object({
  first_name: Joi.string().trim().min(2).max(50).required(),
  last_name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().trim().required(),
  age: Joi.number().min(0).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

export const loginDto = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).required(),
});
