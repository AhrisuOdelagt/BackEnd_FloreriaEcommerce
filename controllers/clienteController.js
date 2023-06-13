import Cliente from "../modelos/cliente.js";
import Producto from "../modelos/productos.js";
import Pedido from "../modelos/pedidos.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRestablecer } from "../helpers/emails.js";

// Registro del cliente en la base de datos
const registroCliente = async (req, res) => {
    // Evitar clientes duplicados sin lanzar errores en la consola
    const { emailCliente } = req.body;
    const existeCliente = await Cliente.findOne({ emailCliente });

    // Validamos que el cliente no exista ya
    if(existeCliente){
        const error = new Error("Correo asociado a una cuenta");
        return res.status(400).json({ msg: error.message });
    }

    try {
        const cliente = new Cliente(req.body);
        cliente.usernameCliente = `${cliente.nombreCliente} ${cliente.apellidoCliente}`;
        cliente.tokenCliente = generarID();
        await cliente.save();

        // Enviamos el email de confirmación
        emailRegistro({
            email: cliente.emailCliente,
            nombre: cliente.usernameCliente,
            token: cliente.tokenCliente
        })

        res.json({
            msg: "Cuenta creada con éxito"
        });
    } catch (error) {
        console.log(error);
    }
};

// Autenticación del Usuario
const autenticacionCliente = async (req, res) => {
    const { emailCliente, passwordCliente } = req.body;
    // Comprobamos si el usuario existe
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Correo o contraseña incorrectos");
        return res.status(404).json({msg: error.message});
    }
    // Comprobamos is el usuario está confirmado
    if(!cliente.isConfirmed){
        const error = new Error("Usuario sin confirmar");  /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }
    // Confirmamos la password
    if(await cliente.comprobarPassword(passwordCliente)){
        res.json({_id: cliente._id,
            username: cliente.usernameCliente,
            email: cliente.emailCliente,
            token: generarJWT(cliente._id)});
    }
    else{
        const error = new Error("Correo o contraseña incorrectos");
        return res.status(403).json({msg: error.message});
    }
}

// Uso de Token para confirmar cliente
const confirmarCliente = async (req, res) => {
    const { tokenCliente } = req.params;
    const clienteConfirmar = await Cliente.findOne({ tokenCliente });
    if(!clienteConfirmar) {
        const error = new Error("Código de verificación inválido");
        return res.status(403).json({msg: error.message});
    }
    try {
        clienteConfirmar.isConfirmed = true;
        clienteConfirmar.tokenCliente = undefined;
        await clienteConfirmar.save();
        res.json({msg: "Cuenta confirmada con éxito"})  /* Mensaje faltante */
    } catch (error) {
        console.log(error);
    }
}

// Olvidé mi contraseña
const olvidePassword = async (req, res) => {
    const { emailCliente } = req.body;
    // Comprobamos si el usuario existe
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("El correo no está registrado");   /* Mensaje faltante */
        return res.status(404).json({msg: error.message});
    }
    try {
        cliente.tokenCliente = generarID();
        await cliente.save();
        // Enviamos el email para restablecer la contraseña
        emailRestablecer({
            email: cliente.emailCliente,
            nombre: cliente.usernameCliente,
            token: cliente.tokenCliente
        })
        res.json({
            msg: "Se ha enviado un correo con las instrucciones a seguir"   /* Mensaje faltante */
        });
    } catch (error) {
        console.log(error);
    }
}

// Uso de Token para confirmar cliente
const comprobarToken = async (req, res) => {
    const { tokenCliente } = req.params;
    const tokenValido = await Cliente.findOne({ tokenCliente });
    if(!tokenValido) {
        const error = new Error("Código de verificación inválido");
        return res.status(403).json({msg: error.message});
    }
    try {
        res.json({msg: "Código de verificación correcto"})     /* Mensaje faltante */
    } catch (error) {
        console.log(error);
    }
}

