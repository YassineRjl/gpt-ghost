import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserClass } from "../src/models/user";
import app from "../src/app";
import { User } from "@prisma/client";
import { ProductClass } from "../src/models/product";
import { makeid } from "../src/utils";

let buyer: User;
let buyerToken: string;

let seller: User;

beforeAll(async () => {
  buyer = await UserClass.create({
    username: makeid(5),
    password: bcrypt.hashSync("testpassword", 10),
    role: "buyer",
    deposit: 0,
  });

  seller = await UserClass.create({
    username: makeid(5),
    password: bcrypt.hashSync("testpassword", 10),
    role: "seller",
    deposit: 0,
  });

  buyerToken = jwt.sign({ id: buyer.id }, process.env.JWT_SECRET as string);
});

afterAll(async () => {
  await UserClass.deleteById(buyer.id);
  await UserClass.deleteById(seller.id);
});

test("Deposit endpoint", async () => {
  const res = await request(app)
    .patch("/user/deposit")
    .set("Authorization", `Bearer ${buyerToken}`)
    .send({ deposit: 50 });

  expect(res.body.deposit).toEqual(50);
});

test("Buy endpoint", async () => {
  const product = await ProductClass.create({
    productName: "Test Product",
    cost: 20,
    amountAvailable: 10,
    sellerId: seller.id,
  });

  const res = await request(app)
    .post("/purchase")
    .set("Authorization", `Bearer ${buyerToken}`)
    .send({ productId: product.id, amount: 2 });

  expect(res.body.totalSpent).toEqual(40);
  expect(res.body.productsPurchased.length).toEqual(1);
  expect(res.body.change).toEqual([10]);

  await ProductClass.delete(product.id);
});

test("User CRUD endpoint", async () => {
  // Create
  // was covered through the authentication endpoint

  // Read
  let localBuyer = await request(app)
    .get(`/user`)
    .set("Authorization", `Bearer ${buyerToken}`);

  expect(localBuyer.body.username).toEqual(buyer.username);

  // Update
  localBuyer = await request(app)
    .put(`/user`)
    .set("Authorization", `Bearer ${buyerToken}`)
    .send({ username: `updated_${buyer.username}` });

  expect(localBuyer.body.username).toEqual(`updated_${buyer.username}`);

  // Delete
  const res = await request(app)
    .delete(`/user/${buyer.id}`)
    .set("Authorization", `Bearer ${buyerToken}`);

  expect(res.statusCode).toEqual(200);
  expect(res.body.message).toEqual("User deleted.");
});
