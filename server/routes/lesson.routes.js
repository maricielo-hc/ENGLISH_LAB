
import express from "express";
import { 
    getLesson, 
    getReadingTopics
} from "../controllers/lesson.controllers.js";

const router = express.Router();

// Endpoint para solicitar una lección
router.get("/", getLesson);

router.get("/topics", getReadingTopics);

export default router;
