
import prisma from "../config/prisma";
import { firestore } from "../config/firebase";
import { FieldValue } from "firebase-admin/firestore";

interface SendMessageInput {
  chatId: string;
  senderId: string;
  text: string;
}

export async function sendMessage({
  chatId,
  senderId,
  text,
}: SendMessageInput) {
  // 1. Verify that the chat exists in PostgreSQL
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!chat) {
    throw new Error("CHAT_NOT_FOUND");
  }

  // 2. Verify that the sender belongs to this chat
  if (chat.userAId !== senderId && chat.userBId !== senderId) {
    throw new Error("SENDER_NOT_IN_CHAT");
  }

  // 3. Save the message in Firestore
  const messageRef = firestore
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc();

  const message = {
    messageId: messageRef.id,
    chatId,
    senderId,
    text: text.trim(),
    createdAt: FieldValue.serverTimestamp(),
    editedAt: null,
    deletedAt: null,
  };

  await messageRef.set(message);

  return {
    messageId: messageRef.id,
    chatId,
    senderId,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
}
