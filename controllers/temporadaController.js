import Temporada from "../modelos/temporadas.js";
import Producto from "../modelos/productos.js";

// Registro de temporadas en la base de datos
const registroTemporada = async (req, res) => {
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

        res.json({
            msg: "Temporada creada correctamente"
        });
    } catch (error) {
        console.log(error);
    }
};

export { registroTemporada };
