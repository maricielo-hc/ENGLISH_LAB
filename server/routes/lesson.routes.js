
import express from "express";
import { getLesson } from "../controllers/lesson.controllers.js";

const router = express.Router();

// Endpoint para solicitar una lección
router.get("/", getLesson);

export default router;
