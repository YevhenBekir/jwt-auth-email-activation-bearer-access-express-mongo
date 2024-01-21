import express from "express";
import {body, param} from "express-validator";

import AuthController from "../controllers/authController.js";

const router = express.Router();
const authController = new AuthController();

router.post("/register",
    body("email").isEmail(),
    body("name").notEmpty(),
    body("password").notEmpty().isLength({min: 8, max: 32}),
    await authController.register
);
router.get("/activate/:link",
    param("link").notEmpty(),
    await authController.activate
);
router.post("/login",
    body("email").notEmpty().isEmail(),
    body("password").notEmpty(),
    await authController.login
);
router.post("/logout", await authController.logout);
router.get("/refresh", await authController.refresh);

export default router;