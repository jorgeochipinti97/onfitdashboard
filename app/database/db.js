import mongoose from "mongoose";



const mongoConnection = {
  isConnected: 0,
};

export const connectDB = async () => {
  try {
    if (mongoConnection.isConnected) {
      console.log("Ya estabamos conectados");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI_NEW || "");
    mongoConnection.isConnected = 1;
    console.log("Conectado a MongoDB:", process.env.MONGO_URI_NEW);
  } catch (err) {
    console.log(err);
  }
};

export const disconnect = async () => {
  if (process.env.NODE_ENV === "development") return;

  if (mongoConnection.isConnected === 0) return;

  await mongoose.disconnect();
  mongoConnection.isConnected = 0;

  console.log("Desconectado de MongoDB");
};
