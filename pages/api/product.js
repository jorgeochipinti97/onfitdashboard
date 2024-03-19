import ProductOnfit from "@/app/Models/Producto";
import { db } from "@/app/database";

import { isValidObjectId } from "mongoose";

// Conexión a la base de datos
db.connectDB();

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return handlePost(req, res);
    case "GET":
      return handleGet(req, res);
    case "PUT":
      return handlePut(req, res);
    case "DELETE":
      return handleDelete(req, res);
    default:
      res.status(405).json({ error: "Método no permitido" });
  }
}

async function handlePost(req, res) {
  try {
    const {
      titulo,
      descripcion,
      precio,
      productosRelacionados,
      images,
      slug,
      talles,
      categoria,
      subcategoria,
      tags,
      personalization,
      tracking,
    } = req.body;

    const nuevoProducto = new ProductOnfit({
      titulo,
      descripcion,
      precio,
      productosRelacionados,
      images,
      slug,
      talles,
      tags,
      categoria,
      subcategoria,
      personalization,
      tracking,
    });
    await nuevoProducto.save();
    console.log(nuevoProducto);
    res.status(201).json({ message: "Producto creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
}

async function handleGet(req, res) {
  try {
    const productos = await ProductOnfit.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
}

async function handlePut(req, res) {
  try {
    const {
      _id,
      titulo,
      descripcion,
      precio,
      precioDescuento,
      productosRelacionados,
      images,
      talles,
      categoria,
      subcategoria,
      tags,
      slug,
      sku,
      tracking,
    } = req.body;
    const fieldsToUpdate = {
      titulo,
      descripcion,
      precio,
      precioDescuento,
      productosRelacionados,
      images,
      talles,
      slug,
      sku,
      categoria,
      subcategoria,
      tags,
      tracking,
    };

    const product = await ProductOnfit.findOneAndUpdate(
      { _id },
      fieldsToUpdate,
      { new: true }
    );
    console.log(product);
    res.status(200).json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
}

async function handleDelete(req, res) {
  try {
    const { _id } = req.body;
    if (!_id || !isValidObjectId(_id)) {
      return res
        .status(400)
        .json({ error: "ID de producto inválido o no proporcionado" });
    }

    const deletedProduct = await ProductOnfit.findByIdAndDelete(_id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    console.log(`Producto eliminado: ${deletedProduct}`);
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
}
