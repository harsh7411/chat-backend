
import type { Request, Response } from "express";
import { updateLastSeen } from "../services/lastseen.service";

export async function updateLastSeenController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const chatId = req.params.chatId;

    if (typeof chatId !== "string" || !chatId.trim()) {
      res.status(400).json({
        success: false,
        message: "Valid chatId is required",
      });
      return;
    }

    const { userId, messageId } = req.body as {
      userId?: unknown;
      messageId?: unknown;
    };

    if (typeof userId !== "string" || !userId.trim()) {
      res.status(400).json({
        success: false,
        message: "userId is required",
      });
      return;
    }

    if (typeof messageId !== "string" || !messageId.trim()) {
      res.status(400).json({
        success: false,
        message: "messageId is required",
      });
      return;
    }

    const result = await updateLastSeen({
      chatId,
      userId: userId.trim(),
      messageId: messageId.trim(),
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

    console.error("Update last seen error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
