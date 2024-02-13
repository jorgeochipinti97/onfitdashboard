import { db } from ".";
import OrderRoyer from "@/Models/OrderRoyer";

export const getAllOrdersRoyers = async (id) => {
  await db.connectDB();
  const order = await OrderRoyer.find().lean();
  if (!order) {
    return null;
  }

  return JSON.parse(JSON.stringify(order));
};

export const getOrderRoyerById = async (id) => {
  try {
    await db.connectDB();
    const order = await OrderRoyer.findOne({ id }).lean();

    if (!order) {
      return null;
    }

    return JSON.parse(JSON.stringify(order));
  } catch (err) {
    console.log(err);
    return null;
  }
};
