import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa
import { validarSchema } from "../middlewares/validador.middleware.js"; // Intermediario de validación

import { crearUsuarioSchema } from "../schemas/usuarios.schema.js"; // Esquemas de validación

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../controllers/usuarios.controller.js";


const router = Router();


//Mostrar usuarios
router.get("/obtener-usuarios", obtenerUsuarios);

// Registro de usuario nuevo
router.post("/crear-usuario", authRequired, validarSchema(crearUsuarioSchema), crearUsuario);

//Actualizar usuario
router.get("/actualizar-usuario/:id", authRequired, validarSchema(crearUsuarioSchema), actualizarUsuario);
//Eliminar usuario
router.get("/eliminar-usuario/:id", authRequired, eliminarUsuario);




// //Buscar
// router.get("/propiedad/:id", getPropertyFront);
// // Últimos 4 registros
// router.get("/last-four-properties", getLastFourProperties);

// //Back
// //Mostrar todo
// router.get("/admin/propiedades", authRequired, getProperties);
// //Buscar
// router.get("/admin/propiedad/:id", authRequired, getProperty);
// //Agregar
// router.post("/admin/agregar-propiedad", authRequired, validateSchema(createPropertySchema), createProperty);
// //Editar
// router.put("/admin/editar-propiedad/:id", authRequired, updateProperty);
// //Eliminar
// router.delete("/admin/eliminar-propiedad/:id", authRequired, deleteProperty);

// //Agregar
// router.post("/admin/categoria", authRequired, createCategory);
// //Agregar
// router.post("/admin/tipo", authRequired, createType);

export default router;
