import express from "express";
import { generarPedido,
    cancelarPedido,
    pagarPedido,
    solicitarReembolso, 
    mostrarPedidosARembolsar} from "../controllers/pedidosController.js";
import checkAuth from "../middleware/checkAuth.js";
import { mostrarFlores } from "../controllers/productosController.js";
import checkAuthAdmin from "../middleware/checkAuthAdmin.js";
const router = express.Router();

// Generación de pedido
router.get("/", checkAuth, generarPedido);
// Cancelación del pedido
router.post("/cancelarPedido", checkAuth, cancelarPedido);
// Pago del pedido
router.post("/pagarPedido", checkAuth, pagarPedido);
// Solicitud de reembolso
router.post("/solicitarReembolso", checkAuth, solicitarReembolso);
//Mostrar pedidos
router.get("/mostrarPedidos", checkAuthAdmin, mostrarPedidos);
//En solicitud de reembolso
router.get("/mostrarSolicitudesReembolso", checkAuthAdmin, mostrarPedidosAReembolsar);


export default router;
