import Mongoose, { Types } from "mongoose";

const detalle_pedidoSchema = new Mongoose.Schema(
  {
    producto: {
      type: Object,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    } ,
    cantidad: {
      type: Number,
      required: true,
    },
    monto_total: {
      type: Number,
      required: true,
    } 
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("DetallePedido", detalle_pedidoSchema);