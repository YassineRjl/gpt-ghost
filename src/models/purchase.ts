import { Purchase } from "@prisma/client";
import { prisma } from "../utils";

export class PurchaseClass {
  static async create(data: Omit<Purchase, "id">) {
    return prisma.purchase.create({ data });
  }

  static async findById(id: string) {
    return prisma.purchase.findUnique({ where: { id } });
  }

  static async findByUserId(userId: string) {
    return prisma.purchase.findMany({ where: { userId } });
  }
}
