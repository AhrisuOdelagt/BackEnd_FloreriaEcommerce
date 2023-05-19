import mongoose, { Schema } from "mongoose";

// Creación del esquema de la colección Temporadas
const temporadasSchema = mongoose.Schema({
    nombreTemporada: {
        type: String,
        trim: true,
    },
    descrTemporada: {
        type: String,
        trim: true,
    }
});

// Creación del modelo
const Temporada = mongoose.model("Temporada", temporadasSchema);
export default Temporada;