// Reestablecer contraseña
const nuevoPasswordRec = async (req, res) => {
    const { tokenCliente } = req.params;
    const { nuevaPassword } = req.body;

    const cliente = await Cliente.findOne({ tokenCliente });
    if(!cliente) {
        const error = new Error("Código de verificación inválido");
        return res.status(403).json({msg: error.message});
    }
    try {
        cliente.passwordCliente = nuevaPassword;
        cliente.tokenCliente = undefined;
        await cliente.save();
        res.json({msg: "Cambio guardado exitosamente"})
    } catch (error) {
        console.log(error);
    }
}

// Perfil
const perfil = async (req, res) => {
    const { cliente } = req;
    res.json(cliente);
}

// Modificar password
const modificarPassword = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { newPassword } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        clienteAModificar.passwordCliente = newPassword;
        await clienteAModificar.save();
        res.json({msg: "Cambio guardado exitosamente"});
    } catch (error) {
        console.log(error);
    }
}

// Modificar username
const modificarUsername = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { nombre, apellido } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        clienteAModificar.nombreCliente = nombre;
        clienteAModificar.apellidoCliente = apellido;
        clienteAModificar.usernameCliente = `${clienteAModificar.nombreCliente} ${clienteAModificar.apellidoCliente}`;
        await clienteAModificar.save();
        res.json({msg: "Cambio guardado exitosamente"});
    } catch (error) {
        console.log(error);
    }
}

// // Modificar email
// const modificarEmail = async (req, res) => {
//     const { newEmail } = req.body;
//     // Verificamos que el Email que quiere colocar el cliente no exista
//     const cliente = await Cliente.findOne({ newEmail });
//     if(cliente){
//         const error = new Error("El email ya está ocupado.");
//         return res.status(404).json({msg: error.message});
//     }
//     let emailCliente;
//     emailCliente = req.cliente.emailCliente;
//     // Encontramos el documento del cliente que está realizando la operación
//     const clienteAModificar = await Cliente.findOne({ emailCliente });
//     if(!clienteAModificar.isConfirmed){
//         const error = new Error("Ocurrió un error.");
//         return res.status(403).json({msg: error.message});
//     }
//     // Realizamos la operación
//     try {
//         clienteAModificar.emailCliente = newEmail;
//         clienteAModificar.save();
//         res.json({msg: "Email modificado exitosamente."});
//     } catch (error) {
//         console.log(error);
//     }
// }

// Modificar teléfono
const modificarTelefono = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { telefono } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        clienteAModificar.telefonoCliente = telefono;
        await clienteAModificar.save();
        res.json({msg: "Cambio guardado exitosamente"});
    } catch (error) {
        console.log(error);
    }
}

// Modificar direccion
const modificarDireccion = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { col,
            cal,
            cp,
            nInt,
            nExt,
            calle1,
            calle2,
            adicionales } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        const direccion = {
            codigoPostal: cp,
            colonia: col,
            calle: cal,
            numInt: nInt,
            numExt: nExt,
            referencia1: calle1,
            referencia2: calle2,
            indicacionesAd: adicionales
        };
        clienteAModificar.direccionCliente.push(direccion);
        await clienteAModificar.save();
        res.json({msg: "Cambio guardado exitosamente"});
    } catch (error) {
        console.log(error);
    }
}

// Modificar Tarjeta
const modificarTarjeta = async (req, res) => {
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const { num,
            fecha,
            c,
            titular } = req.body;
    // Encontramos el documento del cliente que está realizando la operación
    const clienteAModificar = await Cliente.findOne({ emailCliente });
    if(!clienteAModificar.isConfirmed){
        const error = new Error("Ocurrió un error.");
        return res.status(403).json({msg: error.message});
    }
    // Realizamos la operación
    try {
        const direccion = {
            numTarjeta: num,
            fechaVencimiento: fecha,
            cvv: c,
            titularTarjeta: titular
        };
        clienteAModificar.tarjetaCliente.push(direccion);
        await clienteAModificar.save();
        res.json({msg: "Cambio guardado exitosamente"});
    } catch (error) {
        console.log(error);
    }
}

