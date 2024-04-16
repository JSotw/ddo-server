import Mongoose, { Types } from "mongoose";

const pedidoSchema = new Mongoose.Schema(
  {
    id_usuario: {
      type: Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    nombre_retiro: {
      type: String,
      required: true,
    },
    pedido: {
      type: Object,
      required: true,
    },
    precio_total: {
      type: Number,
      required: true,
    } 
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Pedido", pedidoSchema);