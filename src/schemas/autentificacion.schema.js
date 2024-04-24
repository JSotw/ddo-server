import { z } from "zod"; // Validar los datos

export const loginSchema = z.object({
  nombre_usuario: z.string({
    required_error: "Se requiere un nombre de usuario",
  }),
  contrasenia: z.string({
    required_error: "Se requiere una contraseña",
  }),
});
