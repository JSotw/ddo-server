import { z } from "zod" // Validar los datos

export const crearProductoSchema = z.object({
  codigo: z.string({
    required_error: "Codigo requerido",
  }),
  nombre: z.string({
    required_error: "Nombre requerido",
  }),
  descripcion: z.string({
    required_error: "Descripcion requerida",
  }),
  precio_base: z.number({
    required_error: "Precio base requerido",
  }),
  activo: z.boolean({
    required_error: "Estado activo/inactivo requerido",
  }),
});
