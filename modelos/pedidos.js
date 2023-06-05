import mongoose, { Schema } from "mongoose";

// Creación del esquema del documento embebido Detalles
const carritoSchema = mongoose.Schema({
    _id : false,
    producto: {
        type: [mongoose.Schema.Types.ObjectId],
        ref : "Producto",
        trim: true,
    },
    cantidad: {
        type: Number,
        trim: true,
    },
    totalParcial: {
        type: Number,
        trim: true,
    }
});

// Creación del esquema de la colección Pedidos
const pedidosSchema = mongoose.Schema({
    fechaPedido: {
        type: Date,
        trim: true,
        default: Date.now(),
    },
    totalArticulos: {
        type: Number,
        trim: true,
    },
    costoArticulos: {
        type: Number,
        trim: true,
    },
    totalEnvio: {
        type: Number,
        trim: true,
    },
    costoTotal: {
        type: Number,
        trim: true,
    },
    valoracion: {
        type: Number,
        trim: true,
    },
    comentario: {
        type: String,
        trim: true,
    },
    isPaid: {
        type: Boolean,
        trim: true,
        default: false,
    },
    isCancelled: {
        type: Boolean,
        trim: true,
        default: false,
    },
    isReturned: {
        type: Boolean,
        trim: true,
        default: false,
    },
    detallesPedido: {
        type: [carritoSchema],
    }
});

// Creación del modelo
const Pedido = mongoose.model("Pedido", pedidosSchema);
export default Pedido;
