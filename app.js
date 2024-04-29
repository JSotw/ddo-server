import e from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config.js";

// Routes
import autentificacionRoutes from "./src/routes/autentificacion.routes.js";
import usuariosRoutes from "./src/routes/usuarios.routes.js";
import productoRoutes from "./src/routes/productos.routes.js";


const app = e();

app.use(cors({
  origin: process.env.CORS_ORIGIN_URL,
  credentials: true
}));

app.use(morgan('dev'));
app.use(e.json());
app.use(cookieParser());

// app api routes
app.use('/api', autentificacionRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', productoRoutes);


export default app;

