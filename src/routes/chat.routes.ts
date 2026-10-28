
import { Router } from "express";
import { createChatController } from "../controllers/chat.controller";
import { sendMessageController } from "../controllers/message.controller";
import { getChatMessagesController } from "../controllers/message-list.controller";
import { markMessageReadController } from "../controllers/message-read.controller";
import { updateLastSeenController } from "../controllers/lastseen.controller";

const router = Router();

router.post("/create", createChatController);
router.post("/:chatId/message/send", sendMessageController);
router.get("/:chatId/messages", getChatMessagesController);

router.post(
  "/:chatId/message/:messageId/read",
  markMessageReadController
);

router.post("/:chatId/lastseen", updateLastSeenController);

export default router;
