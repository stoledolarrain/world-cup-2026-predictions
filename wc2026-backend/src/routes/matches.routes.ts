import { Router } from "express";
import { MatchController } from "../controllers/match.controller";

const router = Router();

router.get("/seed", MatchController.seedMatches);

router.get("/", MatchController.getMatches);
router.post("/", MatchController.createMatch);
router.put("/:matchId", MatchController.updateMatch);

export default router;
