
import prisma from "../config/prisma";
import { firestore } from "../config/firebase";
import { FieldValue } from "firebase-admin/firestore";

interface UpdateLastSeenInput {
  chatId: string;
  userId: string;
  messageId: string;
}

export async function updateLastSeen({
  chatId,
  userId,
  messageId,
}: UpdateLastSeenInput) {
  // 1. Verify the chat exists in PostgreSQL
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!chat) {
    throw new Error("CHAT_NOT_FOUND");
  }

  // 2. Verify the user belongs to this chat
  if (chat.userAId !== userId && chat.userBId !== userId) {
    throw new Error("USER_NOT_IN_CHAT");
  }

  // 3. Verify the message exists in this chat
  const messageRef = firestore
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc(messageId);

  const messageSnapshot = await messageRef.get();

  if (!messageSnapshot.exists) {
    throw new Error("MESSAGE_NOT_FOUND");
  }

  // 4. Save the user's last-seen message in Firestore
  const lastSeenRef = firestore
    .collection("chats")
    .doc(chatId)
    .collection("lastSeen")
    .doc(userId);

  await lastSeenRef.set({
    userId,
    messageId,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    chatId,
    userId,
    messageId,
    updated: true,
  };
}
