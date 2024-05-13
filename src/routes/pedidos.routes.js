import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    crearPedido,
    actualizarPedido
  } from "../controllers/pedidos.controller.js";
  
const router = Router();

// Registro de pedido nuevo
router.post("/crear-pedido", authRequired, crearPedido);

router.get("/actualizar-pedido/:id", authRequired, actualizarPedido);

export default router;