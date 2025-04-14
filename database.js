import { createPool } from "mysql2";

const db = createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  port: 3306,
  password: "root", /// thay doi password
  database: "gold_price", // ghi ten database cua minh vao
});

db.getConnection((err) => {
  if (!err) console.log("Connect successfully");
  else console.log(err);
});

export default db;
