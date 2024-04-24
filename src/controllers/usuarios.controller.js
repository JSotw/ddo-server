import usuarioModel from "../models/usuario.model.js";

//MODULO DE USUARIOS
//Lista de usuarios

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.find();
    res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: "Usuarios no disponibles o existentes" });
  }
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
