import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate-body.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", protect, authController.getMe);

export default router;
