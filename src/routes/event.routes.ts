import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import { admin, protect } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate-body.middleware";
import { createEventSchema } from "../schemas/event.schema";

const router = Router();

router.get("/", protect, admin, eventController.getAllEvents);
router.get("/:id", protect, admin, eventController.getEvent);
router.post(
    "/",
    protect,
    admin,
    validateBody(createEventSchema),
    eventController.createEvent,
);

export default router;
