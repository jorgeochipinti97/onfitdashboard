import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  titulo: { type: String, required: true, unique: true },
  tags: [{ type: String }],
  images: [{ type: String, required: true }],
  slug: { type: String, unique: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  subcategoria: { type: String},
  productosRelacionados: [{ type: String }],
  tracking: { type: String },
  sku: { type: String },
  talles: [
    {
      nombre: { type: String,  },
      stock: { type: Number, default: 0 },
    },
  ],
});

const ProductOnfit =
  mongoose.models.ProductOnfit || mongoose.model("ProductOnfit", ProductSchema);

export default ProductOnfit;