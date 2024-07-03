const request = require("supertest");
const mysql = require("mysql2");
var faker = require("faker");
var app = require("../index");
var userModel = require("../models/userProfile");
const getDbConfig = require("../dbConfig"); // Import the database configuration function
const conn = mysql.createConnection(getDbConfig()); // Use the function to get the configuration

const userData = {
  username: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

beforeAll(async () => {
  process.env.NODE_ENV = "test"; // Set the environment variable to 'test'
});

afterAll(async () => {
    conn.promise().query("SET FOREIGN_KEY_CHECKS = 0");
    const [result] = await conn.promise().query("TRUNCATE TABLE user");
    conn.promise().query("SET FOREIGN_KEY_CHECKS = 1");
    conn.end();
  
});

// Add user of user table
describe("POST /user", () => {
  test("POST /user 201", async () => {
    const response = await request(app).post("/api/user").send(userData);
    expect(response.status).toBe(201);
    expect(response.body.message).toEqual("Registeration done successfully!");
  });
  test("POST /user 409", async () => {
    const response = await request(app).post("/api/user").send(userData);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: "Username already exist",
    });
  });
  test("POST /user 500", async () => {
    jest
      .spyOn(userModel, "createUser")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app).post("/api/user").send(userData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Get /user", () => {
  test("Get /user 200", async () => {
    const data = {
      username: userData.username,
    };
    const response = await request(app).get("/api/user/").query(data);

    expect(response.status).toBe(200);
  });
  test("Get /user 404", async () => {
    const data = {
      username: 'test',
    };
    const response = await request(app).get("/api/user/").query(data);

    expect(response.status).toBe(404);
  });
  test("Get /user 500", async () => {
    const data = {
      username: userData.username,
    };
    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(userModel, "getUser")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });
    const response = await request(app).get("/api/user").query(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});
