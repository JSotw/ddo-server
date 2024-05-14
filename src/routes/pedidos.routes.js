import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    crearPedido,
    actualizarPedido,
    actualizarDetallePedido
  } from "../controllers/pedidos.controller.js";
  
const router = Router();

// Registro de pedido nuevo
router.post("/crear-pedido", authRequired, crearPedido);

router.get("/actualizar-pedido/:id", authRequired, actualizarPedido);
router.get("/actualizar-pedido-detalles/:id", authRequired, actualizarDetallePedido);

export default router;