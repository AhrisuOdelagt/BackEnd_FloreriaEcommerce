import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

//Parte de la base embebido Direccion
const direccionSchema = mongoose.Schema({
    _id : false,
    /* delegacion: {
        type: String,
        trim: true,
    }, */
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
    },
    referencia1: {
        type: String,
        trim: true,
    },
    referencia2: {
        type: String,
        trim: true,
    },
    indicacionesAd: {
        type: String,
        trim: true,
    }
});

// Creación del esquema de la colección Administrador -----
const administradorSchema = mongoose.Schema({
    nombreAdministrador: {
        type: String,
        required: true,
        trim: true,
    },
    passwordAdministrador: {
        type: String,
        required: true,
        trim: true,
    },
    emailAdministrador: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    telefonoAdministrador: {
        type: String,
        // required: true,
        trim: true,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    direccionAdministrador: {
        type: [direccionSchema],
    },
    tokenAdministrador: {
        type: String,
    }
}, {
    timestamps: true,
});

// Hasheamos la contraseña del administrador
administradorSchema.pre('save', async function(next){
    if(!this.isModified("passwordAdministrador")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordAdministrador = await bcrypt.hash(this.passwordAdministrador, salt);
});

// Creamos un método que ayuda a comparar la contraseña del administrador
administradorSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.passwordAdministrador);
}

// Creación del modelo
const Administrador = mongoose.model("Administrador", administradorSchema);
export default Administrador;