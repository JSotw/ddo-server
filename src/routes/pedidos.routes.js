import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa


import {
    obtenerPedido,
    obtenerPedidos,
    crearPedido,
    actualizarPedido,
    actualizarDetallePedido,
    reporteVentasDiario,
    reporteVentasXDia,
    obtenerAllPedidos,
    eliminarPedido,
    actualizarEstadoPedido
  } from "../controllers/pedidos.controller.js";
  
const router = Router();

// Registro de pedido nuevo
router.post("/crear-pedido", authRequired, crearPedido);

router.post("/actualizar-pedido/:id", authRequired, actualizarPedido);
router.put("/actualizar-estado-pedido/:id", authRequired, actualizarEstadoPedido);
router.post("/actualizar-pedido-detalles/:id", authRequired, actualizarDetallePedido);

router.delete("/eliminar-pedido/:id", authRequired, eliminarPedido);

router.get("/obtener-pedido/:id", authRequired, obtenerPedido);
router.get("/obtener-todos-pedidos", authRequired, obtenerAllPedidos);
router.get("/obtener-pedidos/:desde/:hasta", authRequired, obtenerPedidos);
router.get("/reporte-diario/:desde/:hasta", authRequired, reporteVentasDiario)
router.get("/reporte-por-dia/:desde/:hasta", authRequired, reporteVentasXDia)

export default router;