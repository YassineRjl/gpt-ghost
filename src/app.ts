import express from "express";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import userRoutes from "./routes/user";
import purchaseRoutes from "./routes/purchase";
import cors from "cors";
import { corsOptionsDelegate } from "./utils";

const app = express();

// cors
app.use(cors(corsOptionsDelegate));

// parser
app.use(express.json());

// routes
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/auth", authRoutes);

export default app;
