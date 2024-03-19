import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        _id: { type: String },
        title: { type: String },
        size: { type: String },
        quantity: { type: Number },
        slug: { type: String },
        image: { type: String },
        sku: { type: String },
        price: { type: Number },

      },
    ],
    numberOfItems: { type: Number },
    total: { type: Number, required: true },
    transactionId: { type: String },
    discountCode: { type: String },
    titular: { type: String },
    email: { type: String },
    address: { type: String },
    numberOfAddress: { type: String },
    ciudad: { type: String },
    cuotas: { type: String },
    provincia: { type: String },
    localidad:{ type: String },
    phone: { type: String },
    piso: { type: String },
    estado: { type: String, default: "acreditado" },
    dniTitular: { type: String },
    discountPrice: { type: Number, default: 0 },
    tracking: { type: String },
    codGestion: { type: String },
    token: { type: String },
    postalCode: { type: String },

  },
  {
    timestamps: true,
  }
);

const OrderOnfit =
  mongoose.models.OrderOnfit || mongoose.model("OrderOnfit", orderSchema);

export default OrderOnfit;
