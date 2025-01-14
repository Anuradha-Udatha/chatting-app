import { Router } from "express";
import { getUserFeed } from "../controllers/feed";
import { authMiddleware } from "../middlewares/auth";

const feedRouter = Router();

feedRouter.get("/", authMiddleware, getUserFeed);

export default feedRouter;
