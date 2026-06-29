import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// Middlewares base
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API de Instagram funcionando");
});

// Levanto el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});