import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    crearPagosIniciales,
    obtenerMediosPago
  } from "../controllers/tipoPago.controller.js";
  
const router = Router();

// Registro de pagos iniciales
router.post("/crear-pagos-iniciales", authRequired, crearPagosIniciales);
router.get("/obtener-medios-pago", authRequired, obtenerMediosPago);

export default router;