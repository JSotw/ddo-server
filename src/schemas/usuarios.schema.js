import { z } from "zod" // Validar los datos

export const crearUsuarioSchema = z.object({
  primer_n: z.string({
    required_error: "Primer nombre requerido",
  }),
  apellido_p: z.string({
    required_error: "Apellido paterno requerido",
  }),
  apellido_m: z.string({
    required_error: "Apellido materno requerido",
  }),
  correo: z.string({
    required_error: "Correo requerido",
  }),
  nombre_usuario: z.string({
    required_error: "Nombre de usuario requerido",
  }),
  contrasenia: z.string({
    required_error: "Contraseña requerida",
  }),
  rol: z.string({
    required_error: "Rol de cuenta requerido",
  }),
  activo: z.boolean({
    required_error: "Estado de cuenta requerido",
  }),
});
