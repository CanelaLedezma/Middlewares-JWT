import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS fecha_actual");

    res.status(200).json({
      mensaje: "Conexión a PostgreSQL exitosa",
      fecha: result.rows[0].fecha_actual
    });
  } catch (error) {
    console.error("Error al conectar con PostgreSQL:", error);

    res.status(500).json({
      error: "No se pudo conectar con PostgreSQL"
    });
  }
});

export default router;