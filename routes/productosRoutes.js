import express from "express";
import { registroProducto, modificarProducto, eliminarProducto, verProducto } from "../controllers/productosController.js";

const router = express.Router();

//Creacion producto
router.post("/", registroProducto);
//Modificar producto
router.post("/modificarProducto", modificarProducto);
//Eliminar producto
router.post("/eliminarProducto", eliminarProducto);
//Ver producto
router.post("/", verProducto);

export default router;