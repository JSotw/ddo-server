import usuarioModel from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import { crearTokenAcceso } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../config.js";

import { Resend } from "resend";
import "dotenv/config.js";

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

export const recuperarDatos = async (req, res) => {
  const { nombre_usuario } = req.body;

  try {
    const usuarioEncontrado = await usuarioModel.findOne({ nombre_usuario });
    const newContrasenia = "123456";

    const newCryptContrasenia = await bcrypt.hash(newContrasenia, 10);

    if (!usuarioEncontrado)
      return res.status(400).json(["No se encuentra el nombre de usuario"]);

    if (!usuarioEncontrado.activo) {
      return res.status(400).json(["Su usuario está inactivo"]);
    } else {
      //console.log(newContrasenia);
      await usuarioModel.findOneAndUpdate(
        { _id: usuarioEncontrado._id },
        { contrasenia: newCryptContrasenia },
        {
          new: true,
        }
      );
      const resend = new Resend(process.env.RESEND_APIKEY);
      (async function () {
        const { data, error } = await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: [`janoguerrasks@gmail.com`],
          subject: 'DDO Usuarios',
          html: `<p>Hola ${usuarioEncontrado.primer_n} ${usuarioEncontrado.apellido_p}<br> 
          <strong>Tu nombre de usuario: ${usuarioEncontrado.nombre_usuario}</strong><br>
          <strong>Tu nueva contraseña: ${newContrasenia}</strong>
        </p>`,
        });
      
        if (error) {
          return console.error({ error });
        }
        console.log({ data });
      })();
    }

    res.json({
      primer_n: usuarioEncontrado.primer_n,
      apellido_p: usuarioEncontrado.apellido_p,
      correo: usuarioEncontrado.correo,
      nombre_usuario: usuarioEncontrado.nombre_usuario,
      contrasenia: newContrasenia,
    });
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
