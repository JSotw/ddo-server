import Mongoose from "mongoose";

const productoSchema = new Mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
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
      type: Object,
      required: true,
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Producto", productoSchema);
