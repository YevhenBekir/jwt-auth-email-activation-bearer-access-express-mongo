import express from "express";

import UsersController from "../controllers/usersController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
const usersController = new UsersController();

router.get("/get-users", authMiddleware, await usersController.getUsers);

export default router;