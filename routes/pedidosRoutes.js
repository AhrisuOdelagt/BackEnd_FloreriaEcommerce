import express from "express";
import { generarPedido,
    cancelarPedido,
    pagarPedido,
    solicitarReembolso } from "../controllers/pedidosController.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();

// Generación de pedido
router.get("/", checkAuth, generarPedido);
// Cancelación del pedido
router.post("/cancelarPedido", checkAuth, cancelarPedido);
// Pago del pedido
router.post("/pagarPedido", checkAuth, pagarPedido);
// Solicitud de reembolso
router.post("/solicitarReembolso", checkAuth, solicitarReembolso);


export default router;
