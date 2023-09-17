import { User } from "@prisma/client";
import { prisma } from "../utils";

export class UserClass {
  static async create(data: Omit<User, "id">) {
    return prisma.user.create({
      data,
    });
  }

  static findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  static findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async update(id: string, data: Partial<Omit<User, "id">>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    // check if user exists
    if (!user) return;
    // remove children
    await Promise.all([
      await prisma.product.deleteMany({
        where: { sellerId: id },
      }),
      await prisma.purchase.deleteMany({
        where: { userId: id },
      }),
      await prisma.session.deleteMany({
        where: { userId: id },
      }),
    ]);

    return prisma.user.delete({
      where: { id },
    });
  }

  static omitPassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