/* Funciones relacionadas con productos */
// Valorar Producto
const valorarProducto = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }
    
    // Iniciamos valoración
    const { nombreProducto,
            valoracion } = req.body;

    // Revisamos que el producto exista
    const producto = await Producto.findOne({ nombreProducto });
    if(!producto){
        const error = new Error("Producto no registrado"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Revisamos que la valoración sea válida
    if(valoracion < 0 || valoracion > 5){
        const error = new Error("Ocurrió un error"); /* Mensaje sin mostrar */
        return res.status(403).json({msg: error.message});
    }

    // Revisamos que el cliente no haya valorado antes
    let usuarios = producto.usersVal;
    for (let index = 0; index < usuarios.length; index++) {
        if(cliente.emailCliente = usuarios[index]){
            const error = new Error("El cliente ya ha valorado este producto"); /* Mensaje faltante */
            return res.status(403).json({msg: error.message}); 
        }
    }

    // Realizamos valoración
    try {
        producto.valoracionesProducto.push(valoracion);
        let valArray = producto.valoracionesProducto;
        let promedioVal = 0;
        for (let index = 0; index < valArray.length; index++) {
            promedioVal = promedioVal + valArray[index];
        }
        promedioVal = promedioVal / valArray.length;
        producto.valoracionGlobal = promedioVal;
        producto.usersVal.push(cliente.emailCliente);
        await producto.save();

        res.json({ msg: "Valoración guardada" });
    } catch (error) {
        console.log(error);
    }
}

// Agregar Comentario
const agregarComentario = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    const nombre = cliente.usernameCliente;
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Iniciamos valoración
    const { nombreProducto,
            comentario} = req.body;

    // Revisamos que el producto exista
    const producto = await Producto.findOne({ nombreProducto });
    if(!producto){
        const error = new Error("Producto no registrado"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Revisamos que el cliente no haya valorado antes
    let usuarios = producto.usersComm;
    for (let index = 0; index < usuarios.length; index++) {
        if(cliente.emailCliente = usuarios[index]){
            const error = new Error("El cliente ya ha valorado este producto"); /* Mensaje faltante */
            return res.status(403).json({msg: error.message}); 
        }
    }

    // Realizamos comentario
    try {
        const comment = {
            commentUsername: nombre,
            commentContent: comentario
        };
        producto.comentariosProducto.push(comment);
        producto.usersComm.push(cliente.emailCliente);
        await producto.save();

        res.json({ msg: "Valoración guardada" });
    } catch (error) {
        console.log(error);
    }
}

// Ver flores
const verFlores = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Mostramos las flores para que el usuario pueda verlos
    try {
        // Especificamos que sólo se buscan flores
        const flores = { tipoProducto: "Flor" };

        const documentos = await Producto.find(flores);
        res.json({ fleurs: documentos });
    } catch (error) {
        console.log(error);
    }
}

// Ver peluches
const verPeluches = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Mostramos los peluches para que el usuario pueda verlos
    try {
        // Especificamos que sólo se buscan peluches
        const peluches = { tipoProducto: "Peluche" };

        const documentos = await Producto.find(peluches);
        res.json({ plushies: documentos });
    } catch (error) {
        console.log(error);
    }
}

/* Funciones relacionadas con el carrito de compras */
// Añadir producto al carrito
const agregarProductoCarrito = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    const { nombreProducto } = req.body;

    // Verificamos que el producto exista
    const productoPedido = await Producto.findOne({ nombreProducto });
    if(!productoPedido){
        const error = new Error("Producto no registrado");  /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Verificamos que el producto no se haya añadido previamente
    let productosCarrito = cliente.carritoCompras;
    for (let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto){
            const error = new Error("El producto ya se encuentra en el carrito");   /* Mensaje faltante */
            return res.status(400).json({ msg: error.message });
        }
    }

    // Verificamos que el producto no esté agotado
    if(productoPedido.cantidadInv <= 0){
        const error = new Error("Producto agotado");
        return res.status(400).json({ msg: error.message });
    }

    // Añadimos producto al carrito
    try {
        const carrito = {
            producto_C: productoPedido.nombreProducto,
            cantidad_C: 1,
            totalParcial_C: productoPedido.precioDescuento,
            copiaInv_C: productoPedido.cantidadInv
        }
        cliente.carritoCompras.push(carrito);
        await cliente.save();
        res.json({
            msg: "Se inicio el carrito"
        });
    } catch (error) {
        console.log(error);
    }
}

