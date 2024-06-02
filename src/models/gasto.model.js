import Mongoose from "mongoose";

const gastoSchema = new Mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    costo: {
      type: Number,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Gasto", gastoSchema);