
import prisma from "../config/prisma";

export async function createChat(userAId: string, userBId: string) {
  if (userAId === userBId) {
    throw new Error("A user cannot create a chat with themselves");
  }

  // Confirm both users exist.
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [userAId, userBId],
      },
    },
    select: {
      id: true,
    },
  });

  if (users.length !== 2) {
    throw new Error("One or both users do not exist");
  }

  // Normalize the pair so A-B and B-A represent the same chat.
  const [firstUserId, secondUserId] = [userAId, userBId].sort();

  const existingChat = await prisma.chat.findUnique({
    where: {
      userAId_userBId: {
        userAId: firstUserId,
        userBId: secondUserId,
      },
    },
  });

  if (existingChat) {
    return existingChat;
  }

  return prisma.chat.create({
    data: {
      userAId: firstUserId,
      userBId: secondUserId,
    },
  });
}
