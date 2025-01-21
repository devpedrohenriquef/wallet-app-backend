const { Pool } = require("pg");
const {
  parseInputDatesAsUTC,
  password,
  database,
  host,
} = require("pg/lib/defaults");

const db = new Pool({
  user: "docker",
  password: "docker",
  database: "finances",
  host: "localhost",
  port: 5432,
});

module.exports = db;
