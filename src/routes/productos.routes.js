import { Router } from "express";
import { authRequired } from "../middlewares/validarToken.js"; // Requiere sesión activa
import { validarSchema } from "../middlewares/validador.middleware.js"; // Intermediario de validación

import { crearProductoSchema } from "../schemas/productos.schema.js"; // Esquemas de validación

import {
  obtenerProductos,
  obtenerProducto,
  obtenerProductoPorCodigo,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productos.controller.js";


const router = Router();


//Mostrar productos
router.get("/obtener-productos", obtenerProductos);
router.get("/obtener-productos/:estado", obtenerProductos);
router.get("/obtener-producto/:id", obtenerProducto);
router.get("/obtener-prod-por-codigo/:codigo", obtenerProductoPorCodigo);

// Registro de producto nuevo
router.post("/crear-producto", authRequired, validarSchema(crearProductoSchema), crearProducto);

//Actualizar producto
router.put("/actualizar-producto/:id", authRequired, validarSchema(crearProductoSchema), actualizarProducto);
//Eliminar producto
router.delete("/eliminar-producto/:id", authRequired, eliminarProducto);

export default router;
