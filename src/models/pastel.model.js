import Mongoose from "mongoose";

const pastelSchema = new Mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    ingredientes: {
      type: Array,
      required: true,
    },
    precio: {
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

export default Mongoose.model("Pastel", pastelSchema);
