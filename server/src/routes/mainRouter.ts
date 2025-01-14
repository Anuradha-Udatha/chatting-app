import express from "express";
import userRouter from "./userRouter";
import projectRouter from "./projectRouter";
import swipeRouter from "./swipeRouter";
import feedRouter from "./feedRouter";
import profileRouter from "./profileRouter";
import collaborationRouter from "./collaborationrequestsrouter";

const mainRouter = express.Router();

mainRouter.use("/user",userRouter);
mainRouter.use("/user/user-profile",profileRouter);
mainRouter.use("/projects",projectRouter);
mainRouter.use("/swipe",swipeRouter);
mainRouter.use("/feed",feedRouter);
mainRouter.use("/projects/:projectId/collaboration-requests",collaborationRouter)

export default mainRouter;