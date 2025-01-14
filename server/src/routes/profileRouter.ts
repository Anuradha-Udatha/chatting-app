import express from "express";
import { authMiddleware } from "../middlewares/auth";
import userProfileController from "../controllers/profile";

const profileRouter = express.Router();

profileRouter.post("/", authMiddleware,userProfileController.createUserProfile);
profileRouter.get("/:id", authMiddleware,userProfileController.getUserProfile);
profileRouter.put("/:id", authMiddleware, userProfileController.updateUserProfile);

export default profileRouter;
