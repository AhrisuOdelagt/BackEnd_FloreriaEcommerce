import express from "express";
import { registroProducto,
        modificarProducto,
        eliminarProducto,
        verProducto,
        mostrarProductos } from "../controllers/productosController.js";
import checkAuthAdmin from "../middleware/checkAuthAdmin.js"

const router = express.Router();

/* CRUD */
// Creacion producto
router.post("/", checkAuthAdmin, registroProducto);
// Modificar producto
router.post("/modificarProducto", checkAuthAdmin, modificarProducto);
// Eliminar producto
router.post("/eliminarProducto", checkAuthAdmin, eliminarProducto);
// Ver producto
router.post("/verProducto", checkAuthAdmin, verProducto);

/* Catálogo */
// Mostar productos
router.get("/mostrarProductos", mostrarProductos);

export default router;