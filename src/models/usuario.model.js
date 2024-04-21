import { ObjectId } from "mongodb";
import Mongoose from "mongoose";

const usuarioSchema = new Mongoose.Schema(
  {
    primer_n: {
      type: String,
      required: true,
    },
    segundo_n: {
      type: String,
    },
    apellido_p: {
      type: String,
      required: true,
    },
    apellido_m: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
    },
    nombre_usuario: {
      type: String,
      required: true,
    },
    contrasenia: {
      type: String,
      required: true,
    },
    imagen_perfil: {
      type: String,
    },
    rol: {
      type: String,
      // ref: "Rol",
      //require: true,
    },
    activo: {
      type: Boolean,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Usuario", usuarioSchema);