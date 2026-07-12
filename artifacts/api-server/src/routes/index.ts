import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiChatRouter from "./aiChat";
import checkUploadRouter from "./checkUpload";
import professionalRouter from "./professional";
import shablonRouter from "./shablon";
import consultationRouter from "./consultation";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiChatRouter);
router.use(checkUploadRouter);
router.use(professionalRouter);
router.use(shablonRouter);
router.use(consultationRouter);

export default router;
