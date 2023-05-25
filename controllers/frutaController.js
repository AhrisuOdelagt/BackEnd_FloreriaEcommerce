import Fruta from "../modelos/fruta.js";

// Crear fruta
const crearFruta = async (req, res) => {
    const { nombreFruta } = req.body;
    const existeFruta = await Fruta.findOne({ nombreFruta });

    // Verificar si existe o no una fruta con ese nombre
    if(existeFruta){
        const error = new Error("La fruta ya existe.");
        return res.status(400).json({ msg: error.message });
    }

    // Crear la fruta dentro de la base de datos
    try {
        const fruta = new Fruta(req.body);
        await fruta.save();

        res.json({
            msg: "Fruta creada correctamente."
        });
    } catch (error) {
        console.log(error);
    }
}

export { crearFruta };
