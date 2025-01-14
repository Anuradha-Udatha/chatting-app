import express from "express";
import {
    createSwipe,
    getUserSwipes,
    getLikesForEntity,
} from "../controllers/swipe";
import { authMiddleware } from "../middlewares/auth";

const swipeRouter = express.Router();

swipeRouter.post("/", authMiddleware, createSwipe);
swipeRouter.get("/", authMiddleware, getUserSwipes);
//swipeRouter.get("/:swipedOnId/likes", authMiddleware, getLikesForEntity);

export default swipeRouter;
