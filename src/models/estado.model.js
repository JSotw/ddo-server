import Mongoose, { Types } from "mongoose";

const estadoSchema = new Mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        pedido_abierto: {
            type: Boolean,
            required: true,
        },
    },
    {
      timestamps: true,
    }
);

export default Mongoose.model("Estado", estadoSchema);