import Mongoose from "mongoose";

const ingredienteSchema = new Mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    cant_maxima:{
        type: Number,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Ingrediente", ingredienteSchema);
