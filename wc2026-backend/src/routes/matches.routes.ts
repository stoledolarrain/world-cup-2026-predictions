import { Router } from "express";
import { MatchController } from "../controllers/match.controller";

const router = Router();

// Ruta para cargar partidos manualmente (Ejecutar una vez)
router.get("/seed", MatchController.seedMatches);

// Tus otras rutas existentes
router.get("/", MatchController.getMatches);
router.post("/", MatchController.createMatch);
router.put("/:matchId", MatchController.updateMatch);

export default router;
