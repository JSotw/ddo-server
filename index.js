import app from "./app.js";
import { connectDB } from "./db.js";
import "dotenv/config.js";

connectDB();

const port = process.env.PORT
app.listen(port);

console.log(`Servidor iniciado [${port}]`);