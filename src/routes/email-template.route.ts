import { Router } from "express";
import { admin, protect } from "../middlewares/auth.middleware";
import * as emailTemplateController from "../controllers/email-template.controller";
import { validateBody } from "../middlewares/validate-body.middleware";
import { createEmailTemplateSchema } from "../schemas/email-template.schema";

const router = Router();

router.get("/", protect, admin, emailTemplateController.getAllEmailTemplates);
router.get("/:id", protect, admin, emailTemplateController.getEmailTemplate);
router.post(
    "/",
    protect,
    admin,
    validateBody(createEmailTemplateSchema),
    emailTemplateController.createEmailTemplate,
);

export default router;
