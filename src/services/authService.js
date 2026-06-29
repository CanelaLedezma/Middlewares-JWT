import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authService from "../services/authService.js";

// Controller de autenticación: recibe req, llama al service y responde con res.

const register = async (req, res) => {
  try {
    // Tomo los datos enviados en el body.
    const nombre_usuario = req.body.nombre_usuario;
    const nombre_completo = req.body.nombre_completo;
    const email = req.body.email;
    const password = req.body.password;
    const foto_perfil = req.body.foto_perfil;
    const biografia = req.body.biografia;

    // Valido que estén los datos obligatorios.
    if (!nombre_usuario || !nombre_completo || !email || !password) {
      return res.status(400).json({
        error: "Faltan datos obligatorios"
      });
    }

    // Busco si ya existe un usuario con ese email o nombre de usuario.
    const usuarioExistente = await authService.getUserByEmailOrUsername(email, nombre_usuario);

    // Si ya existe, corto la request con error de conflicto.
    if (usuarioExistente) {
      return res.status(409).json({
        error: "Ya existe un usuario con ese email o nombre de usuario"
      });
    }

    // Encripto la contraseña antes de guardarla.
    const passwordEncriptada = await bcrypt.hash(password, 10);

    // Armo el usuario que se va a guardar en la base.
    const usuarioParaCrear = {
      nombre_usuario: nombre_usuario,
      nombre_completo: nombre_completo,
      email: email,
      password: passwordEncriptada,
      foto_perfil: foto_perfil,
      biografia: biografia
    };

    // Le pido al service que inserte el usuario en PostgreSQL.
    const usuarioCreado = await authService.createUser(usuarioParaCrear);

    // Devuelvo el usuario creado sin la contraseña.
    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: usuarioCreado
    });
  } catch (error) {
    // Muestro el error real en la terminal.
    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      error: "No se pudo registrar el usuario"
    });
  }
};

const login = async (req, res) => {
  try {
    // Tomo email y contraseña enviados en el body.
    const email = req.body.email;
    const password = req.body.password;

    // Valido que estén los datos necesarios para iniciar sesión.
    if (!email || !password) {
      return res.status(400).json({
        error: "Faltan email o contraseña"
      });
    }

    // Busco al usuario por email en la base.
    const usuarioEncontrado = await authService.getUserByEmail(email);

    // Si no existe, las credenciales son inválidas.
    if (!usuarioEncontrado) {
      return res.status(401).json({
        error: "Credenciales inválidas"
      });
    }

    // Comparo la contraseña enviada con la contraseña encriptada.
    const passwordCorrecta = await bcrypt.compare(password, usuarioEncontrado.password);

    // Si la contraseña no coincide, no dejo iniciar sesión.
    if (!passwordCorrecta) {
      return res.status(401).json({
        error: "Credenciales inválidas"
      });
    }

    // Guardo en el token solo datos necesarios, nunca la contraseña.
    const datosDelToken = {
      id: usuarioEncontrado.id,
      nombre_usuario: usuarioEncontrado.nombre_usuario,
      email: usuarioEncontrado.email
    };

    // Creo un JWT firmado con la clave secreta del .env.
    const token = jwt.sign(
      datosDelToken,
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Devuelvo el token y los datos públicos del usuario.
    return res.status(200).json({
      mensaje: "Login exitoso",
      token: token,
      usuario: {
        id: usuarioEncontrado.id,
        nombre_usuario: usuarioEncontrado.nombre_usuario,
        nombre_completo: usuarioEncontrado.nombre_completo,
        email: usuarioEncontrado.email,
        foto_perfil: usuarioEncontrado.foto_perfil,
        biografia: usuarioEncontrado.biografia
      }
    });
  } catch (error) {
    // Muestro el error real en la terminal.
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      error: "No se pudo iniciar sesión"
    });
  }
};

// Exporto las funciones para usarlas en authRoutes.js.
export { register, login };