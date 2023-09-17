import express from "express";
import { allowSellerOnly } from "../middlewares/access-control";
import { authenticate } from "../middlewares/auth";
import { validateProduct } from "../middlewares/validation";
import { ProductClass } from "../models/product";

const router = express.Router();

// create a new product for a given seller
router.post(
  "/",
  authenticate,
  allowSellerOnly,
  validateProduct,
  async (req, res) => {
    const sellerId = req.user.id;
    const product = await ProductClass.create({ ...req.body, sellerId });

    if (!product) {
      return res.status(400).json({ message: "Product could not be created." });
    }

    res.json(product);
  }
);

// get a specific product
router.get("/:id", async (req, res) => {
  const product = await ProductClass.findById(Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }
  res.json(product);
});

// get all products in the database
router.get("/", async (_, res) => {
  const productList = await ProductClass.findAll();
  if (!productList) {
    return res.status(404).json({ message: "Products not found." });
  }
  res.json(productList);
});

// update a specific product
router.patch("/:id", authenticate, allowSellerOnly, async (req, res) => {
  const product = await ProductClass.findById(Number(req.params.id));

  if (product?.sellerId !== req.user?.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this product." });
  }

  const updatedProduct = await ProductClass.update(
    Number(req.params.id),
    req.body
  );
  res.json(updatedProduct);
});

// delete a specific product
router.delete("/:id", authenticate, allowSellerOnly, async (req, res) => {
  const product = await ProductClass.findById(Number(req.params.id));

  if (product?.sellerId !== req.user?.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this product." });
  }

  await ProductClass.delete(Number(req.params.id));
  res.json({ message: "Product deleted." });
});

export default router;