// Incrementar un producto en el carrito
const incrementarProductoCarrito = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    const { nombreProducto } = req.body;

    // Verificamos que el producto exista
    const productoPedido = await Producto.findOne({ nombreProducto });
    if(!productoPedido){
        const error = new Error("Producto no registrado");  /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Verificamos que el producto se encuentre en el carrito
    let productosCarrito = cliente.carritoCompras;
    let isPresent = false;
    for (let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto){
            isPresent = true;
        }
    }
    if(isPresent == false){
        const error = new Error("El producto no está en el carrito");  /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Verificamos que el producto pueda incrementarse
    for (let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto){
            let test = productosCarrito[index].cantidad_C + 1;
            if(test > productosCarrito[index].copiaInv_C || test > 49){
                const error = new Error("Has alcanzado el límite de artículos permitidos");  /* Mensaje faltante */
                return res.status(403).json({msg: error.message});
            }
            break;
        }
    }

    // Añadimos el mismo producto otra vez
    try {
        for (let index = 0; index < productosCarrito.length; index++) {
            console.log(index);
            console.log(productosCarrito[index].producto_C);
            console.log(nombreProducto);
            if(productosCarrito[index].producto_C == nombreProducto){
                productosCarrito[index].cantidad_C += 1;
                productosCarrito[index].totalParcial_C = productoPedido.precioDescuento * productosCarrito[index].cantidad_C;
                await cliente.save();
                break;
            }
        }
        res.json({ msg: "El producto se añadió al carrito" });
    } catch (error) {
        console.log(error);
    }
}

