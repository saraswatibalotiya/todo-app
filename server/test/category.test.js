const request = require("supertest");
const mysql = require("mysql2");
var faker = require("faker");
var app = require("../index");
var categoryModel = require("../models/category");
const getDbConfig = require("../dbConfig"); // Import the database configuration function
const conn = mysql.createConnection(getDbConfig()); // Use the function to get the configuration

const fakeCategoryData = {
  category_name: faker.name.findName(),
  display_name: faker.random.word(),
};

beforeAll(async () => {
  process.env.NODE_ENV = "test"; // Set the environment variable to 'test'
  await connection.connect();
});

afterAll(async () => {
  conn.promise().query("SET FOREIGN_KEY_CHECKS = 0");
  const [result] = await conn.promise().query("TRUNCATE TABLE category");
  conn.promise().query("SET FOREIGN_KEY_CHECKS = 1");
  conn.end();
});

// Add category of category table
describe("POST /categories", () => {
  test("POST /categories 201", async () => {
    const response = await request(app)
      .post("/api/category")
      .send(fakeCategoryData);

    expect(response.status).toBe(201);
    expect(response.body.message).toEqual("Category created Successfully!");
  });
  test("POST /categories 400", async () => {
    const fakeCategoryData = {
      category_name: faker.name.findName(),
      display_name: null,
    };
    const response = await request(app)
      .post("/api/category")
      .send(fakeCategoryData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Missing required fields",
    });
  });
  test("POST /categories 409", async () => {
    const response = await request(app)
      .post("/api/category")
      .send(fakeCategoryData);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: "Category exist",
    });
  });
  test("POST /categories 500", async () => {
    const fakeCategoryData = {
      category_name: faker.name.findName(),
      display_name: faker.name.findName(),
    };

    jest
      .spyOn(categoryModel, "addCategory")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app)
      .post("/api/category")
      .send(fakeCategoryData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Put /categories", () => {
  test("Put /categories 200", async () => {
    let fakeCategoryData = {
      category_name: faker.name.findName(),
      display_name: faker.random.word(),
    };
    fakeCategoryData = { ...fakeCategoryData, cat_id: 1 };

    const response = await request(app)
      .put("/api/category")
      .send(fakeCategoryData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Category updated Successfully!",
    });
  });
  test("Put /categories 500", async () => {
    const fakeCategoryData = {
      category_name: faker.name.findName(),
      display_name: faker.name.findName(),
    };

    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(categoryModel, "updateCategory")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app)
      .put("/api/category")
      .send(fakeCategoryData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Get /categories", () => {
  test("Get /categories 200", async () => {
    const data = {
      totalItem: 3,
      page: "1",
    };
    const response = await request(app).get("/api/category/").query(data);

    expect(response.status).toBe(200);
  });
  test("Get /categories 500", async () => {
    const data = {
      totalItem: 3,
      page: "1",
    };
    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(categoryModel, "getCategory")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });
    const response = await request(app).get("/api/category").query(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Get all /categories", () => {
  test("Get all /categories 200", async () => {
    const response = await request(app).get("/api/category/all");
    expect(response.status).toBe(200);
  });
  test("Get all /categories 500", async () => {
    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(categoryModel, "getCategoryNoPagination")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });
    const response = await request(app).get("/api/category/all");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Delete /categories", () => {
  test("Delete /categories 200", async () => {
    const data = {
      id: 1
    };
    const response = await request(app).delete("/api/category").send(data);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Category deleted successfully!",
    });
  });
  test("Delete /categories 404", async () => {
    let data = {
      id: 20,
    };
    const response = await request(app).delete("/api/category").send(data);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "No Such Category Exist",
    });
  });
  test("Delete /categories 500", async () => {
    let data = {
      id: null,
    };
    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(categoryModel, "deleteCategory")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app).delete("/api/category").send(data);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});
