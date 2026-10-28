
import prisma from "../config/prisma";

export async function getUserChats(userId: string) {
  // 1. Verify that the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // 2. Find chats where the user is either participant
  const chats = await prisma.chat.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: {
        select: { id: true, name: true, email: true },
      },
      userB: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // 3. Return the other participant's details
  return chats.map((chat) => {
    const otherUser = chat.userAId === userId ? chat.userB : chat.userA;

    return {
      chatId: chat.id,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      otherUser,
    };
  });
}
