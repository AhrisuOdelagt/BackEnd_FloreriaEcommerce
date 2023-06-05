import mongoose, { Schema } from "mongoose";

// Creación del esquema de la colección Productos
const productosSchema = mongoose.Schema({
    nombreProducto: {
        type: String,
        trim: true,
        required: true,
    },
    descrProducto: {
        type: String,
        trim: true,
        required: true,
    },
    tipoProducto: {
        type: String,
        trim: true,
        required: true,
    },
    precioProducto: {
        type: Number,
        trim: true,
        required: true,
    },
    cantidadInv: {
        type: Number,
        trim: true,
        required: true,
    },
    statusProducto: {
        type: String,
        trim: true,
        required: true,
    },
    descuentoProducto: {
        type: Number,
        trim: true,
        default: 0
    },
    precioDescuento: {
        type: Number,
        trim: true,
    },
    imagenProducto: {
        type: [String],
        trim: true,
    },
    categoriaProducto: {
        type: String,
        trim: true,
        required: true,
    },
    temporadaProducto: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Temporada", /* Estas temporadas tendrán un tipo ObjectId para llamar por referencia */
        trim: true, 
    }
});

// Creación del modelo
const Producto = mongoose.model("Producto", productosSchema);
export default Producto;
