const request = require("supertest");
const mysql = require("mysql2");
var faker = require("faker");
var app = require("../index");
var subtaskModel = require("../models/subTask");
const getDbConfig = require("../dbConfig"); // Import the database configuration function
const conn = mysql.createConnection(getDbConfig()); // Use the function to get the configuration

beforeAll(async () => {
  process.env.NODE_ENV = "test"; // Set the environment variable to 'test'
  const fakeCategoryData = {
    category_name: faker.name.findName(),
    display_name: faker.random.word(),
  };
  const userData = {
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  await request(app).post("/api/category").send(fakeCategoryData);
  await request(app).post("/api/user").send(userData);

  const todoData = {
    title: faker.name.findName(),
    descp: faker.random.word(),
    userid: 1,
    category_id: 1,
  };
  await request(app).post("/api/item").send(todoData);
});

afterAll(async () => {
  conn.promise().query("SET FOREIGN_KEY_CHECKS = 0");
  const [result] = await conn.promise().query("TRUNCATE TABLE subTask");
  await conn.promise().query("TRUNCATE TABLE category");
  await conn.promise().query("TRUNCATE TABLE todoItem");
  conn.promise().query("SET FOREIGN_KEY_CHECKS = 1");
  conn.end();
});

// Add sutask of category table
describe("POST /subtask", () => {
  test("POST /subtask 201", async () => {
    const data = {
      user_id: 1,
      todo_id: 1,
      title: faker.random.word(),
    };
    const response = await request(app).post("/api/subtask").send(data);
    expect(response.status).toBe(201);
  });

  test("POST /categories 500", async () => {
    const data = {
      user_id: 1,
      todo_id: 1,
      title: faker.random.word(),
    };

    jest
      .spyOn(subtaskModel, "createSubTask")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app).post("/api/subtask").send(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Get /subtak", () => {
  test("Get /categories 200", async () => {
    const data = {
      todo_id: 1,
      user_id: 1,
    };
    const response = await request(app).get("/api/subtask").query(data);
    expect(response.status).toBe(200);
  });
  test("Get /categories 500", async () => {
    const data = {
      todo_id: 1,
      user_id: 1,
    };
    // Mock addCategory to throw an error for the 500 test
    jest.spyOn(subtaskModel, "getSubTask").mockImplementation(async (data) => {
      throw new Error("Internal Server Error");
    });
    const response = await request(app).get("/api/subtask").query(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Put /subtask", () => {
  test("Put /subtask 200", async () => {
    const data = {
      id: 1,
      status: "Completed",
      title: faker.random.word(),
    };

    const response = await request(app).put("/api/subtask").send(data);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Successfully updated subtask",
    });
  });
  test("Put /subtask 500", async () => {
    const data = {
      id: 1,
      status: "Completed",
      title: faker.random.word(),
    };

    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(subtaskModel, "updateSubtask")
      .mockImplementation(async (data) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app)
      .put("/api/subtask")
      .send(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Delete /subtask", () => {
    test("Delete /subtask 200", async () => {
      const data = {
        id: 1
      };
      const response = await request(app).delete("/api/subtask").send(data);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "SubTask deleted successfully!",
      });
    });
    test("Delete /categories 500", async () => {
      let data = {
        id: 1,
      };
      // Mock addCategory to throw an error for the 500 test
      jest
        .spyOn(subtaskModel, "deleteSubTask")
        .mockImplementation(async (data) => {
          throw new Error("Internal Server Error");
        });
  
      const response = await request(app).delete("/api/category").send(data);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "Internal Server Error",
      });
    });
  });
  