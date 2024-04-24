import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Intermediario de seguridad, debe estar con la sesión iniciada
import {
  login,
  register,
  logout,
  verificarToken,
} from "../controllers/autentificacion.controller.js"; // Controladores
import { validarSchema } from "../middlewares/validador.middleware.js"; // Valida el esquema
import {
  loginSchema,
} from "../schemas/autentificacion.schema.js"; // Esquemas de sesión (se usa "zod" para validaciones)
import { crearUsuarioSchema } from "../schemas/usuarios.schema.js"; // Esquema para validar usuario

const router = Router();

// Inicio de sesión
router.post("/login", validarSchema(loginSchema), login);

// Cerrar sesión (limpia el token de las cookies)
router.post("/logout", logout);

// Verifica la validación del token
router.get("/verify", verificarToken);

export default router;
