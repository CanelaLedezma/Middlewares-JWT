import bcrypt from "bcrypt";
import authService from "../services/authService.js";

const register = async (req, res) => {
  try {
    const {
      nombre_usuario,
      nombre_completo,
      email,
      password,
      foto_perfil,
      biografia
    } = req.body;

    if (!nombre_usuario || !nombre_completo || !email || !password) {
      return res.status(400).json({
        error: "Faltan datos obligatorios"
      });
    }

    // Busco en la base si ya existe un usuario con ese email o ese nombre_usuario.

    const usuarioExistente = await authService.getUserByEmailOrUsername(email, nombre_usuario);


if (usuarioExistente) {
  return res.status(409).json({
    error: "Ya existe un usuario con ese email o nombre de usuario"
  });
}

const passwordEncriptada = await bcrypt.hash(password, 10);

    const newUser = await authService.createUser({
      nombre_usuario,
      nombre_completo,
      email,
      password: passwordEncriptada,
      foto_perfil,
      biografia
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: newUser
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      error: "No se pudo registrar el usuario"
    });
  }
};

export { register };