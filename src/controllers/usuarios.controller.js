import usuarioModel from "../models/usuario.model.js";

//MODULO DE USUARIOS
//Lista de usuarios

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.find();
    res.json(usuarios);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Usuarios no disponibles o existentes" });
  }
};

export const crearUsuario = async (req, res) => {
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
      const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10); //Contraseña encriptada

      //console.log(contraseniaEncriptada);
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
      return res.status(401).json(["El nombre de usuario ya existe"]); //
    }
  } catch (error) {
    console.log(error);
  }
};

export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await usuarioModel.findOne({ id: req.params.id });
    if (!usuario)
      return res.status(404).json({ message: "No se encuentra el usuario" });
    res.json(usuario);
  } catch (error) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
};
export const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await usuarioModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (!usuario)
      return res.status(404).json({ message: "No se encuentra el usuario" });
    res.json(usuario);
  } catch (error) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await usuarioModel.findOneAndDelete({ id: req.params.id });
    if (!usuario)
      return res.status(404).json({ message: "No se encuentra el usuario" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(404).json({ message: "Usuario no encontrado" });
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
