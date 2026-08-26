import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import { admin, protect } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate-body.middleware";
import { createEventSchema, updateEventSchema } from "../schemas/event.schema";

const router = Router();

router.get("/", protect, eventController.getAllEvents);
router.get("/:id", protect, eventController.getEvent);
router.post(
    "/",
    protect,
    admin,
    validateBody(createEventSchema),
    eventController.createEvent,
);
router.patch(
    "/:id",
    protect,
    admin,
    validateBody(updateEventSchema),
    eventController.updateEvent,
);
router.delete("/:id", protect, admin, eventController.deleteEvent);

export default router;
