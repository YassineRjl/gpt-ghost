import { Product } from "@prisma/client";
import { prisma } from "../utils";

export class ProductClass {
  static async create(data: Omit<Product, "id">) {
    return prisma.product.create({ data });
  }

  static async findById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  }

  static async findAll() {
    return (await prisma.product.findMany()).sort((a, b) => a.id - b.id);
  }

  static async update(id: number, data: Partial<Omit<Product, "id">>) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.product.delete({ where: { id } });
  }
}
