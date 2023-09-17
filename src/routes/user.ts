import express from "express";
import { allowBuyerOnly } from "../middlewares/access-control";
import { authenticate } from "../middlewares/auth";
import { UserClass } from "../models/user";
import { VALID_COINS } from "../utils";

const router = express.Router();

// get the currently authenticated user
router.get("/", authenticate, async (req, res) => {
  res.json(UserClass.omitPassword(req.user));
});

// update the authenticated user
router.put("/", authenticate, async (req, res) => {
  if (req.body.password) {
    // in production, this feature would run in its own endpoint after some sort of verification.
    // risky here, so we'll just return an error.
    return res.status(400).json({ message: "Password cannot be updated." });
  }
  // prevent updating the balance, we have a separate endpoint for that
  if (req.body.deposit >= 0) {
    return res.status(400).json({
      message: "Deposit cannot be updated. Please use /user/deposit endpoint",
    });
  }
  const user = await UserClass.update(req.user.id, req.body);
  res.json(UserClass.omitPassword(user));
});

// update the authenticated user's deposit
router.patch("/deposit", authenticate, allowBuyerOnly, async (req, res) => {
  if (!VALID_COINS.includes(req.body.deposit)) {
    return res.status(400).json({ message: "Invalid coin value." });
  }

  const user = await UserClass.update(req.user?.id, {
    deposit: req.body.deposit + req.user?.deposit,
  });
  res.json(UserClass.omitPassword(user));
});

// reset the authenticated user's deposit
router.patch("/reset", authenticate, allowBuyerOnly, async (req, res) => {
  const user = await UserClass.update(req.user?.id, { deposit: 0 });
  res.json(UserClass.omitPassword(user));
});

// delete the authenticated user
router.delete("/:id", authenticate, async (req, res) => {
  await UserClass.deleteById(req.params.id);
  res.json({ message: "User deleted." });
});

export default router;
