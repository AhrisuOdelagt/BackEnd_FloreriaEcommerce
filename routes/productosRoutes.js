import express from "express";
import { registroProducto,
        modificarProducto,
        eliminarProducto,
        verProducto,
        mostrarProductos,
        mostrarFlores,
        mostrarPeluches } from "../controllers/productosController.js";
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
// Mostrar Productos (CRUD)
router.get("/mostrarProductos", mostrarProductos);

/* Catálogo */
// Mostrar flores
router.get("/mostrarFlores", mostrarFlores);
// Mostrar peluches
router.get("/mostrarPeluches", mostrarPeluches);

export default router;