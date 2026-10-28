
import type { Request, Response } from "express";
import { getUserChats } from "../services/user-chats.service";

export async function getUserChatsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.params.userId;

    if (typeof userId !== "string" || !userId.trim()) {
      res.status(400).json({
        success: false,
        message: "Valid userId is required",
      });
      return;
    }

    const chats = await getUserChats(userId.trim());

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    console.error("Get user chats error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
