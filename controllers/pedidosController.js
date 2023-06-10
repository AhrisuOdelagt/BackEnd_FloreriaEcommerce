import Pedido from "../modelos/temporadas.js";
import Cliente from "../modelos/cliente.js";
import Producto from "../modelos/productos.js";

// Añadir producto al carrito   ¡¡Función relocalizada en Cliente (Eliminar ésta después)!!
const agregarProducto = async (req, res) => {
    
    const { nombreProducto } = req.body;

    // Verificamos que el producto no se haya añadido previamente
    let producto = nombreProducto
    const existeProducto_Pedido = Pedido.findOne({ "carritoCompras.producto": producto });
    if(existeProducto_Pedido){
        const error = new Error("El producto ya se encuentra en el carrito");   /* Mensaje faltante */
        return res.status(400).json({ msg: error.message });
    }

    // Verificamos que el producto no esté agotado
    const productoPedido = Producto.findOne({ nombreProducto });
    if(productoPedido.cantidadInv <= 0){
        const error = new Error("Producto agotado");   /* Mensaje faltante */
        return res.status(400).json({ msg: error.message });
    }

    // Añadimos producto al carrito
    try {
        const pedido = new Pedido();
        const carrito = {
            producto: productoPedido.nombreProducto,
            cantidad: 1,
            totalParcial: productoPedido.precioDescuento,
            copiaInv: productoPedido.cantidadInv
        }
        pedido.carritoCompras.push(carrito);
        await pedido.save();
        cliente.pedidosCliente.push(pedido._id);
        await cliente.save();
        res.json({
            msg: "Se inicio el carrito"
        });
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarProducto
}