import Mongoose, { Types } from "mongoose";

const campo_pago_extraSchema = new Mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        obligatorio: {
            type: Boolean,
            required: true,
        },
        valor:{
            type: Object,   //Puede ser un string o un number
            required: false,
        },
    },
    {
      timestamps: true,
    }
);

export default Mongoose.model("CampoPagoExtra", campo_pago_extraSchema);