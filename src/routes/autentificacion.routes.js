import { Router } from "express";
import {
  login,
  register,
  logout,
  verificarToken,
} from "../controllers/autentificacion.controller.js";

import { validarSchema } from "../middlewares/validador.middleware.js";
import { loginSchema } from "../schemas/autentificacion.schema.js";

const router = Router();

router.post("/login", validarSchema(loginSchema), login);
router.post("/register", register);
router.post("/logout", logout);

router.get("/verify", verificarToken);

export default router;