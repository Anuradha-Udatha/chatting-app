import express from "express";
import {
    sendCollaborationRequest,
    respondToCollaborationRequest,
    getCollaborationRequests,
} from "../controllers/colaborationRequests";
import { authMiddleware} from "../middlewares/auth"; 

const collaborationRouter = express.Router({ mergeParams: true });
collaborationRouter.post(
    "/",
    authMiddleware,
    sendCollaborationRequest
);
collaborationRouter.put(
    "/",
    authMiddleware,
    respondToCollaborationRequest
);
collaborationRouter.get(
    "/",
    authMiddleware,
    getCollaborationRequests
);

export default collaborationRouter;
