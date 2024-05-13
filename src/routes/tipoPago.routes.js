import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    crearPagosIniciales
  } from "../controllers/tipoPago.controller.js";
  
const router = Router();

// Registro de pagos iniciales
router.post("/crear-pagos-iniciales", authRequired, crearPagosIniciales);

export default router;