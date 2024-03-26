import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema([
  {
    code: [
      {
        sede: { type: String },
        name: { type: String },
        usos: { type: Number },
        valor: { type: Number },
        isPercentaje: { type: Boolean },
        isUsed: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  },
]);

const DiscountCodeNew =
  mongoose.models.DiscountCodeNew ||
  mongoose.model("DiscountCodeNewNew", discountCodeSchema);

export default DiscountCodeNew;
