import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import clienteRoutes from "./routes/clienteRoutes.js"
import productosRoutes from "./routes/productosRoutes.js"

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

// Enrutamiento
app.use("/api/cliente", clienteRoutes);
// app.use("/api/temporada", temporadaRoutes);
app.use("/api/producto", productosRoutes);


// Ocultamiento del puerto de conexión
const PORT = process.env.PORT || 27017;

app.listen(PORT, () => {
    console.log(`El servidor se encuentra corriendo dentro del puerto ${PORT}.`);
});
