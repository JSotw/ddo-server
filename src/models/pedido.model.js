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
    detalles: {
      type: Object,
      required: true,
    },
    pagos:{
      type: Object,
      required: true,
    },
    monto_total: {
      type: Number,
      required: true,
    } ,
    estado: {
      type: Object,
      required: true,
    } ,
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Pedido", pedidoSchema);
