import Joi from "joi";

export const orderDto = Joi.object({
  business: Joi.string().hex().length(24).required(),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
});
