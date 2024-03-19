import Counter from "@/app/Models/Counter";
import OrderOnfit from "@/app/Models/Order";
import { db } from "@/app/database";

export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);
    case "GET":
      return getOrders(req, res);
    case "PUT":
      return updateOrder(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const createOrder = async (req, res) => {
  await db.connectDB();
  try {
    const newOrder = new OrderOnfit({ ...req.body });
    newOrder.total = Math.round(newOrder.total * 100) / 100;
    console.log(newOrder);
    await newOrder.save();

    return res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message || "Revise logs del servidor",
    });
  }
};

const getOrders = async (req, res) => {
  await db.connectDB();
  const { _id } = req.query; // Extrae el _id de la query si existe

  try {
    if (_id) {
      // Si se proporciona un _id, busca una orden específica
      const order = await OrderOnfit.findById(_id).lean();
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    } else {
      // Si no se proporciona un _id, devuelve todas las órdenes
      const orders = await OrderOnfit.find().sort({ createdAt: "desc" }).lean();
      return res.status(200).json(orders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  } finally {
  }
};

const updateOrder = async (req, res) => {
  await db.connectDB();
  try {
    const { _id } = req.query; // Asume que el ID de la orden viene en la query de la URL
    const orderToUpdate = await OrderOnfit.findById(_id);

    if (!orderToUpdate) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await OrderOnfit.findByIdAndUpdate(_id, {
      ...req.body,
    });

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: error.message || "Server error during order update" });
  }
};


async function getNextSequenceValue(sequenceName) {
  const result = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  if (!result) {
    throw new Error(`No se pudo incrementar el valor de secuencia para ${sequenceName}`);
  }
  return result.sequence_value;
}