import { Router } from "express";
import { admin, protect } from "../middlewares/auth.middleware";
import * as emailTemplateController from "../controllers/email-template.controller";
import { validateBody } from "../middlewares/validate-body.middleware";
import { createEmailTemplateSchema } from "../schemas/email-template.schema";

const router = Router();

router.post(
    "/",
    protect,
    admin,
    validateBody(createEmailTemplateSchema),
    emailTemplateController.create,
);

export default router;
