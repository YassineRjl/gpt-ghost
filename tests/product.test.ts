import { Product, User } from "@prisma/client";
import { ProductClass } from "../src/models/product";
import { UserClass } from "../src/models/user";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";
import bcrypt from "bcrypt";
import { makeid } from "../src/utils";

let token: string;
let user: User;
let product: Product;

beforeAll(async () => {
  user = await UserClass.create({
    username: makeid(5),
    password: bcrypt.hashSync("testpassword", 10),
    role: "seller",
    deposit: 0,
  });

  product = await ProductClass.create({
    productName: "testproduct",
    cost: 50,
    amountAvailable: 10,
    sellerId: user.id,
  });

  token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
});

afterAll(async () => {
  await UserClass.deleteById(user.id);
});

test("Product GET endpoint", async () => {
  const res = await request(app)
    .get(`/product/${product.id}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.body.productName).toEqual("testproduct");
});

test("Product POST endpoint", async () => {
  const res = await request(app)
    .post(`/product`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      productName: "newproduct",
      cost: 100,
      amountAvailable: 5,
    });

  expect(res.body.productName).toEqual("newproduct");
  expect(res.body.cost).toEqual(100);
  expect(res.body.amountAvailable).toEqual(5);

  // Clean up the created product
  await ProductClass.delete(res.body.id);
});

test("Product PATCH endpoint", async () => {
  const res = await request(app)
    .patch(`/product/${product.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      productName: "updatedproduct",
    });

  expect(res.body.productName).toEqual("updatedproduct");
});

test("Product DELETE endpoint", async () => {
  const newProduct = await ProductClass.create({
    productName: "producttodelete",
    cost: 50,
    amountAvailable: 10,
    sellerId: user.id,
  });

  const res = await request(app)
    .delete(`/product/${newProduct.id}`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.body.message).toEqual("Product deleted.");
});
