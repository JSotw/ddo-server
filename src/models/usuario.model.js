import { ObjectId } from "mongodb";
import Mongoose from "mongoose";

const usuarioSchema = new Mongoose.Schema(
  {
    nombre_usuario: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
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
    }
  },
  {
    timestamps: true,
  }
);

export default Mongoose.model("Usuario", usuarioSchema);