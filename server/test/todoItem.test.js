const request = require("supertest");
const mysql = require("mysql2");
var faker = require("faker");
var app = require("../index");
var todoItemsModel = require("../models/todoItem");
const getDbConfig = require("../dbConfig"); // Import the database configuration function
const conn = mysql.createConnection(getDbConfig()); // Use the function to get the configuration

var userId;
let category_id;

beforeAll(async () => {
  process.env.NODE_ENV = "test"; // Set the environment variable to 'test'
  const userData = {
    username: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const categoryData = {
    category_name: faker.name.findName(),
    display_name: faker.random.word(),
  };

  const userResp = await request(app).post("/api/user").send(userData);
  userId = userResp._body.data.id;
  console.log(userId, "user id");

  const catResp = await request(app).post("/api/category").send(categoryData);
  category_id = catResp._body.data.id;
  console.log(category_id, "cat id");
});

afterAll(async () => {
  conn.promise().query("SET FOREIGN_KEY_CHECKS = 0");
  await conn.promise().query("TRUNCATE TABLE todoItem");
  await conn.promise().query("TRUNCATE TABLE category");
  await conn.promise().query("TRUNCATE TABLE user");
  conn.promise().query("SET FOREIGN_KEY_CHECKS = 1");
  conn.end();
});

// // Add todoItem for todo table
describe("POST /item", () => {
  test("POST /item 201", async () => {
    const todoData = {
      title: "Learn Node",
      descp: faker.random.word(),
      userid: userId,
      category_id: category_id
    };
    const response = await request(app).post("/api/item").send(todoData);
    console.log(response, "rodo");
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "ToDo Item added Successfully",
    });
  });
  test("POST /item 500", async () => {
    const todoData = {
      title: faker.name.findName(),
      descp: faker.random.word(),
      userid: userId,
      category_id: category_id,
    };
    jest
      .spyOn(todoItemsModel, "addToDoItem")
      .mockImplementation(async (todoData) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app).post("/api/item").send(todoData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Get /item/status", () => {
  test("Get /item/status 200", async () => {
    const data = {
      totalItem: 3,
      page: "1",
      itemStatus: "In-Progress",
      userid: 1,
    };
    const response = await request(app).get("/api/item/status").query(data);

    expect(response.status).toBe(200);
  });
  test("Get /item/status 500", async () => {
    const data = {
      totalItem: 3,
      page: "1",
      itemStatus: "In-Progress",
      userid: 1,
    };
    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(todoItemsModel, "findTodoItemStatus")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });
    const response = await request(app).get("/api/item/status").query(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Get /item/", () => {
  test("Get /item/ 200", async () => {
    const data = {
      totalItem: 3,
      page: 1,
      userid: 1,
    };
    const response = await request(app).get("/api/item").query(data);

    expect(response.status).toBe(200);
  });
  test("Get /item 500", async () => {
    const data = {
      totalItem: 3,
      page: 1,
      userid: 1,
    };
    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(todoItemsModel, "getAllTodoItems")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });
    const response = await request(app).get("/api/item").query(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Put /item ", () => {
  test("Put /item/ 200", async () => {
    const todoData = {
      title: faker.name.findName(),
      descp: faker.random.word(),
      userid: userId,
      category_id: category_id,
      status: "Completed",
    };

    const response = await request(app).put("/api/item/1").send(todoData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "ToDo Item updated Successfully!",
    });
  });
  test("Put /item/ 500", async () => {
    let data = {
      title: faker.random.word(),
      descp: faker.random.word(),
      status: "Completed",
      category_id: 1,
    };

    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(todoItemsModel, "updateTodoItem")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app).put("/api/item/1").send(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Put /item update only status", () => {
  test("Put /item 200", async () => {
    const todoData = {
      id: 1,
      status: "Completed",
    };

    const response = await request(app).put("/api/item").send(todoData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "ToDo Item updated Successfully!",
    });
  });
  test("Put /item 500", async () => {
    let data = {
      id: 1,
      status: "Completed",
    };

    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(todoItemsModel, "updateStatus")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app).put("/api/item").send(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Get /item/:title", () => {
  test("Get /item/ 200", async () => {
    const data = {
      totalItem: 3,
      page: 1,
      userid: 1,
    };
    const title = "Learn Node";
    const response = await request(app).get(`/api/item/${title}`).query(data);
    expect(response.status).toBe(200);
  });
  test("Get /item 500", async () => {
    const data = {
      totalItem: 3,
      page: 1,
      userid: 1,
    };
    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(todoItemsModel, "findTodoItem")
      .mockImplementation(async (fakeCategoryData) => {
        throw new Error("Internal Server Error");
      });
    const title = "Learn Node";
    const response = await request(app).get(`/api/item/${title}`).query(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Get /bookmark/:userId", () => {
  test("Get /item/ 200", async () => {
    const data = {
      totalItem: 3,
      page: 1,
    };
    const response = await request(app).get(`/api/item/bookmark/1`).query(data);
    expect(response.status).toBe(200);
  });
  test("Get /item 500", async () => {
    const data = {
      totalItem: 3,
      page: 1,
    };
    jest
      .spyOn(todoItemsModel, "getBookmark")
      .mockImplementation(async (data) => {
        throw new Error("Internal Server Error");
      });
    const response = await request(app).get(`/api/item/bookmark/1`).query(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Put /bookmark/:id ", () => {
  test("Put /bookmark/:id 200", async () => {
    const data = {
      bookmark: 1,
    };
    const response = await request(app).put("/api/item/bookmark/1").send(data);

    expect(response.status).toBe(200);
  });
  test("Put /bookmark/:id 500", async () => {
    const data = {
      bookmark: 1,
    };

    // Mock addCategory to throw an error for the 500 test
    jest
      .spyOn(todoItemsModel, "updateBookmark")
      .mockImplementation(async (data) => {
        throw new Error("Internal Server Error");
      });

    const response = await request(app).put("/api/item/bookmark/1").send(data);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("Delete /:id", () => {
    test("Delete /:id 200", async () => {
      const response = await request(app).delete("/api/item/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Item deleted successfully!",
      });
    });
    test("Delete /categories 500", async () => {
      // Mock addCategory to throw an error for the 500 test
      jest
        .spyOn(todoItemsModel, "deleteTodoItem")
        .mockImplementation(async (fakeCategoryData) => {
          throw new Error("Internal Server Error");
        });
  
      const response = await request(app).delete("/api/item/1");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: "Internal Server Error",
      });
    });
});