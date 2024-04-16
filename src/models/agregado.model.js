import Mongoose from "mongoose";

const agregadoSchema = new Mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    ingredientes: {
      type: Object,
      required: true,
    },
    minimo_selec: {
      type: Number,
      required: true,
    },
    maximo_select: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Agregado", agregadoSchema);