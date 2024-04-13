import Mongoose from "mongoose";

const rolSchema = new Mongoose.Schema(
  {
    rol: {
      type: String,
      required: true,
    },
    permisos: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Rol", rolSchema);