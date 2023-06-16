import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import clienteRoutes from "./routes/clienteRoutes.js"
import temporadaRoutes from "./routes/temporadaRoutes.js"

const app = express();
app.use(express.json());
app.use(cors())
dotenv.config();
connectDB();

// Cloudinary
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLD_N,
    api_key: process.env.APK,
    api_secret: process.env.APS
});

// Enrutamiento
app.use("/api/cliente", clienteRoutes);
app.use("/api/producto", productosRoutes);
app.use("/api/temporada", temporadaRoutes);


// Ocultamiento del puerto de conexión
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`El servidor se encuentra corriendo dentro del puerto ${PORT}.`);
});
