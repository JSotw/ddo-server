import Mongoose, { Types } from "mongoose";

const pagoSchema = new Mongoose.Schema(
    {
        monto: {
            type: Number,
            required: true,
        },
        tipo_pago: {
            type: Object,
            required: true,
        },
    },
    {
      timestamps: true,
    }
);

export default Mongoose.model("Pago", pagoSchema);