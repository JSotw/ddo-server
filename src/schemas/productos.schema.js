import { z } from "zod" // Validar los datos

export const crearProductoSchema = z.object({
  codigo: z.string({
    required_error: "Código requerido",
  }),
  nombre: z.string({
    required_error: "Nombre requerido",
  }),
  descripcion: z.string({
    required_error: "Descripción requerida",
  }),
  precio_base: z.number({
    required_error: "Precio base requerido",
  }),
  activo: z.boolean({
    required_error: "Estado activo/inactivo requerido",
  }),
});
