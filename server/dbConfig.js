// dbConfig.js

const getDbConfig = () => {
  if (process.env.NODE_ENV === "test") {
    return {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_TEST_DATABASE
    };
  } else {
    return {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_TODO_DATABASE,
      port: process.env.MYSQL_PORT,
    };
  }
};

module.exports = getDbConfig;
