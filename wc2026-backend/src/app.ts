import express, { Application } from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import groupRoutes from "./routes/groups.routes";
import matchRoutes from "./routes/matches.routes";
import predictionRoutes from "./routes/predictions.routes";

import { errorMiddleware } from "./middlewares/error.middleware";

const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
// Como definiste '/api/matches' aquí, CUALQUIER ruta dentro de matchRoutes
// automáticamente tendrá '/api/matches' al principio de la URL.
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/predictions", predictionRoutes);

// Middleware para manejo de errores
app.use(errorMiddleware);

export default app;