// Decrementar un producto en el carrito
const decrementarProductoCarrito = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    const { nombreProducto } = req.body;

    // Verificamos que el producto exista
    const productoPedido = await Producto.findOne({ nombreProducto });
    if(!productoPedido){
        const error = new Error("Producto no registrado");  /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Verificamos que el producto se encuentre en el carrito
    let productosCarrito = cliente.carritoCompras;
    let isPresent = false;
    for (let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto){
            isPresent = true;
        }
    }
    if(isPresent == false){
        const error = new Error("El producto no está en el carrito");  /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Verificamos que el producto pueda decrementarse
    for (let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto){
            let test = productosCarrito[index].cantidad_C - 1;
            if(test < 0){
                const error = new Error("El producto no puede decrementarse");  /* Mensaje faltante */
                return res.status(403).json({msg: error.message});
            }
        }
        break;
    }

    // Decrementamos el producto una vez
    try {
        for (let index = 0; index < productosCarrito.length; index++) {
            console.log(index);
            console.log(productosCarrito[index].producto_C);
            console.log(nombreProducto);
            if(productosCarrito[index].producto_C == nombreProducto){
                if(productosCarrito[index].cantidad_C > 1){
                    productosCarrito[index].cantidad_C -= 1;
                    productosCarrito[index].totalParcial_C = productoPedido.precioDescuento * productosCarrito[index].cantidad_C;
                    await cliente.save();
                    res.json({ msg: "El producto se removió del carrito" });
                    break;
                }
                else if(productosCarrito[index].cantidad_C <= 1){
                    productosCarrito[index].cantidad_C -= 1;
                    productosCarrito[index].totalParcial_C = productoPedido.precioDescuento * productosCarrito[index].cantidad_C;
                    let newCarrito = [];
                    let productosCarrito2 = [...productosCarrito]; 
                    for (let j = 0; j < productosCarrito2.length; j++) {
                        console.log(j);
                        console.log(productosCarrito2[j].producto_C);
                        console.log(nombreProducto);
                        if(productosCarrito2[j].cantidad_C !== 0){
                            newCarrito.push(productosCarrito2[j]);
                            console.log("Agregado");
                        }
                    }
                    console.log(newCarrito);
                    cliente.carritoCompras = newCarrito;
                    await cliente.save();
                    res.json({ msg: "El producto ha sido eliminado con éxito" });
                    break;
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// Decrementar un producto en el carrito
const eliminarProductoCarrito = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    const { nombreProducto } = req.body;

    // Verificamos que el producto exista
    const productoPedido = await Producto.findOne({ nombreProducto });
    if(!productoPedido){
        const error = new Error("Producto no registrado");  /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Verificamos que el producto se encuentre en el carrito
    let productosCarrito = cliente.carritoCompras;
    let isPresent = false;
    for (let index = 0; index < productosCarrito.length; index++) {
        if(productosCarrito[index].producto_C == nombreProducto){
            isPresent = true;
        }
    }
    if(isPresent == false){
        const error = new Error("El producto no está en el carrito");  /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Eliminamos el producto del carrito
    try {
        let newCarrito = [];
        for (let j = 0; j < productosCarrito.length; j++) {
            if(productosCarrito[j].producto_C !== nombreProducto){
                newCarrito.push(productosCarrito[j]);
                console.log("Agregado");
            }
        }
        cliente.carritoCompras = newCarrito;
        await cliente.save();
        res.json({ msg: "El producto ha sido eliminado con éxito" });
    } catch (error) {
        console.log(error);
    }
}

// Vaciar carrito de compras
const vaciarCarrito = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Vaciamos el carrito
    try {
        cliente.carritoCompras = [];
        cliente.save();
        res.json({ msg: "El carrito se ha vaciado" });
    } catch (error) {
        console.log(error);
    }
}

const visualizarCarrito = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Revisamos que el carrito no esté vacíos
    if(cliente.carritoCompras.length < 1){
        const error = new Error("Su carrito de compras está vacío"); /* Mensaje faltante */
        return res.status(404).json({msg: error.message});
    }

    // Mostramos el carrito
    try {
        res.json({ carrito: cliente.carritoCompras });
    } catch (error) {
        console.log(error);
    }
}

/* Funciones relacionadas con Pedidos */
// Ver historial de pedidos
const verHistorialPedidos = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Revisamos la longitud del arreglo de Pedidos
    if(cliente.pedidosCliente < 1){
        const error = new Error("Sin pedidos");
        return res.status(404).json({msg: error.message});
    }

    // Revisamos el historial de pedidos
    try {
        // Revisamos y buscamos la información de todos los pedidos del cliente
        const pedidos = cliente.pedidosCliente;
        let documentos = [];
        for (let index = 0; index < pedidos.length; index++) {
            let nombrePedido = pedidos[index];
            let pedido = await Pedido.findOne({ nombrePedido });
            documentos.push(pedido);
        }
        res.json({ pedidosCliente: documentos });
    } catch (error) {
        console.log(error);
    }
}

// Ver tarjetas registradas
const verTarjetas = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Validamos que el usuario tenga tarjetas registradas
    if(cliente.tarjetaCliente < 1){
        const error = new Error("Este usuario no tiene tarjetas registradas"); /* Mensaje faltante */
        return res.status(404).json({msg: error.message});
    }

    // Retornamos la información
    try {
        res.json(cliente.tarjetaCliente);
    } catch (error) {
        console.log(error);
    }
}

// Ver direcciones registradas
const verDirecciones = async (req, res) => {
    // Realizamos validación del cliente
    let emailCliente;
    emailCliente = req.cliente.emailCliente;
    const cliente = await Cliente.findOne({ emailCliente });
    if(!cliente){
        const error = new Error("Este usuario no ha iniciado sesión"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Validamos que el usuario tenga direcciones registradas
    if(cliente.direccionCliente < 1){
        const error = new Error("Este usuario no tiene direcciones registradas"); /* Mensaje faltante */
        return res.status(404).json({msg: error.message});
    }

    // Retornamos la información
    try {
        res.json(cliente.direccionCliente);
    } catch (error) {
        console.log(error);
    }
}

export { registroCliente,
    autenticacionCliente,
    confirmarCliente,
    olvidePassword,
    comprobarToken,
    nuevoPasswordRec,
    perfil,
    modificarPassword,
    modificarUsername,
    modificarTelefono,
    modificarDireccion,
    modificarTarjeta,
    valorarProducto,
    agregarComentario,
    verPeluches,
    verFlores,
    agregarProductoCarrito,
    incrementarProductoCarrito,
    decrementarProductoCarrito,
    eliminarProductoCarrito,
    vaciarCarrito,
    visualizarCarrito,
    verHistorialPedidos,
    verTarjetas,
    verDirecciones };
