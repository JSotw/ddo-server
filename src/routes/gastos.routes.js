import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    registrarGasto,
    actualizarGasto,
    eliminarGasto,
    recuperar
  } from "../controllers/gastos.controller.js";
  
const router = Router();

router.get("/obtener/", authRequired, recuperar);

router.post("/registrar", authRequired, registrarGasto);
router.post("/actualizar/:id", authRequired, actualizarGasto);
router.delete("/eliminar/:id", authRequired, eliminarGasto);

export default router;