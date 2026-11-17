
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Configuraciones
app.use(cors());
app.use(express.json());
app.use("/api/lessons", lessonRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Ruta inicial para comprobar el servidor
app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "English Lab API is running!"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`English Lab API running on port ${PORT}`);
});

import lessonRoutes from "./routes/lesson.routes.js";