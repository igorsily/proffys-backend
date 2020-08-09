import path from "path";

module.exports = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "src", "database", "seeds"),
  },
  useNullAsDefault: true,
};
// module.exports = {
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     port: 5432,
//     user: "postgres",
//     password: "admin",
//     database: "proffys",
//   },
//   migrations: {
//     directory: path.resolve(__dirname, "src", "database", "migrations"),
//   },
//   seeds: {
//     directory: path.resolve(__dirname, "src", "database", "seeds"),
//   },
//   useNullAsDefault: true,
// };
