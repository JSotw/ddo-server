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

    if (!usuarioEncontrado.activo)
      return res.status(400).json(["Su cuenta está inactiva"]);

    const siCoincide = await bcrypt.compare(
      contrasenia,
      usuarioEncontrado.contrasenia
    ); //contraseña encriptada
    if (!siCoincide) return res.status(400).json(["Contraseña incorrecta"]);

    const token = await crearTokenAcceso({ id: usuarioEncontrado._id });
    res.cookie("token", token);
    res.json({
      primer_n: usuarioEncontrado.primer_n,
      segundo_n: usuarioEncontrado.segundo_n,
      apellido_p: usuarioEncontrado.apellido_p,
      apellido_m: usuarioEncontrado.apellido_m,
      correo: usuarioEncontrado.correo,
      nombre_usuario: usuarioEncontrado.nombre_usuario,
      imagen_perfil: usuarioEncontrado.imagen_perfil,
      rol: usuarioEncontrado.rol,
      activo: usuarioEncontrado.activo,
      createdAt: usuarioEncontrado.createdAt,
      updatedAt: usuarioEncontrado.updatedAt,
    });
  } catch (error) {
    console.log(error);
  }
};

export const register = async (req, res) => {
  const {
    primer_n,
    segundo_n,
    apellido_p,
    apellido_m,
    correo,
    nombre_usuario,
    contrasenia,
    imagen_perfil,
    rol,
    activo,
  } = req.body;

  try {
    const usuarioEncontrado = await usuarioModel.findOne({ nombre_usuario });
    if (!usuarioEncontrado) {
      const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10); //contraseña encriptada

      console.log(contraseniaEncriptada);
      const nuevoUsuario = new usuarioModel({
        primer_n,
        segundo_n,
        apellido_p,
        apellido_m,
        correo,
        nombre_usuario,
        contrasenia: contraseniaEncriptada,
        imagen_perfil,
        rol,
        activo,
      });
      const usuarioGuardado = await nuevoUsuario.save();
      // const token = await crearTokenAcceso({ id: usuarioGuardado._id });
      // res.cookie("token", token);
      console.log(usuarioGuardado);
    } else {
      return res.status(401).json(["El nombre de usuario ya existe"]); //Código podría cambiar
    }
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const verificarToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "No autorizado" });
  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "No autorizado" });

    const usuarioEncontrado = await usuarioModel.findById(user.id);

    if (!usuarioEncontrado)
      return res.status(401).json({ message: "Usuario no encontrado" });

    return res.json({
      primer_n: usuarioEncontrado.primer_n,
      segundo_n: usuarioEncontrado.segundo_n,
      apellido_p: usuarioEncontrado.apellido_p,
      apellido_m: usuarioEncontrado.apellido_m,
      correo: usuarioEncontrado.correo,
      nombre_usuario: usuarioEncontrado.nombre_usuario,
      imagen_perfil: usuarioEncontrado.imagen_perfil,
      rol: usuarioEncontrado.rol,
      activo: usuarioEncontrado.activo,
      createdAt: usuarioEncontrado.createdAt,
      updatedAt: usuarioEncontrado.updatedAt,
    });
  });
};
