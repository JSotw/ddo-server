import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    obtenerUniques
  } from "../controllers/agregados.controller.js";
  
const router = Router();

// Registro de pagos iniciales
router.get("/obtener-uniques", obtenerUniques);

export default router;