
import { firestore } from "../config/firebase";

interface GetMessagesInput {
  chatId: string;
  limit: number;
}

export async function getChatMessages({
  chatId,
  limit,
}: GetMessagesInput) {
  const messagesRef = firestore
    .collection("chats")
    .doc(chatId)
    .collection("messages");

  // Fetch newest messages first
  const snapshot = await messagesRef
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  // Return messages in chronological order
  const messages = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.();

      return {
        messageId: doc.id,
        chatId,
        senderId: data.senderId as string,
        text: data.text as string,
        createdAt: createdAt ? createdAt.toISOString() : null,
        editedAt: data.editedAt?.toDate?.()?.toISOString() ?? null,
        deletedAt: data.deletedAt?.toDate?.()?.toISOString() ?? null,
      };
    })
    .reverse();

  return messages;
}
