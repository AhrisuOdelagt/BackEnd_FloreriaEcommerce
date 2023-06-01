import Temporada from "../modelos/temporadas.js";

// Registro de temporadas en la base de datos
const registroTemporada = async (req, res) => {
    // Evitar temporadas duplicadas sin lanzar errores en la consola
    const { nombreTemporada } = req.body;
    const existeTemporada = await Temporada.findOne({ nombreTemporada });

    // Validamos que la temporada no exista
    if(existeTemporada){
        const error = new Error("La temporada ya esta registrada");
        return res.status(400).json({ msg: error.message });
    }

    try {
        const temporada = new Temporada(req.body);
        await temporada.save();

        res.json({
            msg: "Temporada creada correctamente"
        });
    } catch (error) {
        console.log(error);
    }
};

export { registroTemporada };
