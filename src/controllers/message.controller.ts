
import type { Request, Response } from "express";
import { sendMessage } from "../services/message.service";

export async function sendMessageController(
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

    const { senderId, text } = req.body as {
      senderId?: unknown;
      text?: unknown;
    };

    if (typeof senderId !== "string" || !senderId.trim()) {
      res.status(400).json({
        success: false,
        message: "senderId is required",
      });
      return;
    }

    if (typeof text !== "string" || !text.trim()) {
      res.status(400).json({
        success: false,
        message: "Message text is required",
      });
      return;
    }

    if (text.length > 5000) {
      res.status(400).json({
        success: false,
        message: "Message cannot exceed 5000 characters",
      });
      return;
    }

    const message = await sendMessage({
      chatId,
      senderId: senderId.trim(),
      text,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CHAT_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Chat not found",
      });
      return;
    }

    if (error instanceof Error && error.message === "SENDER_NOT_IN_CHAT") {
      res.status(403).json({
        success: false,
        message: "Sender is not a participant in this chat",
      });
      return;
    }

    console.error("Send message error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
