
import type { Request, Response } from "express";
import { createChat } from "../services/chat.service";

export async function createChatController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { userAId, userBId } = req.body as {
      userAId?: unknown;
      userBId?: unknown;
    };

    if (
      typeof userAId !== "string" ||
      typeof userBId !== "string" ||
      !userAId.trim() ||
      !userBId.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "userAId and userBId are required",
      });
      return;
    }

    const chat = await createChat(userAId, userBId);

    res.status(201).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create chat";

    if (message.includes("cannot create a chat with themselves")) {
      res.status(400).json({ success: false, message });
      return;
    }

    if (message.includes("users do not exist")) {
      res.status(404).json({ success: false, message });
      return;
    }

    console.error("Create chat error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
