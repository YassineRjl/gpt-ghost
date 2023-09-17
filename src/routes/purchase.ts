import express from "express";
import { allowBuyerOnly } from "../middlewares/access-control";
import { PurchaseClass } from "../models/purchase";
import { authenticate } from "../middlewares/auth";
import { ProductClass } from "../models/product";
import { VALID_COINS, prisma } from "../utils";

const router = express.Router();

// buy a product
router.post("/", authenticate, allowBuyerOnly, async (req, res) => {
  const { productId, amount } = req.body;
  const { id: userId, deposit } = req.user;

  const product = await ProductClass.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  if (product.amountAvailable < amount) {
    return res
      .status(400)
      .json({ message: "Product not available in the requested quantity." });
  }

  const totalCost = product.cost * amount;
  if (deposit < totalCost) {
    return res.status(400).json({ message: "Insufficient funds." });
  }

  // prepare for transaction since we're updating multiple sensitive tables
  const updatedProductAvailability = prisma.product.update({
    data: {
      amountAvailable: product.amountAvailable - amount,
    },
    where: {
      id: productId,
    },
  });

  const updatedUserDeposit = prisma.user.update({
    data: {
      deposit: 0, // reset deposit since the user finished the purchase. The rest will be returned as change.
    },
    where: {
      id: userId,
    },
  });

  const newPurchase = prisma.purchase.create({
    data: {
      userId,
      productId,
      amount,
      totalCost,
      productName: product.productName,
    },
  });

  await prisma.$transaction([
    updatedProductAvailability,
    updatedUserDeposit,
    newPurchase,
  ]);

  // Calculate change
  let remainingChange = deposit - totalCost;
  const change = [];

  for (const coin of VALID_COINS) {
    while (remainingChange >= coin) {
      change.push(coin);
      remainingChange -= coin;
    }
  }

  // now retrieve all purchases for this user
  const purchase = await PurchaseClass.findByUserId(userId);

  res.json({ totalSpent: totalCost, productsPurchased: purchase, change });
});

// get all purchases for a given buyer
router.get("/", authenticate, allowBuyerOnly, async (req, res) => {
  const productList = await PurchaseClass.findByUserId(req.user.id);
  if (!productList) {
    return res
      .status(404)
      .json({ message: "Failed to fetch purchase history" });
  }
  res.json(productList);
});

export default router;
