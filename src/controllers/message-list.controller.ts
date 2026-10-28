
import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { getChatMessages } from "../services/message-list.service";

export async function getChatMessagesController(
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

    const rawLimit = req.query.limit;
    let limit = 50;

    if (rawLimit !== undefined) {
      const parsedLimit = Number(rawLimit);

      if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > 100
      ) {
        res.status(400).json({
          success: false,
          message: "limit must be an integer between 1 and 100",
        });
        return;
      }

      limit = parsedLimit;
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { id: true },
    });

    if (!chat) {
      res.status(404).json({
        success: false,
        message: "Chat not found",
      });
      return;
    }

    const messages = await getChatMessages({ chatId, limit });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get chat messages error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
