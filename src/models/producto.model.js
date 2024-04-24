import { ObjectId } from "mongodb";
import Mongoose from "mongoose";

const productoSchema = new Mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    codigo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    agregados: {
      type: Array,
      required: false,
    },
    precio_base: {
      type: Number,
      required: true,
    },
    cantidad_disponible: {
      type: Number,
      required: true,
    }, 
    imagenes: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Producto", productoSchema);
