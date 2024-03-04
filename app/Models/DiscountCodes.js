import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema(
  {
    sede: { type: String },
    name: { type: String },

    valor: { type: Number },
    isPercentaje: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const DiscountCodeOnfit =
  mongoose.models.DiscountCodeOnfit ||
  mongoose.model("DiscountCodeOnfit", discountCodeSchema);

export default DiscountCodeOnfit;
