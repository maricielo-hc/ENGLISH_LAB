
import express from "express";
import { 
    getLesson, 
    getReadingTopics,
    generateReadingQuestions
} from "../controllers/lesson.controllers.js";

const router = express.Router();

// Endpoint para solicitar una lección
router.get("/", getLesson);

router.get("/topics", getReadingTopics);

router.post("/reading-questions", generateReadingQuestions);

export default router;
