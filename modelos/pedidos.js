import mongoose, { Schema } from "mongoose";

// Creación del esquema del documento embebido Detalles
const detallesSchema = mongoose.Schema({
    _id : false,
    producto: { /* Estos productos tendrán un tipo ObjectId para llamar por referencia */
        type: String,
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
        type: [detallesSchema],
    }
});
