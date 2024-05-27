import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    crearPedido,
    actualizarPedido,
    actualizarDetallePedido,
    reporteVentasDiario
  } from "../controllers/pedidos.controller.js";
  
const router = Router();

// Registro de pedido nuevo
router.post("/crear-pedido", authRequired, crearPedido);

router.get("/actualizar-pedido/:id", authRequired, actualizarPedido);
router.get("/actualizar-pedido-detalles/:id", authRequired, actualizarDetallePedido);

router.get("/reporte-diario/:desde/:hasta", authRequired, reporteVentasDiario)

export default router;