
import type { Request, Response } from "express";
import { createTestUser } from "../services/user.service";

export async function createTestUserController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { name, email } = req.body as {
      name?: unknown;
      email?: unknown;
    };

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      res.status(400).json({
        success: false,
        message: "Valid name and email are required",
      });
      return;
    }

    const user = await createTestUser(name.trim(), email.trim().toLowerCase());

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Test user creation error:", error);

    res.status(500).json({
      success: false,
      message: "Could not create test user. Email may already exist.",
    });
  }
}
