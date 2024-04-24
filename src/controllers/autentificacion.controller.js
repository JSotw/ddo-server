import usuarioModel from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import { crearTokenAcceso } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../config.js";

export const login = async (req, res) => {
  const { nombre_usuario, contrasenia } = req.body;

  try {
    const usuarioEncontrado = await usuarioModel.findOne({ nombre_usuario });
    
    if (!usuarioEncontrado)
      return res.status(400).json(["No se encuentra el nombre de usuario"]);

    const siCoincide = await bcrypt.compare(
      contrasenia,
      usuarioEncontrado.contrasenia
    ); //contraseña encriptada
    if (!siCoincide) return res.status(400).json(["Contraseña incorrecta"]);

    const token = await crearTokenAcceso({ id: usuarioEncontrado._id });
    res.cookie("token", token);
    res.json({
      nombre_usuario: usuarioEncontrado.nombre_usuario,
      nombre: usuarioEncontrado.nombre,
      apellido_p: usuarioEncontrado.apellido_p,
      apellido_m: usuarioEncontrado.apellido_m,
      correo: usuarioEncontrado.correo,
      imagen_perfil: usuarioEncontrado.imagen_perfil,
      rol: usuarioEncontrado.rol,
      createdAt: usuarioEncontrado.createdAt,
      updatedAt: usuarioEncontrado.updatedAt,
    });
  } catch (error) {
    return res.status(400).json({
      "resultado": "Error",
      "mensaje": error.message
    });
  }
};

export const register = async (req, res) => {
  const {
    nombre_usuario,
    primer_n,
    segundo_n,
    apellido_p,
    apellido_m,
    correo,
    contrasenia,
    imagen_perfil,
    rol,
    createdAt,
    updatedAt,
    activo,
  } = req.body;

  try {
    const usuarioEncontrado = await usuarioModel.findOne({ nombre_usuario });
    if (!usuarioEncontrado){
      const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10); //contraseña encriptada

      console.log(contraseniaEncriptada);
      const nuevoUsuario = new usuarioModel({
        nombre_usuario,
        primer_n,
        segundo_n,
        apellido_p,
        apellido_m,
        correo,
        contrasenia: contraseniaEncriptada,
        imagen_perfil,
        rol,
        createdAt,
        updatedAt,
        activo
      });
      const usuarioGuardado = await nuevoUsuario.save();
      return res.status(200).json({
        "resultado": "Exito",
        "mensaje": "Usuario registrado",
        "datos": usuarioGuardado
      });
    }else{
      return res.status(401).json({
        "resultado": "Error",
        "mensaje": "Usuario ya registrado"
      });
    }
  } catch (error) {
    return res.status(400).json({
      "resultado": "Error",
      "mensaje": error.message
    });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

// export const profile = async (req, res) => {
//   const usuarioEncontrado = await User.findById(req.user.id);
//   if (!usuarioEncontrado)
//     return res.status(400).json({ message: "Usuario no encontrado" });

//   return res.json({
//     id: usuarioEncontrado._id,
//     username: usuarioEncontrado.username,
//     email: usuarioEncontrado.email,
//     createdAt: usuarioEncontrado.createdAt,
//     updatedAt: usuarioEncontrado.updatedAt,
//   });
// };

export const verificarToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No autorizado" });
  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "No autorizado" });

    const usuarioEncontrado = await usuarioModel.findById(user.id);
    
    if (!usuarioEncontrado)
      return res.status(401).json({ message: "No autorizado" });

    return res.json({
      nombre: usuarioEncontrado.nombre,
      apellido_p: usuarioEncontrado.apellido_p,
      apellido_m: usuarioEncontrado.apellido_m,
      correo: usuarioEncontrado.correo,
      contrasenia: usuarioEncontrado.contrasenia,
      imagen_perfil: usuarioEncontrado.imagen_perfil,
      rol: usuarioEncontrado.rol,
      createdAt: usuarioEncontrado.createdAt,
      updatedAt: usuarioEncontrado.updatedAt,
    });
  });
};
