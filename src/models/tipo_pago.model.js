import Mongoose, { Types } from "mongoose";

const tipo_pagoSchema = new Mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        //Campos extra requeridos, por ejemplo, el efectivo no requere de nada extra 
        //(quizá el monto con el que paga el cliente y el vuelto que se le entregó)
        //el pago con transferencia requiere el número de transferencia dado por la
        //aplicación del banco estado
        camposExtra: {
            type: Object,
            required: true,
        },
    },
    {
      timestamps: true,
    }
);

export default Mongoose.model("TipoPago", tipo_pagoSchema);