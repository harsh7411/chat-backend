
import { Router } from "express";
import { createTestUserController } from "../controllers/user.controller";
import { getUserChatsController } from "../controllers/user-chats.controller";

const router = Router();

router.post("/test", createTestUserController);
router.get("/:userId/chats", getUserChatsController);

export default router;
