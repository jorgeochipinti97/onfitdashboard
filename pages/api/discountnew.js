

import DiscountCodeNew from "@/Models/DiscountCodesNew";
import { db } from "@/database";


export default function handler(req, res) {
  switch (req.method) {
    case "POST":
      return createDiscount(req, res);
    case "GET":
      return getCodes(req, res);
    case "PUT":
      return updateCodeUsage(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const createDiscount = async (req, res) => {
  await db.connectDB();
  try {
    const newCode = new DiscountCodeNew({ ...req.body });

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
      const order = await DiscountCodeNew.findById(_id).lean();
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    } else {
      const orders = await DiscountCodeNew.find()
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




const updateCodeUsage = async (req, res) => {
  await db.connectDB();
  const { _id } = req.query; // Extrae el _id de la query si existe

  if (!_id) {
    return res.status(400).json({ message: "Discount code ID is required" });
  }

  try {
    const discountCode = await DiscountCodeNew.findById(_id);

    if (!discountCode) {
      
      return res.status(404).json({ message: "Discount code not found" });
    }


    if (typeof discountCode.usos === 'number' && discountCode.usos > 0) {
      discountCode.usos -= 1; 
      if (discountCode.usos === 0) {
        discountCode.isUsed = true;
      }
    } else if (typeof discountCode.usos !== 'number') {
      discountCode.isUsed = true;
    }

    await discountCode.save(); 

    return res.status(200).json({ message: "Discount code usage updated successfully", code: discountCode });
  } catch (error) {
    console.error(error);
 
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

