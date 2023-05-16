import mongoose, { Schema } from "mongoose";

// Creación del esquema de la colección Productos
const productosSchema = mongoose.Schema({
    nombreProducto: {
        type: String,
        trim: true,
    },
    descrProducto: {
        type: String,
        trim: true,
    },
    precioProducto: {
        type: Number,
        trim: true,
    },
    cantidadInv: {
        type: Number,
        trim: true,
    },
    descuentoProducto: {
        type: Number,
        trim: true,
    },
    imagenProducto: {
        type: String,   /* No se sabe aún cómo se van a manejar las imágenes */
        trim: true,
    },
    categoriaProducto: {
        type: String,
        trim: true,
    },
    temporadaProducto: {
        type: [String], /* Estas temporadas tendrán un tipo ObjectId para llamar por referencia */
        trim: true, 
    }
});
