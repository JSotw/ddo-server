import Mongoose, { Types } from "mongoose";

const pedidoSchema = new Mongoose.Schema(
  {
    id_usuario: {
      type: Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    id_pastel: {
      type: Types.ObjectId,
      ref: "Pastel",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Pedido", pedidoSchema);