import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import * as eventRecipientController from "../controllers/event-recipient.controller";

const router = Router({ mergeParams: true });

router.post("/event-recipients", protect, eventRecipientController.createEventRecipient);

export default router;
