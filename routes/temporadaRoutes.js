import express from "express";
import { registroTemporada } from "../controllers/temporadaController.js";
const router = express.Router();

// Creación de temporada
router.post("/", registroTemporada);

export default router;
