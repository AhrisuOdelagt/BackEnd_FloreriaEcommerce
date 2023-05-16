import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

// Creación del esquema del documento embebido Direccion
const direccionSchema = mongoose.Schema({
    _id : false,
    delegacion: {
        type: String,
        trim: true,
    },
    codigoPostal: {
        type: String,
        trim: true,
    },
    colonia: {
        type: String,
        trim: true,
    },
    calle: {
        type: String,
        trim: true,
    },
    numInt: {
        type: String,
        trim: true,
    },
    numExt: {
        type: String,
        trim: true,
    }
});

// Creación del esquema del documento embebido Tarjeta
const tarjetaSchema = mongoose.Schema({
    _id : false,
    tipoTarjeta: {
        type: String,
        trim: true,
    },
    numTarjeta: {
        type: String,
        trim: true,
    },
    fechaVencimiento: {
        type: String,
        trim: true,
    },
    cvv: {
        type: String,
        trim: true,
    },
    titularTarjeta: {
        type: String,
        trim: true,
    },
});

// Creación del esquema de la colección Cliente -----
const clienteSchema = mongoose.Schema({
    nombreCliente: {
        type: String,
        required: true,
        trim: true,
    },
    passwordCliente: {
        type: String,
        required: true,
        trim: true,
    },
    emailCliente: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    telefonoCliente: {
        type: String,
        // required: true,
        trim: true,
        default: "00-0000-0000"
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    direccionCliente: {
        type: [direccionSchema],
        default: {
            delegacion: "default value",
            codigoPostal: "default value",
            colonia: "default value",
            calle: "default value",
            numInt: "default value",
            numExt: "default value",
        },
    },
    tarjetaCliente: {
        type: [tarjetaSchema],
        default: {
            tipoTarjeta: "default value",
            numTarjeta: "default value",
            fechaVencimiento: "default value",
            cvv: "default value",
            titularTarjeta: "default value",
        },
    },
    pedidosCliente: {
        type: [String],
        default: "default reference",
    },
    tokenCliente: {
        type: String,
    }
}, {
    timestamps: true,
});

// Hasheamos la contraseña del cliente
clienteSchema.pre('save', async function(next){
    if(!this.isModified("passwordCliente")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordCliente = await bcrypt.hash(this.passwordCliente, salt);
});

// Creamos un método que ayuda a comparar la contraseña del usuario
clienteSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.passwordCliente);
}

// Creación del modelo
const Cliente = mongoose.model("Cliente", clienteSchema);
export default Cliente;
