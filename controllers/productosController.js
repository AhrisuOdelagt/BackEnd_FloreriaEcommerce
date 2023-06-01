import Producto from "../modelos/productos.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";

//Registro de productos en la base de datos
const registroProducto = async(req, res) => {
    //Evitar productos duplicados
    const { nombreProducto } = req.body;
    const existeProducto = await Producto.findOne({ nombreProducto });

    //Validamos que el producto no exista
    if(existeProducto){
        const error = new Error("El producto ya existe");
        return res.status(400).json({ msg: error.message});
    }

    try{
        const producto = new Producto(req.body);
        await producto.save();

        //Regresamos confirmacion
        res.json({
            msg: "Producto agregado a la base de datos."
        })
    }
    catch(error){
        console.log(error);
    }
};

const modificarProducto = async (req, res) => {
    const{nombreProducto,
        descrProducto,
        precioProducto,
        cantidadInv,
        descuentoProducto,
        imagenProducto,
        categoriaProducto,
        temporadaProducto} = req.body;
    
    console.log(nombreProducto);
    console.log(descrProducto);
    console.log(precioProducto);
    console.log(cantidadInv);
    
    const productoAModificar = await Producto.findOne({nombreProducto});

    console.log(productoAModificar);
    //Se confirma que exista el producto
    if(!productoAModificar){
        const error = new Error("Producto no encontrado.");
        return res.status(403).json({msg: error.message});
    }
    //Se actualiza la informacion
    try{
        productoAModificar.descrProducto = descrProducto;
        productoAModificar.precioProducto = precioProducto;
        productoAModificar.cantidadInv = cantidadInv;
        productoAModificar.descuentoProducto = descuentoProducto;
        productoAModificar.imagenProducto = imagenProducto;
        productoAModificar.categoriaProducto = categoriaProducto;
        productoAModificar.temporadaProducto = temporadaProducto;

        productoAModificar.save();

        res.json({msg: "Producto actualizado exitosamente."})
    }
    catch(error){
        console.log(error);
    }
}

const verProducto = async(req, res) => {
    const { producto } = req;
    res.json(producto);
}

const eliminarProducto = async(req, res) => {
    const {nombreProducto} = req.body;

    const producto = await Producto.findOne(nombreProducto);

    if(!producto){
        const error = new Error("Ocurrio un error");
        return res.status(403).json({msg: error.message});
    }

    try {
        await producto.deleteOne();
        res.json({msg: "Producto eliminado"});
    } catch (error) {
        console.log(error)
    }
}

export{registroProducto,
    verProducto,
    modificarProducto,
    eliminarProducto
};