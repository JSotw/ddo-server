import Mongoose from "mongoose";

const ingredienteSchema = new Mongoose.Schema(
  {
    agregado: {
      type: Object,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
    },
    cantidad:{
        type: Number,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Ingrediente", ingredienteSchema);
