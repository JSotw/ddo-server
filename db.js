import Mongoose from "mongoose";
import "dotenv/config.js";

export const connectDB = async () => {
  try{
    await Mongoose.connect(process.env.MONGO_ATLAS);
    console.log("Conectado a la base de datos");
  }catch(err){
    console.log(err)
  }
};