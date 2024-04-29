import { ObjectId } from "mongodb";
import Mongoose from "mongoose";
import { boolean } from "zod";

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
      required: false,
    }, 
    imagenes: {
      type: Array,
      required: false,
    },
    activo: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Producto", productoSchema);
