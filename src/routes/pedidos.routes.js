import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    crearPedido,
    actualizarPedido,
    actualizarDetallePedido,
    reporteVentasDiario,
    reporteVentasXDia
  } from "../controllers/pedidos.controller.js";
  
const router = Router();

// Registro de pedido nuevo
router.post("/crear-pedido", authRequired, crearPedido);

router.post("/actualizar-pedido/:id", authRequired, actualizarPedido);
router.post("/actualizar-pedido-detalles/:id", authRequired, actualizarDetallePedido);

router.get("/reporte-diario/:desde/:hasta", authRequired, reporteVentasDiario)
router.get("/reporte-por-dia/", authRequired, reporteVentasXDia)

export default router;