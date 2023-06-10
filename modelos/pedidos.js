import mongoose, { Schema } from "mongoose";

// Creación del esquema del documento embebido Detalles
const detallesSchema = mongoose.Schema({
    _id : false,
    producto_P: {
        type: String,
        trim: true,
    },
    cantidad_P: {
        type: Number,
        trim: true,
    },
    totalParcial_P: {
        type: Number,
        trim: true,
    },
    copiaInv_P: {
        type: Number,
        trim: true
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
        type: [detallesSchema],
    }
});

// Creación del modelo
const Pedido = mongoose.model("Pedido", pedidosSchema);
export default Pedido;
