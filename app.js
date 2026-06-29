import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de Instagram funcionando");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});