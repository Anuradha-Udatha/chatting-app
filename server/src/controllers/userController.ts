import express from "express";
import { googleSignup } from "../services/user";

const authRouter = express.Router();

authRouter.post("/google-auth",googleSignup);

export default authRouter;
