import { Router } from "express";
import * as emailTemplateController from "../controllers/email-template.controller";
import { admin, protect } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate-body.middleware";
import {
    createEmailTemplateSchema,
    updateEmailTemplateSchema,
} from "../schemas/email-template.schema";

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
router.patch(
    "/:id",
    protect,
    admin,
    validateBody(updateEmailTemplateSchema),
    emailTemplateController.updateEmailTemplate,
);

export default router;
