import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    crearEstadosIniciales
  } from "../controllers/estado.controller.js";
  
const router = Router();

// Registro de estados iniciales
router.post("/crear-estados-iniciales", authRequired, crearEstadosIniciales);

export default router;