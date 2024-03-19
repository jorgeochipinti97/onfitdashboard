import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema(
  {
    sede: { type: String },
    name: { type: String },
    usos: { type: Number },
    valor: { type: Number },
    isPercentaje: { type: Boolean },
    isUsed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const DiscountCodeOnfit =
  mongoose.models.DiscountCodeOnfit ||
  mongoose.model("DiscountCodeOnfit", discountCodeSchema);

export default DiscountCodeOnfit;
