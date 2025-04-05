import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    number: { type: Number, required: true },
    business: {
      type: Schema.Types.ObjectId,
      ref: "business",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["pending", "cancelled", "completed"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

// Autopopulate business y user
orderSchema.pre("find", function () {
  this.populate("business").populate("user");
});

orderSchema.pre("findOne", function () {
  this.populate("business").populate("user");
});

export const Order = model("order", orderSchema);
