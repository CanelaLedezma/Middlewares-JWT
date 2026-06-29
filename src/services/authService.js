import pool from "../config/db.js";

const getUserByEmailOrUsername = async (email, nombre_usuario) => {
  const query = `
    SELECT id, nombre_usuario, email
    FROM usuarios
    WHERE email = $1 OR nombre_usuario = $2
  `;

  const result = await pool.query(query, [email, nombre_usuario]);
  return result.rows[0];
};

const createUser = async (user) => {
  const query = `
    INSERT INTO usuarios (
      nombre_usuario,
      nombre_completo,
      email,
      password,
      foto_perfil,
      biografia
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, nombre_usuario, nombre_completo, email, foto_perfil, biografia
  `;

  const values = [
    user.nombre_usuario,
    user.nombre_completo,
    user.email,
    user.password,
    user.foto_perfil || null,
    user.biografia || null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export default {
  getUserByEmailOrUsername,
  createUser
};