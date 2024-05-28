import { prisma } from "~/lib/prisma";

export const onGetUser = async ({ id }: { id: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return user;
  } catch (error) {}
};
