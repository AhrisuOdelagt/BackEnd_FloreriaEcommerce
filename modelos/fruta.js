import mongoose, { Schema } from "mongoose";

// Crear esquema frutas
const frutaSchema = mongoose.Schema({
    nombreFruta: {
        type: String,
        trim: true,
        required: true,
    },
    colorFruta: {
        type: String,
        trim: true,
        required: true,
    },
    cantidadFruta: {
        type: Number,
        required: true,
    }
});

// Creación del modelo
const Fruta = mongoose.model("Fruta", frutaSchema);
export default Fruta;
