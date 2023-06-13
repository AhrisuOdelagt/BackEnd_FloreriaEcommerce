import express from "express";
import { registroCliente,
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
    verDirecciones } from "../controllers/clienteController.js";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();

// Creación de usuario e inicio de sesión
router.post("/", registroCliente);
router.post("/iniSes", autenticacionCliente);
router.get("/confirmar/:tokenCliente", confirmarCliente);
// Olvidé contraseña
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:tokenCliente", comprobarToken);
router.post("/olvide-password/:tokenCliente", nuevoPasswordRec);
router.get("/perfil", checkAuth, perfil);
// Modificar Datos Personales
router.post("/modificar/password", checkAuth, modificarPassword);
router.post("/modificar/username", checkAuth, modificarUsername);
router.post("/modificar/telefono", checkAuth, modificarTelefono);
router.post("/modificar/direccion", checkAuth, modificarDireccion);
router.post("/modificar/tarjeta", checkAuth, modificarTarjeta);
// Interacción con productos
router.post("/interaccionPro/valorar", checkAuth, valorarProducto);
router.post("/interaccionPro/comentar", checkAuth, agregarComentario);
router.get("/interaccionPro/verFlores", checkAuth, verFlores);
router.get("/interaccionPro/verPeluches", checkAuth, verPeluches);
// Interacción con carrito
router.post("/carrito/agregarProducto", checkAuth, agregarProductoCarrito);
router.post("/carrito/incrementarProducto", checkAuth, incrementarProductoCarrito);
router.post("/carrito/decrementarProducto", checkAuth, decrementarProductoCarrito);
router.post("/carrito/eliminarProducto", checkAuth, eliminarProductoCarrito);
router.get("/carrito/vaciarCarrito", checkAuth, vaciarCarrito);
router.get("/carrito/visualizarCarrito", checkAuth, visualizarCarrito);
// Interacción con pedidos
router.get("/interaccionPed/visualizar", checkAuth, verHistorialPedidos);
router.get("/interaccionPed/verTarjetas", checkAuth, verTarjetas);
router.get("/interaccionPed/verDirecciones", checkAuth, verDirecciones);

export default router;
