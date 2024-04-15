import { z } from "zod"; // Validar los datos

export const loginSchema = z.object({
  contrasenia: z.string({
    required_error: "Se requiere una contraseña",
  }),
});
