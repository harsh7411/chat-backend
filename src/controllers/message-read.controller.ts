
import type { Request, Response } from "express";
import { markMessageRead } from "../services/message-read.service";

export async function markMessageReadController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { chatId, messageId } = req.params;

    if (
      typeof chatId !== "string" ||
      !chatId.trim() ||
      typeof messageId !== "string" ||
      !messageId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Valid chatId and messageId are required",
      });
      return;
    }

    const { userId } = req.body as { userId?: unknown };

    if (typeof userId !== "string" || !userId.trim()) {
      res.status(400).json({
        success: false,
        message: "userId is required",
      });
      return;
    }

    const result = await markMessageRead({
      chatId,
      messageId,
      userId: userId.trim(),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "CHAT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Chat not found",
        });
        return;
      }

      if (error.message === "USER_NOT_IN_CHAT") {
        res.status(403).json({
          success: false,
          message: "User is not a participant in this chat",
        });
        return;
      }

      if (error.message === "MESSAGE_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
        return;
      }
    }

    console.error("Mark message read error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
