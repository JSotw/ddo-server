import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js";

import {
  obtenerUsuarios,
} from "../controllers/usuarios.controller.js";

// import { createPropertySchema } from "../schemas/property.schema.js";
// import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

//Mostrar usuarios
router.get("/obtener-usuarios", obtenerUsuarios);






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
