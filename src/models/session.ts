import { Session } from "@prisma/client";
import { prisma } from "../utils";

export class SessionClass {
  static create(data: Pick<Session, "userId" | "token">) {
    return prisma.session.create({ data });
  }

  static findByActiveSessions(userId: string) {
    return prisma.session.findMany({ where: { userId, isActive: true } });
  }

  static logoutSession(userId: string) {
    return prisma.session.updateMany({
      where: { userId },
      data: { isActive: false },
    });
  }
}
