
import prisma from "../config/prisma";
import { firestore } from "../config/firebase";
import { FieldValue } from "firebase-admin/firestore";

interface MarkMessageReadInput {
  chatId: string;
  messageId: string;
  userId: string;
}

export async function markMessageRead({
  chatId,
  messageId,
  userId,
}: MarkMessageReadInput) {
  // 1. Verify the chat exists in PostgreSQL
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!chat) {
    throw new Error("CHAT_NOT_FOUND");
  }

  // 2. Verify that the user belongs to this chat
  if (chat.userAId !== userId && chat.userBId !== userId) {
    throw new Error("USER_NOT_IN_CHAT");
  }

  // 3. Find the message in Firestore
  const messageRef = firestore
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc(messageId);

  const messageSnapshot = await messageRef.get();

  if (!messageSnapshot.exists) {
    throw new Error("MESSAGE_NOT_FOUND");
  }

  // 4. Save the reader's ID without duplicating existing receipts
  await messageRef.update({
    readBy: FieldValue.arrayUnion(userId),
  });

  return {
    chatId,
    messageId,
    userId,
    read: true,
  };
}
