import DiscountCodeOnfit from "@/app/Models/DiscountCodes";
import { db } from "@/app/database";
export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      return createDiscount(req, res);
    case "GET":
      return getCodes(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const createDiscount = async (req, res) => {
  await db.connectDB();
  try {
    const newCode = new DiscountCodeOnfit({ ...req.body });

    await newCode.save();

    return res.status(201).json(newCode);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message || "Revise logs del servidor",
    });
  }
};

const getCodes = async (req, res) => {
  await db.connectDB();
  const { _id } = req.query; // Extrae el _id de la query si existe

  try {
    if (_id) {
      const order = await DiscountCodeOnfit.findById(_id).lean();
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    } else {
      const orders = await DiscountCodeOnfit.find()
        .sort({ createdAt: "desc" })
        .lean();
      return res.status(200).json(orders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  } finally {
  }
};
