import express from "express";
// import { agregarProducto } from "../controllers/pedidosController.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();

// Solicitud de pedido
// router.post("/agregarProducto", checkAuth, agregarProducto);

export default router;
