const { createPool } = require("mysql2");
//<-------------------For Production------------------->
// const pool = createPool({
//   host: "63.250.52.212",
//   user: "transfoc_admin",
//   password: "Transfoc@2024#",
//   database: "transfoc_db",
//   connectionLimit: 50,
// });
//<---------------------------------------------------->
//<------------For Testing----------------------------->
// const pool = createPool({
//   host: "103.226.205.60",
//   user: "transfoc_admin",
//   password: "Transfoc@2024#",
//   database: "transfoc_db",
//   connectionLimit: 10,
// });

//<------------------LOCAL---------------------------------->
const pool = createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "transfoc_db",
  connectionLimit: 10,
});



console.log("mysql Connected!!");
module.exports = pool