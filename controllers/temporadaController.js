import Temporada from "../modelos/temporadas.js";
import Producto from "../modelos/productos.js";
import Administrador from "../modelos/administrador.js";
import Cliente from "../modelos/cliente.js";

// Registro de temporadas en la base de datos
const registroTemporada = async (req, res) => {
    // Autenticación del administrador
    let emailAdministrador;
    emailAdministrador = req.administrador.emailAdministrador;
    const admin = await Administrador.findOne({ emailAdministrador });
    if(admin.isAdmin == false){
        const error = new Error("Este usuario no es administrador"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Evitar temporadas duplicadas sin lanzar errores en la consola
    const { nombreTemporada,
            peluches,
            flores,
            descrTemporada,
            descuentoTemporada } = req.body;
    const existeTemporada = await Temporada.findOne({ nombreTemporada });

    // Validamos que la temporada no exista
    if(existeTemporada){
        const error = new Error("La temporada ya esta registrada");
        return res.status(400).json({ msg: error.message });
    }

    // Revisamos que ambos productos existan y tengan la categoría correcta
    let nombreProducto = peluches;
    const producto1 = await Producto.findOne({ nombreProducto });
    if(!producto1){
        const error = new Error("El producto no existe");
        return res.status(404).json({ msg: error.message });
    }
    if(producto1.tipoProducto != "Peluche"){
        const error = new Error("El tipo de producto no coincide");
        return res.status(400).json({ msg: error.message });
    }

    nombreProducto = flores;
    const producto2 = await Producto.findOne({ nombreProducto });
    if(!producto2){
        const error = new Error("El producto no existe");
        return res.status(404).json({ msg: error.message });
    }
    if(producto2.tipoProducto != "Flor"){
        const error = new Error("El tipo de producto no coincide");
        return res.status(400).json({ msg: error.message });
    }

    // Validamos que el descuento no sea mayor a 100% ni menor a 0%
    if(descuentoTemporada < 0 && descuentoTemporada > 100){
        const error = new Error("Descuento inválido");  /* Mensaje faltante */
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Guardamos la nueva temporada
        const temporada = new Temporada({nombreTemporada, descrTemporada, descuentoTemporada});
        await temporada.save();

        // Modificamos productos
        producto1.descuentoProducto = descuentoTemporada;
        producto1.precioDescuento = producto1.precioProducto - (producto1.descuentoProducto * producto1.precioProducto)/100;
        producto2.descuentoProducto = descuentoTemporada;
        producto2.precioDescuento = producto2.precioProducto - (producto2.descuentoProducto * producto2.precioProducto)/100;        
        // Añadimos las temporadas a los productos
        producto1.temporadaProducto.push(temporada._id);
        producto2.temporadaProducto.push(temporada._id);
        
        await producto1.save();
        await producto2.save();

        // Verificamos que no existan modificaciones en carritos de compras (para ambos productos)
        // Producto 1
        let nombreProducto = producto1.nombreProducto;
        let clientes = await Cliente.find({ 'carritoCompras.producto_C': nombreProducto });
        for (let i = 0; i < clientes.length; i++) {
            let emailCliente = clientes[i].emailCliente;
            const clienteAModificar = await Cliente.findOne({ emailCliente });
            console.log(clienteAModificar);
            let compras = clienteAModificar.carritoCompras;
            for (let j = 0; j < compras.length; j++) {
                if(compras[j].producto_C == nombreProducto){
                    compras[j].totalParcial_C = producto1.precioDescuento;
                }
            }
            await clienteAModificar.save();
        }
        // Producto 2
        nombreProducto = producto2.nombreProducto;
        clientes = await Cliente.find({ 'carritoCompras.producto_C': nombreProducto });
        for (let i = 0; i < clientes.length; i++) {
            let emailCliente = clientes[i].emailCliente;
            const clienteAModificar = await Cliente.findOne({ emailCliente });
            console.log(clienteAModificar);
            let compras = clienteAModificar.carritoCompras;
            for (let j = 0; j < compras.length; j++) {
                if(compras[j].producto_C == nombreProducto){
                    compras[j].totalParcial_C = producto2.precioDescuento;
                }
            }
            await clienteAModificar.save();
        }

        res.json({
            msg: "La temporada ha sido creada con éxito"
        });
    } catch (error) {
        console.log(error);
    }
};

const modificarTemporada = async (req, res) => {
    // Autenticación del administrador
    let emailAdministrador;
    emailAdministrador = req.administrador.emailAdministrador;
    const admin = await Administrador.findOne({ emailAdministrador });
    if(admin.isAdmin == false){
        const error = new Error("Este usuario no es administrador"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    let { nombreTemporada,
            newName,
            descrTemporada,
            descuentoTemporada } = req.body;
    const temporadaAModificar = await Temporada.findOne({ nombreTemporada });

    // Validamos si existe la temporada
    if(!temporadaAModificar){
        const error = new Error("Temporada no registrada"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Verificar que no haya conflictos al nombrar
    if(nombreTemporada != newName){
        nombreTemporada = newName;
        const existeTemporada = Temporada.findOne({ nombreTemporada });
        if(existeTemporada){
            const error = new Error("Esta temporada ya existe"); /* Mensaje faltante */
            return res.status(403).json({msg: error.message});
        }
    }

    // Validamos que el descuento no sea mayor a 100% ni menor a 0%
    if(descuentoTemporada < 0 && descuentoTemporada > 100){
        const error = new Error("Descuento inválido");  /* Mensaje faltante */
        return res.status(400).json({ msg: error.message });
    }

    // Actualizamos información
    try {
        // Actualizaciones sencillas
        temporadaAModificar.nombreTemporada = nombreTemporada;
        temporadaAModificar.descrTemporada = descrTemporada;
        // Actualizaciones complejas
        temporadaAModificar.descuentoTemporada = descuentoTemporada;
        const id = temporadaAModificar._id;
        const productos = await Producto.find({ "temporadaProducto": id });
        for (let index = 0; index < productos.length; index++) {
            const producto = await Producto.findOne({ _id: productos[index] });
            producto.descuentoProducto = temporadaAModificar.descuentoTemporada;
            producto.precioDescuento = producto.precioProducto - (producto.descuentoProducto * producto.precioProducto)/100;
            await producto.save();

            // Actualizamos los precios del producto en cualquier carrito de compras
            let nombreProducto = producto.nombreProducto;
            const clientes = await Cliente.find({ 'carritoCompras.producto_C': nombreProducto });
            for (let i = 0; i < clientes.length; i++) {
                let emailCliente = clientes[i].emailCliente;
                const clienteAModificar = await Cliente.findOne({ emailCliente });
                console.log(clienteAModificar);
                let compras = clienteAModificar.carritoCompras;
                for (let j = 0; j < compras.length; j++) {
                    if(compras[j].producto_C == nombreProducto){
                        compras[j].totalParcial_C = producto.precioDescuento;
                    }
                }
                await clienteAModificar.save();
            }
        }
        await temporadaAModificar.save();
        res.json({msg: "Se ha modificado la temporada"});  /* Mensaje faltante */
    } catch (error) {
        console.log(error);
    }
}

const verTemporada = async (req, res) => {
    // Autenticación del administrador
    let emailAdministrador;
    emailAdministrador = req.administrador.emailAdministrador;
    const admin = await Administrador.findOne({ emailAdministrador });
    if(admin.isAdmin == false){
        const error = new Error("Este usuario no es administrador"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    const { nombreTemporada } = req.body;

    // Validamos si existe la temporada
    const temporada = await Temporada.findOne({ nombreTemporada });
    if(!temporada){
        const error = new Error("Temporada no registrada"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Ver temporada
    try {
        res.json(temporada);
    } catch (error) {
        console.log(error);
    }
}

const eliminarTemporada = async (req, res) => {
    // Autenticación del administrador
    let emailAdministrador;
    emailAdministrador = req.administrador.emailAdministrador;
    const admin = await Administrador.findOne({ emailAdministrador });
    if(admin.isAdmin == false){
        const error = new Error("Este usuario no es administrador"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    const { nombreTemporada } = req.body;
    const temporada = await Temporada.findOne({ nombreTemporada });

    // Validamos si existe la temporada
    if(!temporada){
        const error = new Error("Temporada no registrada"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Eliminamos la temporada
    try {
        // Primero, eliminamos toda aparición de dicha temporada en toda la colección de productos
        // Seguido, reiniciamos los descuentos
        const id = temporada._id;
        const productos = await Producto.find({ "temporadaProducto": id });
        let temp = [];
        for (let index = 0; index < productos.length; index++) {
            const producto = await Producto.findOne({ _id: productos[index] });
            // Reinicio del descuento
            producto.descuentoProducto = 0;
            producto.precioDescuento = producto.precioProducto;
            // Removemos la temporada del arreglo
            temp = producto.temporadaProducto;
            let newTemp = []
            for (let i = 0; i < temp.length; i++) {
                if(!temp[i].equals(id)){
                    newTemp.push(temp[i]);
                }
                // console.log(id);
                // console.log(temp[i]);
            }
            producto.temporadaProducto = newTemp;
            await producto.save();
            
            // Actualizamos los precios del producto en cualquier carrito de compras
            let nombreProducto = producto.nombreProducto;
            const clientes = await Cliente.find({ 'carritoCompras.producto_C': nombreProducto });
            for (let i = 0; i < clientes.length; i++) {
                let emailCliente = clientes[i].emailCliente;
                const clienteAModificar = await Cliente.findOne({ emailCliente });
                console.log(clienteAModificar);
                let compras = clienteAModificar.carritoCompras;
                for (let j = 0; j < compras.length; j++) {
                    if(compras[j].producto_C == nombreProducto){
                        compras[j].totalParcial_C = producto.precioDescuento;
                    }
                }
                await clienteAModificar.save();
            }
        }
        // Finalmente, eliminamos el documento que contiene la temporada
        await temporada.deleteOne();
        res.json({msg: "Se ha eliminado la temporada correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const mostrarTemporadas = async (req, res) => {
    try {
        const documentos = await Temporada.find();
        res.json({ seasons: documentos });
    } catch (error) {
        console.log(error);
    }
}

export { registroTemporada,
        modificarTemporada,
        verTemporada,
        eliminarTemporada,
        mostrarTemporadas };
