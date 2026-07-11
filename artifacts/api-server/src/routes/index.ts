import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiChatRouter from "./aiChat";
import checkUploadRouter from "./checkUpload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiChatRouter);
router.use(checkUploadRouter);

export default router;
