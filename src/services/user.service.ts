
import prisma from "../config/prisma";

export async function createTestUser(name: string, email: string) {
  return prisma.user.create({
    data: {
      name,
      email,
    },
  });
}
