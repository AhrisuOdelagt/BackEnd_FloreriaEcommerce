import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import clienteRoutes from "./routes/clienteRoutes.js"
import temporadaRoutes from "./routes/temporadaRoutes.js"
import productosRoutes from "./routes/productosRoutes.js"
import administradorRoutes from "./routes/administradorRoutes.js"


const app = express();
app.use(express.json());
app.use(cors())
dotenv.config();
connectDB();

// Enrutamiento
app.use("/api/cliente", clienteRoutes);
app.use("/api/producto", productosRoutes);
app.use("/api/temporada", temporadaRoutes);
app.use("/api/administrador", administradorRoutes);


// Ocultamiento del puerto de conexión
const PORT = process.env.PORT || 27017;

app.listen(PORT, () => {
    console.log(`El servidor se encuentra corriendo dentro del puerto ${PORT}.`);
});
