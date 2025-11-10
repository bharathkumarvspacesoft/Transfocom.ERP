const express = require("express");
const router = new express.Router();
const pool = require("../db/conn");
// const upload = require("../upload");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const { error } = require("console");

const upload = multer({ dest: "uploads/" });

const verifyuser = (req, resp, next) => {
  const token = req.cookies.token;
  if (!token) {
    return resp.json({ Error: "You Are Not Authenticate" });
  } else {
    jwt.verify(token, "jwt-screte-key", (err, decode) => {
      if (err) {
        return resp.json({ Error: "Token Is Not Correct!!" });
      } else {
        req.name = decode.name;
        next();
      }
    });
  }
};
router.get("/", verifyuser, (req, resp) => {
  return resp.json({ valid: true, name: req.name });
});
//<----------------------update employee-------------------->
router.put("/updateemployee/:id", (req, res) => {
  const id = req.params.id;
  const { emp_id, name, email, contactno } = req.body;

  pool.query(
    `UPDATE employee_master SET emp_id=?, name=?, email=?, contactno=? WHERE id=?`,
    [emp_id, name, email, contactno, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating employee");
      } else {
        return res.send("Employee updated successfully");
      }
    }
  );
});
//<------------------------login------------------------------------>
router.post("/login", (req, resp) => {
  const sql = "SELECT * from usermaster where username=?";
  pool.query(sql, [req.body.name], (err, data) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return resp.json({ Error: "Login error" });
    }

    if (data.length > 0) {
      if (req.body.password === data[0].password) {
        const userId = data[0].id;
        const name = data[0].name;
        const type = data[0].type;
        const Username = data[0].fullname;
        const ContactNo = data[0].contactno;
        const token = jwt.sign({ name }, "jwt-screte-key", { expiresIn: "1d" });

        resp.cookie("token", token);
        // console.log(resp.json({ Status: "Success", token: token, type: type, id: userId }))
        return resp.json({
          Status: "Success",
          token: token,
          type: type,
          id: userId,
          Username: Username,
          ContactNo: ContactNo,
        });
      } else {
        console.log("Password does not match");
        return resp.json({ Error: "Password not match" });
      }
    } else {
      console.log("User not found");
      return resp.json({ Error: "Login error" });
    }
  });
});

router.get("/logout", (req, resp) => {
  resp.clearCookie("token");
  return resp.json({ Status: "Success" });
});
//<-------------------------------------------------------------------->
//<-------------------------upload------------------------------->
router.post("/upload", upload.single("file"), (req, res) => {
  const { poid, fileName } = req.body;
  const q = `UPDATE order_acceptance SET fileflag=? WHERE id = ?`;
  pool.query(q, [fileName, poid], (err, data) => {
    if (err) {
      return res.json(err);
    }
    if (req.file) {
      const oldFilePath = "uploads/" + req.file.filename;
      const newFilePath = "uploads/" + fileName;

      fs.rename(oldFilePath, newFilePath, (renameErr) => {
        if (renameErr) {
          return res.json(renameErr);
        }

        return res.json({ message: "File uploaded and updated successfully!" });
      });
    } else {
      return res.json({ message: "File flag updated successfully!" });
    }
  });
});

//<--------------------------------------------------------------->
//<-------------------------download-------------------------->
router.get("/download/:url", function (req, res) {
  const file = `uploads/${req.params.url}`;
  res.download(file);
});
//<-------------------------------------------------------->
//<---------------------------Add user--------------------->
// router.post("/addUser", async (req, res) => {
//   console.log("req.body",req.body);
//   const id = req.body.id;
//   const fullname = `${req.body.fname} ${req.body.lname}`;
//   const email = req.body.email;
//   const contactno = req.body.contactno;
//   const dob = req.body.dob;
//   const type = req.body.type;
//   const username = req.body.username;
//   const password = req.body.password;
//   const fname = req.body.fname;
//   const lname = req.body.lname;
//   const desg = req.body.desg;
//   const quot_serial = req.body.quot_serial;
//   const emp = req.body.emp;
//   try {

//     const existingSerialQuery = "SELECT * FROM usermaster WHERE quot_serial = ?";
//     const existingSerialResult = await pool.query(existingSerialQuery, [quot_serial]);

//     if (existingSerialResult && existingSerialResult.length > 0) {

//       return res.status(400).json({ error: "Quot_serial already exists" });
//     }

//     pool.query(
//       "INSERT INTO usermaster VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//       [
//         id,
//         fullname,
//         email,
//         contactno,
//         dob,
//         type,
//         username,
//         password,
//         fname,
//         lname,
//         desg,
//         quot_serial,
//         `${emp}`,
//       ],
//       (err, result) => {
//         if (err) {

//           if (err.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({ error: "Quot_serial already exists" });
//           } else {
//            return res.status(500).json({ error: "Internal Server Error" });
//           }
//         } else {
//          return  res.send("POSTED");
//         }
//       }
//     );
//   } catch (error) {
//     console.log("error",error)
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.post("/addUser", async (req, res) => {
  const id = null; // Ensure ID is null for auto-increment
  const fullname = `${req.body.fname} ${req.body.lname}`;
  const email = req.body.email;
  const contactno = req.body.contactno;
  const dob = req.body.dob;
  let type = req.body.type.join(","); // Convert array to comma-separated string
  const username = req.body.username;
  const password = req.body.password;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const desg = req.body.desg;
  const quot_serial = req.body.quot_serial;
  const emp = req.body.emp.join(","); // Convert array to comma-separated string

  if (type === "1,2" || type === "2,1") {
    type = "8";
  } else if (type === "1,3" || type === "3,1") {
    type = "13";
  } else if (type === "1,4" || type === "4,1") {
    type = "17";
  } else if (type === "1,5" || type === "5,1") {
    type = "20";
  } else if (type === "1,6" || type === "6,1") {
    type = "22";
  } else if (type === "2,3" || type === "3,2") {
    type = "23";
  } else if (type === "2,4" || type === "4,2") {
    type = "24";
  } else if (type === "2,5" || type === "5,2") {
    type = "25";
  } else if (type === "2,6" || type === "6,2") {
    type = "26";
  } else if (type === "3,4" || type === "4,3") {
    type = "27";
  } else if (type === "3,5" || type === "5,3") {
    type = "28";
  } else if (type === "3,6" || type === "6,3") {
    type = "29";
  } else if (type === "4,5" || type === "5,4") {
    type = "30";
  } else if (type === "4,6" || type === "6,4") {
    type = "31";
  } else if (type === "5,6" || type === "6,5") {
    type = "32";
  } else if (
    type === "1,2,3" ||
    type === "1,3,2" ||
    type === "2,1,3" ||
    type === "2,3,1" ||
    type === "3,1,2" ||
    type === "3,2,1"
  ) {
    type = "9";
  } else if (
    type === "1,2,3,4" ||
    type === "1,3,2,4" ||
    type === "4,2,1,3" ||
    type === "2,3,1,4" ||
    type === "3,1,2,4" ||
    type === "3,2,1,4"
  ) {
    type = "10";
  } else if (
    type === "1,2,3,4,5" ||
    type === "1,3,2,4,5" ||
    type === "4,2,1,3,5" ||
    type === "2,3,1,4,5" ||
    type === "3,1,2,4,5" ||
    type === "3,2,1,4,5"
  ) {
    type = "11";
  } else if (
    type === "1,2,3,4,5,6" ||
    type === "1,3,2,4,5,6" ||
    type === "4,2,1,3,5,6" ||
    type === "2,3,1,4,5,6" ||
    type === "3,1,2,4,5,6" ||
    type === "3,2,1,4,5,6"
  ) {
    type = "12";
  } else if (
    type === "1,4,3" ||
    type === "1,3,4" ||
    type === "4,1,3" ||
    type === "4,3,1" ||
    type === "3,1,4" ||
    type === "3,4,1"
  ) {
    type = "14";
  } else if (
    type === "1,3,4,5" ||
    type === "1,3,5,4" ||
    type === "1,4,3,5" ||
    type === "3,1,4,5" ||
    type === "3,1,5,4" ||
    type === "3,5,1,4"
  ) {
    type = "15";
  } else if (
    type === "1,3,4,5,6" ||
    type === "1,3,6,4,5" ||
    type === "1,3,5,4,6," ||
    type === "1,4,3,5,6" ||
    type === "3,1,6,4,5" ||
    type === "3,6,1,4,5"
  ) {
    type = "16";
  } else if (
    type === "1,4,5" ||
    type === "1,5,4" ||
    type === "4,1,5" ||
    type === "4,5,1" ||
    type === "5,1,4" ||
    type === "5,4,1"
  ) {
    type = "18";
  } else if (
    type === "1,4,5,6" ||
    type === "1,6,5,4" ||
    type === "1,4,6,5" ||
    type === "4,1,5,6" ||
    type === "6,1,5,4" ||
    type === "5,1,4,6"
  ) {
    type = "19";
  } else if (
    type === "1,5,6" ||
    type === "1,6,5" ||
    type === "6,1,5" ||
    type === "6,5,1" ||
    type === "5,1,6" ||
    type === "5,6,1"
  ) {
    type = "21";
  } else if (
    type === "2,5,4" ||
    type === "2,4,5" ||
    type === "5,2,4" ||
    type === "5,4,2" ||
    type === "4,2,5" ||
    type === "4,5,2"
  ) {
    type = "39";
  } else if (
    type === "2,5,4,6" ||
    type === "2,4,5,6" ||
    type === "5,2,4,6" ||
    type === "5,4,2,6" ||
    type === "4,2,5,6" ||
    type === "4,5,2,6"
  ) {
    type = "40";
  } else if (
    type === "2,3,4" ||
    type === "2,4,3" ||
    type === "3,2,4" ||
    type === "3,4,2" ||
    type === "4,2,3" ||
    type === "4,3,2"
  ) {
    type = "33";
  } else if (
    type === "2,3,4,6" ||
    type === "2,4,3,6" ||
    type === "3,2,4,6" ||
    type === "3,4,2,6" ||
    type === "4,2,3,6" ||
    type === "4,3,2,6"
  ) {
    type = "41";
  } else if (
    type === "2,3,4,5" ||
    type === "2,4,3,5" ||
    type === "3,2,4,5" ||
    type === "3,4,2,5" ||
    type === "4,2,3,5" ||
    type === "4,3,2,5"
  ) {
    type = "34";
  } else if (
    type === "2,3,4,5,6" ||
    type === "2,4,3,5,6" ||
    type === "3,2,4,5,6" ||
    type === "3,4,2,5,6" ||
    type === "4,2,3,5,6" ||
    type === "4,3,2,5,6"
  ) {
    type = "35";
  } else if (
    type === "3,5,4" ||
    type === "3,4,5" ||
    type === "5,3,4" ||
    type === "5,4,3" ||
    type === "4,3,5" ||
    type === "4,5,3"
  ) {
    type = "36";
  } else if (
    type === "3,5,4,6" ||
    type === "3,4,5,6" ||
    type === "5,3,4,6" ||
    type === "5,4,3,6" ||
    type === "4,3,5,6" ||
    type === "4,5,3,6"
  ) {
    type = "37";
  } else if (
    type === "6,5,4" ||
    type === "6,4,5" ||
    type === "5,6,4" ||
    type === "5,4,6" ||
    type === "4,6,5" ||
    type === "4,5,6"
  ) {
    type = "38";
  } else if (
    type === "3,5,6" ||
    type === "3,6,5" ||
    type === "5,3,6" ||
    type === "5,6,3" ||
    type === "6,3,5" ||
    type === "6,5,3"
  ) {
    type = "42";
  }
  try {
    const existingSerialQuery =
      "SELECT * FROM usermaster WHERE quot_serial = ?";
    const existingSerialResult = await pool.query(existingSerialQuery, [
      quot_serial,
    ]);

    if (existingSerialResult.length > 0) {
      return res.status(400).json({ error: "Quot_serial already exists" });
    }

    const query = `
      INSERT INTO usermaster (id, fullname, email, contactno, dob, type, username, password, fname, lname, desg, quot_serial, emp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id,
      fullname,
      email,
      contactno,
      dob,
      type,
      username,
      password,
      fname,
      lname,
      desg,
      quot_serial,
      emp,
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Quot_serial already exists" });
        } else {
          return res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        return res.send("POSTED");
      }
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//<---------------------------------------------------------------------->
//<------------------------ Fetch user master------------------------>
router.get("/getUsermaster", (req, res) => {
  const q =
    "SELECT u.`fullname`, u.`id`,u.`fname`,u.`email`,u.`contactno`,u.`emp`,u.`dob`,u.`type`,u.`username`,u.`password`,t.utype,u.lname,u.desg FROM `usermaster` u left join user_typemaster t on u.type=t.id order by u.id desc;";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<------------------------------------------------------------------>

//<--------------------------------Delete user------------------------->
router.delete("/deleteUser/:id", (req, res) => {
  const id = req.params.id;
  const q = "Delete from usermaster where id=?";
  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<-------------------------------------------------------------------->
//<---------------------------fetch for Edit user ----------------------------->
router.get("/edituser/:id", (req, res) => {
  const q =
    "SELECT u.`fullname`, u.`id`,u.`fname`,u.`email`,u.`contactno`,u.`dob` ,u.`quot_serial`,u.`type`,u.`emp`,u.`username`,u.`password`,t.utype,u.lname,u.desg FROM `usermaster` u left join user_typemaster t on u.type=t.id order by u.id=?  desc;";

  const id = req.params.id;
  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }
    if (rows.length > 0) {
      const user = rows[0];
      if (user.type == 8) {
        user.type = "1,2";
      } else if (user.type == 13) {
        user.type = "1,3";
      } else if (user.type == 17) {
        user.type = "1,4";
      } else if (user.type == 20) {
        user.type = "1,5";
      } else if (user.type == 22) {
        user.type = "1,6";
      } else if (user.type == 23) {
        user.type = "2,3";
      } else if (user.type == 24) {
        user.type = "2,4";
      } else if (user.type == 25) {
        user.type = "2,5";
      } else if (user.type == 26) {
        user.type = "2,6";
      } else if (user.type == 27) {
        user.type = "3,4";
      } else if (user.type == 28) {
        user.type = "3,5";
      } else if (user.type == 29) {
        user.type = "3,6";
      } else if (user.type == 30) {
        user.type = "4,5";
      } else if (user.type == 31) {
        user.type = "4,6";
      } else if (user.type == 32) {
        user.type = "5,6";
      } else if (user.type == 91) {
        user.type = "1,2,3";
      } else if (user.type == 10) {
        user.type = "1,2,3,4";
      } else if (user.type == 11) {
        user.type = "1,2,3,4,5";
      } else if (user.type == 12) {
        user.type = "1,2,3,4,5,6";
      } else if (user.type == 14) {
        user.type = "1,4,3";
      } else if (user.type == 15) {
        user.type = "1,3,4,5";
      } else if (user.type == 16) {
        user.type = "1,3,4,5,6";
      } else if (user.type == 18) {
        user.type = "1,4,5";
      } else if (user.type == 19) {
        user.type = "1,4,5,6";
      } else if (user.type == 21) {
        user.type = "1,5,6";
      } else if (user.type == 39) {
        user.type = "2,5,4";
      } else if (user.type == 40) {
        user.type = "2,5,4,6";
      } else if (user.type == 33) {
        user.type = "2,3,4";
      } else if (user.type == 41) {
        user.type = "2,3,4,6";
      } else if (user.type == 34) {
        user.type = "2,3,4,5";
      } else if (user.type == 35) {
        user.type = "2,3,4,5,6";
      } else if (user.type == 36) {
        user.type = "3,5,4";
      } else if (user.type == 37) {
        user.type = "3,5,4,6";
      } else if (user.type == 38) {
        user.type = "6,5,4";
      } else if (user.type == 42) {
        user.type = "3,5,6";
      }
      return res.json(user);
    }
    return res.json({});
  });
});

//<------------------------------------------------------------------>
//<------------------------------------Edit user----------------------->

router.put("/updateUser/:id", (req, res) => {
  const formattedDate = new Date(req.body.dob)
    .toLocaleDateString("en-IN")
    .split("/")
    .reverse()
    .join("-");

  // Convert type string to sorted array of numbers
  let typeArray = req.body.type
    .split(",")
    .map(Number)
    .sort((a, b) => a - b);
  let type = req.body.type; // Default to original if no mapping found

  // Define all possible mappings
  const typeMappings = {
    // Single types (1-7 remain as is)

    // Two-type combinations
    "1,2": "8",
    "1,3": "13",
    "1,4": null,
    "1,5": "20",
    "1,6": "22",
    "1,7": null,
    "2,3": "23",
    "2,4": "24",
    "2,5": "25",
    "2,6": "26",
    "2,7": null,
    "3,4": "27",
    "3,5": "28",
    "3,6": "29",
    "3,7": null,
    "4,5": "30",
    "4,6": "31",
    "4,7": null,
    "5,6": "32",
    "5,7": null,
    "6,7": null,

    // Three-type combinations
    "1,2,3": "9",
    "1,2,4": null,
    "1,2,5": null,
    "1,2,6": null,
    "1,3,4": "14",
    "1,3,5": null,
    "1,3,6": null,
    "1,4,5": "18",
    "1,4,6": null,
    "1,5,6": "21",
    "2,3,4": "33",
    "2,3,5": "17",
    "2,3,6": null,
    "2,4,5": "39",
    "2,4,6": null,
    "2,5,6": null,
    "3,4,5": "36",
    "3,4,6": null,
    "3,5,6": "42",
    "4,5,6": "38",

    // Four-type combinations
    "1,2,3,4": "10",
    "1,2,3,5": null,
    "1,2,3,6": null,
    "1,3,4,5": "15",
    "1,3,4,6": null,
    "1,4,5,6": "19",
    "2,3,4,5": "34",
    "2,3,4,6": "41",
    "2,4,5,6": "40",
    "3,4,5,6": "37",

    // Five-type combinations
    "1,2,3,4,5": "11",
    "1,2,3,4,6": null,
    "1,3,4,5,6": "16",
    "2,3,4,5,6": "35",

    // Six-type combination
    "1,2,3,4,5,6": "12",

    // Seven-type combination (all)
    "1,2,3,4,5,6,7": null,
  };

  // Check if the sorted combination exists in our mappings
  const typeKey = typeArray.join(",");
  if (typeMappings[typeKey] !== undefined) {
    type = typeMappings[typeKey] || typeKey; // Use mapped value or fall back to original
  }

  const q =
    "UPDATE usermaster SET email=?, contactno=?, dob=?, type=?, username=?, password=?, fullname=?, fname=?, lname=?, desg=?, quot_serial=?, emp=? WHERE id=?";

  pool.query(
    q,
    [
      req.body.email,
      req.body.contactno,
      formattedDate,
      type,
      req.body.username,
      req.body.password,
      `${req.body.fname} ${req.body.lname}`,
      req.body.fname,
      req.body.lname,
      req.body.desg,
      req.body.quot_serial,
      req.body.emp,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error updating user");
      }
      return res.send("Updated");
    }
  );
});

//<--------------------------------------------------------------------->
//<------------------------------Fetch company profile for edit --------------------->
router.get("/editCompany/:id", (req, res) => {
  const q =
    "SELECT name,contact,email,telefax,website,address,accholdername,accno,branch,ifsccode,isoline from com_profile where id=1;";
  pool.query(q, (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});

//<---------------------------------------------------------------------------------->
//<------------------------------Edit company profile ------------------------------>
router.put("/updateCompany/:id", (req, res) => {
  const q =
    "UPDATE com_profile SET name = ? , contact = ? , telefax = ? , email = ? , website = ? , address = ?,accholdername=?,accno=?,branch=?,ifsccode=? WHERE id = 1 ;";
  pool.query(
    q,
    [
      req.body.name,
      req.body.contact,
      req.body.telefax,
      req.body.email,
      req.body.website,
      req.body.address,
      req.body.accholdername,
      req.body.accno,
      req.body.branch,
      req.body.ifsccode,
      req.params.id,
    ],
    (err, result, feilds) => {
      if (err) {
      } else {
        return res.send("Updated");
      }
    }
  );
});

//<-------------------------------------------------------------------------------->

//<------------------------------------------add testing division--------------------->
router.post("/post", (req, res) => {
  const id = req.body.id;
  const division = req.body.division;
  pool.query(
    `insert into test_division values(?,?)`,
    [id, division],
    (err, result) => {
      if (err) {
      } else {
        return res.send("POSTED");
      }
    }
  );
});

//<------------------------------------------------------------------------------------->
//<--------------------------------fetch testing division------------------------------->
router.get("/getTesting", (req, res) => {
  const q = "select DISTINCT id,division from test_division order by id DESC";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<------------------------------------------------------------------------------------->
//<--------------------------Delete testing user----------------------------------------->

router.delete("/deletetest/:id", (req, res) => {
  const id = req.params.id;
  const q = "delete from test_division where id=?";
  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

router.post("/validateEnq", async (req, res) => {
  try {
    const { email, custname, contactno } = req.body;

    const validationResults = await pool.query(
      "SELECT * FROM enquiry_master WHERE email = ? OR custname = ? OR contactno = ?",
      [email, custname, contactno]
    );

    if (validationResults.length > 0) {
      const existingValues = validationResults[0];
      const errors = {};

      if (existingValues.email === email) {
        errors.email = "Email already exists";
      }

      if (existingValues.custname === custname) {
        errors.custname = "Custname already exists";
      }

      if (existingValues.contactno === contactno) {
        errors.contactno = "Contactno already exists";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: errors });
      }
    }

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.post("/addEnq", (req, res) => {
//   console.log(req.body);

//   const {
//     id,
//     custname,
//     contactperson,
//     desg,
//     email,
//     contactno,
//     altcontactno,
//     address,
//     currency,
//     edate,
//     capacity,
//     type,
//     hvvoltage,
//     consumertype,
//     lvvoltage,
//     areaofdispatch,
//     vectorgroup,
//     matofwind,
//     typecolling,
//     typetaping,
//     comment,
//     uid,
//     voltageratio,
//     core,
//     priratio,
//     secratio,
//     enqstatus,
//     frequency,
//     phase
//   } = req.body;

//   const validationErrors = [];

//   if (!custname) {
//     validationErrors.push("Customer name is required.");
//   }

//   if (!contactno) {
//     validationErrors.push("Contact number is required.");
//   }

//   if (validationErrors.length > 0) {
//     return res.status(400).json({ validationErrors });
//   } else {
//     pool.query(
//       "SELECT * FROM enquiry_master WHERE custname = ? OR email = ? OR contactno = ?",
//       [custname, email, contactno],
//       (err, enquiryResult) => {
//         if (err) {
//           return res.status(500).json({ error: "Internal Server Error" });
//         } else {
//           pool.query(
//             "SELECT * FROM customer_master WHERE custname = ?",
//             [custname],
//             (customerErr, customerResult) => {
//               if (customerErr) {
//                 return res.status(500).json({ error: "Internal Server Error" });
//               } else if (customerResult.length === 0) {
//                 insertCustomerIntoMaster();
//               } else {
//                 insertIntoEnquiryMaster();
//               }
//             }
//           );
//         }
//       }
//     );
//   }

//   function insertCustomerIntoMaster() {
//     pool.query(
//       "INSERT INTO customer_master (custname, cperson, email, desg, contactno, altcontactno, address, gstno, panno) VALUES (?,?,?,?,?,?,?,?,?)",
//       [
//         custname,
//         contactperson,
//         email,
//         desg,
//         contactno,
//         altcontactno,
//         address,
//         req.body.gstno || null,
//         req.body.panno || null
//       ],
//       (err, customerInsertResult) => {
//         if (err) {
//           return res.send(err);
//         } else {
//           insertIntoEnquiryMaster();
//         }
//       }
//     );
//   }

//   function insertIntoEnquiryMaster() {
//     pool.query(
//       "INSERT INTO enquiry_master (id, custname, contactperson, desg, email, contactno, altcontactno, address, currency, edate, capacity, type, hvvoltage, consumertype, lvvoltage, areaofdispatch, vectorgroup, matofwind, typecolling, typetaping, comment, uid, voltageratio, core, priratio, secratio, enqstatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//       [
//         id,
//         custname,
//         contactperson,
//         desg,
//         email,
//         contactno,
//         altcontactno,
//         address,
//         currency,
//         edate,
//         capacity,
//         type,
//         hvvoltage,
//         consumertype,
//         lvvoltage,
//         areaofdispatch,
//         vectorgroup,
//         matofwind,
//         typecolling,
//         typetaping.replace(/[^\x00-\x7F]/g, ""),
//         comment,
//         uid,
//         voltageratio,
//         core,
//         priratio,
//         secratio,
//         enqstatus
//       ],
//       (err, result) => {
//         if (err) {
//           return res.send(err);
//         } else {
//           return res.send(result);
//         }
//       }
//     );
//   }
// });

// router.post("/addEnq", (req, res) => {
//   const {
//     id,
//     custname,
//     contactperson,
//     desg,
//     email,
//     gstno,
//     contactno,
//     altcontactno,
//     address,
//     currency,
//     edate,
//     capacity,
//     type,
//     hvvoltage,
//     consumertype,
//     lvvoltage,
//     areaofdispatch,
//     vectorgroup,
//     matofwind,
//     typecolling,
//     typetaping,
//     comment,
//     uid,
//     voltageratio,
//     core,
//     priratio,
//     secratio,
//     enqstatus,
//     frequency,
//     phase,
//     tapingSwitch,
//     costingDesign, // ✅ Add this line
//   } = req.body;
//   let typetapings;
//   if (typetaping == "others" || typetaping == "other") {
//     typetapings = req.body.otherTypetaping;
//   } else {
//     typetapings = req.body.typetaping;
//   }
//   const validationErrors = [];
//   // console.log(req.body)
//   if (!custname) {
//     validationErrors.push("Customer name is required.");
//   }

//   if (!contactno) {
//     validationErrors.push("Contact number is required.");
//   }

//   if (validationErrors.length > 0) {
//     return res.status(400).json({ validationErrors });
//   } else {
//     pool.query(
//       "SELECT * FROM enquiry_master WHERE custname = ? OR email = ? OR contactno = ?",
//       [custname, email, contactno],
//       (err, enquiryResult) => {
//         if (err) {
//           return res.status(500).json({ error: "Internal Server Error" });
//         } else {
//           pool.query(
//             "SELECT * FROM customer_master WHERE custname = ?",
//             [custname],
//             (customerErr, customerResult) => {
//               if (customerErr) {
//                 return res.status(500).json({ error: "Internal Server Error" });
//               } else if (customerResult.length === 0) {
//                 insertCustomerIntoMaster();
//               } else {
//                 insertIntoEnquiryMaster();
//               }
//             }
//           );
//         }
//       }
//     );
//   }

//   function insertCustomerIntoMaster() {
//     pool.query(
//       "INSERT INTO customer_master (custname, cperson, email, desg, contactno, altcontactno, address, gstno, panno) VALUES (?,?,?,?,?,?,?,?,?)",
//       [
//         custname,
//         contactperson,
//         email,
//         desg,
//         contactno,
//         altcontactno,
//         address,
//         gstno || null,
//         req.body.panno || null,
//       ],
//       (err, customerInsertResult) => {
//         if (err) {
//           return res.send(err);
//         } else {
//           insertIntoEnquiryMaster();
//         }
//       }
//     );
//   }

//   // function insertIntoEnquiryMaster() {
//   //   pool.query(
//   //     "INSERT INTO enquiry_master (id, custname, contactperson, desg, email, contactno, altcontactno, address, currency, edate, capacity, type, hvvoltage, consumertype, lvvoltage, areaofdispatch, vectorgroup, matofwind, typecolling, typetaping, comment, uid, voltageratio, core, priratio, secratio, enqstatus, frequency, phase,tapingSwitch) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//   //     [
//   //       id,
//   //       custname,
//   //       contactperson,
//   //       desg,
//   //       email,
//   //       contactno,
//   //       altcontactno,
//   //       address,
//   //       currency,
//   //       edate,
//   //       capacity,
//   //       type,
//   //       hvvoltage,
//   //       consumertype,
//   //       lvvoltage,
//   //       areaofdispatch,
//   //       vectorgroup,
//   //       matofwind,
//   //       typecolling,
//   //       typetapings,
//   //       comment,
//   //       uid,
//   //       voltageratio,
//   //       core,
//   //       priratio,
//   //       secratio,
//   //       enqstatus,
//   //       frequency,
//   //       phase,
//   //       // tapingSwitch,
//   //       tapingSwitch?.toUpperCase() || null, // <- Capitalized
//   //     ],
//   //     (err, result) => {
//   //       if (err) {
//   //         return res.send(err);
//   //       } else {
//   //         return res.send(result);
//   //       }
//   //     }
//   //   );
//   // }

//   function insertIntoEnquiryMaster() {

//     // Step 1: Check if duplicate exists (excluding type and consumertype)
//     const checkQuery = `
//     SELECT id FROM enquiry_master 
//     WHERE capacity=? AND hvvoltage=? AND lvvoltage=? AND vectorgroup=? 
//       AND matofwind=? AND typecolling=? AND priratio=? AND core=? 
//       AND secratio=? AND frequency=? AND phase=? 
//       AND tapingSwitch=?`;
//     tapingSwitch

//     pool.query(
//       checkQuery,
//       [
//         capacity,
//         hvvoltage,
//         lvvoltage,
//         vectorgroup,
//         matofwind,
//         typecolling,
//         priratio,
//         core,
//         secratio,
//         frequency,
//         phase,
//         // typetaping,
//         tapingSwitch?.toUpperCase() || null,
//       ],
//       (err, rows) => {
//         if (err) return res.send(err);
//         console.log(rows);

//         // If duplicate exists → force enqstatus = 10
//         const finalEnqStatus = rows.length > 0 ? 10 : enqstatus;

//         // Step 2: Insert new record
//         const insertQuery = `
//         INSERT INTO enquiry_master
//         (id, custname, contactperson, desg, email, contactno, altcontactno, address, currency, edate, capacity, type, hvvoltage, consumertype, lvvoltage, areaofdispatch, vectorgroup, matofwind, typecolling, typetaping, comment, uid, voltageratio, core, priratio, secratio, enqstatus, frequency, phase, tapingSwitch,costingDesign)
//         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

//         pool.query(
//           insertQuery,
//           [
//             id,
//             custname,
//             contactperson,
//             desg,
//             email,
//             contactno,
//             altcontactno,
//             address,
//             currency,
//             edate,
//             capacity,
//             type,
//             hvvoltage,
//             consumertype,
//             lvvoltage,
//             areaofdispatch,
//             vectorgroup,
//             matofwind,
//             typecolling,
//             typetaping,
//             comment,
//             uid,
//             voltageratio,
//             core,
//             priratio,
//             secratio,
//             finalEnqStatus, // ✅ final enqstatus logic applied here
//             frequency,
//             phase,
//             tapingSwitch?.toUpperCase() || null,
//             costingDesign || "D1", // ✅ Add this with default value
//           ],
//           (err2, result2) => {
//             if (err2) return res.send(err2);

//             return res.send({
//               message:
//                 rows.length > 0
//                   ? "Duplicate found → inserted with enqstatus=10"
//                   : "New enquiry inserted with provided enqstatus",
//               result: result2,
//             });
//           }
//         );
//       }
//     );
//   }
//   // function insertIntoEnquiryMaster() {

//   //   // Step 1: Check if duplicate exists
//   //   const checkQuery = `
//   //   SELECT id FROM enquiry_master 
//   //   WHERE capacity=? AND type=? AND hvvoltage=? AND consumertype=? 
//   //     AND lvvoltage=? AND vectorgroup=? AND matofwind=? AND typecolling=? 
//   //     AND priratio=? AND core=? AND secratio=? AND frequency=? 
//   //     AND phase=? AND typetaping=? AND tapingSwitch=?`;

//   //   pool.query(
//   //     checkQuery,
//   //     [
//   //       capacity,
//   //       type,
//   //       hvvoltage,
//   //       consumertype,
//   //       lvvoltage,
//   //       vectorgroup,
//   //       matofwind,
//   //       typecolling,
//   //       priratio,
//   //       core,
//   //       secratio,
//   //       frequency,
//   //       phase,
//   //       typetaping,
//   //       tapingSwitch?.toUpperCase() || null,
//   //     ],
//   //     (err, rows) => {
//   //       if (err) return res.send(err);

//   //       // If duplicate exists → force enqstatus = 10
//   //       const finalEnqStatus = rows.length > 0 ? 10 : enqstatus;

//   //       // Step 2: Insert new record
//   //       const insertQuery = `
//   //       INSERT INTO enquiry_master
//   //       (id, custname, contactperson, desg, email, contactno, altcontactno, address, currency, edate, capacity, type, hvvoltage, consumertype, lvvoltage, areaofdispatch, vectorgroup, matofwind, typecolling, typetaping, comment, uid, voltageratio, core, priratio, secratio, enqstatus, frequency, phase, tapingSwitch)
//   //       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

//   //       pool.query(
//   //         insertQuery,
//   //         [
//   //           id,
//   //           custname,
//   //           contactperson,
//   //           desg,
//   //           email,
//   //           contactno,
//   //           altcontactno,
//   //           address,
//   //           currency,
//   //           edate,
//   //           capacity,
//   //           type,
//   //           hvvoltage,
//   //           consumertype,
//   //           lvvoltage,
//   //           areaofdispatch,
//   //           vectorgroup,
//   //           matofwind,
//   //           typecolling,
//   //           typetaping,
//   //           comment,
//   //           uid,
//   //           voltageratio,
//   //           core,
//   //           priratio,
//   //           secratio,
//   //           finalEnqStatus, // ✅ final enqstatus logic applied here
//   //           frequency,
//   //           phase,
//   //           tapingSwitch?.toUpperCase() || null,
//   //         ],
//   //         (err2, result2) => {
//   //           if (err2) return res.send(err2);

//   //           return res.send({
//   //             message:
//   //               rows.length > 0
//   //                 ? "Duplicate found → inserted with enqstatus=10"
//   //                 : "New enquiry inserted with provided enqstatus",
//   //             result: result2,
//   //           });
//   //         }
//   //       );
//   //     }
//   //   );
//   // }

// });

router.post("/addEnq", (req, res) => {
  const {
    id,
    custname,
    contactperson,
    desg,
    email,
    gstno,
    contactno,
    altcontactno,
    address,
    currency,
    edate,
    capacity,
    type,
    hvvoltage,
    consumertype,
    lvvoltage,
    areaofdispatch,
    vectorgroup,
    matofwind,
    typecolling,
    typetaping,
    comment,
    uid,
    voltageratio,
    core,
    priratio,
    secratio,
    enqstatus,
    frequency,
    phase,
    tapingSwitch,
    costingDesign,
  } = req.body;

  let typetapings;
  if (typetaping == "others" || typetaping == "other") {
    typetapings = req.body.otherTypetaping;
  } else {
    typetapings = req.body.typetaping;
  }

  const validationErrors = [];

  if (!custname) {
    validationErrors.push("Customer name is required.");
  }

  if (!contactno) {
    validationErrors.push("Contact number is required.");
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({ validationErrors });
  } else {
    pool.query(
      "SELECT * FROM enquiry_master WHERE custname = ? OR email = ? OR contactno = ?",
      [custname, email, contactno],
      (err, enquiryResult) => {
        if (err) {
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          pool.query(
            "SELECT * FROM customer_master WHERE custname = ?",
            [custname],
            (customerErr, customerResult) => {
              if (customerErr) {
                return res.status(500).json({ error: "Internal Server Error" });
              } else if (customerResult.length === 0) {
                insertCustomerIntoMaster();
              } else {
                insertIntoEnquiryMaster();
              }
            }
          );
        }
      }
    );
  }

  function insertCustomerIntoMaster() {
    pool.query(
      "INSERT INTO customer_master (custname, cperson, email, desg, contactno, altcontactno, address, gstno, panno) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        custname,
        contactperson,
        email,
        desg,
        contactno,
        altcontactno,
        address,
        gstno || null,
        req.body.panno || null,
      ],
      (err, customerInsertResult) => {
        if (err) {
          return res.send(err);
        } else {
          insertIntoEnquiryMaster();
        }
      }
    );
  }

  function insertIntoEnquiryMaster() {
    // Step 1: Check if duplicate exists (excluding type and consumertype)
    const checkQuery = `
    SELECT id FROM enquiry_master 
    WHERE capacity=? AND hvvoltage=? AND lvvoltage=? AND vectorgroup=? 
      AND matofwind=? AND typecolling=? AND priratio=? AND core=? 
      AND secratio=? AND frequency=? AND phase=? 
      AND tapingSwitch=?`;

    pool.query(
      checkQuery,
      [
        capacity,
        hvvoltage,
        lvvoltage,
        vectorgroup,
        matofwind,
        typecolling,
        priratio,
        core,
        secratio,
        frequency,
        phase,
        tapingSwitch?.toUpperCase() || null,
      ],
      (err, rows) => {
        if (err) return res.send(err);
        console.log(rows);

        // If duplicate exists → force enqstatus = 10
        const finalEnqStatus = rows.length > 0 ? 10 : enqstatus;

        // Step 2: Insert new record (✅ NOW INCLUDES gstno)
        const insertQuery = `
        INSERT INTO enquiry_master
        (id, custname, contactperson, desg, email, gstno, contactno, altcontactno, address, currency, edate, capacity, type, hvvoltage, consumertype, lvvoltage, areaofdispatch, vectorgroup, matofwind, typecolling, typetaping, comment, uid, voltageratio, core, priratio, secratio, enqstatus, frequency, phase, tapingSwitch, costingDesign)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        pool.query(
          insertQuery,
          [
            id,
            custname,
            contactperson,
            desg,
            email,
            gstno || null, // ✅ Added gstno here
            contactno,
            altcontactno,
            address,
            currency,
            edate,
            capacity,
            type,
            hvvoltage,
            consumertype,
            lvvoltage,
            areaofdispatch,
            vectorgroup,
            matofwind,
            typecolling,
            typetaping,
            comment,
            uid,
            voltageratio,
            core,
            priratio,
            secratio,
            finalEnqStatus,
            frequency,
            phase,
            tapingSwitch?.toUpperCase() || null,
            costingDesign || "D1",
          ],
          (err2, result2) => {
            if (err2) return res.send(err2);

            return res.send({
              message:
                rows.length > 0
                  ? "Duplicate found → inserted with enqstatus=10"
                  : "New enquiry inserted with provided enqstatus",
              result: result2,
            });
          }
        );
      }
    );
  }
});

// router.post("/addEnq", (req, res) => {
//   console.log(req.body)

//   const id = req.body.id;
//   const custname = req.body.custname;
//   const contactperson = req.body.contactperson;
//   const desg = req.body.desg;
//   const email = req.body.email;
//   const contactno = req.body.contactno;
//   const altcontactno = req.body.altcontactno;
//   const address = req.body.address;
//   const currency = req.body.currency;
//   const edate = req.body.edate;
//   const capacity = req.body.capacity;
//   const type = req.body.type;
//   const hvvoltage = req.body.hvvoltage;
//   const consumertype = req.body.consumertype;
//   const lvvoltage = req.body.lvvoltage;
//   const areaofdispatch = req.body.areaofdispatch;
//   const vectorgroup = req.body.vectorgroup;
//   const matofwind = req.body.matofwind;
//   const typecolling = req.body.typecolling;
//   const typetaping = req.body.typetaping;
//   const comment = req.body.comment;
//   const uid = req.body.uid;
//   const voltageratio = req.body.voltageratio;
//   const core = req.body.core;
//   const priratio = req.body.priratio;
//   const secratio = req.body.secratio;
//   const enqstatus = req.body.enqstatus;
//   const selectedcostingname = req.body.costingName || null;

//   let costingMasterId;

//   const validationErrors = [];

// if (!custname) {
//   validationErrors.push("Customer name is required.");
// }

// if (!contactno) {
//   validationErrors.push("Contact number is required.");
// }

// if (validationErrors.length > 0) {

//   return res.status(400).json({ validationErrors });
// } else {

//   pool.query(
//     "SELECT * FROM enquiry_master WHERE custname = ? OR email = ? OR contactno = ?",
//     [custname, email, contactno],
//     (err, enquiryResult) => {
//       if (err) {

//         return res.status(500).json({ error: "Internal Server Error" });
//       // } else if (enquiryResult.length > 0) {
//       //   const errorMessages = [];

//       //   if (enquiryResult.some(row => row.custname === custname)) {
//       //     errorMessages.push(`Customer with name ${custname} already exists.`);
//       //   }

//       //   if (enquiryResult.some(row => row.email === email)) {
//       //     errorMessages.push(`Customer with email ${email} already exists.`);
//       //   }

//       //   if (enquiryResult.some(row => row.contactno === contactno)) {
//       //     errorMessages.push(`Customer with contact number ${contactno} already exists.`);
//       //   }

//         // const errorMessage = errorMessages.join(', ');

//         // return res.status(400).json({ error: errorMessage });
//       } else {
//         pool.query(
//           "SELECT * FROM customer_master WHERE custname = ?",
//           [custname],
//           (customerErr, customerResult) => {
//             if (customerErr) {

//               return  res.status(500).json({ error: "Internal Server Error" });
//             } else if (customerResult.length === 0) {
//               insertCustomerIntoMaster();
//             } else {
//               insertIntoEnquiryMaster();
//             }
//           }
//         );
//       }
//     }
//   );
// }
//   function insertCustomerIntoMaster() {
//     pool.query(
//       "INSERT INTO customer_master (custname, cperson, email, desg, contactno, altcontactno, address, gstno, panno) VALUES (?,?,?,?,?,?,?,?,?)",
//       [
//         custname,
//         contactperson,
//         email,
//         desg,
//         contactno,
//         altcontactno,
//         address,
//         req.body.gstno || null,
//         req.body.panno || null,
//       ],
//       (err, customerInsertResult) => {
//         if (err) {

//           return res.send(err);
//         } else {

//           insertIntoEnquiryMaster();
//         }
//       }
//     );
//   }

//   function insertIntoEnquiryMaster() {

//     if (!selectedcostingname) {

//       insertIntoEnquiryMasterDirectly();
//     } else {

//       fetchCostingMasterData();
//     }
//   }

//   function insertIntoEnquiryMasterDirectly() {
//     pool.query(
//       "INSERT INTO enquiry_master (id, custname, contactperson, desg, email, contactno, altcontactno, address, currency, edate, capacity, type, hvvoltage, consumertype, lvvoltage, areaofdispatch, vectorgroup, matofwind, typecolling, typetaping, comment, uid, voltageratio, core, priratio, secratio, enqstatus, selectedcosting) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//       [
//         id,
//         custname,
//         contactperson,
//         desg,
//         email,
//         contactno,
//         altcontactno,
//         address,
//         currency,
//         edate,
//         capacity,
//         type,
//         hvvoltage,
//         consumertype,
//         lvvoltage,
//         areaofdispatch,
//         vectorgroup,
//         matofwind,
//         typecolling,
//         typetaping.replace(/[^\x00-\x7F]/g, ""),
//         comment,
//         uid,
//         voltageratio,
//         core,
//         priratio,
//         secratio,
//         enqstatus,
//         selectedcostingname,
//       ],
//       (err, result) => {
//         if (err) {

//           return res.send(err);
//         } else {
//          console.log( res.send(result))
//           return res.send(result);
//         }
//       }
//     );
//   }

//   function fetchCostingMasterData() {
//     pool.query(
//       "SELECT id FROM costing_master WHERE costingname = ?",
//       [selectedcostingname],
//       (err, costingResult) => {
//         if (err) {

//           return res.send(err);
//         } else if (costingResult.length > 0) {

//           fetchMaxCostingId();
//         } else {

//           return res.send("Costing with Costing Name not found.");
//         }
//       }
//     );
//   }

//   function fetchMaxCostingId() {
//     pool.query("SELECT MAX(id) AS maxCostingId FROM costing_master", (err, maxCostingIdResult) => {
//       if (err) {

//         return res.send(err);
//       } else {
//         const maxCostingId = maxCostingIdResult[0].maxCostingId;
//         const newcostingid1 = maxCostingId + 1;
//         fetchMaxEnquiryId(newcostingid1);
//       }
//     });
//   }

//   function fetchMaxEnquiryId(newcostingid1) {
//     pool.query("SELECT MAX(id) AS maxId FROM enquiry_master", (err, maxIdResult) => {
//       if (err) {

//         return res.send(err);
//       } else {
//         const maxId = maxIdResult[0].maxId;

//         const newCostingMasterId = maxId + 1;
//         const updatedEnqStatus = selectedcostingname ? 3 : enqstatus;
//         insertIntoEnquiryMasterWithData(newcostingid1, newCostingMasterId, updatedEnqStatus);
//       }
//     });
//   }

//   function insertIntoEnquiryMasterWithData(newcostingid1, newCostingMasterId, updatedEnqStatus) {
//     pool.query(
//       "INSERT INTO enquiry_master values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//       [
//         id,
//         custname,
//         contactperson,
//         desg,
//         email,
//         contactno,
//         altcontactno,
//         address,
//         currency,
//         edate,
//         capacity,
//         type,
//         hvvoltage,
//         consumertype,
//         lvvoltage,
//         areaofdispatch,
//         vectorgroup,
//         matofwind,
//         typecolling,
//         typetaping,
//         comment,
//         uid,
//         voltageratio,
//         core,
//         newcostingid1,
//         priratio,
//         secratio,
//         updatedEnqStatus,
//         selectedcostingname,
//       ],
//       (err, result) => {
//         if (err) {

//           return res.send(err);
//         } else {

//           fetchCostingData(selectedcostingname, newCostingMasterId,newcostingid1);
//         }
//       }
//     );
//   }

//   function fetchCostingData(selectedcostingname, newCostingMasterId,newcostingid1) {
//     pool.query(
//       "SELECT * FROM costing_master WHERE costingname = ?",
//       [selectedcostingname],
//       (err, costingResult) => {
//         if (err) {

//           return res.send(err);
//         } else {
//           if (costingResult.length > 0) {
//             const costingData = costingResult[0];

//             costingMasterId = costingData.id;

//             insertIntoCostingMasterWithData(newCostingMasterId,newcostingid1);
//           } else {

//             return  res.send("Costing with Costing Name not found.");
//           }
//         }
//       }
//     );
//   }

//   function insertIntoCostingMasterWithData(newCostingMasterId,newcostingid1) {
//     pool.query(
//       "INSERT INTO costing_master (costing_date, oltctext, uid, accessories, labourcharges, miscexpense, eid) SELECT costing_date, oltctext, uid, accessories, labourcharges, miscexpense, ? FROM costing_master WHERE id = ?",
//       [newcostingid1, costingMasterId],

//       (err, costingInsertResult) => {
//         if (err) {

//           return  res.send(err);
//         } else {
//           console.log(newcostingid1)
//           fetchCostingDetailsData(costingMasterId, newCostingMasterId,newcostingid1);
//         }
//       }
//     );
//   }

//   function fetchCostingDetailsData(costingMasterId, newCostingMasterId,newcostingid1) {
//     pool.query(
//       "SELECT * FROM costing_details WHERE cid = ?",
//       [costingMasterId],
//       (err, costingDetailsResult) => {
//         if (err) {

//           return  res.send(err);
//         } else {

//           if (costingDetailsResult.length > 0) {
//             const costingDetailsData = costingDetailsResult;

//             const newCostingDetailsDataArray = costingDetailsData.map((row) => ({
//               cid: newcostingid1, // Set cid to the newCostingMasterId
//               mid: row.mid,
//               quantity: row.quantity,
//               rate: row.rate,
//               amount: row.amount,
//             }));

//             insertIntoCostingDetails(newCostingDetailsDataArray);
//           } else {

//             return res.send("No Costing Details data found for the specified cid.");
//           }
//         }
//       }
//     );
//   }

//   function insertIntoCostingDetails(newCostingDetailsDataArray) {
//     newCostingDetailsDataArray.forEach((newCostingDetailsData) => {
//       pool.query(
//         "INSERT INTO costing_details SET ?",
//         newCostingDetailsData,
//         (err, insertCostingDetailsResult) => {
//           if (err) {

//           }
//         }
//       );
//     });

//     return  res.send("Data inserted successfully.");
//   }
// });
// const poolQuery = async (sql, values) => {
//   return new Promise((resolve, reject) => {
//     pool.query(sql, values, (error, results, fields) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// router.post("/addEnq", async (req, res) => {
//   const {
//     id,
//     custname,
//     contactperson,
//     desg,
//     email,
//     contactno,
//     altcontactno,
//     address,
//     currency,
//     edate,
//     capacity,
//     type,
//     hvvoltage,
//     consumertype,
//     lvvoltage,
//     areaofdispatch,
//     vectorgroup,
//     matofwind,
//     typecolling,
//     typetaping,
//     comment,
//     uid,
//     voltageratio,
//     core,
//     priratio,
//     secratio,
//     enqstatus,
//     costingName: selectedcostingname,
//     otherTypetaping,
//     tapingSwitch
//   } = req.body;
//   let taping;
//   if (typetaping === 'other' || typetaping === 'others') {
//     taping = otherTypetaping;
//   } else {
//     taping = typetaping;
//   }
//   if (tapingSwitch === 'notapping') {
//     taping = 'No Tapping';
//   }
//   const validationErrors = [];

//   if (!custname) {
//     validationErrors.push("Customer name is required.");
//   }

//   if (!contactno) {
//     validationErrors.push("Contact number is required.");
//   }

//   if (validationErrors.length > 0) {
//     return res.status(400).json({ validationErrors });
//   }

//   try {
//     // const enquiryResult = await poolQuery(
//     //   "SELECT * FROM enquiry_master WHERE email = ? OR contactno = ?",
//     //   [ email, contactno]
//     // );
//     // // custname = ? OR custname,
//     // if (enquiryResult.length > 0) {
//     //   const errorMessages = [];

//     //   // if (enquiryResult.some(row => row.custname === custname)) {
//     //   //   errorMessages.push(`Customer with name ${custname} already exists.`);
//     //   // }

//     //   if (enquiryResult.some(row => row.email === email)) {
//     //     errorMessages.push(`Customer with email ${email} already exists.`);
//     //   }

//     //   if (enquiryResult.some(row => row.contactno === contactno)) {
//     //     errorMessages.push(`Customer with contact number ${contactno} already exists.`);
//     //   }

//     //   const errorMessage = errorMessages.join(', ');

//     //   return res.status(400).json({ error: errorMessage });
//     // }

//     const customerResult = await poolQuery(
//       "SELECT * FROM customer_master WHERE custname = ?",
//       [custname]
//     );

//     if (customerResult.length === 0) {
//       await insertCustomerIntoMaster();
//     } else {
//       await insertIntoEnquiryMaster();
//     }

//     return res.send("Data inserted successfully.");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }

//   async function insertCustomerIntoMaster() {
//     try {
//       await poolQuery(
//         "INSERT INTO customer_master (custname, cperson, email, desg, contactno, altcontactno, address, gstno, panno) VALUES (?,?,?,?,?,?,?,?,?)",
//         [
//           custname,
//           contactperson,
//           email,
//           desg,
//           contactno,
//           altcontactno,
//           address,
//           req.body.gstno || null,
//           req.body.panno || null,
//         ]
//       );
//       await insertIntoEnquiryMaster();
//     } catch (error) {

//       throw error;
//     }
//   }

//   async function insertIntoEnquiryMaster() {
//     try {
//       if (!selectedcostingname) {
//         await insertIntoEnquiryMasterDirectly();
//       } else {
//         await fetchCostingMasterData();
//       }
//     } catch (error) {

//       throw error;
//     }
//   }

//   async function insertIntoEnquiryMasterDirectly() {
//     try {
//       await poolQuery(
//         `INSERT INTO enquiry_master (id, custname, contactperson, desg, email, contactno, altcontactno, address, currency, edate, capacity, type, hvvoltage, consumertype, lvvoltage, areaofdispatch, vectorgroup, matofwind, typecolling, typetaping, comment, uid, voltageratio, core, priratio, secratio, enqstatus, selectedcosting) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//         [
//           id,
//           custname,
//           contactperson,
//           desg,
//           email,
//           contactno,
//           altcontactno,
//           address,
//           currency,
//           edate,
//           capacity,
//           type,
//           hvvoltage,
//           consumertype,
//           lvvoltage,
//           areaofdispatch,
//           vectorgroup,
//           matofwind,
//           typecolling,
//           taping,
//           comment,
//           uid,
//           voltageratio,
//           core,
//           priratio,
//           secratio,
//           enqstatus,
//           selectedcostingname,
//         ]
//       );
//     } catch (error) {

//       throw error;
//     }
//   }

//   async function fetchCostingMasterData() {
//     try {
//       // Check if selectedcostingname exists in costing_master
//       const costingResult = await poolQuery(
//         "SELECT id FROM costing_master WHERE costingname = ?",
//         [selectedcostingname]
//       );

//       if (costingResult.length > 0) {
//         await fetchMaxCostingId();
//       } else {
//         // If not found in costing_master, check in costing_master2
//         const costingResult2 = await poolQuery(
//           "SELECT id FROM costing_master2 WHERE costingname = ?",
//           [selectedcostingname]
//         );

//         if (costingResult2.length > 0) {
//           await fetchMaxCostingId2();
//         } else {
//           throw new Error("Costing with Costing Name not found.");
//         }
//       }
//     } catch (error) {

//       throw error;
//     }
//   }

//   async function fetchMaxCostingId() {
//     try {
//       const maxCostingIdResult = await poolQuery("SELECT MAX(id) AS maxCostingId FROM costing_master");
//       const maxCostingId = maxCostingIdResult[0].maxCostingId;
//       const newcostingid1 = maxCostingId + 1;
//       await fetchMaxEnquiryId(newcostingid1);
//     } catch (error) {

//       throw error;
//     }
//   }
//   async function fetchMaxCostingId2() {
//     try {
//       const maxCostingIdResult = await poolQuery("SELECT MAX(id) AS maxCostingId FROM costing_master2");
//       const maxCostingId = maxCostingIdResult[0].maxCostingId;
//       const newcostingid1 = maxCostingId + 1;
//       await fetchMaxEnquiryId2(newcostingid1);
//     } catch (error) {

//       throw error;
//     }
//   }

//   async function fetchMaxEnquiryId(newcostingid1) {
//     try {
//       const maxIdResult = await poolQuery("SELECT MAX(id) AS maxId FROM enquiry_master");
//       const maxId = maxIdResult[0].maxId;
//       const newCostingMasterId = maxId + 1;

//       const updatedEnqStatus = selectedcostingname ? 3 : enqstatus;
//       await insertIntoEnquiryMasterWithData(newcostingid1, newCostingMasterId, updatedEnqStatus);
//     } catch (error) {

//       throw error;
//     }
//   }
//   async function fetchMaxEnquiryId2(newcostingid1) {
//     try {
//       const maxIdResult = await poolQuery("SELECT MAX(id) AS maxId FROM enquiry_master");
//       const maxId = maxIdResult[0].maxId;
//       const newCostingMasterId = maxId + 1;
//       const updatedEnqStatus = selectedcostingname ? 3 : enqstatus;
//       await insertIntoEnquiryMasterWithData2(newcostingid1, newCostingMasterId, updatedEnqStatus);
//     } catch (error) {

//       throw error;
//     }
//   }
//   async function insertIntoEnquiryMasterWithData(newcostingid1, newCostingMasterId, updatedEnqStatus) {
//     try {
//       await poolQuery(
//         "INSERT INTO enquiry_master values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//         [
//           id,
//           custname,
//           contactperson,
//           desg,
//           email,
//           contactno,
//           altcontactno,
//           address,
//           currency,
//           edate,
//           capacity,
//           type,
//           hvvoltage,
//           consumertype,
//           lvvoltage,
//           areaofdispatch,
//           vectorgroup,
//           matofwind,
//           typecolling,
//           taping,
//           comment,
//           uid,
//           voltageratio,
//           core,
//           newcostingid1,
//           priratio,
//           secratio,
//           updatedEnqStatus,
//           selectedcostingname,
//         ]
//       );
//       await fetchCostingData(selectedcostingname, newCostingMasterId,newcostingid1);
//     } catch (error) {

//       throw error;
//     }
//   }
//   async function insertIntoEnquiryMasterWithData2(newcostingid1, newCostingMasterId, updatedEnqStatus) {
//     try {
//       await poolQuery(
//         "INSERT INTO enquiry_master values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//         [
//           id,
//           custname,
//           contactperson,
//           desg,
//           email,
//           contactno,
//           altcontactno,
//           address,
//           currency,
//           edate,
//           capacity,
//           type,
//           hvvoltage,
//           consumertype,
//           lvvoltage,
//           areaofdispatch,
//           vectorgroup,
//           matofwind,
//           typecolling,
//           taping,
//           comment,
//           uid,
//           voltageratio,
//           core,
//           newcostingid1,
//           priratio,
//           secratio,
//           updatedEnqStatus,
//           selectedcostingname,
//         ]
//       );
//       await fetchCostingData2(selectedcostingname, newCostingMasterId,newcostingid1);
//     } catch (error) {

//       throw error;
//     }
//   }

//   async function fetchCostingData(selectedcostingname, newCostingMasterId,newcostingid1) {
//     try {
//       const costingResult = await poolQuery(
//         "SELECT * FROM costing_master WHERE costingname = ?",
//         [selectedcostingname]
//       );

//       if (costingResult.length > 0) {
//         const costingData = costingResult[0];
//         costingMasterId = costingData.id;
//         await insertIntoCostingMasterWithData(newCostingMasterId,newcostingid1,costingMasterId);
//       } else {
//         throw new Error("Costing with Costing Name not found.");
//       }
//     } catch (error) {

//       throw error;
//     }
//   }
//   async function fetchCostingData2(selectedcostingname, newCostingMasterId,newcostingid1) {
//     try {
//       const costingResult = await poolQuery(
//         "SELECT * FROM costing_master2 WHERE costingname = ?",
//         [selectedcostingname]
//       );

//       if (costingResult.length > 0) {
//         const costingData = costingResult[0];
//         costingMasterId = costingData.id;
//         await insertIntoCostingMasterWithData2(newCostingMasterId,newcostingid1,costingMasterId);
//       } else {
//         throw new Error("Costing with Costing Name not found.");
//       }
//     } catch (error) {

//       throw error;
//     }
//   }

//   async function insertIntoCostingMasterWithData(newCostingMasterId,newcostingid1,costingMasterId) {
//     try {
//       await poolQuery(
//         "INSERT INTO costing_master (costing_date, oltctext, uid, accessories, labourcharges, miscexpense, eid) SELECT costing_date, oltctext, uid, accessories, labourcharges, miscexpense, ? FROM costing_master WHERE id = ?",
//         [newCostingMasterId, costingMasterId]
//       );
//       await fetchCostingDetailsData(costingMasterId, newCostingMasterId,newcostingid1);
//     } catch (error) {

//       throw error;
//     }
//   }
//   async function insertIntoCostingMasterWithData2(newCostingMasterId,newcostingid1,costingMasterId) {
//     try {
//       await poolQuery(
//         "INSERT INTO costing_master2 (costing_date, oltctext, uid, accessories, labourcharges, miscexpense, eid) SELECT costing_date, oltctext, uid, accessories, labourcharges, miscexpense, ? FROM costing_master2 WHERE id = ?",
//         [newCostingMasterId, costingMasterId]
//       );
//       await fetchCostingDetailsData2(costingMasterId, newCostingMasterId,newcostingid1);
//     } catch (error) {

//       throw error;
//     }
//   }

//   async function fetchCostingDetailsData(costingMasterId, newCostingMasterId,newcostingid1) {
//     try {
//       const costingDetailsResult = await poolQuery(
//         "SELECT * FROM costing_details WHERE cid = ?",
//         [costingMasterId]
//       );

//       if (costingDetailsResult.length > 0) {
//         const costingDetailsData = costingDetailsResult;
//         const newCostingDetailsDataArray = costingDetailsData.map((row) => ({
//           cid: newcostingid1, // Set cid to the newCostingMasterId
//           mid: row.mid,
//           quantity: row.quantity,
//           rate: row.rate,
//           amount: row.amount,
//         }));
//         await insertIntoCostingDetails(newCostingDetailsDataArray);
//       } else {
//         throw new Error("No Costing Details data found for the specified cid.");
//       }
//     } catch (error) {

//       throw error;
//     }
//   }
//   async function fetchCostingDetailsData2(costingMasterId, newCostingMasterId,newcostingid1) {
//     try {
//       const costingDetailsResult = await poolQuery(
//         "SELECT * FROM costing_details2 WHERE cid = ?",
//         [costingMasterId]
//       );

//       if (costingDetailsResult.length > 0) {
//         const costingDetailsData = costingDetailsResult;
//         const newCostingDetailsDataArray = costingDetailsData.map((row) => ({
//           cid: newcostingid1, // Set cid to the newCostingMasterId
//           mid: row.mid,
//           quantity: row.quantity,
//           rate: row.rate,
//           amount: row.amount,
//         }));
//         await insertIntoCostingDetails2(newCostingDetailsDataArray);
//       } else {
//         throw new Error("No Costing Details data found for the specified cid.");
//       }
//     } catch (error) {

//       throw error;
//     }
//   }

//   async function insertIntoCostingDetails(newCostingDetailsDataArray) {
//     try {
//       for (const newCostingDetailsData of newCostingDetailsDataArray) {
//         await poolQuery(
//           "INSERT INTO costing_details SET ?",
//           newCostingDetailsData
//         );
//       }
//     } catch (error) {

//       throw error;
//     }
//   }
//   async function insertIntoCostingDetails2(newCostingDetailsDataArray) {
//     try {
//       for (const newCostingDetailsData of newCostingDetailsDataArray) {
//         await poolQuery(
//           "INSERT INTO costing_details2 SET ?",
//           newCostingDetailsData
//         );
//       }
//     } catch (error) {

//       throw error;
//     }
//   }
// });
// router.post("/addEnq", async (req, res) =>{
//   console.log(req.body)
// })

//<----------------------------------------------------------------------------------------->

//<---------------------------------------fetch enquery------------------------------------->
router.get("/getEnquiryDetails", (req, res) => {
  const q =
    "SELECT `id`, `custname`, `contactperson`, `desg`, `email`, `contactno`, `altcontactno`, `address`, `currency`, `edate`, `capacity`, `type`, `hvvoltage`, `consumertype`, `lvvoltage`, `areaofdispatch`, `vectorgroup`, `matofwind`, `typecolling`, `typetaping`, `comment`, `priratio`, `secratio`, `voltageratio`, `core`,`cid`, `enqstatus` FROM `enquiry_master` ORDER BY id DESC";

  pool.query(q, (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json(data);
  });
});

//<----------------------------------------------------------------------------------------->
router.get("/getCustomerSuggestions", (req, res) => {
  const { query } = req.query;
  const q =
    "SELECT `custname`, `contactperson`, `email` FROM `enquiry_master` WHERE `custname` LIKE ?;";

  pool.query(q, [`%${query}%`], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "An error occurred" });
    }
    return res.json(data);
  });
});

//<-------------------------------fetch for edit-------------------------------------------->
// router.get("/editenq/:id", (req, res) => {
//   const id = req.params.id;
//   const q = "Select * From enquiry_master Where id=?";

//   pool.query(q, [id], (err, rows) => {

//     if (err) {

//       return res.json(err);
//     }
//     return res.json(rows[0]);
//   });
// });

router.get("/fetchUquoid/:qid", (req, res) => {
  const id = req.params.qid;
  const joinQuery = `
    SELECT q.eid AS quotation_eid, em.id AS enquiry_eid
    FROM quotation q
    JOIN enquiry_master em ON q.eid = em.eid
    WHERE q.qid = ?;
  `;

  pool.query(joinQuery, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    const resultData = rows[0];

    return res.json(resultData);
  });
});

//<--------------------------------------------------------------------------------------->
//<-----------------------------------edit costing------------------------------------>
router.get("/editCosting/:id", (req, res) => {
  const q =
    " SELECT cm.id,cm.costing_date,cm.oltctext,cm.eid,cm.uid,cm.accessories,cm.labourcharges,cm.miscexpense FROM costing_master cm where cm.id=?;";

  const id = req.params.id;

  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});

//<------------------------------------------------------------------------------------------->
//<--------------------------------------update status - --------------------------------------->
router.put("/updateStatus", (req, res) => {
  const q =
    "update enquiry_master set costing_date=?,oltctext=?,eid=?,uid=?,accessories=?,labourcharges=?,miscexpense=? where id=?";
  pool.query(
    q,
    [
      req.body.costing_date,
      req.body.oltctext,
      req.body.accessories,
      req.body.labourcharges,
      req.body.miscexpense,

      req.params.id,
    ],
    (err, result, feilds) => {
      if (err) {
      } else {
        return res.send("Updated");
      }
    }
  );
});

//<----------------------------------------------------------------------------------------->
//<------------------------------------------edit costing details-------------------------------->
router.get("/editCostingdetailes2/:id", (req, res) => {
  const q =
    "SELECT cd.id,cd.cid,cd.mid,cd.quantity,cd.rate,cd.amount,m.item_code,m.material_description,m.unit FROM costing_details2 cd inner join material_master m on m.id=cd.mid where cd.cid=?; ";

  const id = req.params.id;

  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});

//<------------------------------------------------------------------------------------------->
//<-----------------------------------------edit enquery---------------------------------->

// router.put("/updateEnquiry/:id", (req, res) => {
//   let taping;
//   if (req.body.typetaping == "other" || req.body.typetaping == "others") {
//     taping = req.body.otherTypetaping;
//   } else {
//     taping = req.body.typetaping;
//   }
//   if (req.body.tapingSwitch == "notapping") {
//     taping = "No Tapping";
//   }
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();

//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;

//     return [day, month, year].join("-");
//   };

//   // Function to check if date is in DD-MM-YYYY format
//   const isDateInDDMMYYYYFormat = (dateString) => {
//     const regex = /^\d{2}-\d{2}-\d{4}$/;
//     return regex.test(dateString);
//   };

//   // Main logic to process edate
//   const processDate = (edate) => {
//     if (edate && !isDateInDDMMYYYYFormat(edate)) {
//       return formatDate(edate);
//     }
//     return edate;
//   };
//   const edate = req.body.edate;
//   const formattedDate = processDate(edate);
//   const updateEnquiryQuery = `
//     UPDATE enquiry_master 
//     SET custname=?,
//      contactperson=?,
//       desg=?, 
//       email=?,
//        contactno=?,
//         altcontactno=?, 
//     address=?,
//      currency=?, 
//      edate=?, 
//      capacity=?, 
//      type=?, 
//      hvvoltage=?, 
//      consumertype=?, 
//     lvvoltage=?, 
//     areaofdispatch=?, 
//     vectorgroup=?, 
//     matofwind=?, 
//     typecolling=?, 
//     typetaping=?, 
//     comment=?, 
//     voltageratio=?, 
//     core=?, 
//     secratio=?, 
//     priratio=?, 
//     selectedcosting=?, 
//     frequency=?, 
//     phase=? ,
//     tapingSwitch=?
//     WHERE id=?
//   `;

//   pool.query(
//     updateEnquiryQuery,
//     [
//       req.body.custname,
//       req.body.contactperson,
//       req.body.desg,
//       req.body.email,
//       req.body.contactno,
//       req.body.altcontactno,
//       req.body.address,
//       req.body.currency,
//       formattedDate,
//       req.body.capacity,
//       req.body.type,
//       req.body.hvvoltage,
//       req.body.consumertype,
//       req.body.lvvoltage,
//       req.body.areaofdispatch,
//       req.body.vectorgroup,
//       req.body.matofwind,
//       req.body.typecolling,
//       taping,
//       req.body.comment,
//       req.body.voltageratio,
//       req.body.core,
//       req.body.secratio,
//       req.body.priratio,
//       req.body.costingName,
//       req.body.frequency,
//       req.body.phase,
//       req.body.tapingSwitch,
//       req.params.id,
//     ],
//     (err, updateEnquiryResult) => {
//       if (err) {
//         console.log(err);

//         return res.status(500).send("Internal Server Error", err);
//       }
//       const checkCostingNameQuery =
//         "SELECT COUNT(*) AS nameCount FROM costing_master WHERE costingname = ?";

//       pool.query(
//         checkCostingNameQuery,
//         [req.body.costingName],
//         (err, checkCostingNameResult) => {
//           if (err) {
//             console.log(err);

//             return res.status(500).send("Internal Server Error");
//           }

//           const nameCount = checkCostingNameResult[0].nameCount;

//           if (nameCount > 0) {
//             let enquiryid = req.params.id;

//             const fetchCIDQuery = "SELECT cid FROM enquiry_master WHERE id=?";

//             pool.query(
//               fetchCIDQuery,
//               [req.params.id],
//               (err, fetchCIDResult) => {
//                 if (err) {
//                   console.log(err);

//                   return res.status(500).send("Internal Server Error", err);
//                 }

//                 let cid =
//                   fetchCIDResult.length > 0 ? fetchCIDResult[0].cid : null;

//                 if (fetchCIDResult[0].cid === null) {
//                   const fetchCostingMasterQuery =
//                     "SELECT * FROM costing_master WHERE costingname=?";
//                   pool.query(
//                     fetchCostingMasterQuery,
//                     [req.body.costingName],
//                     (err, fetchCostingMasterResult) => {
//                       if (err) {
//                         console.log(err);

//                         return res.status(500).send("Internal Server Error", err);
//                       }

//                       if (fetchCostingMasterResult.length > 0) {
//                         const costingMasterData = fetchCostingMasterResult[0];

//                         const insertCostingMasterQuery = `
//                     INSERT INTO costing_master (costingname, costing_date, oltctext,eid, uid, accessories, 
//                       labourcharges, miscexpense) 
//                     VALUES (?, ?, ?,?, ?, ?, ?, ?)
//                   `;

//                         pool.query(
//                           insertCostingMasterQuery,
//                           [
//                             costingMasterData.costingName,
//                             costingMasterData.costing_date,
//                             costingMasterData.oltctext,
//                             enquiryid,
//                             costingMasterData.uid,
//                             costingMasterData.accessories,
//                             costingMasterData.labourcharges,
//                             costingMasterData.miscexpense,
//                           ],
//                           (err, insertCostingMasterResult) => {
//                             if (err) {
//                               console.log(err);

//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error", err);
//                             }

//                             if (insertCostingMasterResult.affectedRows > 0) {
//                               cid = insertCostingMasterResult.insertId;

//                               continueCostingOperations(cid);

//                               const updateEnquiryMasterQuery =
//                                 "UPDATE enquiry_master SET cid = ?, enqstatus = 3 WHERE id = ?";
//                               pool.query(
//                                 updateEnquiryMasterQuery,
//                                 [cid, enquiryid],
//                                 (err, updateEnquiryMasterResult) => {
//                                   if (err) {
//                                     console.log(err);

//                                     return res
//                                       .status(500)
//                                       .send("Internal Server Error", err);
//                                   }
//                                 }
//                               );
//                             } else {
//                               return res
//                                 .status(500)
//                                 .send(
//                                   "Failed to insert new entry in costing_master2"
//                                 );
//                             }
//                           }
//                         );
//                       } else {
//                         return res
//                           .status(404)
//                           .send("Costing with Costing Name not found.");
//                       }
//                     }
//                   );
//                 } else {
//                   continueCostingOperations(cid);
//                 }
//               }
//             );
//           } else {
//             let enquiryid = req.params.id;

//             const fetchCIDQuery = "SELECT cid FROM enquiry_master WHERE id=?";

//             pool.query(
//               fetchCIDQuery,
//               [req.params.id],
//               (err, fetchCIDResult) => {
//                 if (err) {
//                   console.log(err);

//                   return res.status(500).send("Internal Server Error", err);
//                 }

//                 let cid =
//                   fetchCIDResult.length > 0 ? fetchCIDResult[0].cid : null;

//                 if (fetchCIDResult[0].cid === null) {
//                   const fetchCostingMasterQuery =
//                     "SELECT * FROM costing_master2 WHERE costingname=?";
//                   pool.query(
//                     fetchCostingMasterQuery,
//                     [req.body.costingName],
//                     (err, fetchCostingMasterResult) => {
//                       if (err) {
//                         console.log(err);

//                         return res.status(500).send("Internal Server Error", err);
//                       }

//                       if (fetchCostingMasterResult.length > 0) {
//                         const costingMasterData = fetchCostingMasterResult[0];

//                         const insertCostingMasterQuery = `
//                     INSERT INTO costing_master2 (costingname, costing_date, oltctext,eid, uid, accessories, 
//                       labourcharges, miscexpense) 
//                     VALUES (?, ?, ?,?, ?, ?, ?, ?)
//                   `;

//                         pool.query(
//                           insertCostingMasterQuery,
//                           [
//                             costingMasterData.costingName,
//                             costingMasterData.costing_date,
//                             costingMasterData.oltctext,
//                             enquiryid,
//                             costingMasterData.uid,
//                             costingMasterData.accessories,
//                             costingMasterData.labourcharges,
//                             costingMasterData.miscexpense,
//                           ],
//                           (err, insertCostingMasterResult) => {
//                             if (err) {
//                               console.log(err);

//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error", err);
//                             }

//                             if (insertCostingMasterResult.affectedRows > 0) {
//                               cid = insertCostingMasterResult.insertId;
//                               continueCostingOperations2(cid);

//                               const updateEnquiryMasterQuery =
//                                 "UPDATE enquiry_master SET cid = ?, enqstatus = 3 WHERE id = ?";
//                               pool.query(
//                                 updateEnquiryMasterQuery,
//                                 [cid, enquiryid],
//                                 (err, updateEnquiryMasterResult) => {
//                                   if (err) {
//                                     console.log(err);

//                                     return res
//                                       .status(500)
//                                       .send("Internal Server Error", err);
//                                   }
//                                 }
//                               );
//                             } else {
//                               return res
//                                 .status(500)
//                                 .send(
//                                   "Failed to insert new entry in costing_master2"
//                                 );
//                             }
//                           }
//                         );
//                       } else {
//                         return res
//                           .status(404)
//                           .send("Costing with Costing Name not found.");
//                       }
//                     }
//                   );
//                 } else {
//                   continueCostingOperations2(cid);
//                 }
//               }
//             );
//           }
//         }
//       );
//     }
//   );

//   function continueCostingOperations(cid) {
//     const fetchCostingMasterQuery =
//       "SELECT * FROM costing_master WHERE costingname=?";
//     pool.query(
//       fetchCostingMasterQuery,
//       [req.body.costingName],
//       (err, fetchCostingMasterResult) => {
//         if (err) {
//           return res.status(500).send("Internal Server Error");
//         }

//         if (fetchCostingMasterResult.length > 0) {
//           const costingMasterData = fetchCostingMasterResult[0];

//           const checkEnquiryMasterQuery =
//             "SELECT * FROM costing_master WHERE eid=?";
//           pool.query(
//             checkEnquiryMasterQuery,
//             [req.params.id],
//             (err, checkEnquiryMasterResult) => {
//               if (err) {
//                 return res.status(500).send("Internal Server Error");
//               }

//               if (checkEnquiryMasterResult.length === 0) {
//                 const insertCostingMasterQuery = `
//               INSERT INTO costing_master ( costing_date, oltctext, eid,uid, accessories, labourcharges, miscexpense) 
//               VALUES (?, ?, ?, ?, ?, ?, ?)
//             `;
//                 pool.query(
//                   insertCostingMasterQuery,
//                   [
//                     costingMasterData.costing_date,
//                     costingMasterData.oltctext,
//                     req.params.id,
//                     costingMasterData.uid,
//                     costingMasterData.accessories,
//                     costingMasterData.labourcharges,
//                     costingMasterData.miscexpense,
//                   ],
//                   (err, insertCostingMasterResult) => {
//                     if (err) {
//                       return res.status(500).send("Internal Server Error");
//                     }

//                     const fetchEidAndIdQuery =
//                       "SELECT eid, id FROM costing_master2 WHERE eid=?";
//                     pool.query(
//                       fetchEidAndIdQuery,
//                       [req.params.id],
//                       (err, fetchEidAndIdResult) => {
//                         if (err) {
//                           return res.status(500).send("Internal Server Error");
//                         }

//                         const deleteCostingMaster2Query =
//                           "DELETE FROM costing_master2 WHERE eid=?";
//                         pool.query(
//                           deleteCostingMaster2Query,
//                           [req.params.id],
//                           (err, deleteCostingMaster2Result) => {
//                             if (err) {
//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error");
//                             }

//                             deleteCostingDetails2(fetchEidAndIdResult[0].id);
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               } else {
//                 updateCostingMaster();
//               }
//             }
//           );

//           function deleteCostingDetails2(costingMasterId) {
//             const deleteCostingDetails2Query =
//               "DELETE FROM costing_details2 WHERE cid=?";
//             pool.query(
//               deleteCostingDetails2Query,
//               [costingMasterId],
//               (err, deleteCostingDetails2Result) => {
//                 if (err) {
//                   return res.status(500).send("Internal Server Error");
//                 }

//                 updateCostingMaster(costingMasterId);
//               }
//             );
//           }

//           async function updateCostingMaster(costingMasterId) {
//             const updateCostingMasterQuery = `
//               UPDATE costing_master 
//               SET costing_date=?, oltctext=?, uid=?, accessories=?, 
//               labourcharges=?, miscexpense=?  
//               WHERE id=?
//           `;

//             try {
//               // Update costing master
//               await new Promise((resolve, reject) => {
//                 pool.query(
//                   updateCostingMasterQuery,
//                   [
//                     costingMasterData.costing_date,
//                     costingMasterData.oltctext,
//                     costingMasterData.uid,
//                     costingMasterData.accessories,
//                     costingMasterData.labourcharges,
//                     costingMasterData.miscexpense,
//                     costingMasterId,
//                   ],
//                   (err, updateCostingMasterResult) => {
//                     if (err) {
//                       return reject(err);
//                     }
//                     resolve(updateCostingMasterResult);
//                   }
//                 );
//               });

//               // Fetch costing details
//               const fetchCostingDetailsResult = await new Promise(
//                 (resolve, reject) => {
//                   const fetchCostingDetailsQuery =
//                     "SELECT * FROM costing_details WHERE cid=? AND mid IS NOT NULL;";
//                   pool.query(
//                     fetchCostingDetailsQuery,
//                     [costingMasterData.id],
//                     (err, result) => {
//                       if (err) {
//                         return reject(err);
//                       }
//                       resolve(result);
//                     }
//                   );
//                 }
//               );

//               // // Delete existing costing details
//               // await new Promise((resolve, reject) => {
//               //     const deleteCostingDetailsQuery = "DELETE FROM costing_details WHERE cid=?";
//               //     pool.query(deleteCostingDetailsQuery, [costingMasterData.id], (err, result) => {
//               //         if (err) {
//               //             return reject(err);
//               //         }
//               //         resolve(result);
//               //     });
//               // });

//               // Fetch costing master ID
//               const fetchCostingDetailscidResult = await new Promise(
//                 (resolve, reject) => {
//                   const fetchCostingDetailscid =
//                     "SELECT id FROM costing_master WHERE eid=?";
//                   pool.query(
//                     fetchCostingDetailscid,
//                     [req.params.id],
//                     (err, result) => {
//                       if (err) {
//                         return reject(err);
//                       }
//                       resolve(result);
//                     }
//                   );
//                 }
//               );

//               const cidfromcostinh1 = fetchCostingDetailscidResult[0].id;

//               // Define insert query
//               const insertCostingDetailsQuery = `
//                   INSERT INTO costing_details (cid, mid, quantity, rate, amount) 
//                   VALUES (?, ?, ?, ?, ?)
//               `;

//               // Insert costing details
//               for (let i = 0; i < fetchCostingDetailsResult.length; i++) {
//                 const item = fetchCostingDetailsResult[i];

//                 const values = [
//                   cidfromcostinh1,
//                   item.mid,
//                   parseInt(item.quantity),
//                   parseFloat(item.rate),
//                   parseFloat(item.amount),
//                 ];

//                 await new Promise((resolve, reject) => {
//                   pool.query(
//                     insertCostingDetailsQuery,
//                     values,
//                     (err, result) => {
//                       if (err) {
//                         console.error("Error inserting costing details:", err);
//                         return reject(err);
//                       }
//                       resolve(result);
//                     }
//                   );
//                 });
//               }

//               // Update enquiry master
//               const updateEntryMasterResult = await new Promise(
//                 (resolve, reject) => {
//                   const updateEntryMasterQuery =
//                     "UPDATE enquiry_master SET cid=? WHERE id=?";
//                   pool.query(
//                     updateEntryMasterQuery,
//                     [cidfromcostinh1, req.params.id],
//                     (err, result) => {
//                       if (err) {
//                         return reject(err);
//                       }
//                       resolve(result);
//                     }
//                   );
//                 }
//               );

//               if (updateEntryMasterResult.affectedRows > 0) {
//                 return res.send(
//                   "Updated with Costing Details deleted, inserted, and Entry Master updated"
//                 );
//               } else {
//                 return res.status(500).send("Failed to update Entry Master");
//               }
//             } catch (err) {
//               console.error("Internal Server Error:", err);
//               return res.status(500).send("Internal Server Error");
//             }
//           }
//         } else {
//           return res.status(404).send("Costing with Costing Name not found.");
//         }
//       }
//     );
//   }

//   function continueCostingOperations2(cid) {
//     const fetchCostingMasterQuery =
//       "SELECT * FROM costing_master2 WHERE costingname=?";
//     pool.query(
//       fetchCostingMasterQuery,
//       [req.body.costingName],
//       (err, fetchCostingMasterResult) => {
//         if (err) {
//           return res.status(500).send("Internal Server Error");
//         }

//         if (fetchCostingMasterResult.length > 0) {
//           const costingMasterData = fetchCostingMasterResult[0];

//           const checkEnquiryMasterQuery =
//             "SELECT * FROM costing_master2 WHERE eid=?";
//           pool.query(
//             checkEnquiryMasterQuery,
//             [req.params.id],
//             (err, checkEnquiryMasterResult) => {
//               if (err) {
//                 return res.status(500).send("Internal Server Error");
//               }

//               if (checkEnquiryMasterResult.length === 0) {
//                 const insertCostingMaster2Query = `
//             INSERT INTO costing_master2 ( costing_date, oltctext, eid,uid, accessories, labourcharges, miscexpense) 
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//           `;
//                 pool.query(
//                   insertCostingMaster2Query,
//                   [
//                     costingMasterData.costing_date,
//                     costingMasterData.oltctext,
//                     req.params.id,
//                     costingMasterData.uid,
//                     costingMasterData.accessories,
//                     costingMasterData.labourcharges,
//                     costingMasterData.miscexpense,
//                   ],
//                   (err, insertCostingMaster2Result) => {
//                     if (err) {
//                       return res.status(500).send("Internal Server Error");
//                     }

//                     const fetchEidQuery =
//                       "SELECT eid,id FROM costing_master WHERE eid=?";
//                     pool.query(
//                       fetchEidQuery,
//                       [req.params.id],
//                       (err, fetchEidResult) => {
//                         if (err) {
//                           return res.status(500).send("Internal Server Error");
//                         }

//                         const deleteCostingMaster2Query =
//                           "DELETE FROM costing_master WHERE eid=?";
//                         pool.query(
//                           deleteCostingMaster2Query,
//                           [req.params.id],
//                           (err, deleteCostingMaster2Result) => {
//                             if (err) {
//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error");
//                             }

//                             deleteCostingMaster1(fetchEidResult[0].id);
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               } else {
//                 updateCostingMaster();
//               }
//             }
//           );

//           function deleteCostingMaster1(costingMasterId) {
//             const deleteCostingDetails2Query =
//               "DELETE FROM costing_details WHERE cid=?";
//             pool.query(
//               deleteCostingDetails2Query,
//               [costingMasterId],
//               (err, deleteCostingDetails2Result) => {
//                 if (err) {
//                   return res.status(500).send("Internal Server Error");
//                 }

//                 updateCostingMaster(costingMasterId);
//               }
//             );
//           }
//           function updateCostingMaster(costingMasterId) {
//             const updateCostingMasterQuery = `
//         UPDATE costing_master2 
//         SET costing_date=?, oltctext=?, uid=?, accessories=?, 
//         labourcharges=?, miscexpense=?  
//         WHERE id=?
//     `;

//             pool.query(
//               updateCostingMasterQuery,
//               [
//                 costingMasterData.costing_date,
//                 costingMasterData.oltctext,
//                 costingMasterData.uid,
//                 costingMasterData.accessories,
//                 costingMasterData.labourcharges,
//                 costingMasterData.miscexpense,
//                 costingMasterId,
//               ],
//               (err, updateCostingMasterResult) => {
//                 if (err) {
//                   return res.status(500).send("Internal Server Error");
//                 }

//                 const fetchCostingDetailsQuery =
//                   "SELECT * FROM costing_details2 WHERE cid=?";
//                 pool.query(
//                   fetchCostingDetailsQuery,
//                   [costingMasterData.id],
//                   (err, fetchCostingDetailsResult) => {
//                     if (err) {
//                       return res.status(500).send("Internal Server Error");
//                     }

//                     const deleteCostingDetailsQuery =
//                       "DELETE FROM costing_details2 WHERE cid=?";
//                     pool.query(
//                       deleteCostingDetailsQuery,
//                       [cid],
//                       (err, deleteCostingDetailsResult) => {
//                         if (err) {
//                           return res.status(500).send("Internal Server Error");
//                         }

//                         const fetchCostingDetailscid =
//                           "SELECT id FROM costing_master2 WHERE eid=?";
//                         pool.query(
//                           fetchCostingDetailscid,
//                           [req.params.id],
//                           (err, fetchCostingDetailscidResult) => {
//                             if (err) {
//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error");
//                             }

//                             const cidfromcostinh1 =
//                               fetchCostingDetailscidResult[0].id;

//                             const insertCostingDetailsQuery = `
//                             INSERT INTO costing_details2 (cid, mid, quantity, rate, amount) 
//                             VALUES (?, ?, ?, ?, ?)
//                         `;

//                             const insertPromises = [];

//                             // Use a for loop to create promises for each row insertion
//                             for (
//                               let i = 0;
//                               i < fetchCostingDetailsResult.length;
//                               i++
//                             ) {
//                               const item = fetchCostingDetailsResult[i];
//                               const values = [
//                                 cidfromcostinh1,
//                                 item.mid,
//                                 parseInt(item.quantity),
//                                 parseFloat(item.rate),
//                                 parseFloat(item.amount),
//                               ];

//                               const insertPromise = new Promise(
//                                 (resolve, reject) => {
//                                   pool.query(
//                                     insertCostingDetailsQuery,
//                                     values,
//                                     (err, result) => {
//                                       if (err) {
//                                         reject(err);
//                                       } else {
//                                         resolve(result);
//                                       }
//                                     }
//                                   );
//                                 }
//                               );

//                               insertPromises.push(insertPromise);
//                             }

//                             // Wait for all promises to resolve
//                             Promise.all(insertPromises)
//                               .then(() => {
//                                 const updateEntryMasterQuery =
//                                   "UPDATE enquiry_master SET cid=? WHERE id=?";
//                                 pool.query(
//                                   updateEntryMasterQuery,
//                                   [cidfromcostinh1, req.params.id],
//                                   (err, updateEntryMasterResult) => {
//                                     if (err) {
//                                       return res
//                                         .status(500)
//                                         .send("Internal Server Error");
//                                     }

//                                     if (
//                                       updateEntryMasterResult.affectedRows > 0
//                                     ) {
//                                       return res.send(
//                                         "Updated with Costing Details deleted, inserted, and Entry Master updated"
//                                       );
//                                     } else {
//                                       return res
//                                         .status(500)
//                                         .send("Failed to update Entry Master");
//                                     }
//                                   }
//                                 );
//                               })
//                               .catch((err) => {
//                                 return res
//                                   .status(500)
//                                   .send("Internal Server Error");
//                               });
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               }
//             );
//           }
//         } else {
//           return res.status(404).send("Costing with Costing Name not found.");
//         }
//       }
//     );
//   }
// });

// router.put("/updateEnquiry/:id", (req, res) => {
//   let taping;
//   if (req.body.typetaping == "other" || req.body.typetaping == "others") {
//     taping = req.body.otherTypetaping;
//   } else {
//     taping = req.body.typetaping;
//   }
//   if (req.body.tapingSwitch == "notapping") {
//     taping = "No Tapping";
//   }

//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();

//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;

//     return [day, month, year].join("-");
//   };

//   // Function to check if date is in DD-MM-YYYY format
//   const isDateInDDMMYYYYFormat = (dateString) => {
//     const regex = /^\d{2}-\d{2}-\d{4}$/;
//     return regex.test(dateString);
//   };

//   // Main logic to process edate
//   const processDate = (edate) => {
//     if (edate && !isDateInDDMMYYYYFormat(edate)) {
//       return formatDate(edate);
//     }
//     return edate;
//   };

//   const edate = req.body.edate;
//   const formattedDate = processDate(edate);

//   // Step 1: Update enquiry_master table
//   const updateEnquiryQuery = `
//     UPDATE enquiry_master 
//     SET custname=?, contactperson=?, desg=?, email=?, contactno=?, altcontactno=?, 
//         address=?, currency=?, edate=?, capacity=?, type=?, hvvoltage=?, consumertype=?, 
//         lvvoltage=?, areaofdispatch=?, vectorgroup=?, matofwind=?, typecolling=?, 
//         typetaping=?, comment=?, voltageratio=?, core=?, secratio=?, priratio=?, 
//         selectedcosting=?, frequency=?, phase=?, tapingSwitch=?
//     WHERE id=?
//   `;

//   pool.query(
//     updateEnquiryQuery,
//     [
//       req.body.custname,
//       req.body.contactperson,
//       req.body.desg,
//       req.body.email,
//       req.body.contactno,
//       req.body.altcontactno,
//       req.body.address,
//       req.body.currency,
//       formattedDate,
//       req.body.capacity,
//       req.body.type,
//       req.body.hvvoltage,
//       req.body.consumertype,
//       req.body.lvvoltage,
//       req.body.areaofdispatch,
//       req.body.vectorgroup,
//       req.body.matofwind,
//       req.body.typecolling,
//       taping,
//       req.body.comment,
//       req.body.voltageratio,
//       req.body.core,
//       req.body.secratio,
//       req.body.priratio,
//       req.body.costingName,
//       req.body.frequency,
//       req.body.phase,
//       req.body.tapingSwitch,
//       req.params.id,
//     ],
//     (err, updateEnquiryResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }

//       // Step 2: Check if costing name exists
//       checkCostingExists(req.body.costingName);
//     }
//   );

//   function checkCostingExists(costingName) {
//     // First check in costing_master
//     const checkCostingMasterQuery = "SELECT id FROM costing_master WHERE costingname = ?";

//     pool.query(checkCostingMasterQuery, [costingName], (err, costingMasterResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }

//       if (costingMasterResult.length > 0) {
//         // Costing exists in costing_master
//         const costingId = costingMasterResult[0].id;
//         updateEnquiryWithCosting(costingId);
//       } else {
//         // Check in costing_master2
//         const checkCostingMaster2Query = "SELECT id FROM costing_master2 WHERE costingname = ?";

//         pool.query(checkCostingMaster2Query, [costingName], (err, costingMaster2Result) => {
//           if (err) {
//             console.log(err);
//             return res.status(500).send("Internal Server Error");
//           }

//           if (costingMaster2Result.length > 0) {
//             // Costing exists in costing_master2
//             const costingId = costingMaster2Result[0].id;
//             updateEnquiryWithCosting(costingId);
//           } else {
//             // Step 3: Costing doesn't exist
//             return res.status(404).send("Costing is not available. Please create that costing first.");
//           }
//         });
//       }
//     });
//   }

//   function updateEnquiryWithCosting(costingId) {
//     // Step 4: Update enquiry with cid and enqstatus = 4
//     const updateEnquiryWithCostingQuery = `
//       UPDATE enquiry_master 
//       SET cid = ?, enqstatus = 4 
//       WHERE id = ?
//     `;

//     pool.query(
//       updateEnquiryWithCostingQuery,
//       [costingId, req.params.id],
//       (err, updateResult) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).send("Internal Server Error");
//         }

//         if (updateResult.affectedRows > 0) {
//           return res.send("Updated with Costing Details deleted, inserted, and Entry Master updated");
//         } else {
//           return res.status(500).send("Failed to update Entry Master");
//         }
//       }
//     );
//   }
// });

// router.put("/updateEnquiry/:id", (req, res) => {
//   let taping;
//   if (req.body.typetaping == "other" || req.body.typetaping == "others") {
//     taping = req.body.otherTypetaping;
//   } else {
//     taping = req.body.typetaping;
//   }
//   if (req.body.tapingSwitch == "notapping") {
//     taping = "No Tapping";
//   }

//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();

//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;

//     return [day, month, year].join("-");
//   };

//   // Function to check if date is in DD-MM-YYYY format
//   const isDateInDDMMYYYYFormat = (dateString) => {
//     const regex = /^\d{2}-\d{2}-\d{4}$/;
//     return regex.test(dateString);
//   };

//   // Main logic to process edate
//   const processDate = (edate) => {
//     if (edate && !isDateInDDMMYYYYFormat(edate)) {
//       return formatDate(edate);
//     }
//     return edate;
//   };

//   const edate = req.body.edate;
//   const formattedDate = processDate(edate);

//   // First, check if a record with same specifications already exists
//   checkForDuplicateRecord();

//   function checkForDuplicateRecord() {
//     const duplicateCheckQuery = `
//       SELECT id, enqstatus 
//       FROM enquiry_master 
//       WHERE capacity = ?  AND hvvoltage = ?
//         AND lvvoltage = ? AND vectorgroup = ? AND matofwind = ? AND typecolling = ? 
//         AND priratio = ? AND core = ? AND secratio = ? AND frequency = ? 
//         AND phase = ?  AND tapingSwitch = ? 
//         AND id != ?
//     `;

//     pool.query(
//       duplicateCheckQuery,
//       [
//         req.body.capacity,
//         // req.body.type,
//         req.body.hvvoltage,
//         // req.body.consumertype,
//         req.body.lvvoltage,
//         req.body.vectorgroup,
//         req.body.matofwind,
//         req.body.typecolling,
//         req.body.priratio,
//         req.body.core,
//         req.body.secratio,
//         req.body.frequency,
//         req.body.phase,
//         // taping,
//         req.body.tapingSwitch,
//         req.params.id
//       ],
//       (err, duplicateResult) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).send("Internal Server Error");
//         }
//         console.log(`Duplicate check result: ${JSON.stringify(duplicateResult)}`);


//         if (duplicateResult.length > 0) {
//           // Duplicate record found - set enqstatus to 10
//           updateEnquiryRecord(10);
//         } else {
//           // No duplicate found - check current record's enqstatus
//           checkCurrentEnquiryStatus();
//         }
//       }
//     );
//   }

//   function checkCurrentEnquiryStatus() {
//     const getCurrentStatusQuery = "SELECT enqstatus FROM enquiry_master WHERE id = ?";

//     pool.query(getCurrentStatusQuery, [req.params.id], (err, statusResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }

//       if (statusResult.length > 0) {
//         const currentStatus = statusResult[0].enqstatus;

//         if (currentStatus == 10) {
//           // Previous status was 10, change to 0
//           updateEnquiryRecord(0);
//         } else {
//           // Previous status was not 10, proceed with normal update
//           updateEnquiryRecord(null); // null means don't change enqstatus
//         }
//       } else {
//         return res.status(404).send("Enquiry not found");
//       }
//     });
//   }

//   function updateEnquiryRecord(newEnqStatus) {
//     let updateEnquiryQuery;
//     let queryParams;
//     console.log(`Updating enquiry record with newEnqStatus: ${newEnqStatus}`);


//     if (newEnqStatus !== null) {
//       // Update with new enqstatus
//       updateEnquiryQuery = `
//         UPDATE enquiry_master 
//         SET custname=?, contactperson=?, desg=?, email=?, contactno=?, altcontactno=?, 
//             address=?, currency=?, edate=?, capacity=?, type=?, hvvoltage=?, consumertype=?, 
//             lvvoltage=?, areaofdispatch=?, vectorgroup=?, matofwind=?, typecolling=?, 
//             typetaping=?, comment=?, voltageratio=?, core=?, secratio=?, priratio=?, 
//             selectedcosting=?, frequency=?, phase=?, tapingSwitch=?, enqstatus=?
//         WHERE id=?
//       `;

//       queryParams = [
//         req.body.custname,
//         req.body.contactperson,
//         req.body.desg,
//         req.body.email,
//         req.body.contactno,
//         req.body.altcontactno,
//         req.body.address,
//         req.body.currency,
//         formattedDate,
//         req.body.capacity,
//         req.body.type,
//         req.body.hvvoltage,
//         req.body.consumertype,
//         req.body.lvvoltage,
//         req.body.areaofdispatch,
//         req.body.vectorgroup,
//         req.body.matofwind,
//         req.body.typecolling,
//         taping,
//         req.body.comment,
//         req.body.voltageratio,
//         req.body.core,
//         req.body.secratio,
//         req.body.priratio,
//         req.body.costingName,
//         req.body.frequency,
//         req.body.phase,
//         req.body.tapingSwitch,
//         newEnqStatus,
//         req.params.id,
//       ];
//     } else {
//       // Update without changing enqstatus
//       updateEnquiryQuery = `
//         UPDATE enquiry_master 
//         SET custname=?, contactperson=?, desg=?, email=?, contactno=?, altcontactno=?, 
//             address=?, currency=?, edate=?, capacity=?, type=?, hvvoltage=?, consumertype=?, 
//             lvvoltage=?, areaofdispatch=?, vectorgroup=?, matofwind=?, typecolling=?, 
//             typetaping=?, comment=?, voltageratio=?, core=?, secratio=?, priratio=?, 
//             selectedcosting=?, frequency=?, phase=?, tapingSwitch=?
//         WHERE id=?
//       `;

//       queryParams = [
//         req.body.custname,
//         req.body.contactperson,
//         req.body.desg,
//         req.body.email,
//         req.body.contactno,
//         req.body.altcontactno,
//         req.body.address,
//         req.body.currency,
//         formattedDate,
//         req.body.capacity,
//         req.body.type,
//         req.body.hvvoltage,
//         req.body.consumertype,
//         req.body.lvvoltage,
//         req.body.areaofdispatch,
//         req.body.vectorgroup,
//         req.body.matofwind,
//         req.body.typecolling,
//         taping,
//         req.body.comment,
//         req.body.voltageratio,
//         req.body.core,
//         req.body.secratio,
//         req.body.priratio,
//         req.body.costingName,
//         req.body.frequency,
//         req.body.phase,
//         req.body.tapingSwitch,
//         req.params.id,
//       ];
//     }

//     pool.query(updateEnquiryQuery, queryParams, (err, updateEnquiryResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }
//       console.log(`Enquiry update result: ${JSON.stringify(updateEnquiryResult)}`);


//       // If enqstatus was set to 10 or 0, skip costing check
//       // if (newEnqStatus === 10 || newEnqStatus === 0) {
//       //   return res.send(`Enquiry updated successfully. Status set to ${newEnqStatus}.`);
//       // }

//       // Step 2: Check if costing name exists (only if enqstatus wasn't changed to 10 or 0)
//       checkCostingExists(req.body.costingName);
//     });
//   }

//   function checkCostingExists(costingName) {
//     // First check in costing_master
//     const checkCostingMasterQuery = "SELECT id, eid FROM costing_master WHERE costingname = ?";

//     pool.query(checkCostingMasterQuery, [costingName], (err, costingMasterResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }
//       console.log(`Costing master check result: ${JSON.stringify(costingMasterResult)}`);


//       if (costingMasterResult.length > 0) {
//         // Costing exists in costing_master
//         const costingData = costingMasterResult[0];
//         checkEidAndUpdateStatus(costingData.id, costingData.eid);
//       } else {
//         // Check in costing_master2
//         const checkCostingMaster2Query = "SELECT id, eid FROM costing_master2 WHERE costingname = ?";

//         pool.query(checkCostingMaster2Query, [costingName], (err, costingMaster2Result) => {
//           if (err) {
//             console.log(err);
//             return res.status(500).send("Internal Server Error");
//           }

//           if (costingMaster2Result.length > 0) {
//             // Costing exists in costing_master2
//             const costingData = costingMaster2Result[0];
//             checkEidAndUpdateStatus(costingData.id, costingData.eid);
//           } else {
//             // Step 3: Costing doesn't exist - what should we do?
//             handleCostingNotExists(costingName);
//           }
//         });
//       }
//     });
//   }

//   function checkEidAndUpdateStatus(costingId, costingEid) {
//     console.log(`Costing ID: ${costingId}, Costing EID: ${costingEid}, Current Enquiry ID: ${req.params.id}`);

//     // Check if costing eid matches current enquiry id
//     if (costingEid == req.params.id) {
//       // Same eid - set enqstatus = 4
//       updateEnquiryWithCosting(costingId, 4);
//     } else {
//       // Different eid - set enqstatus = 3
//       updateEnquiryWithCosting(costingId, 3);
//     }
//   }

//   function updateEnquiryWithCosting(costingId, enqstatus) {
//     console.log(`Updating enquiry with costingId: ${costingId} and enqstatus: ${enqstatus}`);

//     const updateEnquiryWithCostingQuery = `
//       UPDATE enquiry_master 
//       SET cid = ?, enqstatus = ? 
//       WHERE id = ?
//     `;

//     pool.query(
//       updateEnquiryWithCostingQuery,
//       [costingId, enqstatus, req.params.id],
//       (err, updateResult) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).send("Internal Server Error");
//         }

//         if (updateResult.affectedRows > 0) {
//           return res.send("Updated with Costing Details deleted, inserted, and Entry Master updated");
//         } else {
//           return res.status(500).send("Failed to update Entry Master");
//         }
//       }
//     );
//   }

//   function handleCostingNotExists(costingName) {
//     // Step 3: What to do when costing doesn't exist?
//     return res.status(404).send("Costing is not available. Please create that costing first.");
//   }
// });

// router.put("/updateEnquiry/:id", (req, res) => {
//   let taping;
//   if (req.body.typetaping == "other" || req.body.typetaping == "others") {
//     taping = req.body.otherTypetaping;
//   } else {
//     taping = req.body.typetaping;
//   }
//   if (req.body.tapingSwitch == "notapping") {
//     taping = "No Tapping";
//   }

//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();

//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;

//     return [day, month, year].join("-");
//   };

//   const isDateInDDMMYYYYFormat = (dateString) => {
//     const regex = /^\d{2}-\d{2}-\d{4}$/;
//     return regex.test(dateString);
//   };

//   const processDate = (edate) => {
//     if (edate && !isDateInDDMMYYYYFormat(edate)) {
//       return formatDate(edate);
//     }
//     return edate;
//   };

//   const edate = req.body.edate;
//   const formattedDate = processDate(edate);

//   checkForDuplicateRecord();

//   function checkForDuplicateRecord() {
//     const duplicateCheckQuery = `
//       SELECT id, enqstatus 
//       FROM enquiry_master 
//       WHERE capacity = ? AND hvvoltage = ?
//         AND lvvoltage = ? AND vectorgroup = ? AND matofwind = ? AND typecolling = ? 
//         AND priratio = ? AND core = ? AND secratio = ? AND frequency = ? 
//         AND phase = ? AND tapingSwitch = ? 
//         AND id != ?
//     `;

//     pool.query(
//       duplicateCheckQuery,
//       [
//         req.body.capacity,
//         req.body.hvvoltage,
//         req.body.lvvoltage,
//         req.body.vectorgroup,
//         req.body.matofwind,
//         req.body.typecolling,
//         req.body.priratio,
//         req.body.core,
//         req.body.secratio,
//         req.body.frequency,
//         req.body.phase,
//         req.body.tapingSwitch,
//         req.params.id
//       ],
//       (err, duplicateResult) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).send("Internal Server Error");
//         }
//         console.log(`Duplicate check result: ${JSON.stringify(duplicateResult)}`);

//         if (duplicateResult.length > 0) {
//           updateEnquiryRecord(10);
//         } else {
//           checkCurrentEnquiryStatus();
//         }
//       }
//     );
//   }

//   function checkCurrentEnquiryStatus() {
//     const getCurrentStatusQuery = "SELECT enqstatus FROM enquiry_master WHERE id = ?";

//     pool.query(getCurrentStatusQuery, [req.params.id], (err, statusResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }

//       if (statusResult.length > 0) {
//         const currentStatus = statusResult[0].enqstatus;

//         if (currentStatus == 10) {
//           updateEnquiryRecord(0);
//         } else {
//           updateEnquiryRecord(null);
//         }
//       } else {
//         return res.status(404).send("Enquiry not found");
//       }
//     });
//   }

//   function updateEnquiryRecord(newEnqStatus) {
//     let updateEnquiryQuery;
//     let queryParams;
//     console.log(`Updating enquiry record with newEnqStatus: ${newEnqStatus}`);

//     if (newEnqStatus !== null) {
//       // Update with new enqstatus and costingDesign
//       updateEnquiryQuery = `
//         UPDATE enquiry_master 
//         SET custname=?, contactperson=?, desg=?, email=?, contactno=?, altcontactno=?, 
//             address=?, currency=?, edate=?, capacity=?, type=?, hvvoltage=?, consumertype=?, 
//             lvvoltage=?, areaofdispatch=?, vectorgroup=?, matofwind=?, typecolling=?, 
//             typetaping=?, comment=?, voltageratio=?, core=?, secratio=?, priratio=?, 
//             selectedcosting=?, frequency=?, phase=?, tapingSwitch=?, costingDesign=?, enqstatus=?
//         WHERE id=?
//       `;

//       queryParams = [
//         req.body.custname,
//         req.body.contactperson,
//         req.body.desg,
//         req.body.email,
//         req.body.contactno,
//         req.body.altcontactno,
//         req.body.address,
//         req.body.currency,
//         formattedDate,
//         req.body.capacity,
//         req.body.type,
//         req.body.hvvoltage,
//         req.body.consumertype,
//         req.body.lvvoltage,
//         req.body.areaofdispatch,
//         req.body.vectorgroup,
//         req.body.matofwind,
//         req.body.typecolling,
//         taping,
//         req.body.comment,
//         req.body.voltageratio,
//         req.body.core,
//         req.body.secratio,
//         req.body.priratio,
//         req.body.costingName,
//         req.body.frequency,
//         req.body.phase,
//         req.body.tapingSwitch,
//         req.body.costingDesign || "D1", // ✅ Add this
//         newEnqStatus,
//         req.params.id,
//       ];
//     } else {
//       // Update without changing enqstatus but include costingDesign
//       updateEnquiryQuery = `
//         UPDATE enquiry_master 
//         SET custname=?, contactperson=?, desg=?, email=?, contactno=?, altcontactno=?, 
//             address=?, currency=?, edate=?, capacity=?, type=?, hvvoltage=?, consumertype=?, 
//             lvvoltage=?, areaofdispatch=?, vectorgroup=?, matofwind=?, typecolling=?, 
//             typetaping=?, comment=?, voltageratio=?, core=?, secratio=?, priratio=?, 
//             selectedcosting=?, frequency=?, phase=?, tapingSwitch=?, costingDesign=?
//         WHERE id=?
//       `;

//       queryParams = [
//         req.body.custname,
//         req.body.contactperson,
//         req.body.desg,
//         req.body.email,
//         req.body.contactno,
//         req.body.altcontactno,
//         req.body.address,
//         req.body.currency,
//         formattedDate,
//         req.body.capacity,
//         req.body.type,
//         req.body.hvvoltage,
//         req.body.consumertype,
//         req.body.lvvoltage,
//         req.body.areaofdispatch,
//         req.body.vectorgroup,
//         req.body.matofwind,
//         req.body.typecolling,
//         taping,
//         req.body.comment,
//         req.body.voltageratio,
//         req.body.core,
//         req.body.secratio,
//         req.body.priratio,
//         req.body.costingName,
//         req.body.frequency,
//         req.body.phase,
//         req.body.tapingSwitch,
//         req.body.costingDesign || "D1", // ✅ Add this
//         req.params.id,
//       ];
//     }

//     pool.query(updateEnquiryQuery, queryParams, (err, updateEnquiryResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }
//       console.log(`Enquiry update result: ${JSON.stringify(updateEnquiryResult)}`);

//       checkCostingExists(req.body.costingName);
//     });
//   }

//   function checkCostingExists(costingName) {
//     const checkCostingMasterQuery = "SELECT id, eid FROM costing_master WHERE costingname = ?";

//     pool.query(checkCostingMasterQuery, [costingName], (err, costingMasterResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }
//       console.log(`Costing master check result: ${JSON.stringify(costingMasterResult)}`);

//       if (costingMasterResult.length > 0) {
//         const costingData = costingMasterResult[0];
//         checkEidAndUpdateStatus(costingData.id, costingData.eid);
//       } else {
//         const checkCostingMaster2Query = "SELECT id, eid FROM costing_master2 WHERE costingname = ?";

//         pool.query(checkCostingMaster2Query, [costingName], (err, costingMaster2Result) => {
//           if (err) {
//             console.log(err);
//             return res.status(500).send("Internal Server Error");
//           }

//           if (costingMaster2Result.length > 0) {
//             const costingData = costingMaster2Result[0];
//             checkEidAndUpdateStatus(costingData.id, costingData.eid);
//           } else {
//             handleCostingNotExists(costingName);
//           }
//         });
//       }
//     });
//   }

//   function checkEidAndUpdateStatus(costingId, costingEid) {
//     console.log(`Costing ID: ${costingId}, Costing EID: ${costingEid}, Current Enquiry ID: ${req.params.id}`);

//     if (costingEid == req.params.id) {
//       updateEnquiryWithCosting(costingId, 4);
//     } else {
//       updateEnquiryWithCosting(costingId, 3);
//     }
//   }

//   function updateEnquiryWithCosting(costingId, enqstatus) {
//     console.log(`Updating enquiry with costingId: ${costingId} and enqstatus: ${enqstatus}`);

//     const updateEnquiryWithCostingQuery = `
//       UPDATE enquiry_master 
//       SET cid = ?, enqstatus = ? 
//       WHERE id = ?
//     `;

//     pool.query(
//       updateEnquiryWithCostingQuery,
//       [costingId, enqstatus, req.params.id],
//       (err, updateResult) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).send("Internal Server Error");
//         }

//         if (updateResult.affectedRows > 0) {
//           return res.send("Updated with Costing Details deleted, inserted, and Entry Master updated");
//         } else {
//           return res.status(500).send("Failed to update Entry Master");
//         }
//       }
//     );
//   }

//   function handleCostingNotExists(costingName) {
//     return res.status(404).send("Costing is not available. Please create that costing first.");
//   }
// });

router.put("/updateEnquiry/:id", (req, res) => {
  let taping;
  if (req.body.typetaping == "other" || req.body.typetaping == "others") {
    taping = req.body.otherTypetaping;
  } else {
    taping = req.body.typetaping;
  }
  if (req.body.tapingSwitch == "notapping") {
    taping = "No Tapping";
  }

  const formatDate = (date) => {
    const d = new Date(date);
    let day = "" + d.getDate();
    let month = "" + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;

    return [day, month, year].join("-");
  };

  const isDateInDDMMYYYYFormat = (dateString) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(dateString);
  };

  const processDate = (edate) => {
    if (edate && !isDateInDDMMYYYYFormat(edate)) {
      return formatDate(edate);
    }
    return edate;
  };

  const edate = req.body.edate;
  const formattedDate = processDate(edate);

  checkForDuplicateRecord();

  function checkForDuplicateRecord() {
    const duplicateCheckQuery = `
      SELECT id, enqstatus 
      FROM enquiry_master 
      WHERE capacity = ? AND hvvoltage = ?
        AND lvvoltage = ? AND vectorgroup = ? AND matofwind = ? AND typecolling = ? 
        AND priratio = ? AND core = ? AND secratio = ? AND frequency = ? 
        AND phase = ? AND tapingSwitch = ? 
        AND id != ?
    `;

    pool.query(
      duplicateCheckQuery,
      [
        req.body.capacity,
        req.body.hvvoltage,
        req.body.lvvoltage,
        req.body.vectorgroup,
        req.body.matofwind,
        req.body.typecolling,
        req.body.priratio,
        req.body.core,
        req.body.secratio,
        req.body.frequency,
        req.body.phase,
        req.body.tapingSwitch,
        req.params.id
      ],
      (err, duplicateResult) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }
        console.log(`Duplicate check result: ${JSON.stringify(duplicateResult)}`);

        if (duplicateResult.length > 0) {
          updateEnquiryRecord(10);
        } else {
          checkCurrentEnquiryStatus();
        }
      }
    );
  }

  function checkCurrentEnquiryStatus() {
    const getCurrentStatusQuery = "SELECT enqstatus FROM enquiry_master WHERE id = ?";

    pool.query(getCurrentStatusQuery, [req.params.id], (err, statusResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      if (statusResult.length > 0) {
        const currentStatus = statusResult[0].enqstatus;

        if (currentStatus == 10) {
          updateEnquiryRecord(0);
        } else {
          updateEnquiryRecord(null);
        }
      } else {
        return res.status(404).send("Enquiry not found");
      }
    });
  }

  function updateEnquiryRecord(newEnqStatus) {
    let updateEnquiryQuery;
    let queryParams;
    console.log(`Updating enquiry record with newEnqStatus: ${newEnqStatus}`);

    if (newEnqStatus !== null) {
      // Update with new enqstatus, costingDesign, and gstno
      updateEnquiryQuery = `
        UPDATE enquiry_master 
        SET custname=?, contactperson=?, desg=?, email=?, gstno=?, contactno=?, altcontactno=?, 
            address=?, currency=?, edate=?, capacity=?, type=?, hvvoltage=?, consumertype=?, 
            lvvoltage=?, areaofdispatch=?, vectorgroup=?, matofwind=?, typecolling=?, 
            typetaping=?, comment=?, voltageratio=?, core=?, secratio=?, priratio=?, 
            selectedcosting=?, frequency=?, phase=?, tapingSwitch=?, costingDesign=?, enqstatus=?
        WHERE id=?
      `;

      queryParams = [
        req.body.custname,
        req.body.contactperson,
        req.body.desg,
        req.body.email,
        req.body.gstno || null, // ✅ Added gstno
        req.body.contactno,
        req.body.altcontactno,
        req.body.address,
        req.body.currency,
        formattedDate,
        req.body.capacity,
        req.body.type,
        req.body.hvvoltage,
        req.body.consumertype,
        req.body.lvvoltage,
        req.body.areaofdispatch,
        req.body.vectorgroup,
        req.body.matofwind,
        req.body.typecolling,
        taping,
        req.body.comment,
        req.body.voltageratio,
        req.body.core,
        req.body.secratio,
        req.body.priratio,
        null,
        req.body.frequency,
        req.body.phase,
        req.body.tapingSwitch,
        req.body.costingDesign || "D1",
        newEnqStatus,
        req.params.id,
      ];
    } else {
      // Update without changing enqstatus but include costingDesign and gstno
      updateEnquiryQuery = `
        UPDATE enquiry_master 
        SET custname=?, contactperson=?, desg=?, email=?, gstno=?, contactno=?, altcontactno=?, 
            address=?, currency=?, edate=?, capacity=?, type=?, hvvoltage=?, consumertype=?, 
            lvvoltage=?, areaofdispatch=?, vectorgroup=?, matofwind=?, typecolling=?, 
            typetaping=?, comment=?, voltageratio=?, core=?, secratio=?, priratio=?, 
            selectedcosting=?, frequency=?, phase=?, tapingSwitch=?, costingDesign=?
        WHERE id=?
      `;

      queryParams = [
        req.body.custname,
        req.body.contactperson,
        req.body.desg,
        req.body.email,
        req.body.gstno || null, // ✅ Added gstno
        req.body.contactno,
        req.body.altcontactno,
        req.body.address,
        req.body.currency,
        formattedDate,
        req.body.capacity,
        req.body.type,
        req.body.hvvoltage,
        req.body.consumertype,
        req.body.lvvoltage,
        req.body.areaofdispatch,
        req.body.vectorgroup,
        req.body.matofwind,
        req.body.typecolling,
        taping,
        req.body.comment,
        req.body.voltageratio,
        req.body.core,
        req.body.secratio,
        req.body.priratio,
        null,
        req.body.frequency,
        req.body.phase,
        req.body.tapingSwitch,
        req.body.costingDesign || "D1",
        req.params.id,
      ];
    }

    pool.query(updateEnquiryQuery, queryParams, (err, updateEnquiryResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      console.log(`Enquiry update result: ${JSON.stringify(updateEnquiryResult)}`);

      checkCostingExists(req.body.costingName);
    });
  }

  function checkCostingExists(costingName) {
    const checkCostingMasterQuery = "SELECT id, eid FROM costing_master WHERE costingname = ?";

    pool.query(checkCostingMasterQuery, [costingName], (err, costingMasterResult) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      console.log(`Costing master check result: ${JSON.stringify(costingMasterResult)}`);

      if (costingMasterResult.length > 0) {
        const costingData = costingMasterResult[0];
        checkEidAndUpdateStatus(costingData.id, costingData.eid);
      } else {
        const checkCostingMaster2Query = "SELECT id, eid FROM costing_master2 WHERE costingname = ?";

        pool.query(checkCostingMaster2Query, [costingName], (err, costingMaster2Result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
          }

          if (costingMaster2Result.length > 0) {
            const costingData = costingMaster2Result[0];
            checkEidAndUpdateStatus(costingData.id, costingData.eid);
          } else {
            handleCostingNotExists(costingName);
          }
        });
      }
    });
  }

  function checkEidAndUpdateStatus(costingId, costingEid) {
    console.log(`Costing ID: ${costingId}, Costing EID: ${costingEid}, Current Enquiry ID: ${req.params.id}`);

    if (costingEid == req.params.id) {
      updateEnquiryWithCosting(costingId, 4);
    } else {
      updateEnquiryWithCosting(costingId, 3);
    }
  }

  function updateEnquiryWithCosting(costingId, enqstatus) {
    console.log(`Updating enquiry with costingId: ${costingId} and enqstatus: ${enqstatus}`);

    const updateEnquiryWithCostingQuery = `
      UPDATE enquiry_master 
      SET cid = ?, enqstatus = ? 
      WHERE id = ?
    `;

    pool.query(
      updateEnquiryWithCostingQuery,
      [costingId, enqstatus, req.params.id],
      (err, updateResult) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Internal Server Error");
        }

        if (updateResult.affectedRows > 0) {
          return res.send("Updated with Costing Details deleted, inserted, and Entry Master updated");
        } else {
          return res.status(500).send("Failed to update Entry Master");
        }
      }
    );
  }

  function handleCostingNotExists(costingName) {
    return res.status(404).send("Costing is not available. Please create that costing first.");
  }
});

// router.put("/updateEnquiry/:id", (req, res) => {
//   let taping;
//   if (req.body.typetaping == "other" || req.body.typetaping == "others") {
//     taping = req.body.otherTypetaping;
//   } else {
//     taping = req.body.typetaping;
//   }
//   if (req.body.tapingSwitch == "notapping") {
//     taping = "No Tapping";
//   }

//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();

//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;

//     return [day, month, year].join("-");
//   };

//   // Function to check if date is in DD-MM-YYYY format
//   const isDateInDDMMYYYYFormat = (dateString) => {
//     const regex = /^\d{2}-\d{2}-\d{4}$/;
//     return regex.test(dateString);
//   };

//   // Main logic to process edate
//   const processDate = (edate) => {
//     if (edate && !isDateInDDMMYYYYFormat(edate)) {
//       return formatDate(edate);
//     }
//     return edate;
//   };

//   const edate = req.body.edate;
//   const formattedDate = processDate(edate);

//   // Check for duplicate record with same specifications
//   const checkDuplicateQuery = `
//     SELECT id, enqstatus 
//     FROM enquiry_master 
//     WHERE capacity = ? 
//     AND type = ? 
//     AND hvvoltage = ? 
//     AND consumertype = ? 
//     AND lvvoltage = ? 
//     AND vectorgroup = ? 
//     AND matofwind = ? 
//     AND typecolling = ? 
//     AND priratio = ? 
//     AND core = ? 
//     AND secratio = ? 
//     AND frequency = ? 
//     AND phase = ? 
//     AND typetaping = ? 
//     AND tapingSwitch = ?
//     AND id != ?
//   `;

//   pool.query(
//     checkDuplicateQuery,
//     [
//       req.body.capacity,
//       req.body.type,
//       req.body.hvvoltage,
//       req.body.consumertype,
//       req.body.lvvoltage,
//       req.body.vectorgroup,
//       req.body.matofwind,
//       req.body.typecolling,
//       req.body.priratio,
//       req.body.core,
//       req.body.secratio,
//       req.body.frequency,
//       req.body.phase,
//       taping,
//       req.body.tapingSwitch,
//       req.params.id
//     ],
//     (err, duplicateResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error", err);
//       }
//       console.log(duplicateResult);


//       // If duplicate record found, update its enqstatus to 10
//       if (duplicateResult.length > 0) {
//         const duplicateId = duplicateResult[0].id;

//         const updateDuplicateStatusQuery = `
//           UPDATE enquiry_master 
//           SET enqstatus = 10 
//           WHERE id = ?
//         `;

//         pool.query(
//           updateDuplicateStatusQuery,
//           [duplicateId],
//           (err, updateStatusResult) => {
//             if (err) {
//               console.log(err);
//               return res.status(500).send("Internal Server Error", err);
//             }
//             console.log(`Duplicate record found with ID: ${duplicateId}, enqstatus updated to 10`);
//           }
//         );
//       }

//       // Continue with the original update logic
//       proceedWithUpdate();
//     }
//   );

//   function proceedWithUpdate() {
//     const updateEnquiryQuery = `
//       UPDATE enquiry_master 
//       SET custname=?,
//        contactperson=?,
//         desg=?, 
//         email=?,
//          contactno=?,
//           altcontactno=?, 
//       address=?,
//        currency=?, 
//        edate=?, 
//        capacity=?, 
//        type=?, 
//        hvvoltage=?, 
//        consumertype=?, 
//       lvvoltage=?, 
//       areaofdispatch=?, 
//       vectorgroup=?, 
//       matofwind=?, 
//       typecolling=?, 
//       typetaping=?, 
//       comment=?, 
//       voltageratio=?, 
//       core=?, 
//       secratio=?, 
//       priratio=?, 
//       selectedcosting=?, 
//       frequency=?, 
//       phase=? ,
//       tapingSwitch=?
//       WHERE id=?
//     `;

//     pool.query(
//       updateEnquiryQuery,
//       [
//         req.body.custname,
//         req.body.contactperson,
//         req.body.desg,
//         req.body.email,
//         req.body.contactno,
//         req.body.altcontactno,
//         req.body.address,
//         req.body.currency,
//         formattedDate,
//         req.body.capacity,
//         req.body.type,
//         req.body.hvvoltage,
//         req.body.consumertype,
//         req.body.lvvoltage,
//         req.body.areaofdispatch,
//         req.body.vectorgroup,
//         req.body.matofwind,
//         req.body.typecolling,
//         taping,
//         req.body.comment,
//         req.body.voltageratio,
//         req.body.core,
//         req.body.secratio,
//         req.body.priratio,
//         req.body.costingName,
//         req.body.frequency,
//         req.body.phase,
//         req.body.tapingSwitch,
//         req.params.id,
//       ],
//       (err, updateEnquiryResult) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).send("Internal Server Error", err);
//         }

//         const checkCostingNameQuery =
//           "SELECT COUNT(*) AS nameCount FROM costing_master WHERE costingname = ?";

//         pool.query(
//           checkCostingNameQuery,
//           [req.body.costingName],
//           (err, checkCostingNameResult) => {
//             if (err) {
//               console.log(err);
//               return res.status(500).send("Internal Server Error");
//             }

//             const nameCount = checkCostingNameResult[0].nameCount;

//             if (nameCount > 0) {
//               let enquiryid = req.params.id;

//               const fetchCIDQuery = "SELECT cid FROM enquiry_master WHERE id=?";

//               pool.query(
//                 fetchCIDQuery,
//                 [req.params.id],
//                 (err, fetchCIDResult) => {
//                   if (err) {
//                     console.log(err);
//                     return res.status(500).send("Internal Server Error", err);
//                   }

//                   let cid =
//                     fetchCIDResult.length > 0 ? fetchCIDResult[0].cid : null;

//                   if (fetchCIDResult[0].cid === null) {
//                     const fetchCostingMasterQuery =
//                       "SELECT * FROM costing_master WHERE costingname=?";
//                     pool.query(
//                       fetchCostingMasterQuery,
//                       [req.body.costingName],
//                       (err, fetchCostingMasterResult) => {
//                         if (err) {
//                           console.log(err);
//                           return res.status(500).send("Internal Server Error", err);
//                         }

//                         if (fetchCostingMasterResult.length > 0) {
//                           const costingMasterData = fetchCostingMasterResult[0];

//                           const insertCostingMasterQuery = `
//                       INSERT INTO costing_master (costingname, costing_date, oltctext,eid, uid, accessories, 
//                         labourcharges, miscexpense) 
//                       VALUES (?, ?, ?,?, ?, ?, ?, ?)
//                     `;

//                           pool.query(
//                             insertCostingMasterQuery,
//                             [
//                               costingMasterData.costingName,
//                               costingMasterData.costing_date,
//                               costingMasterData.oltctext,
//                               enquiryid,
//                               costingMasterData.uid,
//                               costingMasterData.accessories,
//                               costingMasterData.labourcharges,
//                               costingMasterData.miscexpense,
//                             ],
//                             (err, insertCostingMasterResult) => {
//                               if (err) {
//                                 console.log(err);
//                                 return res
//                                   .status(500)
//                                   .send("Internal Server Error", err);
//                               }

//                               if (insertCostingMasterResult.affectedRows > 0) {
//                                 cid = insertCostingMasterResult.insertId;

//                                 continueCostingOperations(cid);

//                                 const updateEnquiryMasterQuery =
//                                   "UPDATE enquiry_master SET cid = ?, enqstatus = 3 WHERE id = ?";
//                                 pool.query(
//                                   updateEnquiryMasterQuery,
//                                   [cid, enquiryid],
//                                   (err, updateEnquiryMasterResult) => {
//                                     if (err) {
//                                       console.log(err);
//                                       return res
//                                         .status(500)
//                                         .send("Internal Server Error", err);
//                                     }
//                                   }
//                                 );
//                               } else {
//                                 return res
//                                   .status(500)
//                                   .send(
//                                     "Failed to insert new entry in costing_master2"
//                                   );
//                               }
//                             }
//                           );
//                         } else {
//                           return res
//                             .status(404)
//                             .send("Costing with Costing Name not found.");
//                         }
//                       }
//                     );
//                   } else {
//                     continueCostingOperations(cid);
//                   }
//                 }
//               );
//             } else {
//               let enquiryid = req.params.id;

//               const fetchCIDQuery = "SELECT cid FROM enquiry_master WHERE id=?";

//               pool.query(
//                 fetchCIDQuery,
//                 [req.params.id],
//                 (err, fetchCIDResult) => {
//                   if (err) {
//                     console.log(err);
//                     return res.status(500).send("Internal Server Error", err);
//                   }

//                   let cid =
//                     fetchCIDResult.length > 0 ? fetchCIDResult[0].cid : null;

//                   if (fetchCIDResult[0].cid === null) {
//                     const fetchCostingMasterQuery =
//                       "SELECT * FROM costing_master2 WHERE costingname=?";
//                     pool.query(
//                       fetchCostingMasterQuery,
//                       [req.body.costingName],
//                       (err, fetchCostingMasterResult) => {
//                         if (err) {
//                           console.log(err);
//                           return res.status(500).send("Internal Server Error", err);
//                         }

//                         if (fetchCostingMasterResult.length > 0) {
//                           const costingMasterData = fetchCostingMasterResult[0];

//                           const insertCostingMasterQuery = `
//                       INSERT INTO costing_master2 (costingname, costing_date, oltctext,eid, uid, accessories, 
//                         labourcharges, miscexpense) 
//                       VALUES (?, ?, ?,?, ?, ?, ?, ?)
//                     `;

//                           pool.query(
//                             insertCostingMasterQuery,
//                             [
//                               costingMasterData.costingName,
//                               costingMasterData.costing_date,
//                               costingMasterData.oltctext,
//                               enquiryid,
//                               costingMasterData.uid,
//                               costingMasterData.accessories,
//                               costingMasterData.labourcharges,
//                               costingMasterData.miscexpense,
//                             ],
//                             (err, insertCostingMasterResult) => {
//                               if (err) {
//                                 console.log(err);
//                                 return res
//                                   .status(500)
//                                   .send("Internal Server Error", err);
//                               }

//                               if (insertCostingMasterResult.affectedRows > 0) {
//                                 cid = insertCostingMasterResult.insertId;
//                                 continueCostingOperations2(cid);

//                                 const updateEnquiryMasterQuery =
//                                   "UPDATE enquiry_master SET cid = ?, enqstatus = 3 WHERE id = ?";
//                                 pool.query(
//                                   updateEnquiryMasterQuery,
//                                   [cid, enquiryid],
//                                   (err, updateEnquiryMasterResult) => {
//                                     if (err) {
//                                       console.log(err);
//                                       return res
//                                         .status(500)
//                                         .send("Internal Server Error", err);
//                                     }
//                                   }
//                                 );
//                               } else {
//                                 return res
//                                   .status(500)
//                                   .send(
//                                     "Failed to insert new entry in costing_master2"
//                                   );
//                               }
//                             }
//                           );
//                         } else {
//                           return res
//                             .status(404)
//                             .send("Costing with Costing Name not found.");
//                         }
//                       }
//                     );
//                   } else {
//                     continueCostingOperations2(cid);
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     );
//   }

//   function continueCostingOperations(cid) {
//     const fetchCostingMasterQuery =
//       "SELECT * FROM costing_master WHERE costingname=?";
//     pool.query(
//       fetchCostingMasterQuery,
//       [req.body.costingName],
//       (err, fetchCostingMasterResult) => {
//         if (err) {
//           return res.status(500).send("Internal Server Error");
//         }

//         if (fetchCostingMasterResult.length > 0) {
//           const costingMasterData = fetchCostingMasterResult[0];

//           const checkEnquiryMasterQuery =
//             "SELECT * FROM costing_master WHERE eid=?";
//           pool.query(
//             checkEnquiryMasterQuery,
//             [req.params.id],
//             (err, checkEnquiryMasterResult) => {
//               if (err) {
//                 return res.status(500).send("Internal Server Error");
//               }

//               if (checkEnquiryMasterResult.length === 0) {
//                 const insertCostingMasterQuery = `
//                 INSERT INTO costing_master ( costing_date, oltctext, eid,uid, accessories, labourcharges, miscexpense) 
//                 VALUES (?, ?, ?, ?, ?, ?, ?)
//               `;
//                 pool.query(
//                   insertCostingMasterQuery,
//                   [
//                     costingMasterData.costing_date,
//                     costingMasterData.oltctext,
//                     req.params.id,
//                     costingMasterData.uid,
//                     costingMasterData.accessories,
//                     costingMasterData.labourcharges,
//                     costingMasterData.miscexpense,
//                   ],
//                   (err, insertCostingMasterResult) => {
//                     if (err) {
//                       return res.status(500).send("Internal Server Error");
//                     }

//                     const fetchEidAndIdQuery =
//                       "SELECT eid, id FROM costing_master2 WHERE eid=?";
//                     pool.query(
//                       fetchEidAndIdQuery,
//                       [req.params.id],
//                       (err, fetchEidAndIdResult) => {
//                         if (err) {
//                           return res.status(500).send("Internal Server Error");
//                         }

//                         const deleteCostingMaster2Query =
//                           "DELETE FROM costing_master2 WHERE eid=?";
//                         pool.query(
//                           deleteCostingMaster2Query,
//                           [req.params.id],
//                           (err, deleteCostingMaster2Result) => {
//                             if (err) {
//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error");
//                             }

//                             deleteCostingDetails2(fetchEidAndIdResult[0].id);
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               } else {
//                 updateCostingMaster();
//               }
//             }
//           );

//           function deleteCostingDetails2(costingMasterId) {
//             const deleteCostingDetails2Query =
//               "DELETE FROM costing_details2 WHERE cid=?";
//             pool.query(
//               deleteCostingDetails2Query,
//               [costingMasterId],
//               (err, deleteCostingDetails2Result) => {
//                 if (err) {
//                   return res.status(500).send("Internal Server Error");
//                 }

//                 updateCostingMaster(costingMasterId);
//               }
//             );
//           }

//           async function updateCostingMaster(costingMasterId) {
//             const updateCostingMasterQuery = `
//                 UPDATE costing_master 
//                 SET costing_date=?, oltctext=?, uid=?, accessories=?, 
//                 labourcharges=?, miscexpense=?  
//                 WHERE id=?
//             `;

//             try {
//               // Update costing master
//               await new Promise((resolve, reject) => {
//                 pool.query(
//                   updateCostingMasterQuery,
//                   [
//                     costingMasterData.costing_date,
//                     costingMasterData.oltctext,
//                     costingMasterData.uid,
//                     costingMasterData.accessories,
//                     costingMasterData.labourcharges,
//                     costingMasterData.miscexpense,
//                     costingMasterId,
//                   ],
//                   (err, updateCostingMasterResult) => {
//                     if (err) {
//                       return reject(err);
//                     }
//                     resolve(updateCostingMasterResult);
//                   }
//                 );
//               });

//               // Fetch costing details
//               const fetchCostingDetailsResult = await new Promise(
//                 (resolve, reject) => {
//                   const fetchCostingDetailsQuery =
//                     "SELECT * FROM costing_details WHERE cid=? AND mid IS NOT NULL;";
//                   pool.query(
//                     fetchCostingDetailsQuery,
//                     [costingMasterData.id],
//                     (err, result) => {
//                       if (err) {
//                         return reject(err);
//                       }
//                       resolve(result);
//                     }
//                   );
//                 }
//               );

//               // Fetch costing master ID
//               const fetchCostingDetailscidResult = await new Promise(
//                 (resolve, reject) => {
//                   const fetchCostingDetailscid =
//                     "SELECT id FROM costing_master WHERE eid=?";
//                   pool.query(
//                     fetchCostingDetailscid,
//                     [req.params.id],
//                     (err, result) => {
//                       if (err) {
//                         return reject(err);
//                       }
//                       resolve(result);
//                     }
//                   );
//                 }
//               );

//               const cidfromcostinh1 = fetchCostingDetailscidResult[0].id;

//               // Define insert query
//               const insertCostingDetailsQuery = `
//                     INSERT INTO costing_details (cid, mid, quantity, rate, amount) 
//                     VALUES (?, ?, ?, ?, ?)
//                 `;

//               // Insert costing details
//               for (let i = 0; i < fetchCostingDetailsResult.length; i++) {
//                 const item = fetchCostingDetailsResult[i];

//                 const values = [
//                   cidfromcostinh1,
//                   item.mid,
//                   parseInt(item.quantity),
//                   parseFloat(item.rate),
//                   parseFloat(item.amount),
//                 ];

//                 await new Promise((resolve, reject) => {
//                   pool.query(
//                     insertCostingDetailsQuery,
//                     values,
//                     (err, result) => {
//                       if (err) {
//                         console.error("Error inserting costing details:", err);
//                         return reject(err);
//                       }
//                       resolve(result);
//                     }
//                   );
//                 });
//               }

//               // Update enquiry master
//               const updateEntryMasterResult = await new Promise(
//                 (resolve, reject) => {
//                   const updateEntryMasterQuery =
//                     "UPDATE enquiry_master SET cid=? WHERE id=?";
//                   pool.query(
//                     updateEntryMasterQuery,
//                     [cidfromcostinh1, req.params.id],
//                     (err, result) => {
//                       if (err) {
//                         return reject(err);
//                       }
//                       resolve(result);
//                     }
//                   );
//                 }
//               );

//               if (updateEntryMasterResult.affectedRows > 0) {
//                 return res.send(
//                   "Updated with Costing Details deleted, inserted, and Entry Master updated"
//                 );
//               } else {
//                 return res.status(500).send("Failed to update Entry Master");
//               }
//             } catch (err) {
//               console.error("Internal Server Error:", err);
//               return res.status(500).send("Internal Server Error");
//             }
//           }
//         } else {
//           return res.status(404).send("Costing with Costing Name not found.");
//         }
//       }
//     );
//   }

//   function continueCostingOperations2(cid) {
//     const fetchCostingMasterQuery =
//       "SELECT * FROM costing_master2 WHERE costingname=?";
//     pool.query(
//       fetchCostingMasterQuery,
//       [req.body.costingName],
//       (err, fetchCostingMasterResult) => {
//         if (err) {
//           return res.status(500).send("Internal Server Error");
//         }

//         if (fetchCostingMasterResult.length > 0) {
//           const costingMasterData = fetchCostingMasterResult[0];

//           const checkEnquiryMasterQuery =
//             "SELECT * FROM costing_master2 WHERE eid=?";
//           pool.query(
//             checkEnquiryMasterQuery,
//             [req.params.id],
//             (err, checkEnquiryMasterResult) => {
//               if (err) {
//                 return res.status(500).send("Internal Server Error");
//               }

//               if (checkEnquiryMasterResult.length === 0) {
//                 const insertCostingMaster2Query = `
//               INSERT INTO costing_master2 ( costing_date, oltctext, eid,uid, accessories, labourcharges, miscexpense) 
//               VALUES (?, ?, ?, ?, ?, ?, ?)
//             `;
//                 pool.query(
//                   insertCostingMaster2Query,
//                   [
//                     costingMasterData.costing_date,
//                     costingMasterData.oltctext,
//                     req.params.id,
//                     costingMasterData.uid,
//                     costingMasterData.accessories,
//                     costingMasterData.labourcharges,
//                     costingMasterData.miscexpense,
//                   ],
//                   (err, insertCostingMaster2Result) => {
//                     if (err) {
//                       return res.status(500).send("Internal Server Error");
//                     }

//                     const fetchEidQuery =
//                       "SELECT eid,id FROM costing_master WHERE eid=?";
//                     pool.query(
//                       fetchEidQuery,
//                       [req.params.id],
//                       (err, fetchEidResult) => {
//                         if (err) {
//                           return res.status(500).send("Internal Server Error");
//                         }

//                         const deleteCostingMaster2Query =
//                           "DELETE FROM costing_master WHERE eid=?";
//                         pool.query(
//                           deleteCostingMaster2Query,
//                           [req.params.id],
//                           (err, deleteCostingMaster2Result) => {
//                             if (err) {
//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error");
//                             }

//                             deleteCostingMaster1(fetchEidResult[0].id);
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               } else {
//                 updateCostingMaster();
//               }
//             }
//           );

//           function deleteCostingMaster1(costingMasterId) {
//             const deleteCostingDetails2Query =
//               "DELETE FROM costing_details WHERE cid=?";
//             pool.query(
//               deleteCostingDetails2Query,
//               [costingMasterId],
//               (err, deleteCostingDetails2Result) => {
//                 if (err) {
//                   return res.status(500).send("Internal Server Error");
//                 }

//                 updateCostingMaster(costingMasterId);
//               }
//             );
//           }

//           function updateCostingMaster(costingMasterId) {
//             const updateCostingMasterQuery = `
//           UPDATE costing_master2 
//           SET costing_date=?, oltctext=?, uid=?, accessories=?, 
//           labourcharges=?, miscexpense=?  
//           WHERE id=?
//       `;

//             pool.query(
//               updateCostingMasterQuery,
//               [
//                 costingMasterData.costing_date,
//                 costingMasterData.oltctext,
//                 costingMasterData.uid,
//                 costingMasterData.accessories,
//                 costingMasterData.labourcharges,
//                 costingMasterData.miscexpense,
//                 costingMasterId,
//               ],
//               (err, updateCostingMasterResult) => {
//                 if (err) {
//                   return res.status(500).send("Internal Server Error");
//                 }

//                 const fetchCostingDetailsQuery =
//                   "SELECT * FROM costing_details2 WHERE cid=?";
//                 pool.query(
//                   fetchCostingDetailsQuery,
//                   [costingMasterData.id],
//                   (err, fetchCostingDetailsResult) => {
//                     if (err) {
//                       return res.status(500).send("Internal Server Error");
//                     }

//                     const deleteCostingDetailsQuery =
//                       "DELETE FROM costing_details2 WHERE cid=?";
//                     pool.query(
//                       deleteCostingDetailsQuery,
//                       [cid],
//                       (err, deleteCostingDetailsResult) => {
//                         if (err) {
//                           return res.status(500).send("Internal Server Error");
//                         }

//                         const fetchCostingDetailscid =
//                           "SELECT id FROM costing_master2 WHERE eid=?";
//                         pool.query(
//                           fetchCostingDetailscid,
//                           [req.params.id],
//                           (err, fetchCostingDetailscidResult) => {
//                             if (err) {
//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error");
//                             }

//                             const cidfromcostinh1 =
//                               fetchCostingDetailscidResult[0].id;

//                             const insertCostingDetailsQuery = `
//                               INSERT INTO costing_details2 (cid, mid, quantity, rate, amount) 
//                               VALUES (?, ?, ?, ?, ?)
//                           `;

//                             const insertPromises = [];

//                             // Use a for loop to create promises for each row insertion
//                             for (
//                               let i = 0;
//                               i < fetchCostingDetailsResult.length;
//                               i++
//                             ) {
//                               const item = fetchCostingDetailsResult[i];
//                               const values = [
//                                 cidfromcostinh1,
//                                 item.mid,
//                                 parseInt(item.quantity),
//                                 parseFloat(item.rate),
//                                 parseFloat(item.amount),
//                               ];

//                               const insertPromise = new Promise(
//                                 (resolve, reject) => {
//                                   pool.query(
//                                     insertCostingDetailsQuery,
//                                     values,
//                                     (err, result) => {
//                                       if (err) {
//                                         reject(err);
//                                       } else {
//                                         resolve(result);
//                                       }
//                                     }
//                                   );
//                                 }
//                               );

//                               insertPromises.push(insertPromise);
//                             }

//                             // Wait for all promises to resolve
//                             Promise.all(insertPromises)
//                               .then(() => {
//                                 const updateEntryMasterQuery =
//                                   "UPDATE enquiry_master SET cid=? WHERE id=?";
//                                 pool.query(
//                                   updateEntryMasterQuery,
//                                   [cidfromcostinh1, req.params.id],
//                                   (err, updateEntryMasterResult) => {
//                                     if (err) {
//                                       return res
//                                         .status(500)
//                                         .send("Internal Server Error");
//                                     }

//                                     if (
//                                       updateEntryMasterResult.affectedRows > 0
//                                     ) {
//                                       return res.send(
//                                         "Updated with Costing Details deleted, inserted, and Entry Master updated"
//                                       );
//                                     } else {
//                                       return res
//                                         .status(500)
//                                         .send("Failed to update Entry Master");
//                                     }
//                                   }
//                                 );
//                               })
//                               .catch((err) => {
//                                 return res
//                                   .status(500)
//                                   .send("Internal Server Error");
//                               });
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               }
//             );
//           }
//         } else {
//           return res.status(404).send("Costing with Costing Name not found.");
//         }
//       }
//     );
//   }
// });

// router.put("/updateEnquiry/:id", (req, res) => {
//   let taping;
//   if (req.body.typetaping == "other" || req.body.typetaping == "others") {
//     taping = req.body.otherTypetaping;
//   } else {
//     taping = req.body.typetaping;
//   }
//   if (req.body.tapingSwitch == "notapping") {
//     taping = "No Tapping";
//   }
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();

//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;

//     return [day, month, year].join("-");
//   };

//   // Function to check if date is in DD-MM-YYYY format
//   const isDateInDDMMYYYYFormat = (dateString) => {
//     const regex = /^\d{2}-\d{2}-\d{4}$/;
//     return regex.test(dateString);
//   };

//   // Main logic to process edate
//   const processDate = (edate) => {
//     if (edate && !isDateInDDMMYYYYFormat(edate)) {
//       return formatDate(edate);
//     }
//     return edate;
//   };

//   const edate = req.body.edate;
//   const formattedDate = processDate(edate);

//   // Check for duplicate record with same specifications
//   const checkDuplicateQuery = `
//     SELECT id, enqstatus 
//     FROM enquiry_master 
//     WHERE capacity = ? 
//     AND type = ? 
//     AND hvvoltage = ? 
//     AND consumertype = ? 
//     AND lvvoltage = ? 
//     AND vectorgroup = ? 
//     AND matofwind = ? 
//     AND typecolling = ? 
//     AND priratio = ? 
//     AND core = ? 
//     AND secratio = ? 
//     AND frequency = ? 
//     AND phase = ? 
//     AND typetaping = ? 
//     AND tapingSwitch = ?
//     AND id != ?
//   `;

//   // Replace the existing duplicate check section with this updated version

//   pool.query(
//     checkDuplicateQuery,
//     [
//       req.body.capacity,
//       req.body.type,
//       req.body.hvvoltage,
//       req.body.consumertype,
//       req.body.lvvoltage,
//       req.body.vectorgroup,
//       req.body.matofwind,
//       req.body.typecolling,
//       req.body.priratio,
//       req.body.core,
//       req.body.secratio,
//       req.body.frequency,
//       req.body.phase,
//       taping,
//       req.body.tapingSwitch,
//       req.params.id
//     ],
//     (err, duplicateResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error", err);
//       }

//       // If duplicate record found, set current record status to 10
//       if (duplicateResult.length > 0) {
//         const duplicateId = duplicateResult[0].id;
//         console.log(`4032Duplicate record found with ID: ${duplicateId}, setting current record ID: ${req.params.id} status to 10`);

//         const updateCurrentStatusQuery = `
//         UPDATE enquiry_master 
//         SET enqstatus = 10 
//         WHERE id = ?
//       `;

//         pool.query(
//           updateCurrentStatusQuery,
//           [req.params.id],
//           (err, updateStatusResult) => {
//             if (err) {
//               console.log(err);
//               return res.status(500).send("Internal Server Error", err);
//             }
//             console.log(`4048Successfully updated current record ID: ${req.params.id} to status: 10`);
//           }
//         );

//         // Continue with the original update logic
//         proceedWithUpdate();
//       }
//       // If no duplicate found, check current status of the record being updated
//       else {
//         console.log("4057No duplicate record found, checking current status");

//         const getCurrentStatusQuery = `
//         SELECT enqstatus 
//         FROM enquiry_master 
//         WHERE id = ?
//       `;

//         pool.query(
//           getCurrentStatusQuery,
//           [req.params.id],
//           (err, currentStatusResult) => {
//             if (err) {
//               console.log(err);
//               return res.status(500).send("Internal Server Error", err);
//             }

//             if (currentStatusResult.length > 0) {
//               const currentStatus = currentStatusResult[0].enqstatus;

//               if (currentStatus == 10) {
//                 // If current status is 10, change to 0
//                 console.log(`4079Current status is 10, changing to 0 for record ID: ${req.params.id}`);

//                 const updateCurrentStatusQuery = `
//                 UPDATE enquiry_master 
//                 SET enqstatus = 0 
//                 WHERE id = ?
//               `;

//                 pool.query(
//                   updateCurrentStatusQuery,
//                   [req.params.id],
//                   (err, updateResult) => {
//                     if (err) {
//                       console.log(err);
//                       return res.status(500).send("Internal Server Error", err);
//                     }
//                     console.log(`4095Successfully updated current record status from 10 to 0`);

//                     // Continue with the original update logic
//                     proceedWithUpdate();
//                   }
//                 );
//               } else {
//                 // If current status is not 10, keep it unchanged
//                 console.log(`4103Current status is ${currentStatus}, keeping it unchanged for record ID: ${req.params.id}`);

//                 // Continue with the original update logic
//                 proceedWithUpdate();
//               }
//             } else {
//               console.log("Record not found");
//               return res.status(404).send("Record not found");
//             }
//           }
//         );
//       }
//     }
//   );

//   function proceedWithUpdate() {
//     const updateEnquiryQuery = `
//       UPDATE enquiry_master 
//       SET custname=?,
//        contactperson=?,
//         desg=?, 
//         email=?,
//          contactno=?,
//           altcontactno=?, 
//       address=?,
//        currency=?, 
//        edate=?, 
//        capacity=?, 
//        type=?, 
//        hvvoltage=?, 
//        consumertype=?, 
//       lvvoltage=?, 
//       areaofdispatch=?, 
//       vectorgroup=?, 
//       matofwind=?, 
//       typecolling=?, 
//       typetaping=?, 
//       comment=?, 
//       voltageratio=?, 
//       core=?, 
//       secratio=?, 
//       priratio=?, 
//       selectedcosting=?, 
//       frequency=?, 
//       phase=? ,
//       tapingSwitch=?
//       WHERE id=?
//     `;

//     pool.query(
//       updateEnquiryQuery,
//       [
//         req.body.custname,
//         req.body.contactperson,
//         req.body.desg,
//         req.body.email,
//         req.body.contactno,
//         req.body.altcontactno,
//         req.body.address,
//         req.body.currency,
//         formattedDate,
//         req.body.capacity,
//         req.body.type,
//         req.body.hvvoltage,
//         req.body.consumertype,
//         req.body.lvvoltage,
//         req.body.areaofdispatch,
//         req.body.vectorgroup,
//         req.body.matofwind,
//         req.body.typecolling,
//         taping,
//         req.body.comment,
//         req.body.voltageratio,
//         req.body.core,
//         req.body.secratio,
//         req.body.priratio,
//         req.body.costingName,
//         req.body.frequency,
//         req.body.phase,
//         req.body.tapingSwitch,
//         req.params.id,
//       ],
//       (err, updateEnquiryResult) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).send("Internal Server Error", err);
//         }

//         console.log("4191Enquiry updated successfully", updateEnquiryResult);


//         const checkCostingNameQuery =
//           "SELECT COUNT(*) AS nameCount FROM costing_master WHERE costingname = ?";

//         pool.query(
//           checkCostingNameQuery,
//           [req.body.costingName],
//           (err, checkCostingNameResult) => {
//             if (err) {
//               console.log(err);
//               return res.status(500).send("Internal Server Error");
//             }
//             console.log("4205checkCostingNameResult", checkCostingNameResult);


//             const nameCount = checkCostingNameResult[0].nameCount;

//             if (nameCount > 0) {
//               let enquiryid = req.params.id;

//               const fetchCIDQuery = "SELECT cid FROM enquiry_master WHERE id=?";

//               pool.query(
//                 fetchCIDQuery,
//                 [req.params.id],
//                 (err, fetchCIDResult) => {
//                   if (err) {
//                     console.log(err);
//                     return res.status(500).send("Internal Server Error", err);
//                   }

//                   console.log("4224fetchCIDResult", fetchCIDResult);

//                   let cid =
//                     fetchCIDResult.length > 0 ? fetchCIDResult[0].cid : null;

//                   if (fetchCIDResult[0].cid === null) {
//                     const fetchCostingMasterQuery =
//                       "SELECT * FROM costing_master WHERE costingname=?";
//                     pool.query(
//                       fetchCostingMasterQuery,
//                       [req.body.costingName],
//                       (err, fetchCostingMasterResult) => {
//                         if (err) {
//                           console.log(err);
//                           return res.status(500).send("Internal Server Error", err);
//                         }
//                         console.log("4240fetchCostingMasterResult", fetchCostingMasterResult);


//                         if (fetchCostingMasterResult.length > 0) {
//                           const costingMasterData = fetchCostingMasterResult[0];

//                           const insertCostingMasterQuery = `
//                       INSERT INTO costing_master (costingname, costing_date, oltctext,eid, uid, accessories, 
//                         labourcharges, miscexpense) 
//                       VALUES (?, ?, ?,?, ?, ?, ?, ?)
//                     `;

//                           pool.query(
//                             insertCostingMasterQuery,
//                             [
//                               costingMasterData.costingName,
//                               costingMasterData.costing_date,
//                               costingMasterData.oltctext,
//                               enquiryid,
//                               costingMasterData.uid,
//                               costingMasterData.accessories,
//                               costingMasterData.labourcharges,
//                               costingMasterData.miscexpense,
//                             ],
//                             (err, insertCostingMasterResult) => {
//                               if (err) {
//                                 console.log(err);
//                                 return res
//                                   .status(500)
//                                   .send("Internal Server Error", err);
//                               }
//                               console.log("4271insertCostingMasterResult", insertCostingMasterResult);


//                               if (insertCostingMasterResult.affectedRows > 0) {
//                                 cid = insertCostingMasterResult.insertId;

//                                 continueCostingOperations(cid);

//                                 const updateEnquiryMasterQuery =
//                                   "UPDATE enquiry_master SET cid = ?, enqstatus = 3 WHERE id = ?";
//                                 pool.query(
//                                   updateEnquiryMasterQuery,
//                                   [cid, enquiryid],
//                                   (err, updateEnquiryMasterResult) => {
//                                     if (err) {
//                                       console.log(err);
//                                       return res
//                                         .status(500)
//                                         .send("Internal Server Error", err);
//                                     }
//                                     console.log("4291updateEnquiryMasterResult", updateEnquiryMasterResult);

//                                   }
//                                 );
//                               } else {
//                                 return res
//                                   .status(500)
//                                   .send(
//                                     "Failed to insert new entry in costing_master2"
//                                   );
//                               }
//                             }
//                           );
//                         } else {
//                           return res
//                             .status(404)
//                             .send("Costing with Costing Name not found.");
//                         }
//                       }
//                     );
//                   } else {
//                     continueCostingOperations(cid);
//                   }
//                 }
//               );
//             } else {
//               let enquiryid = req.params.id;

//               const fetchCIDQuery = "SELECT cid FROM enquiry_master WHERE id=?";

//               pool.query(
//                 fetchCIDQuery,
//                 [req.params.id],
//                 (err, fetchCIDResult) => {
//                   if (err) {
//                     console.log(err);
//                     return res.status(500).send("Internal Server Error", err);
//                   }
//                   console.log("4329fetchCIDResult", fetchCIDResult);

//                   let cid =
//                     fetchCIDResult.length > 0 ? fetchCIDResult[0].cid : null;

//                   if (fetchCIDResult[0].cid === null) {
//                     const fetchCostingMasterQuery =
//                       "SELECT * FROM costing_master2 WHERE costingname=?";
//                     pool.query(
//                       fetchCostingMasterQuery,
//                       [req.body.costingName],
//                       (err, fetchCostingMasterResult) => {
//                         if (err) {
//                           console.log(err);
//                           return res.status(500).send("Internal Server Error", err);
//                         }
//                         console.log("4345fetchCostingMasterResult", fetchCostingMasterResult);

//                         if (fetchCostingMasterResult.length > 0) {
//                           const costingMasterData = fetchCostingMasterResult[0];

//                           const insertCostingMasterQuery = `
//                       INSERT INTO costing_master2 (costingname, costing_date, oltctext,eid, uid, accessories, 
//                         labourcharges, miscexpense) 
//                       VALUES (?, ?, ?,?, ?, ?, ?, ?)
//                     `;

//                           pool.query(
//                             insertCostingMasterQuery,
//                             [
//                               costingMasterData.costingName,
//                               costingMasterData.costing_date,
//                               costingMasterData.oltctext,
//                               enquiryid,
//                               costingMasterData.uid,
//                               costingMasterData.accessories,
//                               costingMasterData.labourcharges,
//                               costingMasterData.miscexpense,
//                             ],
//                             (err, insertCostingMasterResult) => {
//                               if (err) {
//                                 console.log(err);
//                                 return res
//                                   .status(500)
//                                   .send("Internal Server Error", err);
//                               }
//                               console.log("4375insertCostingMasterResult", insertCostingMasterResult);

//                               if (insertCostingMasterResult.affectedRows > 0) {
//                                 cid = insertCostingMasterResult.insertId;
//                                 continueCostingOperations2(cid);

//                                 const updateEnquiryMasterQuery =
//                                   "UPDATE enquiry_master SET cid = ?, enqstatus = 3 WHERE id = ?";
//                                 pool.query(
//                                   updateEnquiryMasterQuery,
//                                   [cid, enquiryid],
//                                   (err, updateEnquiryMasterResult) => {
//                                     if (err) {
//                                       console.log(err);
//                                       return res
//                                         .status(500)
//                                         .send("Internal Server Error", err);
//                                     }
//                                     console.log("4393updateEnquiryMasterResult", updateEnquiryMasterResult);
//                                   }
//                                 );
//                               } else {
//                                 return res
//                                   .status(500)
//                                   .send(
//                                     "Failed to insert new entry in costing_master2"
//                                   );
//                               }
//                             }
//                           );
//                         } else {
//                           return res
//                             .status(404)
//                             .send("Costing with Costing Name not found.");
//                         }
//                       }
//                     );
//                   } else {
//                     continueCostingOperations2(cid);
//                   }
//                 }
//               );
//             }
//           }
//         );
//       }
//     );
//   }

//   // Rest of the functions remain the same...
//   function continueCostingOperations(cid) {
//     const fetchCostingMasterQuery =
//       "SELECT * FROM costing_master WHERE costingname=?";
//     pool.query(
//       fetchCostingMasterQuery,
//       [req.body.costingName],
//       (err, fetchCostingMasterResult) => {
//         if (err) {
//           return res.status(500).send("Internal Server Error");
//         }
//         console.log("4435fetchCostingMasterResult", fetchCostingMasterResult);


//         if (fetchCostingMasterResult.length > 0) {
//           const costingMasterData = fetchCostingMasterResult[0];

//           const checkEnquiryMasterQuery =
//             "SELECT * FROM costing_master WHERE eid=?";
//           pool.query(
//             checkEnquiryMasterQuery,
//             [req.params.id],
//             (err, checkEnquiryMasterResult) => {
//               if (err) {
//                 return res.status(500).send("Internal Server Error");
//               }
//               console.log("4450checkEnquiryMasterResult", checkEnquiryMasterResult);


//               if (checkEnquiryMasterResult.length === 0) {
//                 const insertCostingMasterQuery = `
//                 INSERT INTO costing_master ( costing_date, oltctext, eid,uid, accessories, labourcharges, miscexpense) 
//                 VALUES (?, ?, ?, ?, ?, ?, ?)
//               `;
//                 pool.query(
//                   insertCostingMasterQuery,
//                   [
//                     costingMasterData.costing_date,
//                     costingMasterData.oltctext,
//                     req.params.id,
//                     costingMasterData.uid,
//                     costingMasterData.accessories,
//                     costingMasterData.labourcharges,
//                     costingMasterData.miscexpense,
//                   ],
//                   (err, insertCostingMasterResult) => {
//                     if (err) {
//                       return res.status(500).send("Internal Server Error");
//                     }
//                     console.log("4473insertCostingMasterResult", insertCostingMasterResult);

//                     const fetchEidAndIdQuery =
//                       "SELECT eid, id FROM costing_master2 WHERE eid=?";
//                     pool.query(
//                       fetchEidAndIdQuery,
//                       [req.params.id],
//                       (err, fetchEidAndIdResult) => {
//                         if (err) {
//                           return res.status(500).send("Internal Server Error");
//                         }
//                         console.log("4484fetchEidAndIdResult", fetchEidAndIdResult);

//                         const deleteCostingMaster2Query =
//                           "DELETE FROM costing_master2 WHERE eid=?";
//                         pool.query(
//                           deleteCostingMaster2Query,
//                           [req.params.id],
//                           (err, deleteCostingMaster2Result) => {
//                             if (err) {
//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error");
//                             }
//                             console.log("4497deleteCostingMaster2Result", deleteCostingMaster2Result);


//                             deleteCostingDetails2(fetchEidAndIdResult[0].id);
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               } else {
//                 updateCostingMaster();
//               }
//             }
//           );

//           function deleteCostingDetails2(costingMasterId) {
//             const deleteCostingDetails2Query =
//               "DELETE FROM costing_details2 WHERE cid=?";
//             pool.query(
//               deleteCostingDetails2Query,
//               [costingMasterId],
//               (err, deleteCostingDetails2Result) => {
//                 if (err) {
//                   return res.status(500).send("Internal Server Error");
//                 }
//                 console.log("4523deleteCostingDetails2Result", deleteCostingDetails2Result);

//                 updateCostingMaster(costingMasterId);
//               }
//             );
//           }

//           async function updateCostingMaster(costingMasterId) {
//             const updateCostingMasterQuery = `
//                 UPDATE costing_master 
//                 SET costing_date=?, oltctext=?, uid=?, accessories=?, 
//                 labourcharges=?, miscexpense=?  
//                 WHERE id=?
//             `;

//             try {
//               // Update costing master
//               await new Promise((resolve, reject) => {
//                 pool.query(
//                   updateCostingMasterQuery,
//                   [
//                     costingMasterData.costing_date,
//                     costingMasterData.oltctext,
//                     costingMasterData.uid,
//                     costingMasterData.accessories,
//                     costingMasterData.labourcharges,
//                     costingMasterData.miscexpense,
//                     costingMasterId,
//                   ],
//                   (err, updateCostingMasterResult) => {
//                     if (err) {
//                       return reject(err);
//                     }
//                     console.log("4556updateCostingMasterResult", updateCostingMasterResult);

//                     resolve(updateCostingMasterResult);
//                   }
//                 );
//               });

//               // Fetch costing details
//               const fetchCostingDetailsResult = await new Promise(
//                 (resolve, reject) => {
//                   const fetchCostingDetailsQuery =
//                     "SELECT * FROM costing_details WHERE cid=? AND mid IS NOT NULL;";
//                   pool.query(
//                     fetchCostingDetailsQuery,
//                     [costingMasterData.id],
//                     (err, result) => {
//                       if (err) {
//                         return reject(err);
//                       }
//                       console.log("4575fetchCostingDetailsResult", result);

//                       resolve(result);
//                     }
//                   );
//                 }
//               );

//               // Fetch costing master ID
//               const fetchCostingDetailscidResult = await new Promise(
//                 (resolve, reject) => {
//                   const fetchCostingDetailscid =
//                     "SELECT id FROM costing_master WHERE eid=?";
//                   pool.query(
//                     fetchCostingDetailscid,
//                     [req.params.id],
//                     (err, result) => {
//                       if (err) {
//                         return reject(err);
//                       }
//                       console.log("4595fetchCostingDetailscidResult", result);
//                       resolve(result);
//                     }
//                   );
//                 }
//               );

//               const cidfromcostinh1 = fetchCostingDetailscidResult[0].id;

//               // Define insert query
//               const insertCostingDetailsQuery = `
//                     INSERT INTO costing_details (cid, mid, quantity, rate, amount) 
//                     VALUES (?, ?, ?, ?, ?)
//                 `;

//               // Insert costing details
//               for (let i = 0; i < fetchCostingDetailsResult.length; i++) {
//                 const item = fetchCostingDetailsResult[i];

//                 const values = [
//                   cidfromcostinh1,
//                   item.mid,
//                   parseInt(item.quantity),
//                   parseFloat(item.rate),
//                   parseFloat(item.amount),
//                 ];

//                 await new Promise((resolve, reject) => {
//                   pool.query(
//                     insertCostingDetailsQuery,
//                     values,
//                     (err, result) => {
//                       if (err) {
//                         console.error("Error inserting costing details:", err);
//                         return reject(err);
//                       }
//                       console.log("4631Inserted costing detail:", result);

//                       resolve(result);
//                     }
//                   );
//                 });
//               }

//               // Update enquiry master
//               const updateEntryMasterResult = await new Promise(
//                 (resolve, reject) => {
//                   const updateEntryMasterQuery =
//                     "UPDATE enquiry_master SET cid=? WHERE id=?";
//                   pool.query(
//                     updateEntryMasterQuery,
//                     [cidfromcostinh1, req.params.id],
//                     (err, result) => {
//                       if (err) {
//                         return reject(err);
//                       }
//                       console.log("4651updateEntryMasterResult", result);

//                       resolve(result);
//                     }
//                   );
//                 }
//               );

//               if (updateEntryMasterResult.affectedRows > 0) {
//                 return res.send(
//                   "Updated with Costing Details deleted, inserted, and Entry Master updated"
//                 );
//               } else {
//                 return res.status(500).send("Failed to update Entry Master");
//               }
//             } catch (err) {
//               console.error("Internal Server Error:", err);
//               return res.status(500).send("Internal Server Error");
//             }
//           }
//         } else {
//           return res.status(404).send("Costing with Costing Name not found.");
//         }
//       }
//     );
//   }

//   function continueCostingOperations2(cid) {
//     const fetchCostingMasterQuery =
//       "SELECT * FROM costing_master2 WHERE costingname=?";
//     pool.query(
//       fetchCostingMasterQuery,
//       [req.body.costingName],
//       (err, fetchCostingMasterResult) => {
//         if (err) {
//           return res.status(500).send("Internal Server Error");
//         }

//         if (fetchCostingMasterResult.length > 0) {
//           const costingMasterData = fetchCostingMasterResult[0];

//           const checkEnquiryMasterQuery =
//             "SELECT * FROM costing_master2 WHERE eid=?";
//           pool.query(
//             checkEnquiryMasterQuery,
//             [req.params.id],
//             (err, checkEnquiryMasterResult) => {
//               if (err) {
//                 return res.status(500).send("Internal Server Error");
//               }

//               if (checkEnquiryMasterResult.length === 0) {
//                 const insertCostingMaster2Query = `
//               INSERT INTO costing_master2 ( costing_date, oltctext, eid,uid, accessories, labourcharges, miscexpense) 
//               VALUES (?, ?, ?, ?, ?, ?, ?)
//             `;
//                 pool.query(
//                   insertCostingMaster2Query,
//                   [
//                     costingMasterData.costing_date,
//                     costingMasterData.oltctext,
//                     req.params.id,
//                     costingMasterData.uid,
//                     costingMasterData.accessories,
//                     costingMasterData.labourcharges,
//                     costingMasterData.miscexpense,
//                   ],
//                   (err, insertCostingMaster2Result) => {
//                     if (err) {
//                       return res.status(500).send("Internal Server Error");
//                     }

//                     const fetchEidQuery =
//                       "SELECT eid,id FROM costing_master WHERE eid=?";
//                     pool.query(
//                       fetchEidQuery,
//                       [req.params.id],
//                       (err, fetchEidResult) => {
//                         if (err) {
//                           return res.status(500).send("Internal Server Error");
//                         }

//                         const deleteCostingMaster2Query =
//                           "DELETE FROM costing_master WHERE eid=?";
//                         pool.query(
//                           deleteCostingMaster2Query,
//                           [req.params.id],
//                           (err, deleteCostingMaster2Result) => {
//                             if (err) {
//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error");
//                             }

//                             deleteCostingMaster1(fetchEidResult[0].id);
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               } else {
//                 updateCostingMaster();
//               }
//             }
//           );

//           function deleteCostingMaster1(costingMasterId) {
//             const deleteCostingDetails2Query =
//               "DELETE FROM costing_details WHERE cid=?";
//             pool.query(
//               deleteCostingDetails2Query,
//               [costingMasterId],
//               (err, deleteCostingDetails2Result) => {
//                 if (err) {
//                   return res.status(500).send("Internal Server Error");
//                 }

//                 updateCostingMaster(costingMasterId);
//               }
//             );
//           }

//           function updateCostingMaster(costingMasterId) {
//             const updateCostingMasterQuery = `
//           UPDATE costing_master2 
//           SET costing_date=?, oltctext=?, uid=?, accessories=?, 
//           labourcharges=?, miscexpense=?  
//           WHERE id=?
//       `;

//             pool.query(
//               updateCostingMasterQuery,
//               [
//                 costingMasterData.costing_date,
//                 costingMasterData.oltctext,
//                 costingMasterData.uid,
//                 costingMasterData.accessories,
//                 costingMasterData.labourcharges,
//                 costingMasterData.miscexpense,
//                 costingMasterId,
//               ],
//               (err, updateCostingMasterResult) => {
//                 if (err) {
//                   return res.status(500).send("Internal Server Error");
//                 }

//                 const fetchCostingDetailsQuery =
//                   "SELECT * FROM costing_details2 WHERE cid=?";
//                 pool.query(
//                   fetchCostingDetailsQuery,
//                   [costingMasterData.id],
//                   (err, fetchCostingDetailsResult) => {
//                     if (err) {
//                       return res.status(500).send("Internal Server Error");
//                     }

//                     const deleteCostingDetailsQuery =
//                       "DELETE FROM costing_details2 WHERE cid=?";
//                     pool.query(
//                       deleteCostingDetailsQuery,
//                       [cid],
//                       (err, deleteCostingDetailsResult) => {
//                         if (err) {
//                           return res.status(500).send("Internal Server Error");
//                         }

//                         const fetchCostingDetailscid =
//                           "SELECT id FROM costing_master2 WHERE eid=?";
//                         pool.query(
//                           fetchCostingDetailscid,
//                           [req.params.id],
//                           (err, fetchCostingDetailscidResult) => {
//                             if (err) {
//                               return res
//                                 .status(500)
//                                 .send("Internal Server Error");
//                             }

//                             const cidfromcostinh1 =
//                               fetchCostingDetailscidResult[0].id;

//                             const insertCostingDetailsQuery = `
//                               INSERT INTO costing_details2 (cid, mid, quantity, rate, amount) 
//                               VALUES (?, ?, ?, ?, ?)
//                           `;

//                             const insertPromises = [];

//                             // Use a for loop to create promises for each row insertion
//                             for (
//                               let i = 0;
//                               i < fetchCostingDetailsResult.length;
//                               i++
//                             ) {
//                               const item = fetchCostingDetailsResult[i];
//                               const values = [
//                                 cidfromcostinh1,
//                                 item.mid,
//                                 parseInt(item.quantity),
//                                 parseFloat(item.rate),
//                                 parseFloat(item.amount),
//                               ];

//                               const insertPromise = new Promise(
//                                 (resolve, reject) => {
//                                   pool.query(
//                                     insertCostingDetailsQuery,
//                                     values,
//                                     (err, result) => {
//                                       if (err) {
//                                         reject(err);
//                                       } else {
//                                         resolve(result);
//                                       }
//                                     }
//                                   );
//                                 }
//                               );

//                               insertPromises.push(insertPromise);
//                             }

//                             // Wait for all promises to resolve
//                             Promise.all(insertPromises)
//                               .then(() => {
//                                 const updateEntryMasterQuery =
//                                   "UPDATE enquiry_master SET cid=? WHERE id=?";
//                                 pool.query(
//                                   updateEntryMasterQuery,
//                                   [cidfromcostinh1, req.params.id],
//                                   (err, updateEntryMasterResult) => {
//                                     if (err) {
//                                       return res
//                                         .status(500)
//                                         .send("Internal Server Error");
//                                     }

//                                     if (
//                                       updateEntryMasterResult.affectedRows > 0
//                                     ) {
//                                       return res.send(
//                                         "Updated with Costing Details deleted, inserted, and Entry Master updated"
//                                       );
//                                     } else {
//                                       return res
//                                         .status(500)
//                                         .send("Failed to update Entry Master");
//                                     }
//                                   }
//                                 );
//                               })
//                               .catch((err) => {
//                                 return res
//                                   .status(500)
//                                   .send("Internal Server Error");
//                               });
//                           }
//                         );
//                       }
//                     );
//                   }
//                 );
//               }
//             );
//           }
//         } else {
//           return res.status(404).send("Costing with Costing Name not found.");
//         }
//       }
//     );
//   }
// });

// router.put("/updateEnquiry/:id", (req, res) => {
//   let taping;
//   if (req.body.typetaping == "other" || req.body.typetaping == "others") {
//     taping = req.body.otherTypetaping;
//   } else {
//     taping = req.body.typetaping;
//   }
//   if (req.body.tapingSwitch == "notapping") {
//     taping = "No Tapping";
//   }

//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();

//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;

//     return [day, month, year].join("-");
//   };

//   // Function to check if date is in DD-MM-YYYY format
//   const isDateInDDMMYYYYFormat = (dateString) => {
//     const regex = /^\d{2}-\d{2}-\d{4}$/;
//     return regex.test(dateString);
//   };

//   // Main logic to process edate
//   const processDate = (edate) => {
//     if (edate && !isDateInDDMMYYYYFormat(edate)) {
//       return formatDate(edate);
//     }
//     return edate;
//   };

//   const edate = req.body.edate;
//   const formattedDate = processDate(edate);

//   // NEW: Check for duplicate specifications
//   const checkDuplicateQuery = `
//     SELECT id FROM enquiry_master 
//     WHERE capacity = ? AND type = ? AND hvvoltage = ? AND consumertype = ? 
//     AND lvvoltage = ? AND vectorgroup = ? AND matofwind = ? AND typecolling = ? 
//     AND priratio = ? AND core = ? AND secratio = ? AND frequency = ? 
//     AND phase = ? AND typetaping = ? AND tapingSwitch = ?
//     AND id != ?
//   `;

//   pool.query(
//     checkDuplicateQuery,
//     [
//       req.body.capacity,
//       req.body.type,
//       req.body.hvvoltage,
//       req.body.consumertype,
//       req.body.lvvoltage,
//       req.body.vectorgroup,
//       req.body.matofwind,
//       req.body.typecolling,
//       req.body.priratio,
//       req.body.core,
//       req.body.secratio,
//       req.body.frequency,
//       req.body.phase,
//       taping,
//       req.body.tapingSwitch,
//       req.params.id
//     ],
//     (err, duplicateResult) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error", err);
//       }

//       // If duplicates found, set status to 10 and return
//       if (duplicateResult.length > 0) {
//         const updateStatusQuery = "UPDATE enquiry_master SET enqstatus = 10 WHERE id = ?";
//         pool.query(updateStatusQuery, [req.params.id], (err, result) => {
//           if (err) {
//             console.log(err);
//             return res.status(500).send("Internal Server Error", err);
//           }
//           return res.send("Duplicate specifications found - status set to 10");
//         });
//         return;
//       }

//       // No duplicates - proceed with your original update logic and set enqstatus = 0
//       const updateEnquiryQuery = `
//         UPDATE enquiry_master 
//         SET custname=?,
//          contactperson=?,
//           desg=?, 
//           email=?,
//            contactno=?,
//             altcontactno=?, 
//         address=?,
//          currency=?, 
//          edate=?, 
//          capacity=?, 
//          type=?, 
//          hvvoltage=?, 
//          consumertype=?, 
//         lvvoltage=?, 
//         areaofdispatch=?, 
//         vectorgroup=?, 
//         matofwind=?, 
//         typecolling=?, 
//         typetaping=?, 
//         comment=?, 
//         voltageratio=?, 
//         core=?, 
//         secratio=?, 
//         priratio=?, 
//         selectedcosting=?, 
//         frequency=?, 
//         phase=?, 
//         tapingSwitch=?,
//         enqstatus=0
//         WHERE id=?
//       `;

//       pool.query(
//         updateEnquiryQuery,
//         [
//           req.body.custname,
//           req.body.contactperson,
//           req.body.desg,
//           req.body.email,
//           req.body.contactno,
//           req.body.altcontactno,
//           req.body.address,
//           req.body.currency,
//           formattedDate,
//           req.body.capacity,     // Make sure this matches the field in UPDATE
//           req.body.type,
//           req.body.hvvoltage,
//           req.body.consumertype,
//           req.body.lvvoltage,
//           req.body.areaofdispatch,
//           req.body.vectorgroup,
//           req.body.matofwind,
//           req.body.typecolling,
//           taping,
//           req.body.comment,
//           req.body.voltageratio,
//           req.body.core,
//           req.body.secratio,
//           req.body.priratio,
//           req.body.costingName,
//           req.body.frequency,
//           req.body.phase,
//           req.body.tapingSwitch,
//           req.params.id,    // This is for WHERE id=?
//         ],
//         (err, updateEnquiryResult) => {
//           if (err) {
//             console.log(err);
//             return res.status(500).send("Internal Server Error", err);
//           }

//           // Continue with your original costing logic below...
//           const checkCostingNameQuery =
//             "SELECT COUNT(*) AS nameCount FROM costing_master WHERE costingname = ?";

//           pool.query(
//             checkCostingNameQuery,
//             [req.body.costingName],
//             (err, checkCostingNameResult) => {
//               if (err) {
//                 console.log(err);
//                 return res.status(500).send("Internal Server Error");
//               }

//               const nameCount = checkCostingNameResult[0].nameCount;

//               if (nameCount > 0) {
//                 let enquiryid = req.params.id;

//                 const fetchCIDQuery = "SELECT cid FROM enquiry_master WHERE id=?";

//                 pool.query(
//                   fetchCIDQuery,
//                   [req.params.id],
//                   (err, fetchCIDResult) => {
//                     if (err) {
//                       console.log(err);
//                       return res.status(500).send("Internal Server Error", err);
//                     }

//                     let cid =
//                       fetchCIDResult.length > 0 ? fetchCIDResult[0].cid : null;

//                     if (fetchCIDResult[0].cid === null) {
//                       const fetchCostingMasterQuery =
//                         "SELECT * FROM costing_master WHERE costingname=?";
//                       pool.query(
//                         fetchCostingMasterQuery,
//                         [req.body.costingName],
//                         (err, fetchCostingMasterResult) => {
//                           if (err) {
//                             console.log(err);
//                             return res.status(500).send("Internal Server Error", err);
//                           }

//                           if (fetchCostingMasterResult.length > 0) {
//                             const costingMasterData = fetchCostingMasterResult[0];

//                             const insertCostingMasterQuery = `
//                         INSERT INTO costing_master (costingname, costing_date, oltctext,eid, uid, accessories, 
//                           labourcharges, miscexpense) 
//                         VALUES (?, ?, ?,?, ?, ?, ?, ?)
//                       `;

//                             pool.query(
//                               insertCostingMasterQuery,
//                               [
//                                 costingMasterData.costingName,
//                                 costingMasterData.costing_date,
//                                 costingMasterData.oltctext,
//                                 enquiryid,
//                                 costingMasterData.uid,
//                                 costingMasterData.accessories,
//                                 costingMasterData.labourcharges,
//                                 costingMasterData.miscexpense,
//                               ],
//                               (err, insertCostingMasterResult) => {
//                                 if (err) {
//                                   console.log(err);
//                                   return res
//                                     .status(500)
//                                     .send("Internal Server Error", err);
//                                 }

//                                 if (insertCostingMasterResult.affectedRows > 0) {
//                                   cid = insertCostingMasterResult.insertId;
//                                   continueCostingOperations(cid);

//                                   const updateEnquiryMasterQuery =
//                                     "UPDATE enquiry_master SET cid = ?, enqstatus = 3 WHERE id = ?";
//                                   pool.query(
//                                     updateEnquiryMasterQuery,
//                                     [cid, enquiryid],
//                                     (err, updateEnquiryMasterResult) => {
//                                       if (err) {
//                                         console.log(err);
//                                         return res
//                                           .status(500)
//                                           .send("Internal Server Error", err);
//                                       }
//                                     }
//                                   );
//                                 } else {
//                                   return res
//                                     .status(500)
//                                     .send(
//                                       "Failed to insert new entry in costing_master2"
//                                     );
//                                 }
//                               }
//                             );
//                           } else {
//                             return res
//                               .status(404)
//                               .send("Costing with Costing Name not found.");
//                           }
//                         }
//                       );
//                     } else {
//                       continueCostingOperations(cid);
//                     }
//                   }
//                 );
//               } else {
//                 let enquiryid = req.params.id;

//                 const fetchCIDQuery = "SELECT cid FROM enquiry_master WHERE id=?";

//                 pool.query(
//                   fetchCIDQuery,
//                   [req.params.id],
//                   (err, fetchCIDResult) => {
//                     if (err) {
//                       console.log(err);
//                       return res.status(500).send("Internal Server Error", err);
//                     }

//                     let cid =
//                       fetchCIDResult.length > 0 ? fetchCIDResult[0].cid : null;

//                     if (fetchCIDResult[0].cid === null) {
//                       const fetchCostingMasterQuery =
//                         "SELECT * FROM costing_master2 WHERE costingname=?";
//                       pool.query(
//                         fetchCostingMasterQuery,
//                         [req.body.costingName],
//                         (err, fetchCostingMasterResult) => {
//                           if (err) {
//                             console.log(err);
//                             return res.status(500).send("Internal Server Error", err);
//                           }

//                           if (fetchCostingMasterResult.length > 0) {
//                             const costingMasterData = fetchCostingMasterResult[0];

//                             const insertCostingMasterQuery = `
//                         INSERT INTO costing_master2 (costingname, costing_date, oltctext,eid, uid, accessories, 
//                           labourcharges, miscexpense) 
//                         VALUES (?, ?, ?,?, ?, ?, ?, ?)
//                       `;

//                             pool.query(
//                               insertCostingMasterQuery,
//                               [
//                                 costingMasterData.costingName,
//                                 costingMasterData.costing_date,
//                                 costingMasterData.oltctext,
//                                 enquiryid,
//                                 costingMasterData.uid,
//                                 costingMasterData.accessories,
//                                 costingMasterData.labourcharges,
//                                 costingMasterData.miscexpense,
//                               ],
//                               (err, insertCostingMasterResult) => {
//                                 if (err) {
//                                   console.log(err);
//                                   return res
//                                     .status(500)
//                                     .send("Internal Server Error", err);
//                                 }

//                                 if (insertCostingMasterResult.affectedRows > 0) {
//                                   cid = insertCostingMasterResult.insertId;
//                                   continueCostingOperations2(cid);

//                                   const updateEnquiryMasterQuery =
//                                     "UPDATE enquiry_master SET cid = ?, enqstatus = 3 WHERE id = ?";
//                                   pool.query(
//                                     updateEnquiryMasterQuery,
//                                     [cid, enquiryid],
//                                     (err, updateEnquiryMasterResult) => {
//                                       if (err) {
//                                         console.log(err);
//                                         return res
//                                           .status(500)
//                                           .send("Internal Server Error", err);
//                                       }
//                                     }
//                                   );
//                                 } else {
//                                   return res
//                                     .status(500)
//                                     .send(
//                                       "Failed to insert new entry in costing_master2"
//                                     );
//                                 }
//                               }
//                             );
//                           } else {
//                             return res
//                               .status(404)
//                               .send("Costing with Costing Name not found.");
//                           }
//                         }
//                       );
//                     } else {
//                       continueCostingOperations2(cid);
//                     }
//                   }
//                 );
//               }
//             }
//           );
//         }
//       );
//     }
//   );

//   // Your existing functions remain the same
//   function continueCostingOperations(cid) {
//     // ... your existing continueCostingOperations function code
//   }

//   function continueCostingOperations2(cid) {
//     // ... your existing continueCostingOperations2 function code
//   }
// });

//<---------------------------------------------------------------------------------------->
//<---------------------------------------------------get add quotation----------------------->
router.get("/getEnquiryForAdd", (req, res) => {
  const q = `SELECT e.*
    FROM enquiry_master e
    WHERE (e.enqstatus = 3 OR e.enqstatus = 4) AND e.id NOT IN (SELECT q.eid FROM quotation q)
    ORDER BY e.id DESC;
    `;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<--------------------------------------------------------------------------------------------->
//<----------------------------------------fetching for new quotation------------------------->
// router.get("/editenq/:id", (req, res) => {
//   const q = `SELECT 
//     e.*, 
//     CASE 
//         WHEN e.selectedcosting IS NULL OR e.selectedcosting = '' 
//         THEN c.costingname 
//         ELSE e.selectedcosting 
//     END AS final_costing
// FROM enquiry_master e
// LEFT JOIN costing_master c ON e.cid = c.id
// WHERE e.id = ?;
// `;

//   const id = req.params.id;

//   pool.query(q, [id], (err, rows) => {
//     if (err) {
//       return res.json(err);
//     }

//     return res.json(rows[0]);
//   });
// });

// router.get("/editenq/:id", (req, res) => {
//   const q = `
//     SELECT 
//       e.*, 
//       c.costingname AS final_costing,
//       o.gstno
//     FROM enquiry_master e
//     LEFT JOIN costing_master c ON e.cid = c.id
//     LEFT JOIN order_acceptance o ON o.qid = e.id
//     WHERE e.id = ?;
//   `;

//   const id = req.params.id;

//   pool.query(q, [id], (err, rows) => {
//     if (err) {
//       return res.json(err);
//     }

//     return res.json(rows[0]);
//   });
// });

router.get("/editenq/:id", (req, res) => {
  const q = `
    SELECT 
      e.*, 
      c.costingname AS final_costing
    FROM enquiry_master e
    LEFT JOIN costing_master c ON e.cid = c.id
    WHERE e.id = ?;
  `;

  const id = req.params.id;

  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});


//<--------------------------------------------------------------------------------------------->

//<------------------------------------------add quotation ---------------------------->
router.post("/addQuotation", (req, res) => {
  const {
    qid,
    eid,
    quotref,
    qdate,
    cost,
    deliveryperiod,
    guranteeperiod,
    validityofquote,
    taxes,
    termscondition,
    uid,
    status,
    rversion,
    transport,
    unloading,
    qty,
    quot_serial,
    tempdelivery,
    deliverydesc,
    temppayment,
    paymentdesc,
    tempinsp,
    guranteetext,
    tempgurantee,
    inspectiondesc,
    desDate,
    validityterms,
  } = req.body;

  const devl = deliverydesc?.replace("*", deliveryperiod || "*");
  const gurantees = guranteetext?.replace("*", guranteeperiod || "*");
  const validityofquot = validityterms?.replace("*", validityofquote || "*");

  pool.getConnection((err, connection) => {
    if (err) return res.status(500).send("Connection Error");

    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return res.status(500).send("Transaction Error");
      }

      const insertQuotationQuery = `
        INSERT INTO quotation VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;
      const quotationValues = [
        qid,
        eid,
        quotref,
        qdate,
        cost,
        deliveryperiod,
        guranteeperiod,
        validityofquote,
        (taxes?.sgst || 0) + (taxes?.cgst || 0),
        termscondition,
        uid,
        status,
        rversion,
        transport,
        unloading,
        qty,
        quot_serial,
        tempdelivery,
        deliverydesc,
        temppayment,
        paymentdesc,
        tempinsp,
        guranteetext,
        tempgurantee,
        inspectiondesc,
        desDate,
        validityterms,
      ];

      connection.query(insertQuotationQuery, quotationValues, (err, result) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
            return res.status(500).send("Failed to insert into quotation");
          });
        } else {
          const qid = result.insertId;

          // const { id, cgst, cgsttype, sgst, sgsttype } = taxes || {};
          // const insertTaxQuery = `
          //   INSERT INTO quot_taxes VALUES (?,?,?,?,?,?,?,?,?)
          // `;
          // const taxValues = [id, qid, "", "", "", cgst, cgsttype, sgst, sgsttype];

          const { id, cgst, cgsttype, sgst, sgsttype } = taxes || {};

          // If type is Inclusive, store '-' instead of the amount
          const cgstValue = cgst || 0;
          const sgstValue = sgst || 0;

          const insertTaxQuery = `
                  INSERT INTO quot_taxes VALUES (?,?,?,?,?,?,?,?,?)
                `;

          // Replace the corresponding positions with cgstValue and sgstValue
          const taxValues = [id, qid, "", "", "", cgstValue, cgsttype, sgstValue, sgsttype];


          connection.query(insertTaxQuery, taxValues, (err, result2) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
                return res.status(500).send("Failed to insert into quot_taxes");
              });
            } else {
              const updateEnq = "UPDATE enquiry_master SET enqstatus=5 WHERE id=?";
              connection.query(updateEnq, [eid], (err, result3) => {
                if (err) {
                  connection.rollback(() => {
                    connection.release();
                    return res.status(500).send("Failed to update enquiry status");
                  });
                } else {
                  connection.commit(err => {
                    if (err) {
                      connection.rollback(() => {
                        connection.release();
                        return res.status(500).send("Commit Error");
                      });
                    } else {
                      connection.release();
                      return res.send({ message: "Quotation and taxes inserted successfully" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
});



//<--------------------------------------------------------------------------------------->
//<--------------------------------------get quotation detials----------------------------->

router.get("/getQuotationDetails", (req, res) => {
  const q =
    "SELECT q.*, e.custname, e.capacity, e.priratio, e.cid, e.secratio, c.costingname as selectedcosting, (SELECT id FROM order_acceptance oa WHERE oa.qid=q.qid LIMIT 1) as order_id FROM quotation q INNER JOIN enquiry_master e ON e.id=q.eid LEFT JOIN costing_master c ON c.id=e.cid ORDER BY q.qid DESC";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<---------------------------------------------------------------------------------------->
//<----------------------------------delete quotation-------------------------------------->
router.delete("/deleteQuotation/:id", (req, res) => {
  const id = req.params.id;

  const selectQuotationQuery = "SELECT eid FROM quotation WHERE qid=?";
  pool.query(selectQuotationQuery, [id], (err, quotationData) => {
    if (err) {
      return res.json(err);
    }

    if (quotationData.length > 0) {
      const { eid } = quotationData[0];

      const selectEnquiryMasterQuery =
        "SELECT enqstatus, selectedcosting FROM enquiry_master WHERE id=?";
      pool.query(selectEnquiryMasterQuery, [eid], (err, enquiryMasterData) => {
        if (err) {
          return res.json(err);
        }

        if (enquiryMasterData.length > 0) {
          const { enqstatus, selectedcosting } = enquiryMasterData[0];

          if (selectedcosting === null) {
            const updateQuery =
              "UPDATE enquiry_master SET enqstatus=2 WHERE id=?";
            pool.query(updateQuery, [eid], (err, updateData) => {
              if (err) {
                return res.json(err);
              }
            });
          } else {
            const updateQuery =
              "UPDATE enquiry_master SET enqstatus=3 WHERE id=?";
            pool.query(updateQuery, [eid], (err, updateData) => {
              if (err) {
                return res.json(err);
              }
            });
          }

          const deleteTaxesQuery = "DELETE FROM quot_taxes WHERE qid=?";
          pool.query(deleteTaxesQuery, [id], (err, taxesData) => {
            if (err) {
              return res.json(err);
            }

            const deleteQuotationQuery = "DELETE FROM quotation WHERE qid=?";
            pool.query(deleteQuotationQuery, [id], (err, data) => {
              if (err) {
                return res.json(err);
              }

              return res.json(data);
            });
          });
        } else {
          return res.json({ error: "Enquiry not found" });
        }
      });
    } else {
      return res.json({ error: "Quotation not found" });
    }
  });
});

//<----------------------------------------------------------------------------------------->
//<----------------------------fetch  for edit quotation----------------------------------->
router.get("/editquotation/:id", (req, res) => {
  const id = req.params.id;

  const q =
    "SELECT q.*, e.`custname`, qt.cgst, qt.cgsttype," +
    "qt.sgst, qt.sgsttype FROM quotation q " +
    "INNER JOIN enquiry_master e ON q.eid = e.id " +
    "LEFT JOIN quot_taxes qt ON qt.qid = q.qid " +
    "WHERE q.qid = ?";
  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    return res.json({
      ...rows[0],
      taxes: {
        cgst: +rows[0].cgst || 0,
        sgst: +rows[0].sgst || 0,
        cgsttype: rows[0].cgsttype,
        sgsttype: rows[0].sgsttype,
      },
    });
  });
});

//<---------------------------------------------------------------------------------->
//<-----------------------------------------get quotation by id-------------------------->
router.get("/getQuotationById/:id", (req, res) => {
  const q =
    "SELECT q.`qid`,q.`eid`,q.`quotref`,q.`qdate`,q.`cost`,q.`deliveryperiod`,q.`guranteeperiod`, " +
    "q.`validityofquote`,q.`taxes`,q.`termscondition` ,(select custname from customer_master where id=e.cid),e.`edate`,e.`comment`,e.`capacity`, " +
    "q.`status`,e.`address`,e.`contactperson`,e.`type`,e.`matofwind`,e.`typecolling`,e.`vectorgroup`, " +
    "e.`hvvoltage`,e.`lvvoltage`,e.`typetaping`,q.`rversion`,e.`core`,e.`voltageratio`,q.transport,q.unloading, qt.cgst, qt.cgsttype, " +
    "qt.sgst,qt.sgsttype,q.qty from quotation q inner join enquiry_master e on q.eid=e.id left join quot_taxes qt " +
    "on qt.qid=q.qid where q.uid=? order by q.qid desc";

  const id = req.params.id;
  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0] || {});
  });
});

//<------------------------------------------------------------------------------------------>
//<-----------------------------------edit quotation------------------------------------------>
router.put("/updateQuotation/:id", (req, res) => {
  const qid = req.params.id;

  const {
    qdate,
    cost,
    deliveryperiod,
    guranteeperiod,
    validityofquote,
    taxes,
    termscondition,
    uid,
    rversion,
    transport,
    unloading,
    qty,
    tempdelivery,
    deliverydesc,
    temppayment,
    paymentdesc,
    tempinsp,
    guranteetext,
    tempgurantee,
    inspectiondesc,
    desDate,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) return res.status(500).send("Connection error");

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).send("Transaction start failed");
      }

      const updateQuotationQuery = `
        UPDATE quotation SET
          qdate=?, cost=?, deliveryperiod=?, guranteeperiod=?, validityofquote=?,
          termscondition=?, uid=?, rversion=?, taxes=?, transport=?, unloading=?,
          qty=?, tempdelivery=?, deliverydesc=?, temppayment=?, paymentdesc=?,
          tempinsp=?, guranteetext=?, tempgurantee=?, inspectiondesc=?, desDate=?
        WHERE qid=?
      `;

      const quotationValues = [
        qdate,
        cost,
        deliveryperiod,
        guranteeperiod,
        validityofquote,
        termscondition,
        uid,
        rversion,
        (+taxes?.sgst || 0) + (+taxes?.cgst || 0),
        transport,
        unloading,
        qty,
        tempdelivery,
        deliverydesc,
        temppayment,
        paymentdesc,
        tempinsp,
        guranteetext,
        tempgurantee,
        inspectiondesc,
        desDate,
        qid,
      ];

      connection.query(updateQuotationQuery, quotationValues, (err, result1) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            return res.status(500).send("Failed to update quotation");
          });
        }

        // const { cgst, cgsttype, sgst, sgsttype } = taxes || {};
        // const updateTaxesQuery = `
        //   UPDATE quot_taxes SET
        //     cgst=?, cgsttype=?, sgst=?, sgsttype=?
        //   WHERE qid=?
        // `;
        // const taxValues = [cgst, cgsttype, sgst, sgsttype, qid];

        const { cgst, cgsttype, sgst, sgsttype } = taxes || {};

        // Apply Inclusive logic
        const cgstValue = cgst || 0;
        const sgstValue = sgst || 0;

        const updateTaxesQuery = `
                UPDATE quot_taxes SET
                  cgst=?, cgsttype=?, sgst=?, sgsttype=?
                WHERE qid=?
              `;

        const taxValues = [cgstValue, cgsttype, sgstValue, sgsttype, qid];


        connection.query(updateTaxesQuery, taxValues, (err, result2) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return res.status(500).send("Failed to update taxes");
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return res.status(500).send("Commit failed");
              });
            }

            connection.release();
            return res.send({ message: "Quotation and taxes updated successfully" });
          });
        });
      });
    });
  });
});

//<----------------------------------------------------------------------------------------->
//<------------------------------get order acc  ------------------------------------->
router.get("/getOrderAcc", (req, res) => {
  const q =
    "SELECT o.id,o.qid,o.orderacc_date,q.quotref,e.custname,ref_no,e.capacity,e.voltageratio,consumer,o.ostatus,o.consignor,o.consignee FROM order_acceptance o inner join quotation q on q.qid=o.qid inner join enquiry_master e on e.id=q.eid  order by id asc limit 5; ";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<-------------------------------------------------------------------------------------->
//<-------------------------------------get order acceotence for adding -------------------->

router.get("/getOrderAccForAdd", (req, res) => {
  const q =
    "SELECT q.quotref,q.qid,e.custname,q.deliveryperiod,q.qty, e.type, e.consumertype, e.capacity,e.priratio,e.secratio FROM quotation q inner join enquiry_master e on e.id=q.eid where q.`qid` not in (select oa.`qid` from order_acceptance oa where ostatus=1 ) order by q.qid desc; ";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<-------------------------------------------------------------------------------------------->
//<-------------------------------------------------update quotation------------------------------->
router.put("/updateQuotationStatus/:id", (req, res) => {
  const q = "update quotation set status='Cancle' where qid=?";
  pool.query(q, [req.params.id], (err, result, feilds) => {
    if (err) {
    } else {
      return res.send("Updated");
    }
  });
});

//<-------------------------------------------------------------------------------------------------->
//<--------------------------------get acceptance number------------------------------------->
router.get("/getAcceptanceNumber/:uid", (req, res) => {
  const userId = req.params.uid;

  const q = "SELECT ref_no,id from order_acceptance order by id desc limit 1";

  pool.query(q, [userId], (err, data) => {
    if (err) {
      return res.json(err);
    }

    const q = "SELECT id,fname,lname,quot_serial from usermaster where id=?";
    pool.query(q, [userId], (err, user) => {
      if (err) {
        return res.json(err);
      }

      return res.json({ refNo: getOrderRefNumber(data, user) });
    });
  });
});

//<------------------------------------------------------------------------------------------->
//<------------------------------------------add order acceptence----------------------------->
// router.post("/addorderacc", (req, res) => {
//   const id = req.body.id;
//   const qid = req.body.qid;
//   const orderacc_date = req.body.orderacc_date;
//   const ostatus = req.body.ostatus;
//   const consignor = req.body.consignor;
//   const consignee = req.body.consignee;
//   const ref_no = req.body.ref_no;
//   const consumer = req.body.consumer;
//   const testing_div = req.body.testing_div;
//   const consumer_address = req.body.consumer_address;
//   const type = req.body.type;
//   const quantity = req.body.quantity;
//   const advance = req.body.advance;
//   const fileflag = req.body.fileflag;
//   const pono = req.body.ponum;
//   const podate = req.body.podate;
//   const basicrate = req.body.basicrate;
//   const gstno = req.body.gstno;
//   const OAcomment = req.body.OAcomment;


//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Connection error:", err);
//       return res.status(500).send("Database connection failed");
//     }

//     connection.beginTransaction((err) => {
//       if (err) {
//         connection.release();
//         return res.status(500).send("Transaction start failed");
//       }

//       const insertOrderQuery = `INSERT INTO order_acceptance VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

//       const orderValues = [
//         id,
//         qid,
//         orderacc_date,
//         ostatus,
//         consignor,
//         consignee,
//         ref_no,
//         consumer,
//         testing_div,
//         consumer_address,
//         type,
//         quantity,
//         advance,
//         fileflag,
//         pono,
//         podate,
//         basicrate,
//         null,
//         gstno,
//         OAcomment,
//       ];

//       connection.query(insertOrderQuery, orderValues, (err, orderResult) => {
//         if (err) {
//           return connection.rollback(() => {
//             connection.release();
//             console.error("Order Insert Error:", err);
//             return res.status(500).send("Order insert failed");
//           });
//         }

//         const insertPaymentQuery = `INSERT INTO payments VALUES (?,?,?,?,?,?,?,?,?)`;
//         const paymentValues = [
//           undefined,
//           consumer,
//           advance,
//           new Date(),
//           "",
//           new Date(),
//           "",
//           advance,
//           orderResult.insertId,
//         ];

//         connection.query(insertPaymentQuery, paymentValues, (err, paymentResult) => {
//           if (err) {
//             return connection.rollback(() => {
//               connection.release();
//               console.error("Payment Insert Error:", err);
//               return res.status(500).send("Payment insert failed");
//             });
//           }

//           connection.commit((err) => {
//             if (err) {
//               return connection.rollback(() => {
//                 connection.release();
//                 console.error("Commit Error:", err);
//                 return res.status(500).send("Transaction commit failed");
//               });
//             }

//             connection.release();
//             return res.send({ success: true, orderId: orderResult.insertId });
//           });
//         });
//       });
//     });
//   });
// });

router.post("/addorderacc", (req, res) => {
  const id = req.body.id;
  const qid = req.body.qid;
  const orderacc_date = req.body.orderacc_date;
  const ostatus = req.body.ostatus;
  const consignor = req.body.consignor;
  const consignee = req.body.consignee;
  const ref_no = req.body.ref_no;
  const consumer = req.body.consumer;
  const testing_div = req.body.testing_div;
  const consumer_address = req.body.consumer_address;
  const type = req.body.type;
  const quantity = req.body.quantity;
  const advance = req.body.advance;
  const fileflag = req.body.fileflag;
  const pono = req.body.ponum;
  const podate = req.body.podate;
  const basicrate = req.body.basicrate;
  const gstno = req.body.gstno;
  const OAcomment = req.body.OAcomment;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Connection error:", err);
      return res.status(500).send("Database connection failed");
    }

    // Fetch required details from quotation, enquiry, costing_master, and quot_taxes tables
    const fetchDetailsQuery = `
      SELECT 
        q.eid as enquiry_id,
        e.cid as costing_id,
        NULL as plan_id,
        qt.cgst,
        qt.sgst,
        0 as igst,
        e.id as buyer_id,
        e.custname as buyer_name,
        q.cost as rate
      FROM quotation q
      INNER JOIN enquiry_master e ON q.eid = e.id
      LEFT JOIN costing_master cm ON e.cid = cm.id
      LEFT JOIN quot_taxes qt ON q.qid = qt.qid
      WHERE q.qid = ?
    `;

    connection.query(fetchDetailsQuery, [qid], (err, detailsResult) => {
      if (err) {
        connection.release();
        console.error("Error fetching details:", err);
        return res.status(500).send("Error fetching related details");
      }

      if (detailsResult.length === 0) {
        connection.release();
        return res.status(404).send("Quotation details not found");
      }

      const details = detailsResult[0];
      const enquiry_id = details.enquiry_id;
      const costing_id = details.costing_id;
      const plan_id = details.plan_id;
      const cgst = parseFloat(details.cgst) || 0;
      const sgst = parseFloat(details.sgst) || 0;
      const igst = parseFloat(details.igst) || 0;
      const buyer_id = details.buyer_id;
      const buyer_name = details.buyer_name || consumer;
      const rate = parseFloat(details.rate) || parseFloat(basicrate);

      // Calculate invoice_balance (assuming grand_total will be calculated later)
      // For now, invoice_balance = 0 - advance (negative means credit)
      const invoice_balance = parseFloat(advance) - 0;

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return res.status(500).send("Transaction start failed");
        }

        const insertOrderQuery = `INSERT INTO order_acceptance VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const orderValues = [
          id,
          qid,
          orderacc_date,
          ostatus,
          consignor,
          consignee,
          ref_no,
          consumer,
          testing_div,
          consumer_address,
          type,
          quantity,
          advance,
          fileflag,
          pono,
          podate,
          basicrate,
          null,
          gstno,
          OAcomment,
        ];

        connection.query(insertOrderQuery, orderValues, (err, orderResult) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error("Order Insert Error:", err);
              return res.status(500).send("Order insert failed");
            });
          }

          const insertPaymentQuery = `INSERT INTO payments VALUES (?,?,?,?,?,?,?,?,?)`;
          const paymentValues = [
            undefined,
            consumer,
            advance,
            new Date(),
            "",
            new Date(),
            "",
            advance,
            orderResult.insertId,
          ];

          connection.query(insertPaymentQuery, paymentValues, (err, paymentResult) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("Payment Insert Error:", err);
                return res.status(500).send("Payment insert failed");
              });
            }

            // Insert invoice transaction with fetched details and payment_id
            const insertInvoiceTransactionQuery = `
              INSERT INTO invoice_transactions (
                invoice_id,
                invoice_no,
                oid,
                costing_id,
                enquiry_id,
                plan_id,
                item_desc,
                qty,
                hsn,
                rate,
                item_amount,
                basic_total,
                cgst,
                sgst,
                igst,
                roundoff,
                grand_total,
                advance,
                net_total,
                invoice_balance,
                payment_id,
                buyer_id,
                buyer_name,
                invoice_date,
                uid,
                created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;

            const invoiceTransactionValues = [
              null,                 // invoice_id - NULL until invoice is created
              null,                 // invoice_no - NULL until invoice is created
              orderResult.insertId, // oid - from order_acceptance insert
              costing_id,           // from enquiry.cid
              enquiry_id,           // from quotation.eid
              plan_id,              // NULL for now
              null,                 // item_desc - NULL for now
              quantity,             // from request body
              null,                 // hsn - NULL for now
              rate,                 // from quotation.cost or basicrate
              null,                 // item_amount - NULL for now
              null,                 // basic_total - NULL for now
              cgst,                 // from quot_taxes.cgst
              sgst,                 // from quot_taxes.sgst
              igst,                 // 0 (not in your tables)
              null,                 // roundoff - NULL for now
              null,                 // grand_total - NULL for now
              advance,              // from request body
              null,                 // net_total - NULL for now
              invoice_balance,      // calculated: 0 - advance (negative balance)
              paymentResult.insertId, // payment_id - from payment insert
              buyer_id,             // from enquiry.id
              buyer_name,           // from enquiry.custname
              null,                 // invoice_date - NULL until invoice is created
              null                  // uid - NULL for now
            ];

            connection.query(insertInvoiceTransactionQuery, invoiceTransactionValues, (err, invoiceTransactionResult) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error("Invoice Transaction Insert Error:", err);
                  return res.status(500).send("Invoice transaction insert failed");
                });
              }

              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error("Commit Error:", err);
                    return res.status(500).send("Transaction commit failed");
                  });
                }

                connection.release();
                return res.send({
                  success: true,
                  orderId: orderResult.insertId,
                  paymentId: paymentResult.insertId,
                  invoiceTransactionId: invoiceTransactionResult.insertId
                });
              });
            });
          });
        });
      });
    });
  });
});



//<-------------------------------------------------------------------------------------------->
//<----------------------------------------get quotation detials -------------------------->
router.get("/getQuotDetail/:id", (req, res) => {
  const q = `SELECT 
    q.qid, 
    e.uid, 
    e.comment,
    e.custname, 
    q.cost, 
    q.qty, 
    e.type, 
    e.address,
    c.gstno
FROM 
    quotation q
INNER JOIN 
    enquiry_master e ON e.id = q.eid
INNER JOIN 
    customer_master c ON c.custname = e.custname
WHERE 
    q.qid = ?;

    `;

  pool.query(q, [req.params.id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data[0]);
  });
});
//<------------------------------------------------------------------------------------->
//<-------------------------------------edit orderacceptence ----------------------------------->
router.get("/editOrder/:id", (req, res) => {
  const q =
    "SELECT o.id,o.qid,o.orderacc_date,q.qid,o.quantity,o.fileflag,o.podate,o.basicrate,o.ponum,o.advance,o.type,q.quotref,o.OAcomment,o.ostatus,e.comment,o.consumer, " +
    "o.ref_no,o.testing_div,o.gstno,e.custname,e.address, " +
    "o.consumer_address " +
    "FROM order_acceptance o " +
    "inner join quotation q on q.qid=o.qid " +
    "inner join enquiry_master e on e.id=q.eid " +
    "where o.id=?;";

  const id = req.params.id;
  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});
//<---------------------------------------------------------------------------------------------->
//<--------------------------------------test division----------------------------------------->
router.put("/testDivision", (req, res) => {
  const division = req.body.division;
  const id = req.body.id;

  const q = `UPDATE test_division SET division='${division}' WHERE id = ${id}`;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<---------------------------------------------------------------------------------->
//<----------------------------------------update order acceptence------------------------------->
router.put("/updateOrderAcceptance/:id", (req, res) => {
  const id = req.params.id;
  const {
    ostatus,
    consumer,
    testing_div,
    consumer_address,
    type,
    quantity,
    advance,
    fileflag,
    ponum,
    podate,
    basicrate,
    gstno,
    OAcomment
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Connection failed" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Transaction failed to start" });
      }

      const updateOrderQuery = `
        UPDATE order_acceptance 
        SET ostatus=?, consumer=?, testing_div=?, consumer_address=?, type=?, quantity=?, advance=?, fileflag=?, ponum=?, podate=?, basicrate=? ,gstno=?,OAcomment=?
        WHERE id = ?
      `;

      connection.query(
        updateOrderQuery,
        [
          ostatus,
          consumer,
          testing_div,
          consumer_address,
          type,
          quantity,
          advance,
          fileflag,
          ponum,
          podate,
          basicrate,
          gstno,
          OAcomment,
          id,
        ],
        (err, data) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json({ error: "Failed to update order_acceptance" });
            });
          }

          const selectPaymentQuery = "SELECT id FROM payments WHERE oid=? ORDER BY id ASC LIMIT 1";
          connection.query(selectPaymentQuery, [id], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return res.status(500).json({ error: "Failed to fetch payments" });
              });
            }

            const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

            if (result?.length) {
              // Update payment
              const updatePaymentQuery = `UPDATE payments SET advance=?, amount=? WHERE id=?`;
              connection.query(updatePaymentQuery, [advance, advance, result[0].id], (err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    return res.status(500).json({ error: "Failed to update payment" });
                  });
                }

                // Commit transaction
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      return res.status(500).json({ error: "Commit failed" });
                    });
                  }

                  connection.release();
                  return res.send("POSTED");
                });
              });
            } else {
              // Insert new payment
              const insertPaymentQuery = `
                INSERT INTO payments (oid, customer, advance, payment_date, paymode, created_at, cheque_rtgs_no, amount)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `;
              connection.query(
                insertPaymentQuery,
                [id, consumer, advance, currentDateTime, "", currentDateTime, "", advance],
                (err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      return res.status(500).json({ error: "Failed to insert payment" });
                    });
                  }

                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        return res.status(500).json({ error: "Commit failed" });
                      });
                    }

                    connection.release();
                    return res.send("POSTED");
                  });
                }
              );
            }
          });
        }
      );
    });
  });
});


//<------------------------------------------------------------------------------------------->
//<-------------------------get production plan--------------------------------------------->
router.get("/getProductionPlan", (req, res) => {
  const q = `
  SELECT
      pp.*,
      e.custname,
      e.capacity,
      e.priratio,
      e.secratio,
      e.type,
      c.costingname AS selectedCosting,
      e.cid,
      o.testing_div,
      o.quantity AS oa_quantity,
      ppd.qty AS production_qty,
      ppd.remainingbomissueqty
  FROM
      production_plan pp
  INNER JOIN
      production_plan_details ppd ON ppd.prod_plan_id = pp.id
  INNER JOIN
      order_acceptance o ON o.id = ppd.oa_id
  INNER JOIN
      quotation q ON q.qid = o.qid
  INNER JOIN
      enquiry_master e ON e.id = q.eid
  LEFT JOIN
      costing_master c ON c.id = e.cid
  ORDER BY
      pp.id DESC;
`;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<------------------------------------------------------------------------------------------>
//<------------------------------------------ get ready stock production plan-------------------->
// router.get("/getreadystockdata", (req, res) => {
//   const q = `
//   SELECT
//     pp.*,
//     e.custname,
//     e.capacity,
//     e.priratio,
//     e.secratio,
//     e.type,
//     o.ref_no,
//     ppd.readyqty AS ready_qty,
//     ppd.challan_qty,
//     ppd.qty AS production_qty,
//     ppd.remaningredyqty
// FROM
//     production_plan pp
// INNER JOIN
//     production_plan_details ppd ON ppd.prod_plan_id = pp.id
// INNER JOIN
//     order_acceptance o ON o.id = ppd.oa_id
// INNER JOIN
//     quotation q ON q.qid = o.qid
// INNER JOIN
//     enquiry_master e ON e.id = q.eid
// WHERE
//    ppd.readyqty IS NOT NULL
// ORDER BY
//     pp.id DESC;
// `;

//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }
//     const reversedData = data.reverse();

//     return res.json(reversedData);
//   });
// });

router.get("/getreadystockdata", (req, res) => {
  const q = `
  SELECT
    pp.*,
    e.custname,
    e.capacity,
    e.priratio,
    e.secratio,
    e.type,
    o.ref_no,
    ppd.readyqty AS ready_qty,
    ppd.challan_qty,
    ppd.qty AS production_qty,
    ppd.remaningredyqty,
    ppd.remainingbomissueqty
FROM
    production_plan pp
INNER JOIN
    production_plan_details ppd ON ppd.prod_plan_id = pp.id
INNER JOIN
    order_acceptance o ON o.id = ppd.oa_id
INNER JOIN
    quotation q ON q.qid = o.qid
INNER JOIN
    enquiry_master e ON e.id = q.eid
WHERE
   ppd.readyqty IS NOT NULL
   AND NOT (COALESCE(ppd.readyqty, 0) = 0 AND COALESCE(ppd.challan_qty, 0) = 0)
ORDER BY
    pp.id DESC;
`;

  pool.query(q, (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    const reversedData = data.reverse();
    return res.json(reversedData);
  });
});

//<------------------------------------------------------------------------------------------>
//<------------------------------------------ delete production plan-------------------->
router.delete("/deleteProductionplane/:id", (req, res) => {
  const id = req.params.id;

  // First delete from production_plan_details
  const deleteDetailsQuery =
    "DELETE FROM production_plan_details WHERE prod_plan_id = ?";
  pool.query(deleteDetailsQuery, [id], (err, detailsResult) => {
    if (err) {
      return res.json(err);
    }

    // Then delete from production_plan
    const deletePlanQuery = "DELETE FROM production_plan WHERE id = ?";
    pool.query(deletePlanQuery, [id], (err, planResult) => {
      if (err) {
        return res.json(err);
      }

      return res.json({
        message: "Production plan and related details deleted successfully",
      });
    });
  });
});
router.delete("/deletereadystock/:id", (req, res) => {
  const id = req.params.id;
  const checkQuery =
    "SELECT COUNT(*) AS count FROM challan_details WHERE plan_id = ?";
  pool.query(checkQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    // If the id exists, return an error message
    if (result[0].count > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete, id exists in challan_details" });
    }
    const q =
      "UPDATE production_plan_details SET readyqty=0 WHERE prod_plan_id=?;";
    pool.query(q, [id], (err, data) => {
      if (err) {
        return res.json(err);
      }

      return res.json(data);
    });
  });
});
//<----------------------------------------------------------------------------------->
//<------------------------------get new production plan------------------------------->

router.get("/getNewreadystock", (req, res) => {
  const q = `
  SELECT 
    br.id, 
    em.custname, 
    em.capacity, 
    oa.type, 
    em.typetaping, 
    em.priratio, 
    em.secratio,
    ppd.qty AS qty,
    ppd.prod_plan_id,
    ppd.remaningredyqty,
    IFNULL(ppd.readyqty, 0) AS readyqty
  FROM 
    bom_request br 
  INNER JOIN 
    production_plan_details ppd ON ppd.prod_plan_id = br.plan_id
  INNER JOIN 
    order_acceptance oa ON ppd.oa_id = oa.id
  INNER JOIN 
    quotation q ON oa.qid = q.qid
  INNER JOIN 
    enquiry_master em ON q.eid = em.id 
  WHERE 
    br.isissue = 1 
    AND ppd.qty != IFNULL(ppd.readyqty, 0) AND ppd.qty  != ppd.remaningredyqty
    ORDER BY 
    br.id DESC 
`;
  //  AND ppd.qty != readyqty
  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    data.forEach((row) => {
      if (
        row.typetaping.includes(
          "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
        )
      ) {
        row.typetaping = "OCTC";
      } else if (
        row.typetaping.includes(
          "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
        )
      ) {
        row.typetaping = "OLTC";
      } else if (row.typetaping.includes("No Tapping")) {
        row.typetaping = "NP";
      } else {
        row.typetaping = "";
      }
    });

    return res.json(data);
  });
});

router.get("/getNewprodPlan", (req, res) => {
  const q = `SELECT
    o.id,
    o.ref_no,
    o.quantity,
    o.testing_div,
    o.orderacc_date,
    o.type,
    e.typetaping,
    e.cid,
    c.costingname AS selectedCosting,
    e.custname,
    e.capacity,
    e.priratio,
    e.secratio,
    e.uid,
    IFNULL(SUM(pp.qty), 0) AS total_qty_in_production
  FROM order_acceptance o
  INNER JOIN quotation q ON q.qid = o.qid
  INNER JOIN enquiry_master e ON e.id = q.eid
  LEFT JOIN costing_master c ON c.id = e.cid
  LEFT JOIN production_plan_details pp ON pp.oa_id = o.id
  WHERE o.ostatus = 1
  GROUP BY o.id, o.ref_no, o.quantity, o.testing_div, o.orderacc_date, o.type, e.typetaping, e.cid, c.costingname, e.custname, e.capacity, e.priratio, e.secratio, e.uid
  HAVING total_qty_in_production < o.quantity
  ORDER BY o.id DESC`;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    data.forEach((row) => {
      if (
        row.typetaping.includes(
          "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
        )
      ) {
        row.typetaping = "OCTC";
      } else if (
        row.typetaping.includes(
          "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
        )
      ) {
        row.typetaping = "OLTC";
      } else if (row.typetaping.includes("No Tapping")) {
        row.typetaping = "NP";
      } else {
        row.typetaping = "";
      }
    });

    return res.json(data);
  });
});

//<------------------------------------------------------------------------------------>
//<----------------------------------------------add production plan------------------------>
router.post("/addreadystockqty/:id", async (req, res) => {
  const id = req.params.id;
  const qty = req.body;

  try {
    for (const element of req.body) {
      if (!element.qty) {
        return res
          .status(401)
          .send("Each order must include both 'id' and 'qty'");
      }
    }
    for (const item of qty) {
      // Check if readyqty already has a value
      const checkExistingQuery = `
        SELECT readyqty
        FROM production_plan_details
        WHERE prod_plan_id = ${item.id}
      `;

      pool.query(checkExistingQuery, async (err, data) => {
        if (err) {
          console.error("Error querying existing ready stock quantity:", err);
          return res
            .status(500)
            .send(
              "An error occurred while querying existing ready stock quantity"
            );
        }

        const existingResult = data[0]; // Assuming data is an array and we need the first result

        if (existingResult && existingResult.readyqty !== null) {
          // If readyqty already has a value, add the new value to it
          const newqty = item.qty + existingResult.readyqty;

          const updateQuery = `
            UPDATE production_plan_details
            SET readyqty = ${newqty} , remaningredyqty = remaningredyqty + ${item.qty} 
            WHERE prod_plan_id = ${item.id}
          `;

          await pool.query(updateQuery);
        } else {
          // If readyqty doesn't have a value, insert the new value
          const insertQuery = `
            UPDATE production_plan_details
            SET readyqty = ${item.qty}, remaningredyqty = remaningredyqty + ${item.qty}
            WHERE prod_plan_id = ${item.id}
          `;

          await pool.query(insertQuery);
        }
      });
    }
    res.status(200).send("Ready stock quantity updated successfully");
  } catch (error) {
    console.error("Error updating ready stock quantity:", error);
    res
      .status(500)
      .send("An error occurred while updating ready stock quantity");
  }
});

// router.post("/addtoProduction/:uid", (req, res) => {
//   const userId = req.params.uid;

//   if (!req.body?.length) {
//     return res.status(400).send("Sorry, please select orders");
//   }

//   const q3 = "SELECT wo_no,id from production_plan order by id desc limit 1";

//   pool.query(q3, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }

//     const q = "SELECT id,fname,lname,quot_serial from usermaster where id=?";
//     pool.query(q, [userId], (err, user) => {
//       if (err) {
//         return res.json(err);
//       }

//       const number = +(data[0]?.wo_no?.split("/")[3] || 0);

//       // Iterate through the received data and insert into production_plan_details
//       req.body?.forEach?.((element, index) => {
//         const q = "insert into production_plan values(?,?,?)";
//         const q1 = "insert into production_plan_details values(?,?,?,?)"; // Updated query
//         pool.query(
//           q,
//           [
//             undefined,
//             getProductionNumber(number + index + 1, user),
//             new Date().toDateString(),
//           ],
//           (err, result) => {
//             if (err) {

//             } else {
//               pool.query(
//                 q1,
//                 [undefined, result.insertId, element.id, element.qty], // Insert id and qty
//                 (err, result) => {
//                   if (err) {

//                   } else {
//                     if (index === req.body?.length - 1) {
//                       return res.send("Updated");
//                     }
//                   }
//                 }
//               );
//             }
//           }
//         );
//       });
//     });
//   });
// });
// router.post("/addtoProduction/:uid", (req, res) => {
//   const userId = req.params.uid;

//   if (!Array.isArray(req.body) || req.body.length === 0) {
//     return res.status(400).send("Sorry, please select orders");
//   }

//   const q3 = "SELECT wo_no, id FROM production_plan ORDER BY id DESC LIMIT 1";

//   pool.query(q3, (err, data) => {
//     if (err) {
//       console.error("Error fetching production plan:", err);
//       return res.status(500).json(err);
//     }

//     const productionNumber = +(data[0]?.wo_no?.split("/")[3] || 0);

//     const q = "SELECT id, fname, lname, quot_serial FROM usermaster WHERE id=?";
//     pool.query(q, [userId], (err, user) => {
//       if (err) {
//         console.error("Error fetching user:", err);
//         return res.status(500).json(err);
//       }

//       const insertions = req.body.map((element, index) => {
//         return new Promise((resolve, reject) => {
//           const productionIndex = productionNumber + index + 1;
//           const currentDate = new Date().toDateString();
//           const qInsertProduction = "INSERT INTO production_plan VALUES (?,?,?)";
//           pool.query(qInsertProduction, [undefined, getProductionNumber(productionIndex, user), currentDate], (err, result) => {
//             if (err) {
//               reject(err);
//             } else {
//               const qInsertDetails = "INSERT INTO production_plan_details (id, prod_plan_id, oa_id, qty) VALUES (?,?,?,?)";
//               pool.query(qInsertDetails, [undefined, result.insertId, element.id, element.qty], (err, result) => {
//                 if (err) {
//                   reject(err);
//                 } else {
//                   resolve();
//                 }
//               });
//             }
//           });
//         });
//       });

//       Promise.all(insertions)
//         .then(() => {
//           res.send("Updated");
//         })
//         .catch((err) => {
//           console.error("Error inserting into production_plan_details:", err);
//           res.status(500).json(err);
//         });
//     });
//   });
// });
router.post("/addtoProduction/:uid", (req, res) => {
  const userId = req.params.uid;

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  const currentDate = formatDate(new Date());
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res.status(400).json({ message: "Sorry, please select orders" });
  }

  for (const element of req.body) {
    if (!element.qty) {
      return res
        .status(401)
        .json({ message: "Each order must include both 'id' and 'qty'" });
    }
  }

  const q3 = "SELECT wo_no, id FROM production_plan ORDER BY id DESC LIMIT 1";

  pool.query(q3, (err, data) => {
    if (err) {
      console.error("Error fetching production plan:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const productionNumber = +(data[0]?.wo_no?.split("/")[3] || 0);

    const q = "SELECT id, fname, lname, quot_serial FROM usermaster WHERE id=?";
    pool.query(q, [userId], (err, user) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const insertions = req.body.map((element, index) => {
        return new Promise((resolve, reject) => {
          const productionIndex = productionNumber + index + 1;

          const qInsertProduction =
            "INSERT INTO production_plan VALUES (?,?,?)";
          pool.query(
            qInsertProduction,
            [
              undefined,
              getProductionNumber(productionIndex, user),
              currentDate,
            ],
            (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                const qInsertDetails =
                  "INSERT INTO production_plan_details (id, prod_plan_id, oa_id, qty,remainingbomissueqty) VALUES (?,?,?,?,?)";
                pool.query(
                  qInsertDetails,
                  [
                    undefined,
                    result.insertId,
                    element.id,
                    element.qty,
                    element.qty,
                  ],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      reject(err);
                    } else {
                      resolve();
                    }
                  }
                );
              }
            }
          );
        });
      });

      Promise.all(insertions)
        .then(() => {
          res.json({ message: "Data added successfully" }); // Sending JSON response
        })
        .catch((err) => {
          console.error("Error inserting into production_plan_details:", err);
          res.status(500).json({ message: "Internal Server Error" });
        });
    });
  });
});

//<-------------------------------------------------------------------------------------------->
//<-------------------------------------get production details ------------------------------->
// router.get("/getProductionDetails/:id", (req, res) => {
//   const id = req.params.id;
//   const q =
//     "SELECT pp.*,e.*,o.*,q.*,qt.* FROM production_plan pp inner join production_plan_details ppd on ppd.prod_plan_id=pp.id " +
//     "inner join order_acceptance o on o.id=ppd.oa_id " +
//     "inner join quotation q on q.qid=o.qid inner join quot_taxes qt on qt.qid=o.qid inner join enquiry_master e on e.id=q.eid where pp.id=?";

//   pool.query(q, [id], (err, data) => {
//     if (err) {

//       return res.json(err);
//     }
// data.forEach(row => {

//   if (row.typetaping.includes("℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer") ||
//       row.typetaping.includes("℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer")) {

//     row.typetaping = "OCTC";
//   }
//   else if(row.typetaping.includes("℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer") ||
//           row.typetaping.includes("℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer")){
//             row.typetaping = "OLTC";
//   }
//   else if(row.typetaping.includes("No Tapping")){
//     row.typetaping = "NP";
//   }
//   else {
//     row.typetaping = "";
//   }

// });
//     return res.json(data[0] || {});
//   });
// });
router.get("/getProductionDetails/:id", (req, res) => {
  const id = req.params.id;
  const q = `  SELECT pp.*, e.*, o.*, q.*,e.typetaping AS Typetaping, ppd.qty AS productionqty, ppd.readyqty, qt.*, cm.costingname, e.type
  FROM production_plan pp
  INNER JOIN production_plan_details ppd ON ppd.prod_plan_id = pp.id
  INNER JOIN order_acceptance o ON o.id = ppd.oa_id
  INNER JOIN quotation q ON q.qid = o.qid
  INNER JOIN quot_taxes qt ON qt.qid = o.qid
  INNER JOIN enquiry_master e ON e.id = q.eid
  INNER JOIN costing_master cm ON cm.id = e.cid
  WHERE pp.id = ?;
`;
  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    // Modify e.typetaping based on conditions
    if (data.length > 0) {
      data.forEach((row) => {
        if (
          row.typetaping.includes(
            "H. V. variation of +2.5 to -5 in equal steps of 2.5 Off circuit tap changer"
          ) ||
          row.typetaping.includes(
            "H. V. variation of +5 to -10 in equal steps of 2.5 Off circuit tap changer"
          )
        ) {
          row.typetaping = "OCTC";
        } else if (
          row.typetaping.includes(
            "H. V. variation of +10 to -10 in equal steps of 1.25 On load tap changer"
          ) ||
          row.typetaping.includes(
            "H. V. variation of +5 to -15 in equal steps of 1.25 On load tap changer"
          )
        ) {
          row.typetaping = "OLTC";
        } else if (row.typetaping.includes("No Tapping")) {
          row.typetaping = "NP";
        } else {
          row.typetaping = "";
        }
      });
    }

    return res.json(data[0] || {});
  });
});

//<------------------------------------------------------------------------------------------->
//<-----------------------------------------get new order accecptence------------------------------------>
// router.get("/getNewOrderAcc", (req, res) => {
//   const q = `
//   SELECT
//   o.id,
//   o.qid,
//   o.podate,
//   q.quotref,
//   o.ponum,
//   custname,
//   o.testing_div,
//   o.fileflag,
//   deliveryperiod,
//   ref_no,
//   capacity,
//   voltageratio,
//   consumer,
//   o.ostatus,
//   o.consignor,
//   o.consignee,
//   o.quantity,
//   e.priratio,
//   e.uid,
//   e.secratio,
//   es.status AS enquiry_status
// FROM
//   order_acceptance o
// INNER JOIN
//   quotation q ON q.qid = o.qid
// INNER JOIN
//   enquiry_master e ON e.id = q.eid
// LEFT JOIN
//   enquiry_status es ON o.ostatus = es.eid
// WHERE
//   o.ostatus = 1
// ORDER BY
//   id DESC;
//   `;

//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }
//     return res.json(data);
//   });
// });

//<------------------------------------------------------------------------------------------->
//<-------------------------check if order acceptance exists in production plan--------------------------------------------->
router.get("/checkOrderInProduction/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  const q = `
  SELECT COUNT(*) as count
  FROM production_plan_details 
  WHERE oa_id = ?
  `;

  pool.query(q, [orderId], (err, data) => {
    if (err) {
      return res.json(err);
    }

    const exists = data[0].count > 0;
    return res.json({ exists: exists });
  });
});

// router.get("/getNewOrderAcc", (req, res) => {
//   const q = `
//     SELECT
//       o.id,
//       o.qid,
//       o.podate,
//       q.quotref,
//       o.ponum,
//       custname,
//       o.testing_div,
//       o.fileflag,
//       deliveryperiod,
//       ref_no,
//       capacity,
//       voltageratio,
//       consumer,
//       o.ostatus,
//       o.consignor,
//       o.consignee,
//       o.quantity,
//       e.priratio,
//       e.uid,
//       e.secratio,
//       es.status AS enquiry_status,
//       CASE 
//         WHEN EXISTS (
//           SELECT 1
//           FROM production_plan_details p
//           WHERE p.oa_id = o.id
//         ) THEN 1
//         ELSE 0
//       END AS inProduction
//     FROM
//       order_acceptance o
//     INNER JOIN
//       quotation q ON q.qid = o.qid
//     INNER JOIN
//       enquiry_master e ON e.id = q.eid
//     LEFT JOIN
//       enquiry_status es ON o.ostatus = es.eid
//     WHERE
//       o.ostatus = 1
//     ORDER BY
//       o.id DESC;
//   `;

//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }
//     return res.json(data);
//   });
// });


//<----------------------------------------------------------------------------------------->

router.get("/getNewOrderAcc", (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const offset = page * pageSize;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM order_acceptance o
    WHERE o.ostatus = 1
  `;

  const dataQuery = `
    SELECT
      o.id,
      o.qid,
      o.podate,
      q.quotref,
      o.ponum,
      custname,
      o.testing_div,
      o.fileflag,
      deliveryperiod,
      ref_no,
      capacity,
      voltageratio,
      consumer,
      o.ostatus,
      o.consignor,
      o.consignee,
      o.quantity,
      e.priratio,
      e.uid,
      e.secratio,
      c.costingname AS selectedCosting,
      e.cid,
      CASE 
        WHEN EXISTS (
          SELECT 1
          FROM production_plan_details p
          WHERE p.oa_id = o.id
        ) THEN 1
        ELSE 0
      END AS inProduction
    FROM
      order_acceptance o
    INNER JOIN
      quotation q ON q.qid = o.qid
    INNER JOIN
      enquiry_master e ON e.id = q.eid
    LEFT JOIN
      costing_master c ON c.id = e.cid
    WHERE
      o.ostatus = 1
    ORDER BY
      o.id DESC
    LIMIT ? OFFSET ?;
  `;

  pool.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const total = countResult[0].total;

    pool.query(dataQuery, [pageSize, offset], (err, data) => {
      if (err) return res.status(500).json(err);

      res.json({
        total,
        data
      });
    });
  });
});


//<------------------------------get ordertaccept by id------------------------------------>
router.get("/getNewOrderAcc/:id", (req, res) => {
  const orderId = req.params.id;
  const q = `
  SELECT
  o.id,
  o.qid,
  o.orderacc_date,
  custname,
  o.testing_div,
  o.fileflag,
  deliveryperiod,
  ref_no,
  capacity,
  voltageratio,
  consumer,
  o.ostatus,
  o.consignor,
  o.consignee,
  o.quantity,
  e.priratio,
  e.secratio,
  e.uid,
  (SELECT SUM(proformaqty) FROM proforma_invoice WHERE oid = o.id) AS proformaqty
FROM
  order_acceptance o
INNER JOIN
  quotation q ON q.qid = o.qid
INNER JOIN
  enquiry_master e ON e.id = q.eid
WHERE
  o.id = ?;

  `;

  pool.query(q, [orderId], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<------------------------------------------------------------------------------------------->
router.get("/getPro", (req, res) => {
  const orderId = req.params.id;
  const q = `
  SELECT
  o.id,
  o.qid,
  o.orderacc_date,
  q.quotref,
  custname,
  o.testing_div,
  o.fileflag,
  deliveryperiod,
  ref_no,
  capacity,
  voltageratio,
  consumer,
  o.ostatus,
  o.consignor,
  o.consignee,
  o.quantity,
  e.priratio,
  e.secratio,
  pi.proformaqty,
  pi.id AS pid

FROM
  order_acceptance o
INNER JOIN
  quotation q ON q.qid = o.qid
INNER JOIN
  enquiry_master e ON e.id = q.eid
LEFT JOIN
  proforma_invoice pi ON o.id = pi.oid
WHERE
  o.ostatus = 1
  AND o.id IN (SELECT oid FROM proforma_invoice)
ORDER BY
  id DESC;

  `;

  pool.query(q, [orderId], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

router.get("/getNewOrderAcccreate", (req, res) => {
  const orderId = req.params.id;
  const q = `
SELECT
  o.id,
  o.qid,
  o.orderacc_date,
  q.quotref,
  custname,
  o.testing_div,
  o.fileflag,
  deliveryperiod,
  ref_no,
  capacity,
  voltageratio,
  consumer,
  o.ostatus,
  o.consignor,
  o.consignee,
  o.quantity,
  e.priratio,
  e.secratio,
  e.voltageratio
FROM
  order_acceptance o
INNER JOIN
  quotation q ON q.qid = o.qid
INNER JOIN
  enquiry_master e ON e.id = q.eid
WHERE
  o.ostatus = 1
  AND o.id NOT IN (SELECT oid FROM proforma_invoice)
  OR (
    SELECT SUM(proformaqty) FROM proforma_invoice WHERE oid = o.id
  ) < o.quantity
ORDER BY
  id DESC;
`;

  pool.query(q, [orderId], (err, data) => {
    if (err) {
      console.error(err);
      return res.json(err);
    }
    console.log("DATA RETRIEVED:", data);


    return res.json(data);
  });
});
//<-------------------------------------------------acc order print----------------------------->

router.get("/getAccorderprint/:id", (req, res) => {
  const id = req.params.id;

  const qidQuery = `
    SELECT qid
    FROM order_acceptance
    WHERE id = ?
    LIMIT 1
  `;

  pool.query(qidQuery, [id], (qidErr, qidRows) => {
    if (qidErr) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (qidRows.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the provided ID" });
    }

    const qid = qidRows[0].qid;

    const q1 = `
      SELECT quotref, qdate, cost, paymentdesc,deliveryperiod, guranteeperiod,deliverydesc, guranteetext, inspectiondesc, unloading, transport
      FROM quotation
      WHERE qid = ?
      ORDER BY qid DESC
      LIMIT 1
    `;

    const q2 = `
      SELECT e.custname, e.contactperson, e.capacity, e.address, e.hvvoltage, e.lvvoltage, e.typecolling, e.core, e.typetaping,e.tapingSwitch, e.type, e.matofwind, e.vectorgroup, e.priratio, e.secratio, e.voltageratio,e.comment
      FROM quotation q
      INNER JOIN enquiry_master e ON e.id = q.eid
      WHERE q.qid = ?
      ORDER BY q.qid
    `;

    const q3 = `
      SELECT orderacc_date, quantity, advance, ponum, podate, basicrate,gstno,consumer,consumer_address,OAcomment
      FROM order_acceptance
      WHERE id = ?
      ORDER BY qid DESC
      LIMIT 1
    `;

    const q4 = `
      SELECT cgst, sgst
      FROM quot_taxes
      WHERE qid = ?
      ORDER BY qid DESC
      LIMIT 1
    `;

    pool.query(q1, [qid], (err1, data1) => {
      if (err1) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      pool.query(q2, [qid], (err2, data2) => {
        if (err2) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        pool.query(q3, [id], (err3, data3) => {
          if (err3) {
            return res.status(500).json({ error: "Internal Server Error" });
          }

          pool.query(q4, [qid], (err4, data4) => {
            if (err4) {
              return res.status(500).json({ error: "Internal Server Error" });
            }

            const response = {
              quotref: data1?.[0]?.quotref || null,
              deliveryperiod: data1?.[0]?.deliveryperiod || null,
              guranteeperiod: data1?.[0]?.guranteeperiod || null,

              qdate: data1?.[0]?.qdate || null,
              unloading: data1?.[0]?.unloading || null,
              transport: data1?.[0]?.transport || null,
              cost: data1?.[0]?.cost || null,
              paymentdesc: data1?.[0]?.paymentdesc || null,
              deliverydesc: data1?.[0]?.deliverydesc || null,
              guranteetext: data1?.[0]?.guranteetext || null,
              inspectiondesc: data1?.[0]?.inspectiondesc || null,
              custname: data2?.[0]?.custname || null,
              contactperson: data2?.[0]?.contactperson || null,
              capacity: data2?.[0]?.capacity || null,
              address: data2?.[0]?.address || null,
              hvvoltage: data2?.[0]?.hvvoltage || null,
              lvvoltage: data2?.[0]?.lvvoltage || null,
              core: data2?.[0]?.core || null,
              typecolling: data2?.[0]?.typecolling || null,
              typetaping: data2?.[0]?.typetaping || "No Tapping",
              tapingSwitch: data2?.[0]?.tapingSwitch || null,
              type: data2?.[0]?.type || null,
              matofwind: data2?.[0]?.matofwind || null,
              vectorgroup: data2?.[0]?.vectorgroup || null,
              priratio: data2?.[0]?.priratio || null,
              secratio: data2?.[0]?.secratio || null,
              voltageratio: data2?.[0]?.voltageratio || null,
              orderacc_date: data3?.[0]?.orderacc_date || null,
              consumer: data3?.[0]?.consumer || null,
              quantity: data3?.[0]?.quantity || null,
              advance: data3?.[0]?.advance || null,
              ponum: data3?.[0]?.ponum || null,
              podate: data3?.[0]?.podate || null,
              basicrate: data3?.[0]?.basicrate || null,
              consumer_address: data3?.[0]?.consumer_address || null,
              comment: data2?.[0]?.comment || null,
              gstno: data3?.[0]?.gstno || "",
              cgst: data4?.[0]?.cgst || 9,
              sgst: data4?.[0]?.sgst || 9,
            };

            return res.json(response);
          });
        });
      });
    });
  });
});

//<---------------------------------------------------------------------------------------------->

//<------------------------------------------------------------------------------------------------->
//<------------------------------------delete proinvoice----------------------------->
router.delete("/deleteProinvoice/:id", (req, res) => {
  const id = req.params.id;
  const q = "";
  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<--------------------------------------------------------------------------------------->
//<----------------------------------delete order acceptence--------------------------------------->
router.delete("/deleteOrder/:id", (req, res) => {
  const id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Connection failed" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Transaction start failed" });
      }

      // Step 1: Delete from payments (assuming orderid is foreign key)
      connection.query("DELETE FROM payments WHERE oid = ?", [id], (err, result1) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.log("DELETE payments error:", err); // helpful debug log
            return res.status(500).json({ error: "Error deleting from payments" });
          });
        }

        connection.query("DELETE FROM order_acceptance WHERE id = ?", [id], (err, result2) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json({ error: "Error deleting from order_acceptance" });
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return res.status(500).json({ error: "Commit failed" });
              });
            }

            connection.release();
            return res.json({ success: true });
          });
        });
      });

    });
  });
});




router.delete("/deleteprofoma/:id", (req, res) => {
  const id = req.params.id;

  const q = `DELETE FROM proforma_invoice WHERE id = ?`;
  pool.query(q, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error deleting data" });
    }

    return res.json({ success: true });
  });
});
//<------------------------------------------------------------------------------>
//<---------------------------------get payments------------------------------------->
//<---------------------------get payments ------------------------------->
// router.get("/getPayments", (req, res) => {
//   const q = `
//     SELECT 
//       oa.id, 
//       oa.ref_no,
//       oa.orderacc_date,
//       e.custname,
//       e.capacity,
//       e.priratio,
//       e.secratio,
//       (
//         (IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0)) *
//         ((IFNULL(qta.cgst, 0) + IFNULL(qta.sgst, 0)) / 100)
//       ) + (IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0)) AS total,
//       IFNULL(p.paid_amount, 0) AS paid,
//       (SELECT MAX(date) FROM payments WHERE oid = oa.id) as date
//     FROM 
//       order_acceptance oa
//     INNER JOIN 
//       quotation qt ON qt.qid = oa.qid
//     INNER JOIN 
//       enquiry_master e ON e.id = qt.eid
//     INNER JOIN 
//       quot_taxes qta ON qta.qid = qt.qid
//     LEFT JOIN 
//       (SELECT oid, SUM(amount) AS paid_amount FROM payments GROUP BY oid) p 
//       ON oa.id = p.oid
//     ORDER BY oa.id DESC;
//   `;

//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }
//     return res.json(data);
//   });
// });

router.get("/getPayments", (req, res) => {
  const q = `
    SELECT 
      oa.id, 
      oa.ref_no,
      oa.orderacc_date,
      e.custname,
      e.capacity,
      e.priratio,
      e.secratio,
      CAST(CASE 
        -- When GST is Exclusive, add GST to the total
        WHEN qta.cgsttype = 'Exclusive' OR qta.sgsttype = 'Exclusive' THEN
          (IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0)) +
          ((IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0)) * 
           ((IFNULL(qta.cgst, 0) + IFNULL(qta.sgst, 0)) / 100))
        -- When GST is Inclusive, total is just quantity * rate (GST already included)
        ELSE
          (IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0))
      END AS DECIMAL(10,2)) AS total,
      CAST(IFNULL(it.paid_amount, 0) AS DECIMAL(10,2)) AS paid,
      (SELECT MAX(created_at) FROM invoice_transactions WHERE oid = oa.id) as date
    FROM 
      order_acceptance oa
    INNER JOIN 
      quotation qt ON qt.qid = oa.qid
    INNER JOIN 
      enquiry_master e ON e.id = qt.eid
    LEFT JOIN 
      quot_taxes qta ON qta.qid = qt.qid AND qta.id = (
        SELECT MIN(id) FROM quot_taxes WHERE qid = qt.qid
      )
    LEFT JOIN 
      (SELECT oid, SUM(advance) AS paid_amount FROM invoice_transactions GROUP BY oid) it 
      ON oa.id = it.oid
    ORDER BY oa.id DESC;
  `;

  pool.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching payments:", err);
      return res.status(500).json({ error: "Failed to fetch payments" });
    }
    console.log("Payments data retrieved:", data);
    return res.json(data);
  });
});

//<------------------------------------------------------------------------------------->
//<--------------------------------get detailed payments--------------------------------->
// router.get("/getDetailedPayments/:id", (req, res) => {
//   const q = `
//     SELECT
//       IFNULL(paid_table.paid, 0) AS paid,
//       (
//         (IFNULL(oa.quantity,0)*IFNULL(qt.cost,0)) *
//         ((IFNULL(qta.cgst,0)+IFNULL(qta.sgst,0))/100)
//       ) +
//       (IFNULL(oa.quantity,0)*IFNULL(qt.cost,0)) AS total
//     FROM order_acceptance oa
//     INNER JOIN quotation qt ON qt.qid = oa.qid
//     INNER JOIN quot_taxes qta ON qta.qid = qt.qid
//     LEFT JOIN (
//       SELECT oid, SUM(amount) AS paid
//       FROM payments
//       WHERE oid = ?
//       GROUP BY oid
//     ) AS paid_table ON paid_table.oid = oa.id
//     WHERE oa.id = ?
//   `;

//   const q1 = `SELECT * FROM payments WHERE oid = ?`;

//   pool.query(q, [req.params.id, req.params.id], (err, data) => {
//     if (err) return res.json(err);

//     pool.query(q1, [req.params.id], (err, payments) => {
//       if (err) return res.json(err);

//       return res.json({
//         paid: data[0]?.paid || 0,
//         total: data[0]?.total || 0,
//         payments,
//       });
//     });
//   });
// });

// router.get("/getDetailedPayments/:id", (req, res) => {
//   const q = `
//     SELECT
//       oa.ref_no,
//       IFNULL(paid_table.paid, 0) AS paid,
//       (
//         (IFNULL(oa.quantity,0)*IFNULL(qt.cost,0)) *
//         ((IFNULL(qta.cgst,0)+IFNULL(qta.sgst,0))/100)
//       ) +
//       (IFNULL(oa.quantity,0)*IFNULL(qt.cost,0)) AS total
//     FROM order_acceptance oa
//     INNER JOIN quotation qt ON qt.qid = oa.qid
//     INNER JOIN quot_taxes qta ON qta.qid = qt.qid
//     LEFT JOIN (
//       SELECT oid, SUM(amount) AS paid
//       FROM payments
//       WHERE oid = ?
//       GROUP BY oid
//     ) AS paid_table ON paid_table.oid = oa.id
//     WHERE oa.id = ?
//   `;

//   const q1 = `
//     SELECT p.*, oa.ref_no 
//     FROM payments p
//     INNER JOIN order_acceptance oa ON oa.id = p.oid
//     WHERE p.oid = ?
//   `;

//   pool.query(q, [req.params.id, req.params.id], (err, data) => {
//     if (err) return res.json(err);

//     pool.query(q1, [req.params.id], (err, payments) => {
//       if (err) return res.json(err);

//       return res.json({
//         ref_no: data[0]?.ref_no || null,
//         paid: data[0]?.paid || 0,
//         total: data[0]?.total || 0,
//         payments, // now each payment record has ref_no as well
//       });
//     });
//   });
// });

// router.get("/getDetailedPayments/:id", (req, res) => {
//   const q = `
//     SELECT
//       oa.ref_no,
//       CAST(IFNULL(paid_table.paid, 0) AS DECIMAL(10,2)) AS paid,
//       CAST(CASE 
//         -- When GST is Exclusive, add GST to the total
//         WHEN qta.cgsttype = 'Exclusive' OR qta.sgsttype = 'Exclusive' THEN
//           (IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0)) +
//           ((IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0)) * 
//            ((IFNULL(qta.cgst, 0) + IFNULL(qta.sgst, 0)) / 100))
//         -- When GST is Inclusive, total is just quantity * rate (GST already included)
//         ELSE
//           (IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0))
//       END AS DECIMAL(10,2)) AS total
//     FROM order_acceptance oa
//     INNER JOIN quotation qt ON qt.qid = oa.qid
//     INNER JOIN quot_taxes qta ON qta.qid = qt.qid
//     LEFT JOIN (
//       SELECT oid, SUM(advance) AS paid
//       FROM invoice_transactions
//       WHERE oid = ?
//       GROUP BY oid
//     ) AS paid_table ON paid_table.oid = oa.id
//     WHERE oa.id = ?
//   `;

//   const q1 = `
//     SELECT it.*, oa.ref_no 
//     FROM invoice_transactions it
//     INNER JOIN order_acceptance oa ON oa.id = it.oid
//     WHERE it.oid = ?
//     ORDER BY it.created_at DESC
//   `;

//   pool.query(q, [req.params.id, req.params.id], (err, data) => {
//     if (err) {
//       console.error("Error fetching detailed payment summary:", err);
//       return res.status(500).json({ error: "Failed to fetch payment summary" });
//     }

//     pool.query(q1, [req.params.id], (err, invoiceTransactions) => {
//       if (err) {
//         console.error("Error fetching invoice transactions:", err);
//         return res.status(500).json({ error: "Failed to fetch transactions" });
//       }

//       return res.json({
//         ref_no: data[0]?.ref_no || null,
//         paid: data[0]?.paid || 0,
//         total: data[0]?.total || 0,
//         payments: invoiceTransactions, // each transaction record has ref_no
//       });
//     });
//   });
// });

router.get("/getDetailedPayments/:id", (req, res) => {
  const q = `
    SELECT
      oa.ref_no,
      CAST(IFNULL(paid_table.paid, 0) AS DECIMAL(10,2)) AS paid,
      CAST(CASE 
        WHEN qta.cgsttype = 'Exclusive' OR qta.sgsttype = 'Exclusive' THEN
          (IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0)) +
          ((IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0)) * 
           ((IFNULL(qta.cgst, 0) + IFNULL(qta.sgst, 0)) / 100))
        ELSE
          (IFNULL(oa.quantity, 0) * IFNULL(qt.cost, 0))
      END AS DECIMAL(10,2)) AS total
    FROM order_acceptance oa
    INNER JOIN quotation qt ON qt.qid = oa.qid
    INNER JOIN quot_taxes qta ON qta.qid = qt.qid
    LEFT JOIN (
      SELECT oid, SUM(advance) AS paid
      FROM invoice_transactions
      WHERE oid = ?
      GROUP BY oid
    ) AS paid_table ON paid_table.oid = oa.id
    WHERE oa.id = ?
  `;

  // 🆕 Updated query to include paymode from payments
  const q1 = `
    SELECT 
      it.*, 
      oa.ref_no, 
      p.paymode
    FROM invoice_transactions it
    INNER JOIN order_acceptance oa ON oa.id = it.oid
    LEFT JOIN payments p ON p.id = it.payment_id  -- Join payment table
    WHERE it.oid = ?
    ORDER BY it.created_at DESC
  `;

  pool.query(q, [req.params.id, req.params.id], (err, data) => {
    if (err) {
      console.error("Error fetching detailed payment summary:", err);
      return res.status(500).json({ error: "Failed to fetch payment summary" });
    }

    pool.query(q1, [req.params.id], (err, invoiceTransactions) => {
      if (err) {
        console.error("Error fetching invoice transactions:", err);
        return res.status(500).json({ error: "Failed to fetch transactions" });
      }

      return res.json({
        ref_no: data[0]?.ref_no || null,
        paid: data[0]?.paid || 0,
        total: data[0]?.total || 0,
        payments: invoiceTransactions.map(tx => ({
          ...tx,
          paymode: tx.paymode || "", // ensures paymode always exists
        })),
      });
    });
  });
});


//<-------------------------------------------------------------------------------->
//<------------------------------------delete payment-------------------------------->

// router.delete("/deletePayment/:id", (req, res) => {
//   const id = req.params.id;
//   const q = "Delete from payments where id=?";
//   pool.query(q, [id], (err, data) => {
//     if (err) {
//       return res.json(err);
//     }
//     return res.json(data);
//   });
// });

router.delete("/deletePayment/:id", (req, res) => {
  const id = req.params.id;

  // Step 1: Delete all related invoice_transactions first
  const deleteInvoiceTransactions = "DELETE FROM invoice_transactions WHERE id = ?";

  // Step 2: Delete payment itself
  const deletePayment = "DELETE FROM payments WHERE id = ?";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      return res.status(500).json({ error: "Database connection failed" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Transaction start failed" });
      }

      // Delete from invoice_transactions first
      connection.query(deleteInvoiceTransactions, [id], (err) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error("Error deleting invoice_transactions:", err);
            res.status(500).json({ error: "Failed to delete related invoice transactions" });
          });
        }

        // Then delete from payments
        connection.query(deletePayment, [id], (err, data) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error("Error deleting payment:", err);
              res.status(500).json({ error: "Failed to delete payment" });
            });
          }

          // Commit transaction
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("Commit failed:", err);
                res.status(500).json({ error: "Transaction commit failed" });
              });
            }

            connection.release();
            res.json({ message: "Payment and related transactions deleted successfully" });
          });
        });
      });
    });
  });
});


//<-------------------------------------------------------->
//<-----------------------------add payments-------------------------------->
// router.post("/payment", (req, res) => {
//   const id = req.body.id;
//   const customer = req.body.customer;
//   const advance = req.body.advance;
//   const date = req.body.date;
//   const paymode = req.body.paymode;
//   const payment_date = req.body.payment_date;
//   const cheque_rtgs_no = req.body.cheque_rtgs_no;
//   const amount = req.body.amount;
//   const oid = req.body.oid;

//   pool.query(
//     "insert into payments values(?,?,?,?,?,?,?,?,?)",
//     [
//       id,
//       customer,
//       advance,
//       date,
//       paymode,
//       payment_date,
//       cheque_rtgs_no,
//       amount,
//       oid,
//     ],
//     (err, result) => {
//       if (err) {
//       } else {
//         return res.send("POSTED");
//       }
//     }
//   );
// });

router.post("/payment", (req, res) => {
  const id = req.body.id;
  const customer = req.body.customer;
  const advance = req.body.advance;
  const date = req.body.date;
  const paymode = req.body.paymode;
  const payment_date = req.body.payment_date;
  const cheque_rtgs_no = req.body.cheque_rtgs_no;
  const amount = req.body.amount;
  const oid = req.body.oid;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Connection error:", err);
      return res.status(500).send("Database connection failed");
    }

    // Fetch details from order_acceptance and related tables
    const fetchDetailsQuery = `
      SELECT 
        oa.qid,
        q.eid as enquiry_id,
        e.cid as costing_id,
        NULL as plan_id,
        qt.cgst,
        qt.sgst,
        0 as igst,
        e.id as buyer_id,
        e.custname as buyer_name,
        q.cost as rate,
        oa.quantity as qty
      FROM order_acceptance oa
      INNER JOIN quotation q ON oa.qid = q.qid
      INNER JOIN enquiry_master e ON q.eid = e.id
      LEFT JOIN quot_taxes qt ON q.qid = qt.qid
      WHERE oa.id = ?
    `;

    connection.query(fetchDetailsQuery, [oid], (err, detailsResult) => {
      if (err) {
        connection.release();
        console.error("Error fetching details:", err);
        return res.status(500).send("Error fetching related details");
      }

      if (detailsResult.length === 0) {
        connection.release();
        return res.status(404).send("Order details not found");
      }

      const details = detailsResult[0];

      // Get the current total advance for this order
      // const getTotalAdvanceQuery = `
      //   SELECT COALESCE(SUM(advance), 0) as total_advance 
      //   FROM invoice_transactions 
      //   WHERE oid = ?
      // `;

      const getLastInvoiceBalanceQuery = `
          SELECT invoice_balance, net_total 
          FROM invoice_transactions 
          WHERE oid = ? 
          ORDER BY id DESC 
          LIMIT 1
        `;

      // connection.query(getTotalAdvanceQuery, [oid], (err, advanceResult) => {
      //   if (err) {
      //     connection.release();
      //     console.error("Error fetching total advance:", err);
      //     return res.status(500).send("Error fetching total advance");
      //   }

      connection.query(getLastInvoiceBalanceQuery, [oid], (err, lastBalanceResult) => {
        if (err) {
          connection.release();
          console.error("Error fetching last invoice balance:", err);
          return res.status(500).send("Error fetching last invoice balance");
        }

        const lastInvoiceBalance = lastBalanceResult.length > 0 ? parseFloat(lastBalanceResult[0].invoice_balance || 0) : 0;
        const lastNetTotal = lastBalanceResult.length > 0 ? parseFloat(lastBalanceResult[0].net_total || 0) : 0;
        const newInvoiceBalance = lastInvoiceBalance + parseFloat(amount);
        console.log("lastInvoiceBalance", lastInvoiceBalance);
        console.log("newInvoiceBalance", newInvoiceBalance);


        const invoice_balance = newInvoiceBalance;

        connection.beginTransaction((err) => {
          if (err) {
            connection.release();
            return res.status(500).send("Transaction start failed");
          }

          // Insert payment
          const insertPaymentQuery = "INSERT INTO payments VALUES(?,?,?,?,?,?,?,?,?)";
          const paymentValues = [
            id,
            customer,
            advance,
            date,
            paymode,
            payment_date,
            cheque_rtgs_no,
            amount,
            oid,
          ];

          connection.query(insertPaymentQuery, paymentValues, (err, paymentResult) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("Payment Insert Error:", err);
                return res.status(500).send("Payment insert failed");
              });
            }

            // Insert new invoice transaction record for this payment with payment_id
            const insertInvoiceTransactionQuery = `
              INSERT INTO invoice_transactions (
                invoice_id,
                invoice_no,
                oid,
                costing_id,
                enquiry_id,
                plan_id,
                item_desc,
                qty,
                hsn,
                rate,
                item_amount,
                basic_total,
                cgst,
                sgst,
                igst,
                roundoff,
                grand_total,
                advance,
                net_total,
                invoice_balance,
                payment_id,
                buyer_id,
                buyer_name,
                invoice_date,
                uid,
                created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;

            const invoiceTransactionValues = [
              null,                      // invoice_id
              null,                      // invoice_no
              oid,                       // oid
              details.costing_id,        // costing_id
              details.enquiry_id,        // enquiry_id
              details.plan_id,           // plan_id
              null,                      // item_desc
              details.qty,               // qty
              null,                      // hsn
              details.rate,              // rate
              null,                      // item_amount
              null,                      // basic_total
              details.cgst || 0,         // cgst
              details.sgst || 0,         // sgst
              details.igst || 0,         // igst
              null,                      // roundoff
              null,                      // grand_total
              amount,                    // advance - current payment amount
              null,                      // net_total
              invoice_balance,           // invoice_balance - cumulative balance
              paymentResult.insertId,    // payment_id - from payment insert
              details.buyer_id,          // buyer_id
              details.buyer_name,        // buyer_name
              null,                      // invoice_date
              null                       // uid
            ];

            connection.query(insertInvoiceTransactionQuery, invoiceTransactionValues, (err, invoiceResult) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error("Invoice Transaction Insert Error:", err);
                  return res.status(500).send("Invoice transaction insert failed");
                });
              }

              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error("Commit Error:", err);
                    return res.status(500).send("Transaction commit failed");
                  });
                }

                connection.release();
                return res.send("POSTED");
              });
            });
          });
        });
      });
    });
  });
});

// router.post("/payment", (req, res) => {
//   const id = req.body.id;
//   const customer = req.body.customer;
//   const advance = req.body.advance;
//   const date = req.body.date;
//   const paymode = req.body.paymode;
//   const payment_date = req.body.payment_date;
//   const cheque_rtgs_no = req.body.cheque_rtgs_no;
//   const amount = req.body.amount;
//   const oid = req.body.oid;

//   // First, insert the payment
//   pool.query(
//     "INSERT INTO payments VALUES(?,?,?,?,?,?,?,?,?)",
//     [
//       id,
//       customer,
//       advance,
//       date,
//       paymode,
//       payment_date,
//       cheque_rtgs_no,
//       amount,
//       oid,
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("Error inserting payment:", err);
//         return res.status(500).send("Error inserting payment");
//       }

//       // After successful payment insertion, update the remainingadvance in order_acceptance
//       pool.query(
//         "UPDATE order_acceptance SET remainingadvance = COALESCE(remainingadvance, 0) + ? WHERE id = ?",
//         [advance, oid],
//         (updateErr, updateResult) => {
//           if (updateErr) {
//             console.error("Error updating remainingadvance:", updateErr);
//             return res.status(500).send("Error updating remaining advance");
//           }

//           return res.send("POSTED");
//         }
//       );
//     }
//   );
// });
//<-------------------------------------------------------------->
//<-------------------------------------------get new payment-------------------->
router.get("/getNewpayments", (req, res) => {
  const q =
    "SELECT SQL_CALC_FOUND_ROWS p.id,p.payment_date,ifnull(p.paymode,''),p.date,ref_no, capacity,voltageratio,orderacc_date, p.cheque_rtgs_no,oid,cm.custname,p.amount, " +
    "((IFNULL(oa.quantity,0)*IFNULL(qt.cost,0))*((IFNULL(qta.cgst,0)+IFNULL(qta.sgst,0))/100))+(IFNULL(oa.quantity,0)*IFNULL(qt.cost,0)) As total " +
    "FROM payments p inner join order_acceptance oa on oa.id=p.oid inner join quotation qt on qt.qid=oa.qid " +
    "inner join enquiry_master e on e.id=qt.eid INNER JOIN quot_taxes qta ON qta.qid=qt.qid" +
    " inner join customer_master cm on cm.id=e.cid ";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<------------------------------------------------------------------------------->
//<---------------------------get payments ------------------------------->
router.get("/getPayments", (req, res) => {
  const q = `SELECT MAX(p.date) as date, SUM(p.amount) AS paid,
  oa.id, 
  oa.ref_no,
  oa.orderacc_date,
  e.capacity,
  e.custname,
  e.priratio,
  e.secratio,
  ((IFNULL(oa.quantity,0)*IFNULL(qt.cost,0))*((IFNULL(qta.cgst,0)+IFNULL(qta.sgst,0))/100))+(IFNULL(oa.quantity,0)*IFNULL(qt.cost,0)) As total
  FROM payments p 
  left join order_acceptance oa on oa.id=p.oid 
  inner join quotation qt on qt.qid=oa.qid 
  inner join enquiry_master e on e.id=qt.eid INNER JOIN quot_taxes qta ON qta.qid=qt.qid 
  GROUP BY p.oid`;
  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<-------------------------------------------------------------------------------->
//<--------------------------------get quotation parameters------------------------------>
router.get("/getQuotParameter", (req, res) => {
  const q = "SELECT * from quotparameter_master limit 1";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data[0]);
  });
});
//<--------------------------------------------------------------------------------->
//<----------------------------------update parameters------------------------------>
router.put("/updateParameter", (req, res) => {
  const {
    quotdate,
    quottitle,
    delivery_temp1,
    pay_temp1,
    pay_temp2,
    pay_temp3,
    insp_temp1,
    insp_temp2,
    insp_temp3,
    gltterms,
    ghtterms,
    validityterms,
    gspecial,
    id,
  } = req.body;
  const q = `UPDATE quotparameter_master SET quotdate=?, quottitle=?, delivery_temp1=?, pay_temp1=?, pay_temp2=?, pay_temp3=?, insp_temp1=?, insp_temp2=?, insp_temp3=?, gltterms=?, ghtterms=?, validityterms=?, gspecial=? WHERE id = ?`;

  pool.query(
    q,
    [
      quotdate,
      quottitle,
      delivery_temp1,
      pay_temp1,
      pay_temp2,
      pay_temp3,
      insp_temp1,
      insp_temp2,
      insp_temp3,
      gltterms,
      ghtterms,
      validityterms,
      gspecial,
      id,
    ],
    (err, data) => {
      if (err) {
        return res.json(err);
      }

      return res.json(data[0]);
    }
  );
});
//<----------------------------------------------------------------------------------------->
//<----------------------------add coustomer ------------------------------------------->
router.post("/addCustomer", (req, res) => {
  const id = req.body.id;
  const custname = req.body.custname;
  const cperson = req.body.cperson;
  const email = req.body.email;
  const desg = req.body.desg;
  const contactno = req.body.contactno;
  const altcontactno = req.body.altcontactno;
  const address = req.body.address;
  const gstno = req.body.gstno;
  const panno = req.body.panno;

  pool.query(
    "SELECT * FROM customer_master WHERE custname = ?",
    [custname],
    (selectErr, selectResult) => {
      if (selectErr) {
        return res.status(500).send("Internal Server Error");
      } else {
        if (selectResult.length > 0) {
          // Customer name already exists, send an alert message
          return res.status(422).send("Customer name already exists");
        } else {
          pool.query(
            "INSERT INTO customer_master VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              id,
              custname,
              cperson,
              email,
              desg,
              contactno,
              altcontactno,
              address,
              gstno,
              panno,
            ],
            (insertErr, insertResult) => {
              if (insertErr) {
                return res.status(500).json({
                  success: false,
                  message: "Internal Server Error",
                  error: insertErr.message || "An unexpected error occurred",
                });
              } else {
                return res.send("POSTED");
              }
            }
          );
        }
      }
    }
  );
});

//<-------------------------------------------------------------------->
//<-----------------------------------get customer master------------------------>
router.get("/getCustemermaster", (req, res) => {
  const q =
    "SELECT `id`, `custname`, `cperson`, `email`, `desg`, `contactno`, `altcontactno`, `address`, `gstno`, `panno` FROM `customer_master`";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<------------------------------------------------------------------------------->
//<-----------------------------delete customers----------------------------------->
router.delete("/deleteCustomers/:id", (req, res) => {
  const id = req.params.id;
  const q = "Delete from customer_master where id=?";
  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<----------------------------------------------------------------------------->
//<-----------------------------------------edit customers------------------------------>
router.get("/editcust/:id", (req, res) => {
  const q = "Select * From customer_master Where id=?";

  const id = req.params.id;

  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});
//<----------------------------------------------------------------------------------->
//<------------------------------------update customers---------------------------->
router.put("/updateCust/:id", (req, res) => {
  const q =
    "Update customer_master SET custname=?, cperson=?,  desg=?, email=?, contactno=?, altcontactno=?, address=?, gstno=?, panno=? Where id=?";
  pool.query(
    q,
    [
      req.body.custname,
      req.body.cperson,
      req.body.desg,
      req.body.email,
      req.body.contactno,
      req.body.altcontactno,
      req.body.address,
      req.body.gstno,
      req.body.panno,
      req.params.id,
    ],
    (err, result, feilds) => {
      if (err) {
      } else {
        return res.send("Updated");
      }
    }
  );
});
//<----------------------------------------------------------------------------->
//<---------------------------------get units------------------------------------>
router.get("/getUnits", (req, res) => {
  const q = "SELECT * from unitmaster";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<----------------------------------------------------------------------------->
//<--------------------------------get stores------------------------------------>
router.get("/getStores", (req, res) => {
  const q = "SELECT * from store_master";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<--------------------------------------------------------------------->
//<----------------------------add material-------------------------------->

router.post("/addmaterial", async (req, res) => {
  try {
    const materials = req.body;

    if (!materials || materials.length === 0) {
      return res.status(400).send("Please add at least one material");
    }

    // Trim item_codes
    materials.forEach((material) => {
      if (material.item_code) {
        material.item_code = material.item_code.trim();
      }
    });

    // ✅ Check for duplicates within the request payload
    const seen = new Set();
    const duplicates = materials
      .map((m) => m.item_code)
      .filter((code) => {
        if (seen.has(code)) return true;
        seen.add(code);
        return false;
      });

    if (duplicates.length > 0) {
      return res
        .status(400)
        .json({ error: "Duplicate item codes in request: " + duplicates.join(", ") });
    }

    // Check if item codes already exist in database
    const existingItemCodes = await new Promise((resolve, reject) => {
      const itemCodes = materials.map((material) => material.item_code);
      pool.query(
        "SELECT item_code FROM material_master WHERE item_code IN (?)",
        [itemCodes],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.map((row) => row.item_code));
        }
      );
    });

    if (existingItemCodes.length > 0) {
      return res
        .status(400)
        .json({ error: "Item codes already exist in DB: " + existingItemCodes.join(", ") });
    }

    // Insert all materials
    const insertQueries = materials.map(
      ({ item_code, material_description, unit, uid, store_id, rate }) => {
        return new Promise((resolve, reject) => {
          pool.query(
            "INSERT INTO material_master (item_code, material_description, unit, uid, store_id, rate) VALUES (?, ?, ?, ?, ?, ?)",
            [item_code, material_description, unit, uid, store_id, rate],
            (err, result) => {
              if (err) return reject(err);
              resolve(result);
            }
          );
        });
      }
    );

    await Promise.all(insertQueries);

    return res.send("POSTED");
  } catch (error) {
    console.error("Error inserting materials:", error);
    return res.status(500).send("Error inserting materials: " + error.message);
  }
});


// router.post("/addmaterial", async (req, res) => {
//   try {
//     const materials = req.body;

//     if (!materials || materials.length === 0) {
//       return res.status(400).send("Please add at least one material");
//     }
//     materials.forEach((material) => {
//       if (material.item_code) {
//         material.item_code = material.item_code.trim();
//       }
//     });
//     // Check if item codes already exist
//     const existingItemCodes = await new Promise((resolve, reject) => {
//       const itemCodes = materials.map((material) => material.item_code);
//       pool.query(
//         "SELECT item_code FROM material_master WHERE item_code IN (?)",
//         [itemCodes],
//         (err, result) => {
//           if (err) {
//             return reject(err);
//           } else {
//             resolve(result.map((row) => row.item_code));
//           }
//         }
//       );
//     });

//     // Check if any item code already exists
//     if (existingItemCodes.length > 0) {
//       const errorMessage =
//         "Item codes already exist: " + existingItemCodes.join(", ");
//       return res.status(400).json({ error: errorMessage });
//     }

//     // Continue with the insertion
//     const insertQueries = materials.map(
//       ({ item_code, material_description, unit, uid, store_id, rate }) => {
//         return new Promise((resolve, reject) => {
//           pool.query(
//             "INSERT INTO material_master (item_code, material_description, unit, uid, store_id, rate) VALUES (?, ?, ?, ?, ?, ?)",
//             [item_code, material_description, unit, uid, store_id, rate],
//             (err, result) => {
//               if (err) {
//                 return reject(err);
//               } else {
//                 return resolve(result);
//               }
//             }
//           );
//         });
//       }
//     );

//     await Promise.all(insertQueries);

//     // Send success response
//     return res.send("POSTED");
//   } catch (error) {
//     console.error("Error inserting materials:", error);
//     return res.status(500).send("Error inserting materials: " + error.message);
//   }
// });

//<------------------------------------------------------------------->
//<-----------------------------get material master------------------------->
router.get("/getMaterialmaster", (req, res) => {
  // const q = `SELECT mm.id, mm.item_code, mm.material_description,mm.rate,u.unit,sm.store_name,COALESCE(s.qty, 0) AS stock
  // FROM material_master mm 
  // INNER JOIN unitmaster u ON u.id=mm.unit
  // INNER JOIN store_master sm ON sm.id=mm.store_id
  // LEFT JOIN stock s ON s.itemid=mm.id
  // ORDER BY mm.id DESC`;
  //   const q = `
  //   SELECT 
  //   mm.id, 
  //   mm.item_code, 
  //   mm.material_description,
  //   mm.rate,
  //   u.unit,
  //   sm.store_name,
  //   COALESCE(s.qty, 0) AS stock,
  //   CASE 
  //     WHEN cd.id IS NOT NULL THEN TRUE
  //     ELSE FALSE
  //   END AS costing_done
  // FROM material_master mm
  // INNER JOIN unitmaster u ON u.id = mm.unit
  // INNER JOIN store_master sm ON sm.id = mm.store_id
  // LEFT JOIN stock s ON s.itemid = mm.id
  // LEFT JOIN costing_details cd ON cd.mid = mm.id
  // ORDER BY mm.id DESC;

  //   `

  const q = `
SELECT 
  mm.id, 
  mm.item_code, 
  mm.material_description,
  mm.rate,
  u.unit,
  sm.store_name,
  COALESCE(s.qty, 0) AS stock,
  CASE 
    WHEN cd.mid IS NOT NULL THEN TRUE
    ELSE FALSE
  END AS costing_done
FROM material_master mm
INNER JOIN unitmaster u ON u.id = mm.unit
INNER JOIN store_master sm ON sm.id = mm.store_id
LEFT JOIN stock s ON s.itemid = mm.id
LEFT JOIN (
  SELECT DISTINCT mid
  FROM costing_details
) cd ON cd.mid = mm.id
ORDER BY mm.id DESC;

`

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<------------------------------------------------------------------->
//<--------------------------------delete marerial---------------------------->
router.delete("/deleteMaterialInward/:id", (req, res) => {
  const id = req.params.id;
  const poid = req.query.poid;

  const updateMaterialInwardStatusQuery =
    "UPDATE material_inward SET status = 1 WHERE poid = ? ";
  pool.query(
    updateMaterialInwardStatusQuery,
    [poid],
    (errUpdateStatus, dataUpdateStatus) => {
      if (errUpdateStatus) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const fetchMaterialDetailsQuery =
        "SELECT itemid, accqty,indentid FROM materialin_details WHERE miid=?";
      pool.query(
        fetchMaterialDetailsQuery,
        [id],
        (errFetchMaterialDetails, dataMaterialDetails) => {
          if (errFetchMaterialDetails) {
            return res.status(500).json({ error: "Internal Server Error" });
          }

          const accQtyMap = new Map();

          dataMaterialDetails.forEach((item) => {
            const { itemid, accqty, indentid } = item;
            if (accQtyMap.has(itemid)) {
              accQtyMap.set(itemid, accQtyMap.get(itemid) + accqty, indentid);
            } else {
              accQtyMap.set(itemid, accqty, indentid);
            }
          });

          const deleteMaterialDetailsQuery =
            "DELETE FROM materialin_details WHERE miid=?";
          pool.query(
            deleteMaterialDetailsQuery,
            [id],
            (errMaterialDetails, dataMaterialDetails) => {
              if (errMaterialDetails) {
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const updateMaterialAccQtyQuery =
                "UPDATE materialin_details SET materialaccqty = materialaccqty + ? WHERE itemid=? AND indentid=?";

              accQtyMap.forEach((accqty, itemid, indentid) => {
                pool.query(
                  updateMaterialAccQtyQuery,
                  [accqty, itemid, indentid],
                  (errUpdateAccQty, dataUpdateAccQty) => {
                    if (errUpdateAccQty) {
                    }
                  }
                );
              });

              const deleteMaterialInwardQuery =
                "DELETE FROM material_inward WHERE id=?";
              pool.query(
                deleteMaterialInwardQuery,
                [id],
                (errMaterialInward, dataMaterialInward) => {
                  if (errMaterialInward) {
                  }

                  return res.json({ success: true });
                }
              );
            }
          );
        }
      );
    }
  );
});

router.delete("/deletequantityInward/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const getDetailsQuery = `
      SELECT itemid, accqty
      FROM qualitycontrol_details
      WHERE qcid = ?
    `;
    const details = await executeQuery(getDetailsQuery, [id]);

    if (!Array.isArray(details) || details.length === 0) {
      return res.status(404).json({ error: "No records found to delete" });
    }

    for (const { itemid, accqty } of details) {
      const getStockQuery = `
        SELECT qty
        FROM stock
        WHERE itemid = ?
      `;
      const stock = await executeQuery(getStockQuery, [itemid]);

      if (Array.isArray(stock) && stock.length > 0) {
        // Update stock quantity if itemid exists
        const newQty = stock[0].qty - accqty;
        const updateStockQuery = `
          UPDATE stock
          SET qty = ?
          WHERE itemid = ?
        `;
        await executeQuery(updateStockQuery, [newQty, itemid]);
      }
    }

    // Delete records from qualitycontrol_details
    const deleteMaterialDetailsQuery = `
      DELETE FROM qualitycontrol_details
      WHERE qcid = ?
    `;
    await executeQuery(deleteMaterialDetailsQuery, [id]);

    // Delete record from qualitycontrolinward
    const deleteMaterialInwardQuery = `
      DELETE FROM qualitycontrolinward
      WHERE id = ?
    `;
    await executeQuery(deleteMaterialInwardQuery, [id]);

    return res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//<------------------------------------------------------------------------>
//<----------------------------------edit material----------------------------->
router.get("/editMaterial/:id", (req, res) => {
  const q =
    "select id,item_code,material_description,rate,unit,store_id from material_master where id=?";

  const id = req.params.id;

  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});
//<--------------------------------------------------------------------------------------->
//<-------------------------------update material --------------------------------------->

router.put("/updatematerial/:id", (req, res) => {
  const q =
    "Update material_master SET item_code=?, material_description=?,  unit=?, store_id=?,rate=? Where id=?";
  pool.query(
    q,
    [
      req.body.item_code,
      req.body.material_description,
      req.body.unit,
      req.body.store_id,
      req.body.rate,
      req.params.id,
    ],
    (err, result, feilds) => {
      if (err) {
      } else {
        return res.send("Updated");
      }
    }
  );
});
//<----------------------------------------------------------------->
//<-------------------------add costing ----------------------------->
// router.post("/costing1", (req, res) => {
//   console.log(req.body)
//   const {
//     id,
//     costing_date,
//     oltctext,
//     eid,
//     uid,
//     accessories,
//     labourcharges,
//     miscexpense,
//     materialList = [],
//     costingname,
//   } = req.body;

//   pool.query(
//     "SELECT COUNT(*) AS count FROM costing_master WHERE costingname = ?",
//     [costingname],
//     (err, result) => {
//       if (err) {

//         return res.status(500).send("Error checking costingname uniqueness");
//       }

//       const count = result[0].count;
//       if (count > 0) {
//         return res.status(400).send("Costing Name is not unique");
//       }

//       if (!materialList?.length) {
//         return res.status(400).send("Sorry, please select materials");
//       }

//       let materialsProcessed = 0;

//       pool.query(
//         "INSERT INTO costing_master (id, costing_date, oltctext, eid, uid, accessories, labourcharges, miscexpense, costingname) VALUES (?,?,?,?,?,?,?,?,?)",
//         [
//           id,
//           costing_date,
//           oltctext,
//           eid,
//           uid,
//           accessories,
//           labourcharges,
//           miscexpense,
//           costingname,
//         ],
//         (err, result) => {
//           if (err) {

//             return res.status(500).send("Error inserting into costing_master");
//           }

//           const updateEnqstatusAndSendResponse = () => {
//             materialsProcessed++;
//             if (materialsProcessed === materialList?.length) {

//               pool.query(
//                 "UPDATE enquiry_master SET enqstatus = 4,cid=? WHERE id = ?",
//                 [result.insertId,eid],
//                 (err, updateResult) => {
//                   if (err) {

//                     return res.status(500).send("Error updating enqstatus");
//                   }

//                   return res.send(updateResult);
//                 }
//               );
//             }
//           };

//           materialList.forEach?.((material) => {
//             const cid = result.insertId;
//             const { quantity, rate, amount, mid } = material;
//             pool.query(
//               "INSERT INTO costing_details (id, cid, mid, quantity, rate, amount) VALUES (?,?,?,?,?,?)",
//               [id, cid, mid, quantity, rate, amount],
//               (err, result) => {
//                 if (err) {

//                   return res.status(500).send("Error inserting into costing_details");
//                 }
//                 updateEnqstatusAndSendResponse();
//               }
//             );
//           });
//         }
//       );
//     }
//   );
// });

router.post("/costing1", (req, res) => {
  const {
    id,
    costing_date, // Renamed to rawCostingDate for clarity
    oltctext,
    eid,
    uid,
    accessories,
    labourcharges,
    miscexpense,
    materialList = [],
    costingname,
  } = req.body;
  const formatDate = (date) => {
    const d = new Date(date);
    let day = "" + d.getDate();
    let month = "" + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;

    return [day, month, year].join("-");
  };

  // Function to check if date is in DD-MM-YYYY format
  const isDateInDDMMYYYYFormat = (dateString) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(dateString);
  };

  // Main logic to process edate
  const processDate = (edate) => {
    if (edate && !isDateInDDMMYYYYFormat(edate)) {
      return formatDate(edate);
    }
    return edate;
  };
  const formattedDate = processDate(costing_date);
  // Format the costing_date as YYYY-MM-DD
  //const costing_date = new Date(rawCostingDate).toISOString().split('T')[0];

  pool.query(
    "SELECT COUNT(*) AS count FROM costing_master WHERE costingname = ?",
    [costingname],
    (err, result) => {
      if (err) {
        return res.status(500).send("Error checking costingname uniqueness");
      }

      const count = result[0].count;
      if (count > 0) {
        return res.status(400).send("Costing Name is not unique");
      }

      if (!materialList?.length) {
        return res.status(400).send("Sorry, please select materials");
      }

      let materialsProcessed = 0;

      pool.query(
        "INSERT INTO costing_master (id, costing_date, oltctext, eid, uid, accessories, labourcharges, miscexpense, costingname) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          id,
          formattedDate, // Using the formatted date
          oltctext,
          eid,
          uid,
          accessories,
          labourcharges,
          miscexpense,
          costingname,
        ],
        async (err, result) => {
          if (err) {
            return res.status(500).send("Error inserting into costing_master");
          }

          const updateEnqstatusAndSendResponse = () => {
            materialsProcessed++;
            if (materialsProcessed === materialList?.length) {
              pool.query(
                "UPDATE enquiry_master SET enqstatus = 4, cid=?,selectedcosting=? WHERE id = ?",
                [result.insertId, costingname, eid],
                (err, updateResult) => {
                  if (err) {
                    return res.status(500).send("Error updating enqstatus");
                  }

                  return res.send(updateResult);
                }
              );
            }
          };

          const insertCostingDetails = async (cid, material) => {
            const { quantity, rate, amount, mid } = material;
            return new Promise((resolve, reject) => {
              pool.query(
                "INSERT INTO costing_details (id, cid, mid, quantity, rate, amount) VALUES (?,?,?,?,?,?)",
                [id, cid, mid, quantity, rate, amount],
                (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
                }
              );
            });
          };

          const cid = result.insertId;

          // Insert into costing_details using async/await and for...of loop
          for (const material of materialList) {
            await insertCostingDetails(cid, material);
            updateEnqstatusAndSendResponse(); // Moved this line here
          }
        }
      );
    }
  );
});

router.get("/getcostingmaster", (req, res) => {
  const q = `SELECT costingname, id
  FROM costing_master
  WHERE costingname IS NOT NULL
  
  UNION
  
  SELECT costingname, id
  FROM costing_master2
  WHERE costingname IS NOT NULL;
  
  
  
  `;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});


router.get("/getFilteredCostings", (req, res) => {
  const {
    capacity,
    hvvoltage,
    lvvoltage,
    vectorgroup,
    matofwind,
    typecolling,
    priratio,
    core,
    secratio,
    frequency,
    phase,
    tapingSwitch
  } = req.query;

  // Check required fields
  if (
    !capacity ||
    !hvvoltage ||
    !lvvoltage ||
    !vectorgroup ||
    !matofwind ||
    !typecolling ||
    !priratio ||
    !core ||
    !secratio ||
    !frequency ||
    !phase ||
    !tapingSwitch
  ) {
    return res.json([]); // Return empty if not all params provided
  }

  // Query without typetaping
  const q = `
    SELECT DISTINCT cm.costingname, cm.id
    FROM costing_master cm
    INNER JOIN enquiry_master em ON cm.id = em.cid
    WHERE cm.costingname IS NOT NULL
      AND em.capacity = ?
      AND em.hvvoltage = ?
      AND em.lvvoltage = ?
      AND em.vectorgroup = ?
      AND em.matofwind = ?
      AND em.typecolling = ?
      AND em.priratio = ?
      AND em.core = ?
      AND em.secratio = ?
      AND em.frequency = ?
      AND em.phase = ?
      AND em.tapingSwitch = ?
    ORDER BY cm.id DESC
  `;

  const params = [
    capacity,
    hvvoltage,
    lvvoltage,
    vectorgroup,
    matofwind,
    typecolling,
    priratio,
    core,
    secratio,
    frequency,
    phase,
    tapingSwitch
  ];

  pool.query(q, params, (err, data) => {
    if (err) {
      console.error("Error fetching filtered costings:", err);
      return res.status(500).json({
        error: "Database error",
        details: err.message
      });
    }
    console.log(`Found ${data.length} matching costings`);
    return res.json(data);
  });
});

// router.get("/getFilteredCostings", (req, res) => {
//   const {
//     capacity,
//     // consumertype,
//     // type,
//     hvvoltage,
//     lvvoltage,
//     vectorgroup,
//     matofwind,
//     typecolling,
//     priratio,
//     core,
//     secratio,
//     frequency,
//     phase,
//     tapingSwitch,
//     typetaping
//   } = req.query;

//   // Check required fields except typetaping (conditionally used)
//   if (
//     !capacity ||
//     // !consumertype ||
//     // !type ||
//     !hvvoltage ||
//     !lvvoltage ||
//     !vectorgroup ||
//     !matofwind ||
//     !typecolling ||
//     !priratio ||
//     !core ||
//     !secratio ||
//     !frequency ||
//     !phase ||
//     !tapingSwitch
//   ) {
//     return res.json([]); // Return empty if not all params provided
//   }

//   // Base query
//   let q = `
//     SELECT DISTINCT cm.costingname, cm.id
//     FROM costing_master cm
//     INNER JOIN enquiry_master em ON cm.id = em.cid
//     WHERE cm.costingname IS NOT NULL
//       AND em.capacity = ?
//       AND em.hvvoltage = ?
//       AND em.lvvoltage = ?
//       AND em.vectorgroup = ?
//       AND em.matofwind = ?
//       AND em.typecolling = ?
//       AND em.priratio = ?
//       AND em.core = ?
//       AND em.secratio = ?
//       AND em.frequency = ?
//       AND em.phase = ?
//       AND em.tapingSwitch = ?
//   `;

//   const params = [
//     capacity,
//     // consumertype,
//     // type,
//     hvvoltage,
//     lvvoltage,
//     vectorgroup,
//     matofwind,
//     typecolling,
//     priratio,
//     core,
//     secratio,
//     frequency,
//     phase,
//     tapingSwitch
//   ];

//   // Add typetaping condition only when tapingSwitch is NOT 'NOTTAPING'
//   if (tapingSwitch !== 'NOTTAPING' && typetaping) {
//     q += ` AND em.typetaping = ?`;
//     params.push(typetaping);
//   }

//   q += ` ORDER BY cm.id DESC`;

//   pool.query(q, params, (err, data) => {
//     if (err) {
//       console.error("Error fetching filtered costings:", err);
//       return res.status(500).json({
//         error: "Database error",
//         details: err.message
//       });
//     }
//     console.log(`Found ${data.length} matching costings`);
//     return res.json(data);
//   });
// });


// router.get("/getFilteredCostings", (req, res) => {
//   const {
//     capacity,
//     consumertype,
//     type,
//     hvvoltage,
//     lvvoltage,
//     vectorgroup,
//     matofwind,
//     typecolling,
//     priratio,
//     core,
//     secratio,
//     frequency,
//     phase,
//     tapingSwitch,
//     typetaping
//   } = req.query;

//   // Check if all parameters are provided
//   if (!capacity || !consumertype || !type || !hvvoltage || !lvvoltage ||
//     !vectorgroup || !matofwind || !typecolling || !priratio || !core ||
//     !secratio || !frequency || !phase || !tapingSwitch || !typetaping) {
//     return res.json([]); // Return empty if not all params provided
//   }

//   const q = `
//     SELECT DISTINCT cm.costingname, cm.id
//     FROM costing_master cm
//     INNER JOIN enquiry_master em ON cm.id = em.cid
//     WHERE cm.costingname IS NOT NULL
//       AND em.capacity = ?
//       AND em.consumertype = ?
//       AND em.type = ?
//       AND em.hvvoltage = ?
//       AND em.lvvoltage = ?
//       AND em.vectorgroup = ?
//       AND em.matofwind = ?
//       AND em.typecolling = ?
//       AND em.priratio = ?
//       AND em.core = ?
//       AND em.secratio = ?
//       AND em.frequency = ?
//       AND em.phase = ?
//       AND em.tapingSwitch = ?
//       AND em.typetaping = ?
//     ORDER BY cm.id DESC
//   `;

//   const params = [
//     capacity,
//     consumertype,
//     type,
//     hvvoltage,
//     lvvoltage,
//     vectorgroup,
//     matofwind,
//     typecolling,
//     priratio,
//     core,
//     secratio,
//     frequency,
//     phase,
//     tapingSwitch,
//     typetaping
//   ];

//   pool.query(q, params, (err, data) => {
//     if (err) {
//       console.error("Error fetching filtered costings:", err);
//       return res.status(500).json({
//         error: "Database error",
//         details: err.message
//       });
//     }
//     console.log(`Found ${data.length} matching costings`);
//     return res.json(data);
//   });
// });

//<-------------------------------------------------------------------->
//<---------------------------get costing id----------------------->
router.get("/getcostingid", (req, res) => {
  const q = `SELECT e.*
  FROM enquiry_master e
  LEFT JOIN costing_master c1 ON e.id = c1.eid
  LEFT JOIN costing_master2 c2 ON e.id = c2.eid
  WHERE e.enqstatus = 1
    AND (c1.eid IS NULL OR c2.eid IS NULL);
  
  `;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});
//<----------------------------------------------------------------------------->

//<----------------------------------get costing 1------------------------------->
router.get("/getcosting1", (req, res) => {
  const q =
    "SELECT SQL_CALC_FOUND_ROWS c.`id`,c.eid,c.costingname,e.selectedcosting,e.`capacity`,IFNULL(e.priratio,'') as priratio ,IFNULL(e.secratio,'') as secratio,e.`type`,e.`consumertype`,e.`vectorgroup`,e.`typecolling`,e.`typetaping`,e.`comment` FROM `costing_master` c " +
    "  inner join enquiry_master e on c.eid=e.id ORDER BY c.`id` DESC;";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    data.forEach((row) => {
      if (
        row.typetaping.includes(
          "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
        )
      ) {
        row.typetaping = "OCTC";
      } else if (
        row.typetaping.includes(
          "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
        )
      ) {
        row.typetaping = "OLTC";
      } else if (row.typetaping.includes("No Tapping")) {
        row.typetaping = "NP";
      } else {
        row.typetaping = "";
      }
    });

    return res.json(data);
  });
});

router.get("/getcostingforbom1/:emId", (req, res) => {
  const emId = req.params.emId;
  console.log(emId);


  //   const q = `
  //   SELECT
  //   c.id AS cid,
  //   e.capacity,
  //   IFNULL(e.priratio, '') AS priratio,
  //   IFNULL(e.secratio, '') AS secratio,
  //   e.type,
  //   e.id,
  //   e.consumertype,
  //   e.vectorgroup,
  //   e.typecolling,
  //   e.typetaping,
  //   e.comment,
  //   e.cid,
  //   e.selectedcosting,
  //   c.costingname,
  //   ppd.prod_plan_id
  // FROM
  //   bom_request br
  // INNER JOIN
  //   production_plan_details ppd ON br.plan_id = ppd.prod_plan_id
  // INNER JOIN
  //   order_acceptance oa ON oa.id = ppd.oa_id
  // INNER JOIN
  //   quotation q ON q.qid = oa.qid
  // INNER JOIN
  //   enquiry_master e ON e.id = q.eid
  // INNER JOIN
  //   costing_master c ON c.eid = e.id
  // WHERE
  //   br.id = ?;
  // `;

  //   const q = `
  //   SELECT
  //   c.id AS cid,
  //   e.capacity,
  //   IFNULL(e.priratio, '') AS priratio,
  //   IFNULL(e.secratio, '') AS secratio,
  //   e.type,
  //   e.id,
  //   e.consumertype,
  //   e.vectorgroup,
  //   e.typecolling,
  //   e.typetaping,
  //   e.comment,
  //   e.cid,
  //   e.selectedcosting,
  //   c.costingname,
  //   ppd.prod_plan_id
  // FROM
  //   bom_request br
  // INNER JOIN
  //   production_plan_details ppd ON br.plan_id = ppd.prod_plan_id
  // INNER JOIN
  //   order_acceptance oa ON oa.id = ppd.oa_id
  // INNER JOIN
  //   quotation q ON q.qid = oa.qid
  // INNER JOIN
  //   enquiry_master e ON e.id = q.eid
  // INNER JOIN
  //   costing_master c ON c.id = e.cid
  // WHERE
  //   br.id = ?;
  // `;

  const q = `
  SELECT
  c.id AS cid,
  e.capacity,
  IFNULL(e.priratio, '') AS priratio,
  IFNULL(e.secratio, '') AS secratio,
  e.type,
  e.id,
  e.consumertype,
  e.vectorgroup,
  e.typecolling,
  e.typetaping,
  e.comment,
  e.cid,
  c.costingname AS selectedcosting,
  c.costingname,
  ppd.prod_plan_id
FROM
  bom_request br
INNER JOIN
  production_plan_details ppd ON br.plan_id = ppd.prod_plan_id
INNER JOIN
  order_acceptance oa ON oa.id = ppd.oa_id
INNER JOIN
  quotation q ON q.qid = oa.qid
INNER JOIN
  enquiry_master e ON e.id = q.eid
INNER JOIN
  costing_master c ON c.id = e.cid
WHERE
  br.id = ?;
`;

  pool.query(q, [emId], (err, data) => {
    if (err) {
      return res.json(err);
    }



    data.forEach((row) => {
      if (
        row.typetaping.includes(
          "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
        )
      ) {
        row.typetaping = "OCTC";
      } else if (
        row.typetaping.includes(
          "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
        )
      ) {
        row.typetaping = "OLTC";
      } else if (row.typetaping.includes("No Tapping")) {
        row.typetaping = "NP";
      } else {
        row.typetaping = "";
      }
    });

    return res.json(data);
  });
});

router.get("/getcosting1/:emId", (req, res) => {
  const emId = req.params.emId;

  const q = `
    SELECT SQL_CALC_FOUND_ROWS c.id, c.eid, e.capacity, IFNULL(e.priratio, '') as priratio, IFNULL(e.secratio, '') as secratio,
    e.type, e.consumertype, e.vectorgroup, e.typecolling, e.typetaping, e.comment
    FROM costing_master c
    INNER JOIN enquiry_master e ON c.eid = e.id
    WHERE e.id = ?;`;

  pool.query(q, [emId], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

router.get("/getcostingforbom2/:id", (req, res) => {
  const id = req.params.id;
  // const q = `
  //   SELECT
  //   c.id AS cid,
  //   e.capacity,
  //   IFNULL(e.priratio, '') AS priratio,
  //   IFNULL(e.secratio, '') AS secratio,
  //   e.type,
  //   e.id,
  //   e.consumertype,
  //   e.vectorgroup,
  //   e.typecolling,
  //   e.typetaping,
  //   e.comment,
  //   e.selectedcosting,
  //   c.costingname
  // FROM
  //   bom_request br
  // INNER JOIN
  //   production_plan_details ppd ON br.plan_id = ppd.prod_plan_id
  // INNER JOIN
  //   order_acceptance oa ON oa.id = ppd.oa_id
  // INNER JOIN
  //   quotation q ON q.qid = oa.qid
  // INNER JOIN
  //   enquiry_master e ON e.id = q.eid
  // INNER JOIN
  //   costing_master2 c ON c.eid = e.id
  // WHERE
  //   br.id = ?;`;
  const q = `
    SELECT
    c.id AS cid,
    e.capacity,
    IFNULL(e.priratio, '') AS priratio,
    IFNULL(e.secratio, '') AS secratio,
    e.type,
    e.id,
    e.consumertype,
    e.vectorgroup,
    e.typecolling,
    e.typetaping,
    e.comment,
    c.costingname AS selectedcosting,
    c.costingname
  FROM
    bom_request br
  INNER JOIN
    production_plan_details ppd ON br.plan_id = ppd.prod_plan_id
  INNER JOIN
    order_acceptance oa ON oa.id = ppd.oa_id
  INNER JOIN
    quotation q ON q.qid = oa.qid
  INNER JOIN
    enquiry_master e ON e.id = q.eid
  INNER JOIN
    costing_master2 c ON c.eid = e.id
  WHERE
    br.id = ?;`;
  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    data.forEach((row) => {
      if (
        row.typetaping.includes(
          "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
        )
      ) {
        row.typetaping = "OCTC";
      } else if (
        row.typetaping.includes(
          "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
        )
      ) {
        row.typetaping = "OLTC";
      } else if (row.typetaping.includes("No Tapping")) {
        row.typetaping = "NP";
      } else {
        row.typetaping = "";
      }
    });

    return res.json(data);
  });
});

router.get("/getcosting2/:id", (req, res) => {
  const id = req.params.id;
  const q = `
    SELECT SQL_CALC_FOUND_ROWS c.id, e.capacity, IFNULL(e.priratio, '') as priratio, IFNULL(e.secratio, '') as secratio,
    e.type, e.consumertype, e.vectorgroup, e.typecolling, e.typetaping,e.comment
    FROM costing_master2 c
    INNER JOIN enquiry_master e ON c.eid = e.id
    WHERE c.id = ?;`;

  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<------------------------------------------------------------------------------------>
//<----------------------------------------delete costing ----------------------------------->
router.delete("/deleteCosting/:id", (req, res) => {
  const id = req.params.id;

  const q = "DELETE FROM costing_details WHERE cid=?;";

  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    const r = "DELETE FROM costing_master WHERE id=?;";

    pool.query(r, [id], (err, data) => {
      if (err) {
        return res.json(err);
      }

      const updateEnqStatusQuery =
        "UPDATE enquiry_master SET enqstatus = 1 WHERE cid = ?;";

      pool.query(updateEnqStatusQuery, [id], (err, updateData) => {
        if (err) {
          return res.json(err);
        }

        return res.json({
          message: "Costing deleted successfully",
          updateData,
        });
      });
    });
  });
});

//<---------------------------------------------------------------------------------->
router.get("/fetchDatacostingname/:eid", (req, res) => {
  const eid = req.params.eid;

  const q = `
    SELECT 
      capacity,
      voltageratio,
      typetaping,
      matofwind,
      consumertype,
      type,
      costingDesign
    FROM 
      enquiry_master 
    WHERE 
      id = ?;
  `;

  pool.query(q, [eid], (err, result) => {
    if (err) {
      return res.json(err);
    }

    if (result.length > 0) {
      const data = {
        capacity: result[0].capacity,
        voltageratio: result[0].voltageratio,
        matofwind: result[0].matofwind === "Aluminium" ? "AL" : "CU",
        type:
          result[0].type === 1 ? "OD" : result[0].type === 2 ? "ID" : "OD/ID",
        consumertype: result[0].consumertype,
        tapp: result[0].typetaping,
        costingDesign: result[0].costingDesign,
      };

      if (
        result[0].typetaping ===
        "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer" ||
        result[0].typetaping ===
        "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
      ) {
        data.typetaping = "OCTC";
      } else if (
        result[0].typetaping ===
        "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer" ||
        result[0].typetaping ===
        "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
      ) {
        data.typetaping = "OLTC";
      } else if (result[0].typetaping === "") {
        data.typetaping = "NT";
      } else {
        data.typetaping = "OLTC";
      }
      return res.json(data);
    } else {
      return res.json({}); // Return empty object if no matching record found
    }
  });
});

//<--------------------------------------edit costing 1---------------------------------------->
router.get("/editCosting1/:id", (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM costing_master WHERE id=? LIMIT 1";

  let data = {};
  pool.query(q, [id], (err, costings) => {
    if (err) {
      return res.json(err);
    }

    if (costings && costings.length > 0) {
      const eid = costings[0].eid;
      const qEnquiry = "SELECT * FROM enquiry_master WHERE id=?";
      pool.query(qEnquiry, [eid], (err, enquiry) => {
        if (err) {
          return res.json(err);
        }
        const selectedcosting =
          enquiry.length > 0 ? enquiry[0].selectedcosting : null;
        const typetapping = enquiry.length > 0 ? enquiry[0].typetaping : "";
        const tapingSwitch = enquiry.length > 0 ? enquiry[0].tapingSwitch : "";
        const q1 = `
          SELECT 
            cd.*,
            mt.item_code,
            mt.material_description,
            mt.unit,
            um.unit 
          FROM
            costing_details cd
          INNER JOIN
            material_master mt ON mt.id = cd.mid
          LEFT JOIN
            unitmaster um ON mt.unit = um.id
          WHERE
            cd.cid = ${costings[0].id}
        `;
        pool.query(q1, (err, rows) => {
          if (err) {
            return res.json(err);
          }

          data = {
            ...costings[0],
            selectedcosting,
            typetapping,
            tapingSwitch,
            materialList: rows.map((material) => {
              const {
                id,
                item_code,
                material_description,
                unit,
                mid,
                quantity,
                rate,
                amount,
                corresponding_unit,
              } = material;
              return {
                id,
                mid,
                code: { id: mid, item_code, material_description, unit },
                unit,
                description: material_description,
                quantity,
                rate,
                amount,
                corresponding_unit,
              };
            }),
          };
          return res.json(data);
        });
      });
    } else {
      return res.json({});
    }
  });
});

//<------------------------------------------------------------------------------->
// router.get("/editCosting1/:id", (req, res) => {
//   const id = req.params.id;
//   const q = `
//     SELECT
//       cm.*,
//       cd.*,
//       mm.item_code,
//       mm.material_description,
//       mm.unit AS corresponding_unit
//     FROM costing_master cm
//     LEFT JOIN costing_details cd ON cm.id = cd.cid
//     LEFT JOIN material_master mm ON cd.mid = mm.id
//     LEFT JOIN unitmaster um ON mm.unit = um.id
//     WHERE cm.id = ?
//   `;

//   pool.query(q, [id], (err, results) => {

//     if (err) {

//       return res.status(500).json({ error: "An error occurred" });
//     }

//     if (results.length > 0) {
//       const data = {
//         id: results[0].id,
//         date: results[0].date,

//         materialList: results.map((row) => ({
//           id: row.id,
//           mid: row.mid,
//           code: {
//             id: row.mid,
//             item_code: row.item_code,
//             material_description: row.material_description,
//             unit: row.unit,
//           },
//           unit: row.unit,
//           description: row.material_description,
//           quantity: row.quantity,
//           rate: row.rate,
//           amount: row.amount,
//           corresponding_unit: row.corresponding_unit,
//         })),
//       };

//       return res.json(data);
//     } else {
//       return res.status(404).json({ error: "Data not found" });
//     }
//   });
// });

//<-------------------------------------------updatre costing1----------------------------->
router.put("/updateCosting1/:id", (req, res) => {
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;
  };

  // Convert costing_date to YYYY-MM-DD format
  const formattedDate = formatDate(req.body.costing_date);
  const q =
    "Update costing_master SET costing_date=?, oltctext=?, uid=?, accessories=?, labourcharges=?, miscexpense=?,costingname=? Where id=?";
  const { materialList = [], deletedItems = [] } = req.body;
  pool.query(
    q,
    [
      formattedDate,
      req.body.oltctext,
      req.body.uid,
      req.body.accessories,
      req.body.labourcharges,
      req.body.miscexpense,
      req.body.costingname,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
      } else {
        materialList.forEach?.((element) => {
          const { id, mid, quantity, rate, amount } = element;
          if (!element?.id) {
            pool.query("insert into costing_details values(?,?,?,?,?,?)", [
              id,
              req.params.id,
              mid,
              quantity,
              rate,
              amount,
            ]);
          } else {
            pool.query(
              "Update costing_details SET mid=?, quantity=?, rate=?, amount=? Where id=?",
              [mid, quantity, rate, amount, id]
            );
          }
        });
        deletedItems.forEach?.((id) => {
          if (id) {
            pool.query("delete from costing_details where id=?", [id]);
          }
        });

        return res.send("Updated");
      }
    }
  );
});
//<----------------------------------------------------------------------------->
//<--------------------------------------------auto customer ------------------------>
router.get("/autoCustomerInfo/:query", (req, res) => {
  const query = req.params.query;

  const q = `SELECT DISTINCT custname, email, contactno, altcontactno, address FROM customer_master WHERE custname LIKE '%${query}%'`;
  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

//<------------------------------------------------------------------------------------>
//<------------------------------auto item code ------------------------------------>
router.get("/autoItemCode/:code", (req, res) => {
  const code = req.params.code;

  const q = `SELECT mm.id, mm.item_code, mm.material_description,rate, u.unit FROM material_master mm INNER JOIN unitmaster u ON u.id=mm.unit WHERE item_code LIKE '%${code}%'`;
  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});
//<------------------------------------------------------------------------------------>
router.get("/autocust/:custname", (req, res) => {
  const custname = req.params.custname;

  const q = `SELECT custname, contactperson, email
             FROM enquiry_master
             WHERE custname LIKE ?`;

  const searchTerm = `%${custname}%`;

  pool.query(q, [searchTerm], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

//<-------------------------------add costing 2---------------------------------------->
router.post("/costing2", (req, res) => {
  const {
    id,
    costing_date,
    oltctext,
    eid, // Assuming `eid` is used to identify the relevant enquiry
    uid,
    accessories,
    labourcharges,
    miscexpense,
    materialList = [],
    costingname,
  } = req.body;

  // First, check the uniqueness of costingname
  pool.query(
    "SELECT COUNT(*) AS count FROM costing_master2 WHERE costingname = ?",
    [costingname],
    (err, result) => {
      if (err) {
        return res.status(500).send("Error checking costingname uniqueness");
      }

      const count = result[0].count;
      if (count > 0) {
        return res.status(400).send("Costing Name is not unique");
      }

      if (!materialList?.length) {
        return res.status(400).send("Sorry, please select materials");
      }

      let materialsProcessed = 0;

      pool.query(
        "INSERT INTO costing_master2 (id, costing_date, oltctext, eid, uid, accessories, labourcharges, miscexpense, costingname) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          id,
          costing_date,
          oltctext,
          eid,
          uid,
          accessories,
          labourcharges,
          miscexpense,
          costingname,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).send("Error inserting into costing_master2");
          }

          const updateEnqstatusAndSendResponse = () => {
            materialsProcessed++;
            if (materialsProcessed === materialList?.length) {
              pool.query(
                "UPDATE enquiry_master SET enqstatus = 4,cid=? WHERE id = ?",
                [result.insertId, eid],
                (err, updateResult) => {
                  if (err) {
                    return res.status(500).send("Error updating enqstatus");
                  }

                  return res.send(updateResult);
                }
              );
            }
          };

          materialList.forEach?.((material) => {
            const cid = result.insertId;
            const { quantity, rate, amount, mid } = material;
            pool.query(
              "INSERT INTO costing_details2 (id, cid, mid, quantity, rate, amount) VALUES (?,?,?,?,?,?)",
              [id, cid, mid, quantity, rate, amount],
              (err, result) => {
                if (err) {
                  return res
                    .status(500)
                    .send("Error inserting into costing_details2");
                }
                updateEnqstatusAndSendResponse();
              }
            );
          });
        }
      );
    }
  );
});

//<--------------------------------------------------------------------------------------->
//<--------------------------getting costing 2------------------------------------------->
router.get("/getcosting2", (req, res) => {
  const q =
    "SELECT SQL_CALC_FOUND_ROWS c.`id`,c.costingname,e.selectedcosting,e.`capacity`,ifnull(e.priratio,'') as priratio,ifnull(e.secratio,'') as secratio,e.`type`,e.`consumertype`,e.`vectorgroup`,e.`typecolling`,e.`typetaping`,e.`comment` FROM `costing_master2` c " +
    "  inner join enquiry_master e on c.eid=e.id ORDER BY c.`id` DESC; ";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    data.forEach((row) => {
      if (
        row.typetaping.includes(
          "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
        )
      ) {
        row.typetaping = "OCTC";
      } else if (
        row.typetaping.includes(
          "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
        )
      ) {
        row.typetaping = "OLTC";
      } else if (row.typetaping.includes("No Tapping")) {
        row.typetaping = "NP";
      } else {
        row.typetaping = "";
      }
    });

    return res.json(data);
  });
});
//<---------------------------------------------------------------------------------------->
router.delete("/deletemp/:id", (req, res) => {
  const id = req.params.id;
  pool.query(
    "DELETE FROM employee_master WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      } else {
        return res.send("Employee deleted successfully");
      }
    }
  );
});

//<---------------------------------delete costing 2------------------------------------>
router.delete("/deleteCosting2/:id", (req, res) => {
  const id = req.params.id;

  const deleteDetailsQuery = "DELETE FROM costing_details2 WHERE cid=?;";
  pool.query(deleteDetailsQuery, [id], (err, detailsData) => {
    if (err) {
      return res.json(err);
    }

    const deleteMasterQuery = "DELETE FROM costing_master2 WHERE id=?;";
    pool.query(deleteMasterQuery, [id], (err, masterData) => {
      if (err) {
        return res.json(err);
      }

      const updateEnqStatusQuery =
        "UPDATE enquiry_master SET enqstatus = 1 WHERE cid = ?;";

      pool.query(updateEnqStatusQuery, [id], (err, updateData) => {
        if (err) {
          return res.json(err);
        }

        return res.json({
          message: "Costing deleted successfully",
          detailsData,
          masterData,
          updateData,
        });
      });
    });
  });
});

//<---------------------------------------------------------------------------------------->
//<----------------------------------edit consting2----------------------------------->
router.get("/editCosting2/:id", (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM costing_master2 WHERE id=? LIMIT 1";

  let data = {};
  pool.query(q, [id], (err, costings) => {
    if (err) {
      return res.json(err);
    }

    if (costings && costings.length > 0) {
      const eid = costings[0].eid;
      const qEnquiry = "SELECT * FROM enquiry_master WHERE id=?";
      pool.query(qEnquiry, [eid], (err, enquiry) => {
        if (err) {
          return res.json(err);
        }

        const selectedcosting =
          enquiry.length > 0 ? enquiry[0].selectedcosting : null;

        const q1 = `
          SELECT 
            cd.*,
            mt.item_code,
            mt.material_description,
            mt.unit,
            um.unit 
          FROM
            costing_details2 cd
          INNER JOIN
            material_master mt ON mt.id = cd.mid
          LEFT JOIN
            unitmaster um ON mt.unit = um.id
          WHERE
            cd.cid = ${costings[0].id}
        `;
        pool.query(q1, (err, rows) => {
          if (err) {
            return res.json(err);
          }

          data = {
            ...costings[0],
            selectedcosting,
            materialList: rows.map((material) => {
              const {
                id,
                item_code,
                material_description,
                unit,
                mid,
                quantity,
                rate,
                amount,
                corresponding_unit,
              } = material;
              return {
                id,
                mid,
                code: { id: mid, item_code, material_description, unit },
                unit,
                description: material_description,
                quantity,
                rate,
                amount,
                corresponding_unit,
              };
            }),
          };

          return res.json(data);
        });
      });
    } else {
      return res.json({});
    }
  });
});

//<------------------------------------------------------------->
//<------------------------update costing 2------------------------------>
router.put("/updateCosting2/:id", (req, res) => {
  const q =
    "Update costing_master2 SET costing_date=?, oltctext=?, uid=?, accessories=?, labourcharges=?, miscexpense=?,costingname=? Where id=?";
  const { materialList = [], deletedItems = [] } = req.body;
  pool.query(
    q,
    [
      req.body.costing_date,
      req.body.oltctext,
      req.body.uid,
      req.body.accessories,
      req.body.labourcharges,
      req.body.miscexpense,
      req.body.costingname,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
      } else {
        materialList.forEach?.((element) => {
          const { id, mid, quantity, rate, amount } = element;
          if (!element?.id) {
            pool.query("insert into costing_details2 values(?,?,?,?,?,?)", [
              id,
              req.params.id,
              mid,
              quantity,
              rate,
              amount,
            ]);
          } else {
            pool.query(
              "Update costing_details2 SET mid=?, quantity=?, rate=?, amount=? Where id=?",
              [mid, quantity, rate, amount, id]
            );
          }
        });
        deletedItems.forEach?.((id) => {
          if (id) {
            pool.query("delete from costing_details2 where id=?", [id]);
          }
        });

        return res.send("Updated");
      }
    }
  );
});
//<---------------------------------------------------------------------------->
//<------------------------------view bomo 1------------------------------------->
router.get("/viewbom1/:id", (req, res) => {
  console.log(req.params.id, "Received costing ID"); // Console log added

  const cid = req.params.id;
  const sql = `
    SELECT
      cm.costing_date AS CostingDate,
      cm.costingname AS CostingName,             -- ✅ Added this line
      cm.oltctext AS oltctext,
      em.capacity AS Capacity,
      em.voltageratio AS VoltageRatio,
      em.typetaping AS TypeTaping,
      em.matofwind AS Matofwind,
      em.consumertype AS ConsumerType,
      em.type AS Type,
      mt.item_code AS ItemCode,
      mt.material_description AS Description,
      um.unit AS Unit,
      cd.quantity AS Quantity
    FROM
      costing_details cd
    INNER JOIN
      material_master mt ON mt.id = cd.mid
    INNER JOIN
      unitmaster um ON um.id = mt.unit
    INNER JOIN
      costing_master cm ON cm.id = cd.cid
    LEFT JOIN
      enquiry_master em ON em.id = cm.eid 
    WHERE
      cd.cid = ?;
  `;

  pool.query(sql, [cid], (err, data) => {
    if (err) {
      console.error("Database error:", err); // Log the error
      return res.status(500).json({ error: "Error fetching data" });
    }

    data.forEach((row) => {
      if (
        row.TypeTaping?.includes(
          "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
        ) ||
        row.TypeTaping?.includes(
          "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
        )
      ) {
        row.TypeTaping = "OCTC";
      } else if (
        row.TypeTaping?.includes(
          "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
        ) ||
        row.TypeTaping?.includes(
          "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
        )
      ) {
        row.TypeTaping = "OLTC";
      } else if (row.TypeTaping?.includes("No Tapping")) {
        row.TypeTaping = "NP";
      } else {
        row.TypeTaping = "OLTC";
      }

      row.Matofwind = row.Matofwind === "aluminium" ? "AL" : "CU";

      if (row.Type === 1) {
        row.Type = "OD";
      } else if (row.Type === 2) {
        row.Type = "ID";
      } else {
        row.Type = "OD/ID";
      }
    });

    console.log("Fetched data:", data); // ✅ Console the result
    return res.json(data);
  });
});

//<---------------------------------------------------------------->
//<------------------------------view bomo 2------------------------------------->
router.get("/viewbom2/:id", (req, res) => {
  const cid = req.params.id;
  const sql = `
  SELECT
  cm.costing_date AS CostingDate, 
  em.capacity AS Capacity,
  em.voltageratio AS voltageratio,
  em.typetaping AS TypeTaping,
  em.matofwind AS Matofwind,
  em.consumertype AS ConsumerType,
  em.type AS Type,
  cm.oltctext AS OLTCtext,
  mt.item_code AS ItemCode,
  mt.material_description AS Description,
  um.unit AS Unit,
  cd2.quantity AS Quantity
FROM
  costing_details2 cd2
INNER JOIN
  material_master mt ON mt.id = cd2.mid
INNER JOIN
  unitmaster um ON um.id = mt.unit
INNER JOIN
  costing_master2 cm ON cm.id = cd2.cid
LEFT JOIN
  enquiry_master em ON em.id = cm.eid 
WHERE
  cd2.cid = ?;

  `;

  pool.query(sql, [cid], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching data" });
    }
    data.forEach((row) => {
      if (
        row.TypeTaping.includes(
          "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
        ) ||
        row.TypeTaping.includes(
          "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
        )
      ) {
        row.TypeTaping = "OCTC";
      } else if (
        row.TypeTaping.includes(
          "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
        ) ||
        row.TypeTaping.includes(
          "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
        )
      ) {
        row.TypeTaping = "OLTC";
      } else if (row.TypeTaping.includes("No Tapping")) {
        row.TypeTaping = "NP";
      } else {
        row.TypeTaping = "OLTC";
      }

      row.Matofwind = row.Matofwind === "aluminium" ? "AL" : "CU";

      if (row.Type === 1) {
        row.Type = "OD";
      } else if (row.Type === 2) {
        row.Type = "ID";
      } else {
        row.Type = "OD/ID";
      }
    });

    return res.json(data);
  });
});
//<---------------------------------------------------------------->
//<---------------------------------get supplier----------------------->
router.get("/getsupplier", (req, res) => {
  const q =
    "SELECT id,name,email,contactno,address,curdate FROM supplier_master order by id desc";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<----------------------------------------------------------------------->
//<---------------------------------add supplier------------------------------->
router.post("/addSuppliers", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;
  const contactno = req.body.contactno;
  const address = req.body.address;
  const curdate = new Date();
  const formattedDate = curdate.toLocaleDateString("en-GB");

  pool.query(
    "insert into supplier_master values(?,?,?,?,?,?)",
    [id, name, email, contactno, address, formattedDate],
    (err, result) => {
      if (err) {
      } else {
        return res.send("POSTED");
      }
    }
  );
});

//<-------------------------------------------------------------------------------->
//<----------------------------------delete supplier-------------------------------->
router.delete("/deleteSuppliers/:id", (req, res) => {
  const id = req.params.id;
  const q = "Delete from supplier_master where id=?";

  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<--------------------------------------------------------------------------->
//<---------------------get supplier for edit-------------------------------->
router.get("/editsuppliers/:id", (req, res) => {
  const q =
    "SELECT id,name,email,contactno,address,curdate FROM supplier_master where id=?";

  const id = req.params.id;

  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});
//<------------------------------------------------------------------------------>
//<---------------------------------editindent----------------------------->
router.get("/editIndent/:id", (req, res) => {
  const q =
    "SELECT i.id,i.indentid,i.itemid,i.qty,m.item_code,m.material_description,m.unit,u.unit FROM indent_details i INNER JOIN material_master m ON m.id=i.itemid inner join unitmaster u on u.id=m.unit WHERE i.indentid=?";

  const id = req.params.id;

  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});
//<------------------------------------------------------------------>
//<--------------------------update supplier--------------------------------->
router.put("/updateSupplier/:id", (req, res) => {
  const q =
    "update supplier_master set name=?,email=?,contactno=?,address=? where id=?";
  pool.query(
    q,
    [
      req.body.name,
      req.body.email,
      req.body.contactno,
      req.body.address,

      req.params.id,
    ],
    (err, result, feilds) => {
      if (err) {
      } else {
        return res.send("Updated");
      }
    }
  );
});
//<--------------------------------------------------------------------->
//<--------------------------get indent ----------------------------------->
// router.get("/getindent", (req, res) => {
//   const q = "SELECT id, bomid, date,indentref FROM indent ";

//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }

//     return res.json(data);
//   });
// });

router.get("/getindent", (req, res) => {
  // const q = `
  //   SELECT 
  //     i.id, 
  //     i.bomid, 
  //     i.date, 
  //     i.indentref,
  //     e.cid,
  //     e.selectedcosting
  //   FROM indent i
  //   LEFT JOIN bom_request br ON br.id = i.bomid
  //   LEFT JOIN production_plan_details ppd ON ppd.prod_plan_id = br.plan_id
  //   LEFT JOIN order_acceptance oa ON oa.id = ppd.oa_id
  //   LEFT JOIN quotation q ON q.qid = oa.qid
  //   LEFT JOIN enquiry_master e ON e.id = q.eid
  // `;
  const q = `
    SELECT 
      i.id, 
      i.bomid, 
      i.date, 
      i.indentref,
      e.cid,
      cm.costingname AS selectedcosting
    FROM indent i
    LEFT JOIN bom_request br ON br.id = i.bomid
    LEFT JOIN production_plan_details ppd ON ppd.prod_plan_id = br.plan_id
    LEFT JOIN order_acceptance oa ON oa.id = ppd.oa_id
    LEFT JOIN quotation q ON q.qid = oa.qid
    LEFT JOIN enquiry_master e ON e.id = q.eid
    LEFT JOIN costing_master cm ON cm.id = e.cid
  `;
  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<----------------------------------------------------------------------->
//<--------------------------get stock------------------------------------>
router.get("/getaddstock/:id", (req, res) => {
  const indentId = req.params.id;

  const q = `
    SELECT
      i.id AS indent_id,
      i.bomid,
      mm.item_code,
      mm.material_description,
      um.unit AS unit,
      idet.qty
    FROM
      indent i
    INNER JOIN
      indent_details idet ON i.id = idet.indentid
    INNER JOIN
      material_master mm ON idet.itemid = mm.id
    LEFT JOIN
      unitmaster um ON mm.unit = um.id
    WHERE
      i.id = ?
  `;
  pool.query(q, [indentId], (err, data) => {
    if (err) {
      return res.json({ error: "An error occurred while fetching data." });
    }

    return res.json(data);
  });
});
//<------------------------------------------------------------------->

//<-------------------------------update indent-------------------------->
router.put("/updateindent/:id", (req, res) => {
  const itemCodesToUpdate = req.body.data
    .map((item) => `'${item.item_code}'`)
    .join(", ");

  if (!itemCodesToUpdate) {
    return res.status(400).send("No items to update");
  }

  const updateQuery = `
    -- Update the quantities for matching items
    UPDATE indent_details AS idet
    INNER JOIN indent AS i ON i.id = idet.indentid
    INNER JOIN material_master AS mm ON idet.itemid = mm.id
    LEFT JOIN unitmaster AS um ON mm.unit = um.id
    SET idet.qty = CASE
      ${req.body.data
      .map(
        (item) => `WHEN mm.item_code = '${item.item_code}' THEN ${item.qty}`
      )
      .join(" ")}
      ELSE idet.qty
    END
    WHERE i.id = ? AND mm.item_code IN (${itemCodesToUpdate});
  `;

  const deleteQuery = `
    -- Delete items in indent_details that are not in the request data
    DELETE FROM indent_details
    WHERE indentid = ? AND itemid NOT IN (
      SELECT id FROM material_master WHERE item_code IN (${itemCodesToUpdate})
    );
  `;

  const supplierId = req.params.id;
  const updatedQtyValues = req.body.data.map((item) => item.qty);

  pool.query(updateQuery, [supplierId], (err, result, fields) => {
    if (err) {
      return res.status(500).send("Error updating indent data");
    }

    pool.query(
      deleteQuery,
      [supplierId],
      (deleteErr, deleteResult, deleteFields) => {
        if (deleteErr) {
          return res.status(500).send("Error deleting indent data");
        }

        return res.send("Updated");
      }
    );
  });
});

//<--------------------------------------------------------------->
//<---------------------------get po order------------------------------->
// router.get("/getPorder", (req, res) => {
//   const q =
//     "SELECT id, poref, podate, indentid, (SELECT name FROM supplier_master WHERE id = supplierid) AS suppname FROM po_master ";

//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.json({ error: "An error occurred while fetching data." });
//     }

//     return res.json(data);
//   });
// });

router.get("/getPorder", (req, res) => {
  // const q = `
  //   SELECT 
  //     po.id, 
  //     po.poref, 
  //     po.podate, 
  //     po.indentid, 
  //     (SELECT name FROM supplier_master WHERE id = po.supplierid) AS suppname,
  //     e.cid,
  //     e.selectedcosting
  //   FROM po_master po
  //   LEFT JOIN indent i ON i.id = po.indentid
  //   LEFT JOIN bom_request br ON br.id = i.bomid
  //   LEFT JOIN production_plan_details ppd ON ppd.prod_plan_id = br.plan_id
  //   LEFT JOIN order_acceptance oa ON oa.id = ppd.oa_id
  //   LEFT JOIN quotation q ON q.qid = oa.qid
  //   LEFT JOIN enquiry_master e ON e.id = q.eid
  // `;

  const q = `
  SELECT 
    po.id, 
    po.poref, 
    po.podate, 
    po.indentid, 
    (SELECT name FROM supplier_master WHERE id = po.supplierid) AS suppname,
    e.cid,
    cm.costingname AS selectedcosting
  FROM po_master po
  LEFT JOIN indent i ON i.id = po.indentid
  LEFT JOIN bom_request br ON br.id = i.bomid
  LEFT JOIN production_plan_details ppd ON ppd.prod_plan_id = br.plan_id
  LEFT JOIN order_acceptance oa ON oa.id = ppd.oa_id
  LEFT JOIN quotation q ON q.qid = oa.qid
  LEFT JOIN enquiry_master e ON e.id = q.eid
  LEFT JOIN costing_master cm ON cm.id = e.cid
`;
  pool.query(q, (err, data) => {
    if (err) {
      return res.json({ error: "An error occurred while fetching data." });
    }

    return res.json(data);
  });
});

//<-=------------------------------------------------------------->
//<--------------------------------delete po --------------------------->
router.delete("/deletePo/:id", (req, res) => {
  const id = req.params.id;
  const q = "Delete from po_master where id=?  ";

  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
  const r = "Delete from po_details where poid=?";
  pool.query(r, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<-------------------------------------------------------------->
//<---------------------------get indent for po------------------------->
router.get("/getindentForPO", (req, res) => {
  const q = `
    SELECT i.id, i.bomid, i.date, i.indentref, IFNULL(SUM(d.qty), 0) as qty
    FROM indent i
    LEFT JOIN indent_details d ON i.id = d.indentid
    GROUP BY i.id
    HAVING qty > 0
  `;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<--------------------------------------------------------->
//<-------------------------------Add po----------------------------------->
// router.post("/addPOmaster", (req, res) => {
//   console.log("Received request to add PO master");
//   const {
//     id,
//     podate,
//     custname,
//     uid,
//     inwardflag,
//     supplierid,
//     indents,
//   } = req.body;

//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();

//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;

//     return [day, month, year].join("-");
//   };

//   const formattedPodate = formatDate(podate);

//   if (!indents?.length) {
//     return res.status(400).send("Sorry, please select material");
//   }

//   const q3 = "SELECT poref FROM po_master ORDER BY id DESC LIMIT 1";

//   pool.query(q3, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }

//     const q = "SELECT quot_serial FROM usermaster WHERE id=?";
//     pool.query(q, [uid], (err, user) => {
//       if (err) {
//         console.error(err);
//         return res.json(err);
//       }

//       const fetchMaxIdQuery = "SELECT MAX(id) AS maxId FROM po_master";
//       pool.query(fetchMaxIdQuery, (err, maxIdData) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: "Internal server error", err: err });
//         }

//         // Calculate the next number based on the maximum ID
//         let number = 0;
//         if (maxIdData && maxIdData.length > 0 && maxIdData[0].maxId !== null) {
//           number = maxIdData[0].maxId + 1;
//         } else {
//           // If there is no entry, start with 1
//           number = 0;
//         }

//         pool.query(
//           "INSERT INTO po_master VALUES (?,?,?,?,?,?,?,?)",
//           [
//             id,
//             getPONumber(number + 1, user),
//             formattedPodate,
//             custname,
//             null,
//             uid,
//             inwardflag,
//             supplierid,
//           ],
//           async (err, result) => {
//             if (err) {
//               console.error(err);
//               return res.status(500).json({ error: "Internal server error", err: err });
//             }

//             if (indents && indents.length) {
//               // Construct the poDetailsData array
//               const poDetailsData = indents.map(({ itemid, qty, rate }) => [
//                 undefined,
//                 result.insertId,
//                 itemid,
//                 parseInt(qty), // Convert 'qty' to an integer
//                 new Date().toLocaleDateString("en-GB"),
//                 rate,
//                 null,
//               ]);

//               // Insert data into po_details table
//               const insertQuery = "INSERT INTO po_details VALUES ?";
//               pool.query(insertQuery, [poDetailsData], (err) => {
//                 if (err) {
//                   console.error(err);
//                   return res
//                     .status(500)
//                     .json({ error: "Internal server error", err: err });
//                 }

//                 return res.send("POSTED");
//               });
//             } else {
//               return res.send("POSTED");
//             }
//           }
//         );
//       });
//     });
//   });
// });

router.post("/addPOmaster", (req, res) => {
  console.log("Received request to add PO master");

  const {
    id,
    podate,
    custname,
    uid,
    inwardflag,
    supplierid,
    indents, // should be an array of items
  } = req.body;

  const formatDate = (date) => {
    const d = new Date(date);
    let day = "" + d.getDate();
    let month = "" + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;

    return [day, month, year].join("-");
  };

  const formattedPodate = formatDate(podate);

  if (!indents?.length) {
    return res.status(400).send("Sorry, please select material");
  }

  const q3 = "SELECT poref FROM po_master ORDER BY id DESC LIMIT 1";

  pool.query(q3, (err, data) => {
    if (err) return res.json(err);

    const q = "SELECT quot_serial FROM usermaster WHERE id=?";
    pool.query(q, [uid], (err, user) => {
      if (err) return res.json(err);

      const fetchMaxIdQuery = "SELECT MAX(id) AS maxId FROM po_master";
      pool.query(fetchMaxIdQuery, (err, maxIdData) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }

        let number = 0;
        if (maxIdData && maxIdData.length > 0 && maxIdData[0].maxId !== null) {
          number = maxIdData[0].maxId + 1;
        } else {
          number = 0;
        }

        pool.query(
          // Insert PO master data
          "INSERT INTO po_master VALUES (?,?,?,?,?,?,?,?)",
          [
            id,
            getPONumber(number, user),
            formattedPodate,
            custname,
            null,
            uid,
            inwardflag,
            supplierid,
          ],
          (err, result) => {
            if (err) {
              console.error("Error inserting into po_master:", err);
              return res.status(500).json({ error: "Internal server error" });
            }

            if (indents && indents.length) {
              // Build po_details rows (8 columns)
              const poDetailsData = indents.map(
                ({ itemid, qty, rate, indentid }) => [
                  null,                        // id (auto increment)
                  result.insertId,             // poid
                  itemid,                      // itemid
                  parseInt(qty),               // qty
                  formattedPodate,             // date
                  rate,                        // rates
                  indentid || null,            // indentid (from request or NULL)
                  0                            // isTransfer (default 0)
                ]
              );

              // Insert into po_details with column names
              const insertQuery = `
                INSERT INTO po_details
                (id, poid, itemid, qty, date, rates, indentid, isTransfer)
                VALUES ?
              `;

              pool.query(insertQuery, [poDetailsData], (err) => {
                if (err) {
                  console.error("Error inserting into po_details:", err);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }

                return res.send("POSTED");
              });
            } else {
              return res.send("POSTED");
            }
          }
        );
      });
    });
  });
});

router.post("/addPO", (req, res) => {
  const {
    id,
    podate,
    custname,
    uid,
    inwardflag,
    supplierid,
    indents,
  } = req.body;

  const formatDate = (date) => {
    const d = new Date(date);
    let day = "" + d.getDate();
    let month = "" + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;

    return [day, month, year].join("-");
  };

  const formattedPodate = formatDate(podate);

  if (!indents?.length) {
    return res.status(400).send("Sorry, please select material");
  }

  // 🔹 Step 1: Collect all indentrefs across all items (for po_master)
  const allIndentRefs = Array.from(
    new Set(indents.flatMap((item) => item.indentrefs || []))
  );

  if (!allIndentRefs.length) {
    return res.status(400).json({ error: "No indent references found" });
  }

  const placeholders = allIndentRefs.map(() => "?").join(",");
  const fetchIndentIdsQuery = `SELECT id, indentref FROM indent WHERE indentref IN (${placeholders})`;

  pool.query(fetchIndentIdsQuery, allIndentRefs, (err, indentRows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch indent IDs", object: err });
    }

    // Create a lookup for quick per-item mapping
    const indentIdMap = {};
    indentRows.forEach((row) => {
      indentIdMap[row.indentref] = row.id;
    });

    // 🔸 For po_master: combine all indent IDs
    const indentIdsString = indentRows.map((row) => row.id).join(",");

    // 🔹 Step 2: Get user details
    const q = "SELECT quot_serial FROM usermaster WHERE id=?";
    pool.query(q, [uid], (err, user) => {
      if (err) return res.json(err);

      // 🔹 Step 3: Get next PO ID
      const fetchMaxIdQuery = "SELECT MAX(id) AS maxId FROM po_master";
      pool.query(fetchMaxIdQuery, (err, maxIdData) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Internal server error", object: err });
        }

        let number = 0;
        if (maxIdData && maxIdData.length > 0 && maxIdData[0].maxId !== null) {
          number = maxIdData[0].maxId + 1;
        } else {
          number = 0;
        }

        // 🔹 Step 4: Insert into po_master
        const insertPOMasterQuery =
          "INSERT INTO po_master VALUES (?,?,?,?,?,?,?,?)";

        pool.query(
          insertPOMasterQuery,
          [
            id,
            getPONumber(number, user),
            formattedPodate,
            custname,
            indentIdsString, // ✅ multiple indent IDs
            uid,
            inwardflag,
            supplierid,
          ],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                error: "Internal server error",
                object: err,
              });
            }

            const poId = result.insertId;

            // 🔹 Step 5: Build po_details rows with per-item indent mapping
            const poDetailsData = indents.map((item) => {
              // Map indentrefs of this item to IDs
              const indentIdsForItem = (item.indentrefs || [])
                .map((ref) => indentIdMap[ref])
                .filter(Boolean)
                .join(",");

              return [
                undefined,
                poId,
                item.itemid,
                parseInt(item.qty),
                new Date().toLocaleDateString("en-GB"),
                item.rate,
                indentIdsForItem || null, // ✅ multiple indent IDs for each row
                0,
              ];
            });

            // 🔹 Step 6: Insert into po_details
            const insertPODetailsQuery = "INSERT INTO po_details VALUES ?";
            pool.query(insertPODetailsQuery, [poDetailsData], (err) => {
              if (err) {
                return res.status(500).json({
                  error: "Internal server error",
                  object: err,
                });
              }

              // 🔹 Step 7: Update indent_details quantities
              poDetailsData.forEach((poItem, index) => {
                const [_, __, itemid, insertedQty] = poItem;
                const item = indents[index];

                // For each indentref for this item → update qty individually
                (item.indentrefs || []).forEach((ref) => {
                  const indentid = indentIdMap[ref];
                  if (!indentid) return;

                  const fetchIndentQtyQuery = `
                    SELECT qty FROM indent_details WHERE indentid = ? AND itemid = ?
                  `;

                  pool.query(
                    fetchIndentQtyQuery,
                    [indentid, itemid],
                    (err, indentDetails) => {
                      if (err) {
                        console.error(err);
                        return;
                      }

                      if (indentDetails && indentDetails.length) {
                        const currentQty = parseInt(indentDetails[0].qty);
                        const updatedQty = Math.max(
                          currentQty - parseInt(insertedQty),
                          0
                        );

                        const updateIndentDetailsQuery = `
                          UPDATE indent_details
                          SET qty = ?
                          WHERE indentid = ? AND itemid = ?
                        `;

                        pool.query(
                          updateIndentDetailsQuery,
                          [updatedQty, indentid, itemid],
                          (err) => {
                            if (err) {
                              console.error("Failed to update indent qty", err);
                            }
                          }
                        );
                      }
                    }
                  );
                });
              });

              // 🔹 Step 8: Final check if all indents are closed
              const checkIndentQtyQuery = `
                SELECT itemid, qty FROM indent_details WHERE indentid IN (${indentIdsString})
              `;

              pool.query(checkIndentQtyQuery, (err, indentDetails) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }

                const remainingItems = indentDetails.filter(
                  (item) => item.qty > 0
                );

                if (remainingItems.length === 0) {
                  return res.json({ message: "POSTED", remainingItems });
                } else {
                  return res.send("POSTED");
                }
              });
            });
          }
        );
      });
    });
  });
});


// router.post("/addPO", (req, res) => {
//   const {
//     id,
//     podate,
//     custname,
//     uid,
//     inwardflag,
//     supplierid,
//     indents,
//   } = req.body;

//   // Format date as dd-mm-yyyy
//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();
//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;
//     return [day, month, year].join("-");
//   };

//   const formattedPodate = formatDate(podate);

//   if (!indents?.length) {
//     return res.status(400).send("Sorry, please select material");
//   }

//   // ✅ STEP 1: Extract indentrefs from payload
//   const indentRefsArray = indents[0]?.indentrefs || [];

//   if (!indentRefsArray.length) {
//     return res.status(400).json({ error: "No indent references found" });
//   }

//   // Fetch the last PO ref for generating new number
//   const q3 = "SELECT poref FROM po_master ORDER BY id DESC LIMIT 1";
//   pool.query(q3, (err) => {
//     if (err) return res.json(err);

//     // Get user info for PO number
//     const q = "SELECT quot_serial FROM usermaster WHERE id=?";
//     pool.query(q, [uid], (err, user) => {
//       if (err) return res.json(err);

//       // Fetch max ID to generate next PO number
//       const fetchMaxIdQuery = "SELECT MAX(id) AS maxId FROM po_master";
//       pool.query(fetchMaxIdQuery, (err, maxIdData) => {
//         if (err) {
//           return res.status(500).json({ error: "Internal server error", object: err });
//         }

//         let number = 0;
//         if (maxIdData && maxIdData.length > 0 && maxIdData[0].maxId !== null) {
//           number = maxIdData[0].maxId + 1;
//         } else {
//           number = 1;
//         }

//         // ✅ STEP 2: Fetch indent IDs for the given indentrefs
//         const placeholders = indentRefsArray.map(() => "?").join(",");
//         const fetchIndentIdsQuery = `
//           SELECT id FROM indent WHERE indentref IN (${placeholders})
//         `;

//         pool.query(fetchIndentIdsQuery, indentRefsArray, (err, indentRows) => {
//           if (err) {
//             return res
//               .status(500)
//               .json({ error: "Failed to fetch indent IDs", object: err });
//           }

//           if (!indentRows.length) {
//             return res.status(400).json({ error: "No indent IDs found for given indentrefs" });
//           }

//           // Convert IDs to comma separated string to store in po_master
//           const indentIdsString = indentRows.map(row => row.id).join(",");

//           // ✅ STEP 3: Insert into po_master
//           pool.query(
//             "INSERT INTO po_master VALUES (?,?,?,?,?,?,?,?)",
//             [
//               id,
//               getPONumber(number, user),
//               formattedPodate,
//               custname,
//               indentIdsString,
//               uid,
//               inwardflag,
//               supplierid,
//             ],
//             (err, result) => {
//               if (err) {
//                 return res.status(500).json({ error: "Internal server error", object: err });
//               }

//               // ✅ STEP 4: Insert PO details
//               if (indents && indents.length) {
//                 const poDetailsData = indents.map(
//                   ({ itemid, qty, indentid, rate }) => [
//                     undefined,
//                     result.insertId,
//                     itemid,
//                     parseInt(qty),
//                     new Date().toLocaleDateString("en-GB"),
//                     rate,
//                     indentid || null,
//                     0,
//                   ]
//                 );

//                 const insertQuery = "INSERT INTO po_details VALUES ?";
//                 pool.query(insertQuery, [poDetailsData], (err) => {
//                   if (err) {
//                     return res
//                       .status(500)
//                       .json({ error: "Internal server error", object: err });
//                   }

//                   // ✅ STEP 5: Update indent_details qty for each item
//                   poDetailsData.forEach((poItem, index) => {
//                     const [_, __, itemid, insertedQty] = poItem;
//                     let insertitem = indents[index];

//                     const fetchIndentQtyQuery = `
//                       SELECT qty FROM indent_details WHERE indentid = ? AND itemid = ?
//                     `;

//                     pool.query(
//                       fetchIndentQtyQuery,
//                       [insertitem.indentid, itemid],
//                       (err, indentDetails) => {
//                         if (err) return;

//                         if (indentDetails && indentDetails.length) {
//                           const currentQty = parseInt(indentDetails[0].qty);
//                           const updatedQty = Math.max(currentQty - parseInt(insertedQty), 0);

//                           const updateIndentDetailsQuery = `
//                             UPDATE indent_details
//                             SET qty = ?
//                             WHERE indentid = ? AND itemid = ?
//                           `;

//                           pool.query(
//                             updateIndentDetailsQuery,
//                             [updatedQty, insertitem.indentid, itemid],
//                             () => {}
//                           );
//                         }
//                       }
//                     );
//                   });

//                   // ✅ STEP 6: Check if any indent still has qty left
//                   const fetchRemainingQuery = `
//                     SELECT itemid, qty FROM indent_details WHERE indentid IN (${indentRows.map(row => row.id).join(",")})
//                   `;

//                   pool.query(fetchRemainingQuery, (err, indentDetails) => {
//                     if (err) {
//                       return res
//                         .status(500)
//                         .json({ error: "Internal server error" });
//                     }

//                     const remainingItems = indentDetails.filter(
//                       (item) => item.qty > 0
//                     );

//                     if (remainingItems.length === 0) {
//                       return res.json({ message: "POSTED", remainingItems });
//                     } else {
//                       return res.send("POSTED");
//                     }
//                   });
//                 });
//               } else {
//                 return res.send("POSTED");
//               }
//             }
//           );
//         });
//       });
//     });
//   });
// });

// router.post("/addPO", (req, res) => {
//   const {
//     id,
//     podate,
//     custname,
//     indentid,
//     uid,
//     inwardflag,
//     supplierid,
//     indents,
//   } = req.body;

//   const formatDate = (date) => {
//     const d = new Date(date);
//     let day = "" + d.getDate();
//     let month = "" + (d.getMonth() + 1);
//     const year = d.getFullYear();

//     if (day.length < 2) day = "0" + day;
//     if (month.length < 2) month = "0" + month;

//     return [day, month, year].join("-");
//   };

//   const formattedPodate = formatDate(podate);

//   if (!indents?.length) {
//     return res.status(400).send("Sorry, please select material");
//   }

//   const q3 = "SELECT poref FROM po_master ORDER BY id DESC LIMIT 1";

//   pool.query(q3, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }

//     const q = "SELECT quot_serial FROM usermaster WHERE id=?";
//     pool.query(q, [uid], (err, user) => {
//       if (err) {
//         return res.json(err);
//       }

//       const fetchMaxIdQuery = "SELECT MAX(id) AS maxId FROM po_master";
//       pool.query(fetchMaxIdQuery, (err, maxIdData) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ error: "Internal server error", object: err });
//         }

//         // Calculate the next number based on the maximum ID
//         let number = 0;
//         if (maxIdData && maxIdData.length > 0 && maxIdData[0].maxId !== null) {
//           number = maxIdData[0].maxId + 1;
//         } else {
//           // If there is no entry, start with 1
//           number = 0;
//         }

//         pool.query(
//           "INSERT INTO po_master VALUES (?,?,?,?,?,?,?,?)",
//           [
//             id,
//             getPONumber(number + 1, user),
//             formattedPodate,
//             custname,
//             indentid,
//             uid,
//             inwardflag,
//             supplierid,
//           ],
//           async (err, result) => {
//             if (err) {
//               return res
//                 .status(500)
//                 .json({ error: "Internal server error", object: err });
//             }

//             if (indents && indents.length) {
//               // Construct the poDetailsData array
//               const poDetailsData = indents.map(
//                 ({ itemid, qty, indentid, rate }) => [
//                   undefined,
//                   result.insertId,
//                   itemid,
//                   parseInt(qty), // Convert 'qty' to an integer
//                   new Date().toLocaleDateString("en-GB"),
//                   rate,
//                   indentid || null,
//                   0,
//                 ]
//               );

//               // Insert data into po_details table
//               const insertQuery = "INSERT INTO po_details VALUES ?";
//               pool.query(insertQuery, [poDetailsData], (err) => {
//                 if (err) {
//                   return res
//                     .status(500)
//                     .json({ error: "Internal server error", object: err });
//                 }

//                 poDetailsData.forEach((poItem, index) => {
//                   const [_, __, itemid, insertedQty] = poItem;
//                   let insertitem = req.body.indents[index];

//                   const fetchIndentQtyQuery = `
//                     SELECT qty FROM indent_details WHERE indentid = ? AND itemid = ?
//                   `;

//                   pool.query(
//                     fetchIndentQtyQuery,
//                     [insertitem.indentid, itemid],
//                     (err, indentDetails) => {
//                       if (err) {
//                         return res.status(500).json({
//                           error: "Internal server error",
//                           object: err,
//                         });
//                       }

//                       if (indentDetails && indentDetails.length) {
//                         const currentQty = parseInt(indentDetails[0].qty);
//                         const updatedQty = Math.max(
//                           currentQty - parseInt(insertedQty),
//                           0
//                         );

//                         // Update the qty in indent_details table
//                         const updateIndentDetailsQuery = `
//                         UPDATE indent_details
//                         SET qty = ?
//                         WHERE indentid = ? AND itemid = ?
//                       `;

//                         pool.query(
//                           updateIndentDetailsQuery,
//                           [updatedQty, insertitem.indentid, itemid],
//                           (err) => {
//                             if (err) {
//                             } else {
//                             }
//                           }
//                         );
//                       } else {
//                       }
//                     }
//                   );
//                 });

//                 const fetchIndentQtyQuery = `
//                   SELECT itemid, qty FROM indent_details WHERE indentid = ?
//                 `;

//                 pool.query(
//                   fetchIndentQtyQuery,
//                   [indentid],
//                   (err, indentDetails) => {
//                     if (err) {
//                       return res
//                         .status(500)
//                         .json({ error: "Internal server error" });
//                     }

//                     const remainingItems = indentDetails.filter(
//                       (item) => item.qty > 0
//                     );

//                     if (remainingItems.length === 0) {
//                       return res.json({ message: "POSTED", remainingItems });
//                     } else {
//                       return res.send("POSTED");
//                     }
//                   }
//                 );
//               });
//             } else {
//               return res.send("POSTED");
//             }
//           }
//         );
//       });
//     });
//   });
// });

router.post("/editPO/:id", (req, res) => {
  const poid = req.params.id;
  const {
    id,
    podate,
    custname,
    indentid,
    uid,
    inwardflag,
    supplierid,
    indents,
  } = req.body;

  const formatDate = (date) => {
    const d = new Date(date);
    let day = "" + d.getDate();
    let month = "" + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;

    return [day, month, year].join("-");
  };

  const formattedPodate = formatDate(podate);

  if (!indents?.length) {
    return res.status(400).send("Sorry, please select material");
  }

  const q3 = "SELECT poref FROM po_master ORDER BY id DESC LIMIT 1";

  pool.query(q3, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    const updateQuery = `
      UPDATE po_master 
      SET 
        podate = ?,
        custname = ?,
        indentid = ?,
        supplierid = ?
      WHERE id = ?
    `;

    pool.query(
      updateQuery,
      [formattedPodate, custname, indentid || null, supplierid, poid],
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        // Delete existing records from po_details
        const deleteDetailsQuery = `
          DELETE FROM po_details WHERE poid = ?
        `;

        pool.query(deleteDetailsQuery, [poid], (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Insert new records into po_details
          if (indents && indents.length) {
            for (const { itemid, qty, indentid, rate } of indents) {
              const insertDetailsQuery = `
                INSERT INTO po_details (poid, itemid, qty, rates, indentid)
                VALUES (?, ?, ?, ?, ?)
              `;

              pool.query(
                insertDetailsQuery,
                [poid, itemid, parseInt(qty), rate, indentid || null],
                (err) => {
                  if (err) {
                    console.log(err);
                    return res
                      .status(500)
                      .json({ error: "Internal server error" });
                  }
                }
              );
            }
          }

          if (indentid) {
            indents.forEach(({ qty, itemid }) => {
              const fetchIndentQtyQuery = `
                SELECT qty FROM indent_details WHERE indentid = ? AND itemid = ?
              `;

              pool.query(
                fetchIndentQtyQuery,
                [indentid, itemid],
                (err, indentDetails) => {
                  if (err) {
                    console.log(err);
                    return res
                      .status(500)
                      .json({ error: "Internal server error" });
                  }

                  if (indentDetails && indentDetails.length) {
                    const currentQty = parseInt(indentDetails[0].qty);
                    const updatedQty = Math.max(currentQty - parseInt(qty), 0);

                    const updateIndentDetailsQuery = `
                    UPDATE indent_details
                    SET qty = ?
                    WHERE indentid = ? AND itemid = ?
                  `;

                    pool.query(
                      updateIndentDetailsQuery,
                      [updatedQty, indentid, itemid],
                      (err) => {
                        if (err) {
                          console.log(err);
                          return res
                            .status(500)
                            .json({ error: "Internal server error" });
                        }
                      }
                    );
                  }
                }
              );
            });

            const fetchRemainingItemsQuery = `
              SELECT itemid, qty FROM indent_details WHERE indentid = ?
            `;

            pool.query(
              fetchRemainingItemsQuery,
              [indentid],
              (err, indentDetails) => {
                if (err) {
                  console.log(err);
                  return res
                    .status(500)
                    .json({ error: "Internal server error" });
                }

                const remainingItems = indentDetails.filter(
                  (item) => item.qty > 0
                );

                if (remainingItems.length === 0) {
                  return res.json({ message: "POSTED", remainingItems });
                } else {
                  return res.send("POSTED");
                }
              }
            );
          } else {
            return res.send("POSTED");
          }
        });
      }
    );
  });
});

//<------------------------------------------------------------------->
//<------------------------------------get indent material---------------------->
// router.post("/getindentMaterial", (req, res) => {
//   const q = `SELECT id.id,id.indentid,id.itemid, i.indentref, i.uid,id.qty  ,mm.item_code ,mm.material_description,mm.rate, u.unit 
//   FROM indent_details id  
//   INNER JOIN indent i ON i.id =id.indentid  
//   INNER JOIN material_master mm ON mm.id =id.itemid 
//   INNER JOIN unitmaster u ON u.id =mm.unit  
//   WHERE i.id IN (${req.body}) AND id.qty > 0 
//   ORDER BY id.id`;

//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }

//     const list = data.map((item) => {
//       const { itemid, item_code, material_description, unit } = item;
//       return {
//         ...item,
//         item_code,
//         description: material_description,
//         code: {
//           id: itemid,
//           item_code,
//           material_description,
//           unit,
//         },
//       };
//     });
//     return res.json(list);
//   });
// });

router.post("/getindentMaterial", (req, res) => {
  const ids = Array.isArray(req.body) ? req.body.join(",") : req.body;

  const q = `
    SELECT 
      id.id,
      id.indentid,
      id.itemid,
      i.indentref,
      i.uid,
      id.qty,
      mm.item_code,
      mm.material_description,
      mm.rate,
      u.unit 
    FROM indent_details id  
    INNER JOIN indent i ON i.id = id.indentid  
    INNER JOIN material_master mm ON mm.id = id.itemid 
    INNER JOIN unitmaster u ON u.id = mm.unit  
    WHERE i.id IN (${ids}) AND id.qty > 0 
    ORDER BY id.id
  `;

  pool.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    const itemMap = new Map();


    data.forEach((row) => {
      const {
        itemid,
        item_code,
        material_description,
        unit,
        qty,
        indentref,
        rate,
      } = row;

      if (!itemMap.has(itemid)) {
        itemMap.set(itemid, {
          ...row,
          item_code,
          description: material_description,
          code: {
            id: itemid,
            item_code,
            material_description,
            unit,
          },
          total_qty: qty,
          total_rate: rate || 0,  // ✅ start accumulating rate
          indentrefs: [indentref],
        });
      } else {
        const existing = itemMap.get(itemid);
        existing.total_qty += qty;
        existing.total_rate += rate || 0;  // ✅ add rate too

        if (!existing.indentrefs.includes(indentref)) {
          existing.indentrefs.push(indentref);
        }
      }
    });

    const finalList = Array.from(itemMap.values()).map((item) => ({
      ...item,
      qty: item.total_qty,
      total_rate: item.total_rate,  // ✅ return summed rate
      indentref: item.indentrefs.join(", "),
    }));

    return res.json(finalList);
  });
});


//<----------------------------------------------------------->
//<-----------------------------view purchase order--------------------->
router.get("/viewpurchase/:id", (req, res) => {
  const poMasterId = req.params.id;

  const q = `
    SELECT
      pm.custname,
      pm.poref,
      pm.poref,
      pd.itemid,
      pd.qty,
      
      pm.podate As date,
      pd.rates,
      mm.item_code,
      mm.material_description,
      um.unit
    FROM
      po_master pm
    JOIN
      po_details pd ON pm.id = pd.poid
    JOIN
      material_master mm ON pd.itemid = mm.id
    JOIN
      unitmaster um ON mm.unit = um.id
    WHERE
      pm.id = ?
  `;

  pool.query(q, [poMasterId], (err, data) => {
    if (err) {
      return res.json({ error: "An error occurred while fetching data." });
    }

    return res.json(data);
  });
});
//<------------------------------------------------------------->
router.get("/viewgrn/:id", (req, res) => {
  const poMasterId = req.params.id;

  const q = `
  SELECT 
      DISTINCT pd.itemid,
      pm.custname,
      pm.poref,
      md.qty,
      pd.date,
      pd.rates,
      mm.item_code,
      mm.material_description,
      um.unit

    FROM
      po_master pm
    JOIN
      po_details pd ON pm.id = pd.poid
    JOIN
      material_master mm ON pd.itemid = mm.id
    JOIN
      unitmaster um ON mm.unit = um.id
    JOIN 
    material_inward mi ON mi.poid =pm.id
    JOIN 
    materialin_details md ON md.miid =mi.id AND md.itemid = mm.id

    WHERE
      pm.id = ?
  `;

  pool.query(q, [poMasterId], (err, data) => {
    if (err) {
      return res.json({ error: "An error occurred while fetching data." });
    }

    return res.json(data);
  });
});
router.get("/viewqualitycontrol/:poid", (req, res) => {
  const poid = req.params.poid;
  const miid = req.query.miid;

  const q = `
  SELECT
  qc.id AS qcId,
  qc.miid,
  qc.date AS qcDate,
  qc.supplierid,
  sm.name,  -- Add supplier_name from supplier_master
  qc.poid,
  pm.poref,  -- Add po_ref from po_master
  qc.uid,
  qcd.id AS qcdId,
  qcd.qcid,
  qcd.itemid,
  qcd.qty,
  qcd.rates,
  qcd.accqty,
  qcd.materialqty,
  qcd.rejqty,
  mm.item_code,
  mm.material_description,
  mm.unit AS material_unit,
  um.unit 
FROM
  qualitycontrolinward qc
LEFT JOIN
  qualitycontrol_details qcd ON qc.id = qcd.qcid
LEFT JOIN
  material_master mm ON qcd.itemid = mm.id
LEFT JOIN
  unitmaster um ON mm.unit = um.id
LEFT JOIN
  supplier_master sm ON qc.supplierid = sm.id  -- Join with supplier_master
LEFT JOIN
  po_master pm ON qc.poid = pm.id  -- Join with po_master
WHERE
  qc.poid = ? AND
  qc.miid = ?
  ORDER BY
qcdId;
  `;

  const params = [poid, miid];

  pool.query(q, params, (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data." });
    }

    return res.json(data);
  });
});

router.get("/viewmaterialinward/:poid/:id?", (req, res) => {
  const { poid } = req.params;
  const id = req.query.id;
  const q = `
  SELECT
  mi.id AS material_inward_id,
  mi.poid,
  mi.date,
  mi.date AS inward_date,
  md.id AS material_details_id,
  md.itemid,
  md.qty,
  md.rates,
  md.accqty,
  md.rejqty,
  mm.item_code AS item_code,
  mm.material_description AS material_description,
  um.unit AS unitmaster_unit,
  pm.poref,
  sm.name
FROM
  material_inward mi
JOIN
  materialin_details md ON mi.id = md.miid
JOIN
  material_master mm ON md.itemid = mm.id
JOIN
  unitmaster um ON mm.unit = um.id
JOIN
  po_master pm ON mi.poid = pm.id
JOIN
  supplier_master sm ON pm.supplierid = sm.id
WHERE
  mi.poid = ?
  AND mi.id = ?;

`;

  const params = id ? [poid, id] : [poid];

  pool.query(q, params, (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data." });
    }

    return res.json(data);
  });
});

//<-------------------------get material inward-------------------->
router.get("/getmaterial_inward", (req, res) => {
  const q = `SELECT mi.id, mi.miref,mi.date, sm.name, pm.poref ,mi.poid
    FROM material_inward mi 
    INNER JOIN supplier_master sm ON sm.id =mi.supplierid 
    INNER JOIN po_master pm ON pm.id =mi.poid 
    ORDER BY mi.id DESC`;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

router.get("/getquantity_inward", (req, res) => {
  const q = `SELECT
  mi.id,
  mi.miref,
  mi.date,
  sm.name AS supplier_name,
  pm.poref,
  mi.poid,
  qi.id AS qualitycontrolinward_id,
  qi.qcref
FROM
  material_inward mi
INNER JOIN
  supplier_master sm ON sm.id = mi.supplierid
INNER JOIN
  po_master pm ON pm.id = mi.poid
LEFT JOIN
  qualitycontrolinward qi ON qi.poid = mi.poid
ORDER BY
  mi.id DESC;
`;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

router.get("/getquality_inward", (req, res) => {
  const q = `SELECT
  qi.*,
  sm.name AS supplier_name,
  pm.poref
FROM
  qualitycontrolinward qi
JOIN
  supplier_master sm ON sm.id = qi.supplierid
JOIN
  po_master pm ON pm.id = qi.poid
ORDER BY
  qi.id DESC;


`;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<-------------------------------------------------------------->
//<--------------------------------add stock -------------------------->
router.post("/addStock", (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res.status(400).send("Sorry, please select material");
  }

  const totalItems = req.body.length;
  let completedItems = 0;
  let errorOccurred = false;

  const checkCompletion = () => {
    completedItems++;
    if (completedItems === totalItems) {
      if (!errorOccurred) {
        return res.status(200).json({ message: "POSTED" });
      }
    }
  };

  const insertOrUpdateStock = (item) => {
    pool.query(
      "SELECT * FROM stock WHERE itemid = ?",
      [item.itemid],
      (selectErr, selectResult) => {
        if (selectErr) {
          errorOccurred = true;
          checkCompletion();
          return;
        }

        if (selectResult.length > 0) {
          const existingQty = parseInt(selectResult[0].qty, 10);
          const newQty = existingQty + parseInt(item.qty, 10);

          pool.query(
            "UPDATE stock SET qty = ? WHERE itemid = ?",
            [newQty, item.itemid],
            (updateErr, updateResult) => {
              if (updateErr) {
                errorOccurred = true;
              }
              checkCompletion();
            }
          );
        } else {
          pool.query(
            "INSERT INTO stock (id, itemid, qty, date, uid) VALUES (?, ?, ?, ?, ?)",
            [item.id, item.itemid, item.qty, item.date, item.uid],
            (insertErr, insertResult) => {
              if (insertErr) {
                errorOccurred = true;
              }
              checkCompletion();
            }
          );
        }
      }
    );
  };

  req.body.forEach((item, index) => {
    insertOrUpdateStock(item);
  });
});

//<----------------------------------------------------------------------------->
//<-----------------------------get po details ------------------------------------>

// router.get("/getPoDetail/:id", (req, res) => {
//   const id = req.params.id;
//   const miid = req.query.miid;

//   let q, params;

//   if (miid === null || miid === undefined || miid === "null") {
//     // If miid is null, undefined, or 'null', fetch only by poid
//     q = `
//       SELECT
//         pd.id,
//         pd.indentid,
//         pd.itemid,
//         pd.qty,
//         pd.rates,
//         pm.custname,
//         pm.supplierid,
//         pm.uid,
//         mm.item_code,
//         mm.material_description,
//         u.unit,
//         mi.id AS miid,
//         MID.accqty,
//         MID.rejqty,
//         MID.materialaccqty
//       FROM
//         po_details pd
//         INNER JOIN po_master pm ON pm.id = pd.poid
//         INNER JOIN material_master mm ON mm.id = pd.itemid
//         INNER JOIN unitmaster u ON u.id = mm.unit
//         LEFT JOIN material_inward mi ON mi.poid = pd.poid
//         LEFT JOIN materialin_details MID ON mi.id = MID.miid AND MID.itemid = pd.itemid
//       WHERE
//         pd.poid = ?
//         ORDER BY
//    pd.id;
//     `;
//     params = [id];
//   } else {
//     // If miid is not null, fetch by both poid and miid
//     q = `
//     SELECT DISTINCT
//     pd.id,
//     pd.indentid,
//     pd.itemid,
//     pd.qty,
//     pd.rates,
//     pm.custname,
//     pm.supplierid,
//     pm.uid,
//     mm.item_code,
//     mm.material_description,
//     u.unit,
//     mi.id AS miid,
//     MID.accqty,
//     MID.rejqty,
//     MID.materialaccqty
// FROM
//     po_details pd
//     INNER JOIN po_master pm ON pm.id = pd.poid
//     INNER JOIN material_master mm ON mm.id = pd.itemid
//     INNER JOIN unitmaster u ON u.id = mm.unit
//     LEFT JOIN material_inward mi ON mi.poid = pd.poid
//     LEFT JOIN materialin_details MID ON MID.miid = mi.id AND MID.itemid = pd.itemid  AND (
//         MID.indentid = pd.indentid
//         OR (MID.indentid IS NULL AND MID.poid = pd.poid)
//     )
// WHERE
//     pd.poid = ? AND mi.id = ?;

//     `;
//     params = [id, miid];
//   }

//   pool.query(q, params, (err, data) => {
//     if (err) {
//       console.log(err);
//       return res.json(err);
//     }

//     // Create a map to ensure unique items
//     const uniqueItemMap = new Map();

//     data.forEach((item) => {
//       if (!uniqueItemMap.has(item.id)) {
//         uniqueItemMap.set(item.id, {
//           ...item,
//           item_code: item.item_code,
//           description: item.material_description,
//           code: {
//             id: item.itemid,
//             item_code: item.item_code,
//             material_description: item.material_description,
//             unit: item.unit,
//           },
//           qty: item.qty,
//           accqty: 0,
//           rejqty: 0,
//           materialaccqty:
//             item.materialaccqty !== null && item.materialaccqty !== 0
//               ? item.materialaccqty
//               : item.qty,
//         });
//       }
//     });

//     // Convert the map to an array
//     const sortedList = Array.from(uniqueItemMap.values());

//     return res.json(sortedList);
//   });
// });

router.get("/getPoDetail/:id", (req, res) => {
  const id = req.params.id;
  const miid = req.query.miid;

  let q, params;

  if (miid === null || miid === undefined || miid === "null") {
    // Case 1: miid is null -> fetch only by poid
    q = `
      SELECT
        pd.id,
        pd.indentid,
        pd.itemid,
        pd.qty,
        pd.rates,
        pm.custname,
        pm.supplierid,
        pm.uid,
        mm.item_code,
        mm.material_description,
        u.unit,
        mi.id AS miid,
        MID.accqty,
        MID.rejqty,
        MID.materialaccqty
      FROM po_details pd
      INNER JOIN po_master pm ON pm.id = pd.poid
      INNER JOIN material_master mm ON mm.id = pd.itemid
      INNER JOIN unitmaster u ON u.id = mm.unit
      LEFT JOIN material_inward mi ON mi.poid = pd.poid
      LEFT JOIN materialin_details MID ON mi.id = MID.miid AND MID.itemid = pd.itemid
      WHERE pd.poid = ?
      ORDER BY pd.id;
    `;
    params = [id];
  } else {
    // Case 2: miid is provided -> fetch by poid and miid
    q = `
      SELECT DISTINCT
        pd.id,
        pd.indentid,
        pd.itemid,
        pd.qty,
        pd.rates,
        pm.custname,
        pm.supplierid,
        pm.uid,
        mm.item_code,
        mm.material_description,
        u.unit,
        mi.id AS miid,
        MID.accqty,
        MID.rejqty,
        MID.materialaccqty
      FROM po_details pd
      INNER JOIN po_master pm ON pm.id = pd.poid
      INNER JOIN material_master mm ON mm.id = pd.itemid
      INNER JOIN unitmaster u ON u.id = mm.unit
      LEFT JOIN material_inward mi ON mi.poid = pd.poid
      LEFT JOIN materialin_details MID 
        ON MID.miid = mi.id 
        AND MID.itemid = pd.itemid  
        AND (
          MID.indentid = pd.indentid
          OR (MID.indentid IS NULL AND MID.poid = pd.poid)
        )
      WHERE pd.poid = ? AND mi.id = ?;
    `;
    params = [id, miid];
  }

  pool.query(q, params, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    // Group by itemid to avoid duplicates and sum materialaccqty
    const itemMap = new Map();
    console.log(data);

    data.forEach((row) => {
      if (!itemMap.has(row.itemid)) {
        itemMap.set(row.itemid, {
          ...row,
          item_code: row.item_code,
          description: row.material_description,
          code: {
            id: row.itemid,
            item_code: row.item_code,
            material_description: row.material_description,
            unit: row.unit,
          },
          qty: row.qty,
          accqty: row.accqty || 0,
          rejqty: row.rejqty || 0,
          materialaccqty:
            row.materialaccqty !== null && row.materialaccqty !== 0
              ? row.materialaccqty
              : row.qty,
        });
      } else {
        // If item already exists, just add materialaccqty
        const existing = itemMap.get(row.itemid);
        const additionalAccQty =
          row.materialaccqty !== null && row.materialaccqty !== 0
            ? row.materialaccqty
            : row.qty;

        existing.materialaccqty += additionalAccQty;
        existing.accqty += row.accqty || 0;
        existing.rejqty += row.rejqty || 0;
      }
    });

    const sortedList = Array.from(itemMap.values());
    return res.json(sortedList);
  });
});


router.get("/getPoDetailforqualitycontrol/:id", (req, res) => {
  const id = req.params.id;
  const miid = req.query.miid;

  let q, params;

  if (miid === null || miid === undefined || miid === "null") {
    q = `
      SELECT
        pd.id,
        pd.itemid,
        pd.qty,
        pd.rates,
        pm.custname,
        pm.supplierid,
        pm.uid,
        mm.item_code,
        mm.material_description,
        u.unit,
        mi.id AS miid,
        MID.accqty,
        MID.rejqty,
        MID.materialaccqty,
        MID.indentid
      FROM
        po_details pd
        INNER JOIN po_master pm ON pm.id = pd.poid
        INNER JOIN material_master mm ON mm.id = pd.itemid
        INNER JOIN unitmaster u ON u.id = mm.unit
        LEFT JOIN material_inward mi ON mi.poid = pd.poid
        LEFT JOIN materialin_details MID ON mi.id = MID.miid AND MID.itemid = pd.itemid
      WHERE
        pd.poid = ?
        ORDER BY pd.id DESC
    `;
    params = [id];
  } else {
    q = `
      SELECT DISTINCT
        pd.id,
        pd.itemid,
        pd.qty,
        pd.rates,
        pm.custname,
        pm.supplierid,
        pm.uid,
        mm.item_code,
        mm.material_description,
        u.unit,
        mi.id AS miid,
        MID.accqty,
        MID.rejqty,
        MID.materialaccqty,
        MID.indentid,
        MID.id
      FROM
        po_details pd
        INNER JOIN po_master pm ON pm.id = pd.poid
        INNER JOIN material_master mm ON mm.id = pd.itemid
        INNER JOIN unitmaster u ON u.id = mm.unit
        LEFT JOIN material_inward mi ON mi.poid = pd.poid
        LEFT JOIN materialin_details MID ON mi.id = MID.miid AND MID.itemid = pd.itemid
      WHERE
        pd.poid = ? AND mi.id = ?
        GROUP BY
    MID.id,pd.id, pd.itemid, pd.qty, pd.rates, pm.custname, pm.supplierid, pm.uid, 
    mm.item_code, mm.material_description, u.unit, mi.id;
    `;
    params = [id, miid];
  }

  pool.query(q, params, (err, data) => {
    if (err) {
      return res.json(err);
    }
    const uniqueItemIds = new Set();
    const filteredData = data.filter((item) => {
      if (uniqueItemIds.has(item.id)) {
        return false;
      }
      uniqueItemIds.add(item.id);
      return true;
    });

    const list = filteredData.map((item) => {
      const {
        itemid,
        item_code,
        material_description,
        unit,
        qty,
        accqty,
        rejqty,
        materialaccqty,
      } = item;

      const updatedMaterialAccQty =
        materialaccqty !== null && materialaccqty !== 0 ? materialaccqty : qty;

      return {
        ...item,
        item_code,
        description: material_description,
        code: {
          id: itemid,
          item_code,
          material_description,
          unit,
        },
        qty,
        materialaccqty: accqty,
        materialreaingqty: updatedMaterialAccQty,
        accqty: 0,
        rejqty: 0,
      };
    });

    return res.json(list);
  });
});


router.post("/addPOInward", async (req, res) => {
  const { id, date, supplierid, poid, uid, qltflag, materialList, status } =
    req.body;
  let user;
  let number = 0;

  const convertDateFormat = (dateString) => {
    // Split the date by '/' and join with '-'
    const parts = dateString.split("/");
    if (parts.length === 3) {
      return parts.join("-");
    }
    // Return the original string if it's not in expected format
    return dateString;
  };

  const newdate = convertDateFormat(date);

  if (!materialList?.length) {
    return res.status(400).send("Sorry, please select material");
  }

  // ✅ Validate that at least one item has accqty > 0
  const hasValidAccqty = materialList.some((item) => {
    return item.materialaccqty != 0 && item.accqty != null && parseInt(item.accqty) > 0;
  });

  if (!hasValidAccqty) {
    return res.status(400).json({
      message: "At least one item must have an accepted quantity greater than 0"
    });
  }

  // Assuming you have access to your database pool as 'pool'
  try {
    // Query to select quot_serial for the provided uid
    const selectQuotQuery = `
      SELECT quot_serial
      FROM usermaster
      WHERE id = ${uid};
    `;

    // Executing the select query for quot_serial
    const userData = await executeQuery(selectQuotQuery);
    if (userData && userData.length > 0) {
      user = userData[0].quot_serial;

      // Query to select the maximum id from material_inward table
      const selectMaxIdQuery = `SELECT MAX(id) AS maxId FROM material_inward`;

      // Executing the select query for maximum id
      const maxIdData = await executeQuery(selectMaxIdQuery);
      if (maxIdData && maxIdData.length > 0 && maxIdData[0].maxId !== null) {
        number = maxIdData[0].maxId + 1;
      } else {
        number = 1;
      }

      // Insert query to insert data into material_inward table
      const insertMaterialInwardQuery = `
        INSERT INTO material_inward (miref, date, supplierid, poid, uid, qltflag, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const materialInwardValues = [
        getInwardNumber(number, user), // Assuming getInwardNumber generates the reference
        newdate,
        supplierid,
        poid,
        uid,
        qltflag,
        status,
      ];

      // Executing the insert query for material_inward
      const materialInwardResult = await executeQuery(
        insertMaterialInwardQuery,
        materialInwardValues
      );

      // Get the ID of the inserted material_inward record
      const materialInwardId = materialInwardResult.insertId;

      // Loop through materialList to insert data into materialdetails table
      for (const {
        itemid,
        qty,
        rates,
        accqty,
        rejqty,
        materialaccqty,
        qtyleft,
        indentid,
      } of materialList) {
        const poidValue = indentid === null ? poid : null;
        const insertMaterialDetailsQuery = `
          INSERT INTO materialin_details (miid, itemid, qty, date, rates, accqty, rejqty, materialaccqty,indentid,poid)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)
        `;
        const materialDetailsValues = [
          materialInwardId,
          itemid,
          qty,
          newdate,
          rates,
          accqty,
          rejqty,
          qtyleft,
          indentid,
          poidValue,
        ];
        // Executing the insert query for materialdetails
        await executeQuery(insertMaterialDetailsQuery, materialDetailsValues);
      }
      if (status === 2) {
        const updateStatusQuery = `UPDATE material_inward SET status = 2 WHERE poid = ?`;
        await executeQuery(updateStatusQuery, [poid]);
      }
      return res.status(200).send("POSTED");
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});


// router.post("/addPOInward", async (req, res) => {
//   const { id, date, supplierid, poid, uid, qltflag, materialList, status } =
//     req.body;
//   let user;
//   let number = 0;

//   const convertDateFormat = (dateString) => {
//     // Split the date by '/' and join with '-'
//     const parts = dateString.split("/");
//     if (parts.length === 3) {
//       return parts.join("-");
//     }
//     // Return the original string if it's not in expected format
//     return dateString;
//   };

//   const newdate = convertDateFormat(date);

//   if (!materialList?.length) {
//     return res.status(400).send("Sorry, please select material");
//   }

//   // for (const item of materialList) {
//   //   if (item.materialaccqty != 0) {
//   //     if (item.accqty == null || parseInt(item.accqty) <= 0) {
//   //       return res
//   //         .status(400)
//   //         .json({ message: "Accqty should be greater than 0" });
//   //     }
//   //   }
//   // }
//   // Assuming you have access to your database pool as 'pool'
//   try {
//     // Query to select quot_serial for the provided uid
//     const selectQuotQuery = `
//       SELECT quot_serial
//       FROM usermaster
//       WHERE id = ${uid};
//     `;

//     // Executing the select query for quot_serial
//     const userData = await executeQuery(selectQuotQuery);
//     if (userData && userData.length > 0) {
//       user = userData[0].quot_serial;

//       // Query to select the maximum id from material_inward table
//       const selectMaxIdQuery = `SELECT MAX(id) AS maxId FROM material_inward`;

//       // Executing the select query for maximum id
//       const maxIdData = await executeQuery(selectMaxIdQuery);
//       if (maxIdData && maxIdData.length > 0 && maxIdData[0].maxId !== null) {
//         number = maxIdData[0].maxId + 1;
//       } else {
//         number = 1;
//       }

//       // Insert query to insert data into material_inward table
//       const insertMaterialInwardQuery = `
//         INSERT INTO material_inward (miref, date, supplierid, poid, uid, qltflag, status)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//       `;

//       const materialInwardValues = [
//         getInwardNumber(number, user), // Assuming getInwardNumber generates the reference
//         newdate,
//         supplierid,
//         poid,
//         uid,
//         qltflag,
//         status,
//       ];

//       // Executing the insert query for material_inward
//       const materialInwardResult = await executeQuery(
//         insertMaterialInwardQuery,
//         materialInwardValues
//       );

//       // Get the ID of the inserted material_inward record
//       const materialInwardId = materialInwardResult.insertId;

//       // Loop through materialList to insert data into materialdetails table
//       for (const {
//         itemid,
//         qty,
//         rates,
//         accqty,
//         rejqty,
//         materialaccqty,
//         qtyleft,
//         indentid,
//       } of materialList) {
//         const poidValue = indentid === null ? poid : null;
//         const insertMaterialDetailsQuery = `
//           INSERT INTO materialin_details (miid, itemid, qty, date, rates, accqty, rejqty, materialaccqty,indentid,poid)
//           VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)
//         `;
//         const materialDetailsValues = [
//           materialInwardId,
//           itemid,
//           qty,
//           newdate,
//           rates,
//           accqty,
//           rejqty,
//           qtyleft,
//           indentid,
//           poidValue,
//         ];
//         // Executing the insert query for materialdetails
//         await executeQuery(insertMaterialDetailsQuery, materialDetailsValues);
//       }
//       if (status === 2) {
//         const updateStatusQuery = `UPDATE material_inward SET status = 2 WHERE poid = ?`;
//         await executeQuery(updateStatusQuery, [poid]);
//       }
//       return res.status(200).send("POSTED");
//     } else {
//       return res.status(404).send("User not found");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Function to execute a SQL query and return a promise
// Function to execute a SQL query and return a promise
function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(query, values, (err, result) => {
        connection.release(); // Release the connection back to the pool
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });
}

//<--------------------------Stock Reports----------------------------
router.get("/stockreports", (req, res) => {
  const query = ` SELECT 
  mm.*, 
  COALESCE(s.qty, 0) AS stock_qty,
  sm.store_name
FROM 
  material_master mm
LEFT JOIN 
  stock s 
  ON mm.id = s.itemid
LEFT JOIN 
  store_master sm 
  ON mm.store_id = sm.id;
`;

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json(results);
  });
});
//<------------------------------------------------------------------>

router.post("/addqualityInward", async (req, res) => {
  const {
    id,
    date,
    supplierid,
    poid,
    uid,
    qltflag,
    materialList,
    status,
    miid,
  } = req.body;

  let user;
  let number = 0;
  const convertDateFormat = (dateString) => {
    // Split the date by '/' and join with '-'
    const parts = dateString.split("/");
    if (parts.length === 3) {
      return parts.join("-");
    }

    return dateString;
  };
  const newdate = convertDateFormat(date);
  if (!materialList?.length) {
    return res.status(400).send("Sorry, please select material");
  }
  for (const item of materialList) {
    if (item.materialaccqty != 0) {
      if (item.accqty == null || parseInt(item.accqty) <= 0) {
        return res
          .status(400)
          .json({ message: "Accqty should be greater than 0" });
      }
    }
  }
  try {
    // Query to select quot_serial for the provided uid
    const selectQuotQuery = `
      SELECT quot_serial
      FROM usermaster
      WHERE id = ${uid};
    `;

    // Executing the select query for quot_serial
    const userData = await executeQuery(selectQuotQuery);
    if (userData && userData.length > 0) {
      user = userData[0].quot_serial;

      const selectMaxIdQuery = `SELECT MAX(id) AS maxId FROM qualitycontrolinward`;

      const maxIdData = await executeQuery(selectMaxIdQuery);
      if (maxIdData && maxIdData.length > 0 && maxIdData[0].maxId !== null) {
        number = maxIdData[0].maxId + 1;
      } else {
        number = 1;
      }

      const insertMaterialInwardQuery = `
      INSERT INTO qualitycontrolinward (id,qcref, date, miid, supplierid, poid, uid, status)
      VALUES (?,?, ?, ?, ?, ?, ?,?)
    `;

      const materialInwardValues = [
        number,
        getquantityInwardNumber(number, user), // Assuming getquantityInwardNumber generates the reference
        newdate,
        materialList[0]?.miid || miid,
        supplierid,
        poid,
        uid,
        status,
      ];

      const materialInwardResult = await executeQuery(
        insertMaterialInwardQuery,
        materialInwardValues
      );

      // Get the ID of the inserted material_inward record
      const materialInwardId = materialInwardResult.insertId;
      let allRejQtyNonZero = true;
      // Loop through materialList to insert data into materialdetails table
      for (const {
        id,
        itemid,
        qty,
        rates,
        accqty,
        rejqty,
        materialaccqty,
        materialreaingqty,
        indentid,
      } of materialList) {
        const insertMaterialDetailsQuery = `
        INSERT INTO qualitycontrol_details (qcid, itemid, qty, date, materialqty, rates, accqty, rejqty)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
        const materialDetailsValues = [
          number, // Using the ID of the inserted material_inward record
          itemid,
          qty,
          newdate,
          Number(materialaccqty) || 0,
          Number(rates) || 0,
          Number(accqty) || 0,   // ✅ convert empty string to 0
          Number(rejqty) || 0,
        ];
        // Executing the insert query for materialdetails
        await executeQuery(insertMaterialDetailsQuery, materialDetailsValues);
        const newMaterialAccQty = Math.max(
          materialaccqty - parseInt(accqty),
          0
        );

        const materialInDetailsUpdateQuery = `
          UPDATE materialin_details
          SET materialaccqty = materialaccqty + ?
          WHERE itemid = ? AND id = ? AND indentid = ?
        `;
        const materialInDetailsUpdateValues = [
          newMaterialAccQty,
          itemid,
          id,
          indentid,
        ];
        await executeQuery(
          materialInDetailsUpdateQuery,
          materialInDetailsUpdateValues
        );
        const checkStockQuery = `
        SELECT COUNT(*) AS count
        FROM stock
        WHERE itemid = ?
      `;
        const checkStockValues = [itemid];
        const checkStockData = await executeQuery(
          checkStockQuery,
          checkStockValues
        );
        const itemExists = checkStockData[0].count > 0;
        if (itemExists) {
          // Update stock if itemid exists
          const stockUpdateQuery = `
          UPDATE stock
          SET qty = qty + ?
          WHERE itemid = ?
        `;
          const stockUpdateValues = [accqty, itemid];
          await executeQuery(stockUpdateQuery, stockUpdateValues);
        } else {
          // Insert new stock entry if itemid does not exist
          const insertStockQuery = `
          INSERT INTO stock (itemid, qty, date, uid)
          VALUES (?, ?, ?, 116)
        `;
          const insertStockValues = [
            itemid,
            accqty,
            new Date().toLocaleDateString("en-GB"),
          ];
          await executeQuery(insertStockQuery, insertStockValues);
        }
      }
      const updateStatusQuery = `UPDATE qualitycontrolinward SET status = 2 WHERE id = ?`;
      await executeQuery(updateStatusQuery, [number]);
      for (const { rejqty } of materialList) {
        if (parseInt(rejqty) != 0) {
          allRejQtyNonZero = true;

          break;
        } else {
          allRejQtyNonZero = false;
        }
      }
      if (allRejQtyNonZero) {
        const getPoidQuery = `
  SELECT poid
  FROM material_inward
  WHERE id = ?;
`;

        const [result] = await executeQuery(getPoidQuery, [miid]);
        const poid = result.poid;

        if (poid) {
          const updateStatusQuery = `
    UPDATE material_inward
    SET status = 1
    WHERE poid = ?;
  `;

          await executeQuery(updateStatusQuery, [poid]);
        }
      }
      return res.status(200).send("POSTED");
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Function to execute a SQL query and return a promise
// Function to execute a SQL query and return a promise
function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(query, values, (err, result) => {
        connection.release(); // Release the connection back to the pool
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });
}

// router.post("/addqualityInward", async (req, res) => {

//   const { id, miid, date, supplierid, poid, uid, qltflag, materialList, status } = req.body;

//   if (!materialList?.length) {
//     return res.status(400).send("Sorry, please select material");
//   }

//   try {
//     const maxIdResult = await poolQuery("SELECT MAX(id) AS maxId FROM qualitycontrolinward");
//     const nextId = maxIdResult[0].maxId !== null ? maxIdResult[0].maxId + 1 : 1;
//     const data = await poolQuery("SELECT qcref FROM qualitycontrolinward ORDER BY id DESC LIMIT 1");
//     const user = await poolQuery("SELECT quot_serial FROM usermaster WHERE id=?", [uid]);
//     const fetchMaxIdQuery = "SELECT MAX(id) AS maxId FROM qualitycontrolinward";

//     const maxIdData = await poolQuery(fetchMaxIdQuery);

//     let number = 0;
//     if (maxIdData && maxIdData.length > 0 && maxIdData[0].maxId !== null) {
//       number = maxIdData[0].maxId + 1;
//     } else {

//       number = 1;
//     }

//     const result = await poolQuery(
//       "INSERT INTO qualitycontrolinward VALUES(?,?,?,?,?,?,?,?)",
//       [
//         (await getMaxQualityControlInwardId()) + 1,
//         getquantityInwardNumber(number, user),
//         date,
//         materialList[0]?.miid || miid,
//         supplierid,
//         poid,
//         uid,
//         status,
//       ]
//     );

//     await insertMaterialDetails(nextId);

//     await updateMaterialInwardStatus(materialList[0]?.miid);

//     return res.send("POSTED");
//   } catch (err) {

//     return res.send("Error occurred");
//   }

//   async function getMaxQualityControlInwardId() {

//     const maxIdResult = await poolQuery("SELECT MAX(id) AS maxId FROM qualitycontrolinward");
//     return maxIdResult[0].maxId || 0;
//   }

//   async function insertMaterialDetails(nextId) {

//     const materialDetailsQuery =
//       "SELECT mi.id AS mi_id, mi.poid, md.id AS md_id, md.itemid, md.materialaccqty " +
//       "FROM material_inward mi " +
//       "JOIN materialin_details md ON mi.id = md.miid " +
//       "WHERE mi.poid = ?";
//     const existingMaterialDetails = await poolQuery(materialDetailsQuery, [poid]);

//     for (const { itemid, qty, rates, accqty, rejqty, materialaccqty } of materialList) {
//       const existingEntries = existingMaterialDetails.filter((entry) => entry.itemid === itemid);

//       let totalMaterialAccQty = 0;

//       for (const existingEntry of existingEntries) {
//         console.log("existingEntry",existingEntry)
//         totalMaterialAccQty +=
//           existingEntry ? parseInt(existingEntry.materialaccqty, 10) + parseInt(rejqty, 10) : parseInt(rejqty, 10);
//       }
//       console.log("totalMaterialAccQty",totalMaterialAccQty)

//       await poolQuery(
//         "INSERT INTO qualitycontrol_details VALUES(?,?,?,?,?,?,?,?,?)",
//         [undefined, nextId, itemid, qty, new Date().toLocaleDateString("en-GB"), parseInt(materialaccqty), rates, accqty, rejqty]
//       );
//       await updateStockQuantity(itemid, parseInt(accqty, 10));

//       for (const existingEntry of existingEntries) {
//         await poolQuery(
//           "UPDATE materialin_details SET materialaccqty = ? WHERE id = ? AND itemid = ?",
//           [totalMaterialAccQty, existingEntry.md_id, itemid]
//         );
//       }
//     }
//   }

//   async function updateStockQuantity(itemid, accqty) {
//     try {
//     const stockResult = await poolQuery("SELECT qty FROM stock WHERE itemid = ?", [itemid]);
//     const existingStockQty = stockResult[0]?.qty || 0;

//     const newStockQty = existingStockQty + accqty;

//     await poolQuery("UPDATE stock SET qty = ? WHERE itemid = ?", [newStockQty, itemid]);
//     }catch (error) {

//     }
//   }

//   async function updateMaterialInwardStatus(materialInwardId) {

//     const detailsResult = await poolQuery("SELECT id, accqty, qty FROM qualitycontrol_details WHERE qcid = ?", [
//       materialInwardId,
//     ]);

//     const hasMismatch = detailsResult.some((detail) => detail.accqty !== detail.qty);

//     const newStatus = 2;

//     await poolQuery("UPDATE qualitycontrolinward SET status = ? WHERE id = ?", [newStatus, materialInwardId]);
//   }

//   async function poolQuery(query, values) {
//     return new Promise((resolve, reject) => {
//       pool.query(query, values, (err, result) => {
//         if (err) {
//           return reject(err);
//         } else {
//           return resolve(result);
//         }
//       });
//     });
//   }
// });

//<-------------------------------------------------------------------->
//<-----------------------------------get po for inward------------------------>
router.get("/getPoForInward", (req, res) => {
  const q = `SELECT 
  po.id,
  po.poref,
  po.podate,
  po.indentid,
  sm.name AS suppname,
  em.custname,
  mi.status,
  mi.id AS miid
FROM po_master po
LEFT JOIN supplier_master sm ON po.supplierid = sm.id
LEFT JOIN enquiry_master em ON po.indentid = em.id
LEFT JOIN (
  SELECT 
    id,
    poid,
    STATUS,
    ROW_NUMBER() OVER (PARTITION BY poid ORDER BY id DESC) AS row_num
  FROM material_inward
) mi ON po.id = mi.poid AND mi.row_num = 1
WHERE mi.poid IS NULL 
   OR mi.id = (
    SELECT MAX(mi_inner.id)
    FROM material_inward mi_inner
    WHERE mi_inner.poid = po.id
)
ORDER BY po.id DESC;

`;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

// router.get("/getmaterialForquantityInward", (req, res) => {
//   const q = `
//     SELECT
//       po.id AS id,
//       mi.miref,
//       mi.poid,
//       mi.uid,
//       mi.id AS miid,
//       po.poref,
//       em.custname,
//       po.podate,
//       po.indentid,
//       qc.status AS qcStatus
//     FROM
//       material_inward mi
//     LEFT JOIN
//       po_master po ON mi.poid = po.id
//     LEFT JOIN
//       enquiry_master em ON po.indentid = em.id
//     LEFT JOIN
//       qualitycontrolinward qc ON mi.id = qc.miid AND mi.poid = qc.poid
//     WHERE
//       qc.status IS NULL OR qc.status != 2
//     ORDER BY
//       mi.id DESC
//   `;

//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//     return res.json(data);
//   });
// });

//<--------------------------------------------------------->
// router.post('/updateBOMIssue/:id', async (req, res) => {
//   const dataList = req.body;
//   const bomRequestId = req.params.id;

//   try {
//     for (const item of dataList) {
//       const updatedStock = item.availableInStore - item.boiQty;
//       const newStock = updatedStock < 0 ? 0 : updatedStock;

//       const updateStockQuery = `
//         UPDATE stock
//         SET qty = ?
//         WHERE itemid = ?;
//       `;
//       await pool.query(updateStockQuery, [newStock, item.item_id]);
//     }
//     const updateBOMRequestQuery = `
//       UPDATE bom_request
//       SET isissue = 1
//       WHERE id = ?;
//     `;
//     await pool.query(updateBOMRequestQuery, [bomRequestId]);

//     // plan_id
//     const updateProductionPlanDetailsQuery = `
//       UPDATE production_plan_details
//       SET bomissued = 1
//       WHERE prod_plan_id = ?;
//     `;
//     await pool.query(updateProductionPlanDetailsQuery, [item.plan_id]);

//    return res.json({ message: 'Available in Store quantity and BOM Request updated successfully' });
//   } catch (error) {

//   return  res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get("/getmaterialForquantityInward", (req, res) => {
  const q = `
    SELECT
      po.id AS id,
      mi.miref,
      mi.poid,
      mi.uid,
      mi.id AS miid,
      po.poref,
      em.custname,
      sm.name AS suppname,  -- Added supplier name
      po.podate,
      po.indentid,
      qc.status AS qcStatus
    FROM
      material_inward mi
    LEFT JOIN
      po_master po ON mi.poid = po.id
    LEFT JOIN
      enquiry_master em ON po.indentid = em.id
    LEFT JOIN
      supplier_master sm ON po.supplierid = sm.id  -- New join for supplier name
    LEFT JOIN
      qualitycontrolinward qc ON mi.id = qc.miid AND mi.poid = qc.poid
    WHERE
      qc.status IS NULL OR qc.status != 2
    ORDER BY
      mi.id DESC
  `;

  pool.query(q, (err, data) => {
    console.log("DATATATA", data);

    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});


router.post("/updateBOMIssue/:id", (req, res) => {
  const dataList = req.body;
  const bomRequestId = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Connection error" });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Transaction start failed" });
      }

      try {
        for (const item of dataList) {
          const updatedStock = item.availableInStore - item.boiQty;
          const newStock = updatedStock < 0 ? 0 : updatedStock;

          const updateStockQuery = `
            UPDATE stock
            SET qty = ?
            WHERE itemid = ?;
          `;
          await new Promise((resolve, reject) => {
            connection.query(updateStockQuery, [newStock, item.item_id], (err) => {
              if (err) return reject(err);
              resolve();
            });
          });

          // Update production plan details inside the loop
          const updateProductionPlanDetailsQuery = `
            UPDATE production_plan_details
            SET bomissued = 1, remainingbomissueqty = 0
            WHERE prod_plan_id = ?;
          `;
          await new Promise((resolve, reject) => {
            connection.query(updateProductionPlanDetailsQuery, [item.plan_id], (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        }

        const updateBOMRequestQuery = `
          UPDATE bom_request
          SET isissue = 1
          WHERE id = ?;
        `;
        await new Promise((resolve, reject) => {
          connection.query(updateBOMRequestQuery, [bomRequestId], (err) => {
            if (err) return reject(err);
            resolve();
          });
        });

        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json({ error: "Commit failed" });
            });
          }
          connection.release();
          return res.json({
            message: "Available in Store quantity and BOM Request updated successfully",
          });
        });
      } catch (error) {
        connection.rollback(() => {
          connection.release();
          return res.status(500).json({ error: "Internal Server Error" });
        });
      }
    });
  });
});



//<--------------------------get bom details---------------------->

// router.get("/getbomDetailselect/:ids", (req, res) => {
//   // Split the comma-separated IDs into an array
//   const ids = req.params.ids.split(',');

//   // Create an array to store the results for each ID
//   const results = [];

//   // Define a function to fetch data for a single ID
//   const fetchDataForId = (id) => {
//     const q = `
//       SELECT
//         e.uid,
//         brd.id,
//         brd.totqty,
//         mm.id AS itemid,
//         mm.item_code,
//         mm.material_description,
//         u.unit,
//         COALESCE(SUM(ind.qty), 0) AS qty,
//         COALESCE(s.qty, 0) AS stock,
//         COALESCE(po.qty, 0) AS poqty
//       FROM
//         bom_request_details brd
//       INNER JOIN bom_request br ON br.id = brd.bomid
//       INNER JOIN production_plan_details prod_plan ON prod_plan.prod_plan_id = br.plan_id
//       INNER JOIN order_acceptance oa ON oa.id = prod_plan.oa_id
//       INNER JOIN quotation q ON q.qid = oa.qid
//       INNER JOIN enquiry_master e ON e.id = q.eid
//       INNER JOIN material_master mm ON mm.id = brd.itemid
//       INNER JOIN unitmaster u ON u.id = mm.unit
//       LEFT JOIN stock s ON s.itemid = brd.itemid
//       LEFT JOIN (
//         SELECT i.id AS indent_id, id.itemid, SUM(id.qty) AS qty
//         FROM indent i
//         JOIN indent_details id ON i.id = id.indentid AND i.bomid = ?
//         GROUP BY i.id, id.itemid
//       ) AS ind ON brd.itemid = ind.itemid
//       LEFT JOIN (
//         SELECT itemid, indentid, SUM(qty) AS qty
//         FROM po_details
//         GROUP BY itemid, indentid
//       ) AS po ON po.itemid = brd.itemid AND po.indentid = ind.indent_id
//       WHERE
//         brd.bomid = ?
//       GROUP BY e.uid, brd.id, brd.totqty, mm.id, mm.item_code, mm.material_description, u.unit, s.qty, po.qty;
//     `;

//     pool.query(q, [id, id], (err, data) => {
//       if (err) {
//         // Handle error
//         console.error(err);
//         results.push({ error: err.message });
//       } else {
//         // Push the data for this ID to the results array
//         results.push(data);
//       }

//       // If all IDs have been processed, send the results to the client
//       if (results.length === ids.length) {
//         res.json(results);
//       }
//     });
//   };

//   // Fetch data for each ID
//   ids.forEach((id) => {
//     fetchDataForId(id);
//   });
// });

router.get("/getbomDetailselect/:ids", (req, res) => {
  // Split the comma-separated IDs into an array
  const ids = req.params.ids.split(",");

  // Create an array to store the results for each ID
  const results = [];

  // Define a function to fetch data for a single ID
  const fetchDataForId = (id) => {
    const q = `
      SELECT
        e.uid,
        brd.id,
        brd.totqty,
        mm.id AS itemid,
        mm.item_code,
        mm.material_description,
        u.unit,
        COALESCE(SUM(ind.qty), 0) AS qty,
        COALESCE(s.qty, 0) AS stock,
        COALESCE(po.qty, 0) AS poqty
      FROM
        bom_request_details brd
      INNER JOIN bom_request br ON br.id = brd.bomid
      INNER JOIN production_plan_details prod_plan ON prod_plan.prod_plan_id = br.plan_id
      INNER JOIN order_acceptance oa ON oa.id = prod_plan.oa_id
      INNER JOIN quotation q ON q.qid = oa.qid
      INNER JOIN enquiry_master e ON e.id = q.eid
      INNER JOIN material_master mm ON mm.id = brd.itemid
      INNER JOIN unitmaster u ON u.id = mm.unit
      LEFT JOIN stock s ON s.itemid = brd.itemid
      LEFT JOIN (
        SELECT i.id AS indent_id, id.itemid, SUM(id.qty) AS qty
        FROM indent i
        JOIN indent_details id ON i.id = id.indentid AND i.bomid = ?
        GROUP BY i.id, id.itemid
      ) AS ind ON brd.itemid = ind.itemid
      LEFT JOIN (
        SELECT itemid, indentid, SUM(qty) AS qty
        FROM po_details
        GROUP BY itemid, indentid
      ) AS po ON po.itemid = brd.itemid AND po.indentid = ind.indent_id
      WHERE
        brd.bomid = ?
      GROUP BY e.uid, brd.id, brd.totqty, mm.id, mm.item_code, mm.material_description, u.unit, s.qty, po.qty;
    `;

    pool.query(q, [id, id], (err, data) => {
      if (err) {
        // Handle error
        console.error(err);
        results.push({ error: err.message });
      } else {
        // Extract relevant fields and structure them as an object
        const resultObject = data.map((row) => ({
          uid: row.uid,
          id: row.id,
          totqty: row.totqty,
          itemid: row.itemid,
          item_code: row.item_code,
          material_description: row.material_description,
          unit: row.unit,
          qty: row.qty,
          stock: row.stock,
          poqty: row.poqty,
        }));
        // Push the object for this ID to the results array
        results.push(resultObject);
      }

      // If all IDs have been processed, send the results to the client
      if (results.length === ids.length) {
        return res.json(results);
      }
    });
  };

  // Fetch data for each ID
  ids.forEach((id) => {
    fetchDataForId(id);
  });
});


router.get("/getbomDetail/:id", (req, res) => {
  const q = `SELECT
   e.uid,
   e.cid,
   e.selectedCosting,
   cd.id as costing_detail_id,
   brd.id,
   brd.totqty,
   mm.id AS itemid,
   mm.item_code,
   mm.material_description,
   br.plan_id,
   u.unit,
   COALESCE(SUM(ind.qty), 0) AS qty,
   COALESCE(s.qty, 0) AS stock,
   COALESCE(po.qty, 0) AS poqty
  FROM
   bom_request_details brd
  INNER JOIN bom_request br ON br.id = brd.bomid
  INNER JOIN production_plan_details prod_plan ON prod_plan.prod_plan_id = br.plan_id
  INNER JOIN order_acceptance oa ON oa.id = prod_plan.oa_id
  INNER JOIN quotation q ON q.qid = oa.qid
  INNER JOIN enquiry_master e ON e.id = q.eid
  INNER JOIN costing_details cd ON cd.cid = e.cid AND cd.mid = brd.itemid
  INNER JOIN material_master mm ON mm.id = brd.itemid
  INNER JOIN unitmaster u ON u.id = mm.unit
  LEFT JOIN stock s ON s.itemid = brd.itemid
  LEFT JOIN (
   SELECT i.id AS indent_id, id.itemid, SUM(id.qty) AS qty
   FROM indent i
   JOIN indent_details id ON i.id = id.indentid AND i.bomid = ?
   WHERE i.isTransfer = 0
   GROUP BY i.id, id.itemid
  ) AS ind ON brd.itemid = ind.itemid
  LEFT JOIN (
   SELECT itemid, indentid, SUM(qty) AS qty
   FROM po_details WHERE isTransfer = 0
   GROUP BY itemid, indentid
  ) AS po ON po.itemid = brd.itemid AND po.indentid = ind.indent_id
  WHERE
   brd.bomid = ?
  GROUP BY e.uid, e.cid, e.selectedCosting, cd.id, brd.id, brd.totqty, mm.id, mm.item_code, mm.material_description, u.unit, s.qty, po.qty
  ORDER BY cd.id;
  `;
  //   const q = `SELECT
  //  e.uid,
  //  e.cid,
  //  cm.costingname AS selectedCosting,
  //  cd.id as costing_detail_id,
  //  brd.id,
  //  brd.totqty,
  //  mm.id AS itemid,
  //  mm.item_code,
  //  mm.material_description,
  //  br.plan_id,
  //  u.unit,
  //  COALESCE(SUM(ind.qty), 0) AS qty,
  //  COALESCE(s.qty, 0) AS stock,
  //  COALESCE(po.qty, 0) AS poqty
  // FROM
  //  bom_request_details brd
  // INNER JOIN bom_request br ON br.id = brd.bomid
  // INNER JOIN production_plan_details prod_plan ON prod_plan.prod_plan_id = br.plan_id
  // INNER JOIN order_acceptance oa ON oa.id = prod_plan.oa_id
  // INNER JOIN quotation q ON q.qid = oa.qid
  // INNER JOIN enquiry_master e ON e.id = q.eid
  // INNER JOIN costing_master cm ON cm.id = e.cid
  // INNER JOIN costing_details cd ON cd.cid = e.cid AND cd.mid = brd.itemid
  // INNER JOIN material_master mm ON mm.id = brd.itemid
  // INNER JOIN unitmaster u ON u.id = mm.unit
  // LEFT JOIN stock s ON s.itemid = brd.itemid
  // LEFT JOIN (
  //  SELECT i.id AS indent_id, id.itemid, SUM(id.qty) AS qty
  //  FROM indent i
  //  JOIN indent_details id ON i.id = id.indentid AND i.bomid = ?
  //  WHERE i.isTransfer = 0
  //  GROUP BY i.id, id.itemid
  // ) AS ind ON brd.itemid = ind.itemid
  // LEFT JOIN (
  //  SELECT itemid, indentid, SUM(qty) AS qty
  //  FROM po_details WHERE isTransfer = 0
  //  GROUP BY itemid, indentid
  // ) AS po ON po.itemid = brd.itemid AND po.indentid = ind.indent_id
  // WHERE
  //  brd.bomid = ?
  // GROUP BY e.uid, e.cid, cm.costingname, cd.id, brd.id, brd.totqty, mm.id, mm.item_code, mm.material_description, u.unit, s.qty, po.qty
  // ORDER BY cd.id;
  // `;
  pool.query(q, [req.params.id, req.params.id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

// router.get("/getbomDetail/:id", (req, res) => {
//   const q = `SELECT
//  e.uid,
//  e.cid,
//  e.selectedCosting,
//  brd.id,
//  brd.totqty,
//  mm.id AS itemid,
//  mm.item_code,
//  mm.material_description,
//  br.plan_id,
//  u.unit,
//  COALESCE(SUM(ind.qty), 0) AS qty,
//  COALESCE(s.qty, 0) AS stock,
//  COALESCE(po.qty, 0) AS poqty
// FROM
//  bom_request_details brd
// INNER JOIN bom_request br ON br.id = brd.bomid
// INNER JOIN production_plan_details prod_plan ON prod_plan.prod_plan_id = br.plan_id
// INNER JOIN order_acceptance oa ON oa.id = prod_plan.oa_id
// INNER JOIN quotation q ON q.qid = oa.qid
// INNER JOIN enquiry_master e ON e.id = q.eid
// INNER JOIN material_master mm ON mm.id = brd.itemid
// INNER JOIN unitmaster u ON u.id = mm.unit
// LEFT JOIN stock s ON s.itemid = brd.itemid
// LEFT JOIN (
//  SELECT i.id AS indent_id, id.itemid, SUM(id.qty) AS qty
//  FROM indent i
//  JOIN indent_details id ON i.id = id.indentid AND i.bomid = ?
//  where i.isTransfer = 0
//  GROUP BY i.id, id.itemid
// ) AS ind ON brd.itemid = ind.itemid
// LEFT JOIN (
//  SELECT itemid, indentid, SUM(qty) AS qty
//  FROM po_details WHERE isTransfer = 0
//  GROUP BY itemid, indentid
// ) AS po ON po.itemid = brd.itemid AND po.indentid = ind.indent_id
// WHERE
//  brd.bomid = ?
// GROUP BY e.uid, e.cid, e.selectedCosting, brd.id, brd.totqty, mm.id, mm.item_code, mm.material_description, u.unit, s.qty, po.qty
// ORDER BY brd.id, mm.id;



// `;
//   pool.query(q, [req.params.id, req.params.id], (err, data) => {
//     if (err) {
//       return res.json(err);
//     }

//     return res.json(data);
//   });
// });

// router.get("/getbomDetail/:id", (req, res) => {
//   const q = `SELECT
//  e.uid,
//  brd.id,
//  brd.totqty,
//  mm.id AS itemid,
//  mm.item_code,
//  mm.material_description,
//  br.plan_id,
//  u.unit,
//  COALESCE(SUM(ind.qty), 0) AS qty,
//  COALESCE(s.qty, 0) AS stock,
//  COALESCE(po.qty, 0) AS poqty
// FROM
//  bom_request_details brd
// INNER JOIN bom_request br ON br.id = brd.bomid
// INNER JOIN production_plan_details prod_plan ON prod_plan.prod_plan_id = br.plan_id
// INNER JOIN order_acceptance oa ON oa.id = prod_plan.oa_id
// INNER JOIN quotation q ON q.qid = oa.qid
// INNER JOIN enquiry_master e ON e.id = q.eid
// INNER JOIN material_master mm ON mm.id = brd.itemid
// INNER JOIN unitmaster u ON u.id = mm.unit
// LEFT JOIN stock s ON s.itemid = brd.itemid
// LEFT JOIN (
//  SELECT i.id AS indent_id, id.itemid, SUM(id.qty) AS qty
//  FROM indent i
//  JOIN indent_details id ON i.id = id.indentid AND i.bomid = ?
//  where i.isTransfer = 0
//  GROUP BY i.id, id.itemid
// ) AS ind ON brd.itemid = ind.itemid
// LEFT JOIN (
//  SELECT itemid, indentid, SUM(qty) AS qty
//  FROM po_details WHERE isTransfer = 0
//  GROUP BY itemid, indentid
// ) AS po ON po.itemid = brd.itemid AND po.indentid = ind.indent_id
// WHERE
//  brd.bomid = ?
// GROUP BY e.uid, brd.id, brd.totqty, mm.id, mm.item_code, mm.material_description, u.unit, s.qty, po.qty
// ORDER BY brd.id, mm.id;



// `;
//   pool.query(q, [req.params.id, req.params.id], (err, data) => {
//     if (err) {
//       return res.json(err);
//     }

//     return res.json(data);
//   });
// });

//<---------------------------------------------------->
//<------------------------add indent--------------------------------------------->
router.post("/addIndent/:uid", (req, res) => {
  const userId = req.params.uid;

  const q3 = "SELECT indentref from indent order by id desc limit 1";

  pool.query(q3, (err, data) => {
    if (err) {
      return res.json(err);
    }

    const q1 = "SELECT id,fname,lname,quot_serial from usermaster where id=?";
    pool.query(q1, [userId], (err, user) => {
      if (err) {
        return res.json(err);
      }

      const number = +(data[0]?.indentref?.split("/")[3] || 0);
      const insertIndentQuery =
        "INSERT INTO indent (bomid, itemid, date, indentref, uid, iscompleted) VALUES (?, ?, ?, ?, ?, ?)";
      const { bomid, item_id, date, uid, iscompleted, dataList } = req.body;

      if (!dataList?.length) {
        return res.status(400).send("Sorry, please select material");
      }

      pool.query(
        insertIndentQuery,
        [
          bomid,
          item_id,
          date,
          getIndentNumber(number + 1, user),
          uid,
          iscompleted,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.json(err);
          }

          const insertDetailsQuery =
            "INSERT INTO indent_details (id, indentid, itemid, qty) VALUES (?, ?, ?, ?)";

          // Create an array of promises for each indent_detail insertion
          const detailPromises = dataList.map(({ id, item_id, qty }) => {
            return new Promise((resolve, reject) => {
              pool.query(
                insertDetailsQuery,
                [id, result.insertId, item_id, qty],
                (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
          });

          // Use Promise.all to wait for all insertions to complete
          Promise.all(detailPromises)
            .then(() => {
              res.send("Updated");
            })
            .catch((err) => {
              console.log(err);
              res.json(err);
            });
        }
      );
    });
  });
});

//<--------------------------------------------------------------------->
//<----------------------------------get bom---------------------------->
// router.get("/getbom", (req, res) => {
//   const q = `SELECT
//     br.id,
//     br.bomref,
//     br.bomtype,
//     br.isissue,
//     pp.wo_no,
//     pp.id AS pp_id,
//     oa.type,
//     oa.testing_div,
//     oa.orderacc_date,
//     ppd.qty,
//     em.id AS enquiry_master_id, -- Include the enquiry_master ID
//     em.custname,
//     em.capacity,
//     em.priratio,
//     em.secratio,
//     em.voltageratio
//   FROM
//     bom_request br
//   INNER JOIN
//     production_plan pp ON pp.id = br.plan_id
//   INNER JOIN
//     production_plan_details ppd ON ppd.prod_plan_id = pp.id
//   INNER JOIN
//     order_acceptance oa ON oa.id = ppd.oa_id
//   INNER JOIN
//     quotation q ON q.qid = oa.qid
//   INNER JOIN
//     enquiry_master em ON em.id = q.eid
//   WHERE
//     pp.wo_no IN (SELECT wo_no FROM production_plan)
//   ORDER BY
//     br.id DESC;
//   `;

//   pool.query(q, (err, data) => {
//     if (err) {

//       return res.json(err);
//     }
//     return res.json( data );
//   });
// });
function executeQueryForId(brBomid, callback) {
  const query = `SELECT
      e.uid,
      brd.id,
      brd.totqty,
      mm.id AS itemid,
      mm.item_code,
      mm.material_description,
      u.unit,
      COALESCE(SUM(ind.qty), 0) AS qty,
      COALESCE(s.qty, 0) AS stock,
      COALESCE(po.qty, 0) AS poqty
    FROM
      bom_request_details brd
    INNER JOIN bom_request br ON br.id = brd.bomid
    INNER JOIN production_plan_details prod_plan ON prod_plan.prod_plan_id = br.plan_id
    INNER JOIN order_acceptance oa ON oa.id = prod_plan.oa_id
    INNER JOIN quotation q ON q.qid = oa.qid
    INNER JOIN enquiry_master e ON e.id = q.eid
    INNER JOIN material_master mm ON mm.id = brd.itemid
    INNER JOIN unitmaster u ON u.id = mm.unit
    LEFT JOIN stock s ON s.itemid = brd.itemid
    LEFT JOIN (
      SELECT i.id AS indent_id, id.itemid, SUM(id.qty) AS qty
      FROM indent i
      JOIN indent_details id ON i.id = id.indentid AND i.bomid = ${pool.escape(
    brBomid
  )}
      GROUP BY i.id, id.itemid
    ) AS ind ON brd.itemid = ind.itemid
    LEFT JOIN (
      SELECT itemid, indentid, SUM(qty) AS qty
      FROM po_details
      GROUP BY itemid, indentid
    ) AS po ON po.itemid = brd.itemid AND po.indentid = ind.indent_id
    WHERE
      brd.bomid = ${pool.escape(brBomid)}
    GROUP BY e.uid, brd.id, brd.totqty, mm.id, mm.item_code, mm.material_description, u.unit, s.qty, po.qty;`;

  pool.query(query, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}
router.get("/getbomrequest", (req, res) => {
  // const q = `SELECT
  //   br.id,
  //   br.bomref,
  //   br.bomtype,
  //   br.isissue,
  //   pp.wo_no,
  //   pp.id AS pp_id,
  //   oa.type,
  //   oa.testing_div,
  //   oa.orderacc_date,
  //   ppd.qty,
  //   em.id AS enquiry_master_id,
  //   em.custname,
  //   em.cid,
  //   em.selectedCosting,
  //   em.capacity,
  //   em.priratio,
  //   em.secratio,
  //   em.voltageratio
  // FROM
  //   bom_request br
  // INNER JOIN
  //   production_plan pp ON pp.id = br.plan_id
  // INNER JOIN
  //   production_plan_details ppd ON ppd.prod_plan_id = pp.id
  // INNER JOIN
  //   order_acceptance oa ON oa.id = ppd.oa_id
  // INNER JOIN
  //   quotation q ON q.qid = oa.qid
  // INNER JOIN
  //   enquiry_master em ON em.id = q.eid
  // WHERE
  //   pp.wo_no IN (SELECT wo_no FROM production_plan)
  // ORDER BY
  //   br.id DESC;`;
  const q = `SELECT
    br.id,
    br.bomref,
    br.bomtype,
    br.isissue,
    pp.wo_no,
    pp.id AS pp_id,
    oa.type,
    oa.testing_div,
    oa.orderacc_date,
    ppd.qty,
    em.id AS enquiry_master_id,
    em.custname,
    em.cid,
    cm.costingname AS selectedCosting,
    em.capacity,
    em.priratio,
    em.secratio,
    em.voltageratio
  FROM
    bom_request br
  INNER JOIN
    production_plan pp ON pp.id = br.plan_id
  INNER JOIN
    production_plan_details ppd ON ppd.prod_plan_id = pp.id
  INNER JOIN
    order_acceptance oa ON oa.id = ppd.oa_id
  INNER JOIN
    quotation q ON q.qid = oa.qid
  INNER JOIN
    enquiry_master em ON em.id = q.eid
  LEFT JOIN
    costing_master cm ON cm.id = em.cid
  WHERE
    pp.wo_no IN (SELECT wo_no FROM production_plan)
  ORDER BY
    br.id DESC;`;
  pool.query(q, (err, bomData) => {
    if (err) {
      return res.json(err);
    }

    // Execute queries for each ID in bomData sequentially
    const results = [];
    let index = 0;

    const executeNextQuery = () => {
      if (index >= bomData.length) {
        // All queries executed, send response
        const combinedData = bomData.map((item) => {
          return {
            ...item,
            result: results.shift() || null,
          };
        });
        return res.json(combinedData);
      }

      const brBomid = bomData[index].id;
      executeQueryForId(brBomid, (err, result) => {
        if (err) {
          return res.json(err);
        }
        results.push(result);
        index++;
        executeNextQuery();
      });
    };

    executeNextQuery();
  });
});
// Execute the first query to fetch BOM data
router.get("/getbom", (req, res) => {
  // const q = `SELECT
  //   br.id,
  //   br.bomref,
  //   br.bomtype,
  //   br.isissue,
  //   pp.wo_no,
  //   pp.id AS pp_id,
  //   oa.type,
  //   oa.testing_div,
  //   oa.orderacc_date,
  //   ppd.qty,
  //   ppd.challan_qty,
  //   ppd.readyqty,
  //   ppd.remainingbomissueqty,
  //   em.id AS enquiry_master_id,
  //   em.cid,
  //   em.selectedCosting,
  //   em.custname,
  //   em.capacity,
  //   em.priratio,
  //   em.secratio,
  //   em.voltageratio
  // FROM
  //   bom_request br
  // INNER JOIN
  //   production_plan pp ON pp.id = br.plan_id
  // INNER JOIN
  //   production_plan_details ppd ON ppd.prod_plan_id = pp.id
  // INNER JOIN
  //   order_acceptance oa ON oa.id = ppd.oa_id
  // INNER JOIN
  //   quotation q ON q.qid = oa.qid
  // INNER JOIN
  //   enquiry_master em ON em.id = q.eid
  // WHERE
  //   pp.wo_no IN (SELECT wo_no FROM production_plan)
  // ORDER BY
  //   br.id DESC;`;
  const q = `SELECT
    br.id,
    br.bomref,
    br.bomtype,
    br.isissue,
    pp.wo_no,
    pp.id AS pp_id,
    oa.type,
    oa.testing_div,
    oa.orderacc_date,
    ppd.qty,
    ppd.challan_qty,
    ppd.readyqty,
    ppd.remainingbomissueqty,
    em.id AS enquiry_master_id,
    em.cid,
    cm.costingname AS selectedCosting,
    em.custname,
    em.capacity,
    em.priratio,
    em.secratio,
    em.voltageratio
  FROM
    bom_request br
  INNER JOIN
    production_plan pp ON pp.id = br.plan_id
  INNER JOIN
    production_plan_details ppd ON ppd.prod_plan_id = pp.id
  INNER JOIN
    order_acceptance oa ON oa.id = ppd.oa_id
  INNER JOIN
    quotation q ON q.qid = oa.qid
  INNER JOIN
    enquiry_master em ON em.id = q.eid
  LEFT JOIN
    costing_master cm ON cm.id = em.cid
  WHERE
    pp.wo_no IN (SELECT wo_no FROM production_plan)
  ORDER BY
    br.id DESC;`;
  pool.query(q, (err, bomData) => {
    if (err) {
      return res.json(err);
    }
    const filteredBomData = bomData.filter((item) => item.bomtype == 1);
    // Execute queries for each ID in bomData sequentially
    const results = [];
    let index = 0;

    const executeNextQuery = () => {
      if (index >= filteredBomData.length) {
        // All queries executed, send response
        const combinedData = filteredBomData.map((item) => {
          return {
            ...item,
            result: results.shift() || null,
          };
        });
        return res.json(combinedData);
      }

      const brBomid = filteredBomData[index].id;
      executeQueryForId(brBomid, (err, result) => {
        if (err) {
          return res.json(err);
        }
        results.push(result);
        index++;
        executeNextQuery();
      });
    };

    executeNextQuery();
  });
});
//<=-=============================---------------------------------------->
//<-------------------------------------get item------------------------------>
router.get("/getitem", (req, res) => {
  const q =
    "select DISTINCT ifnull(material_description,'') from material_master order by material_description ASC";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<--------------------------------------------------------------------------------->
//<----------------------------------get stock------------------------------>
router.get("/getstock", (req, res) => {
  const q =
    "SELECT SQL_CALC_FOUND_ROWS s.id,s.itemid,s.qty,s.date,m.material_description,sm.store_name FROM total_stock s inner join material_master m on m.id=s.itemid left join store_master sm on sm.id=m.store_id limit 7";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<---------------------------------------------------------------->
//<-------------------------get production------------------------->
router.get("/getproduction", (req, res) => {
  //   const q = `SELECT
  //   pp.*,
  //   em.custname,
  //   em.capacity,
  //   em.voltageratio,
  //   em.priratio,
  //   em.cid,
  //   em.uid,
  //   em.secratio,
  //   oa.type,
  //   ppd.qty,
  //   oa.testing_div,
  //   oa.orderacc_date,
  //   em.selectedCosting
  // FROM
  //   production_plan pp
  //   INNER JOIN production_plan_details ppd ON ppd.prod_plan_id = pp.id
  //   INNER JOIN order_acceptance oa ON oa.id = ppd.oa_id
  //   INNER JOIN quotation q ON q.qid = oa.qid
  //   INNER JOIN enquiry_master em ON em.id = q.eid
  //   LEFT JOIN bom_request br ON br.plan_id = pp.id
  // WHERE
  //   br.plan_id IS NULL -- Rows where there is no match in bom_request
  // ORDER BY
  //   pp.id DESC;
  // `;
  const q = `SELECT
  pp.*,
  em.custname,
  em.capacity,
  em.voltageratio,
  em.priratio,
  em.cid,
  em.uid,
  em.secratio,
  oa.type,
  ppd.qty,
  oa.testing_div,
  oa.orderacc_date,
  cm.costingname AS selectedCosting
FROM
  production_plan pp
  INNER JOIN production_plan_details ppd ON ppd.prod_plan_id = pp.id
  INNER JOIN order_acceptance oa ON oa.id = ppd.oa_id
  INNER JOIN quotation q ON q.qid = oa.qid
  INNER JOIN enquiry_master em ON em.id = q.eid
  LEFT JOIN costing_master cm ON cm.id = em.cid
  LEFT JOIN bom_request br ON br.plan_id = pp.id
WHERE
  br.plan_id IS NULL -- Rows where there is no match in bom_request
ORDER BY
  pp.id DESC;
`;
  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<------------------------------------------------------------->
//<---------------------------add to bom=----------------------->
router.post("/addtoBOM/:uid", (req, res) => {
  const userId = req.params.uid;

  if (!req.body?.length) {
    return res.status(400).send("Sorry, please select plans");
  }
  const q3 = "SELECT bomref,id from bom_request order by id desc limit 1";

  pool.query(q3, (err, data) => {
    if (err) {
      return res.json(err);
    }

    const q = "SELECT id,fname,lname,quot_serial from usermaster where id=?";
    pool.query(q, [userId], (err, user) => {
      if (err) {
        return res.json(err);
      }

      const number = +(data[0]?.bomref?.split("/")[3] || 0);

      req.body?.forEach?.(({ plan_id, costing_id }, index) => {
        const q = "insert into bom_request values(?,?,?,?,?,?,?)";
        pool.query(
          q,
          [
            undefined,
            plan_id,
            new Date().toLocaleDateString("en-GB"),
            getBOMNumber(number + index + 1, user),
            costing_id,
            undefined,
            0,
          ],
          (err, result) => {
            if (err) {
            } else {
              if (req.body?.length - 1 === index) {
                return res.send("Updated");
              }
            }
          }
        );
      });
    });
  });
});
//<---------------------------------------------------------->
//<----------------------------update bom-------------------------->

// router.put("/updateBOM", (req, res) => {
//   const { costing_id, bomtype, id, plan_id } = req.body;

//   const storedCostingId = req.body.costing_id;
//   const storedBomType = req.body.bomtype;

//   pool.query(
//     "SELECT COUNT(*) AS count FROM bom_request_details WHERE bomid = ?",
//     [id],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Error checking BOM existence");
//       }

//       const bomExists = result[0].count > 0;

//       pool.query(
//         "UPDATE bom_request SET costing_id=?, bomtype=? WHERE id=?",
//         [storedCostingId, storedBomType, id],
//         (err) => {
//           if (err) {
//             console.log(err);
//             return res.status(500).send("Error updating BOM request");
//           }

//           pool.query(
//             "CALL getdataforbom(?,?)",
//             [costing_id, plan_id],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//                 return res.status(500).send("Error fetching data for BOM");
//               }

//               console.log("Data fetched for BOM:", result[0]);


//               // Use reduce to sequentially process each item
//               result[0]
//                 .reduce((promise, { mid, quantity, oqty }) => {
//                   return promise.then(() => {
//                     const value = (quantity || 0) * (oqty || 0);
//                     if (bomExists) {
//                       return new Promise((resolve, reject) => {
//                         pool.query(
//                           "UPDATE bom_request_details SET itemid = ?, value = ? WHERE bomid = ?",
//                           [mid, value, id],
//                           (err) => {
//                             if (err) {
//                               console.log(err);
//                               return reject(err);
//                             }
//                             resolve();
//                           }
//                         );
//                       });
//                     } else {
//                       return new Promise((resolve, reject) => {
//                         pool.query(
//                           "INSERT INTO bom_request_details (bomid, itemid, totqty, assignqty) VALUES(?,?,?,?)",
//                           [id, mid, value, quantity],
//                           (err) => {
//                             if (err) {
//                               console.log(err);
//                               return reject(err);
//                             }
//                             resolve();
//                           }
//                         );
//                       });
//                     }
//                   });
//                 }, Promise.resolve()) // Start the chain with a resolved promise
//                 .then(() => {
//                   res.send("Updated");
//                 })
//                 .catch((err) => {
//                   console.error(err);
//                   res.status(500).send("Error updating BOM details");
//                 });
//             }
//           );
//         }
//       );
//     }
//   );
// });

// router.put("/updateBOM", (req, res) => {
//   const { costing_id, bomtype, id, plan_id } = req.body;

//   const storedCostingId = costing_id;
//   const storedBomType = bomtype;

//   pool.query(
//     "SELECT COUNT(*) AS count FROM bom_request_details WHERE bomid = ?",
//     [id],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Error checking BOM existence");
//       }

//       const bomExists = result[0].count > 0;

//       pool.query(
//         "UPDATE bom_request SET costing_id=?, bomtype=? WHERE id=?",
//         [storedCostingId, storedBomType, id],
//         (err) => {
//           if (err) {
//             console.log(err);
//             return res.status(500).send("Error updating BOM request");
//           }

//           pool.query(
//             "CALL getdataforbom(?,?)",
//             [costing_id, plan_id],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//                 return res.status(500).send("Error fetching data for BOM");
//               }

//               const bomData = result[0];

//               // Check if ALL mid values are null
//               const allMidNull = bomData.every(row => row.mid == null);
//               if (allMidNull) {
//                 return res
//                   .status(400)
//                   .send("No valid items found (all mid values are null)");
//               }

//               // Use reduce to sequentially process each valid item
//               bomData
//                 .filter(row => row.mid != null) // skip null mids
//                 .reduce((promise, { mid, quantity, oqty }) => {
//                   return promise.then(() => {
//                     const value = (quantity || 0) * (oqty || 0);
//                     if (bomExists) {
//                       return new Promise((resolve, reject) => {
//                         pool.query(
//                           "UPDATE bom_request_details SET itemid = ?, value = ? WHERE bomid = ? AND itemid = ?",
//                           [mid, value, id, mid], // ensures updating correct item
//                           (err) => {
//                             if (err) return reject(err);
//                             resolve();
//                           }
//                         );
//                       });
//                     } else {
//                       return new Promise((resolve, reject) => {
//                         pool.query(
//                           "INSERT INTO bom_request_details (bomid, itemid, totqty, assignqty) VALUES(?,?,?,?)",
//                           [id, mid, value, quantity],
//                           (err) => {
//                             if (err) return reject(err);
//                             resolve();
//                           }
//                         );
//                       });
//                     }
//                   });
//                 }, Promise.resolve())
//                 .then(() => res.send("Updated"))
//                 .catch((err) => {
//                   console.error(err);
//                   res.status(500).send("Error updating BOM details");
//                 });
//             }
//           );
//         }
//       );
//     }
//   );
// });


router.put("/updateBOM", (req, res) => {
  const { costing_id, bomtype, id, plan_id } = req.body;

  const storedCostingId = costing_id;
  const storedBomType = bomtype;

  pool.query(
    "SELECT COUNT(*) AS count FROM bom_request_details WHERE bomid = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error checking BOM existence");
      }
      console.log(result[0]);

      const bomExists = result[0].count > 0;

      pool.query(
        "UPDATE bom_request SET costing_id=?, bomtype=? WHERE id=?",
        [storedCostingId, storedBomType, id],
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error updating BOM request");
          }

          pool.query(
            "CALL getdataforbom(?,?)",
            [costing_id, plan_id],
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).send("Error fetching data for BOM");
              }

              const bomData = result[0];
              console.log(bomData);

              // Check if ALL mid values are null
              const allMidNull = bomData.every(row => row.mid == null);
              if (allMidNull) {
                return res
                  .status(400)
                  .send("No valid items found (all mid values are null)");
              }

              // Group by mid to avoid duplicates and sum quantities
              const groupedData = bomData
                .filter(row => row.mid != null)
                .reduce((acc, { mid, quantity, oqty }) => {
                  if (!acc[mid]) {
                    acc[mid] = { mid, quantity: 0, oqty: 0 };
                  }
                  acc[mid].quantity += (quantity || 0);
                  acc[mid].oqty += (oqty || 0);
                  return acc;
                }, {});

              const uniqueBomData = Object.values(groupedData);

              // If updating, first delete existing records for this bomid
              const processData = bomExists
                ? new Promise((resolve, reject) => {
                  pool.query(
                    "DELETE FROM bom_request_details WHERE bomid = ?",
                    [id],
                    (err) => {
                      if (err) return reject(err);
                      resolve();
                    }
                  );
                })
                : Promise.resolve();

              processData
                .then(() => {
                  // Insert all records
                  return uniqueBomData.reduce((promise, { mid, quantity, oqty }) => {
                    return promise.then(() => {
                      const value = quantity * oqty;
                      return new Promise((resolve, reject) => {
                        pool.query(
                          "INSERT INTO bom_request_details (bomid, itemid, totqty, assignqty) VALUES(?,?,?,?)",
                          [id, mid, value, quantity],
                          (err) => {
                            if (err) return reject(err);
                            resolve();
                          }
                        );
                      });
                    });
                  }, Promise.resolve());
                })
                .then(() => res.send("Updated"))
                .catch((err) => {
                  console.error(err);
                  res.status(500).send("Error updating BOM details");
                });
            }
          );
        }
      );
    }
  );
});


//<--------------------------------------------------------------------->
//<----------------------------------get bom1------------------------------->
router.get("/getbom1", (req, res) => {
  const q =
    "SELECT b.`id`,b. `Sr_No` ,b.`ItemCode`,b.`MaterialName`,b.`Unit`,b.`Quantity`  FROM `bom1` b;";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<------------------------------------------------------------------------->
//<---------------------------------------get oroinvoice details-------------------->
router.get("/getProInvoiceDetails", (req, res) => {
  const q =
    "SELECT  o.id,o.qid,o.orderacc_date,q.quotref,cm.custname, o.ostatus,o.consumer," +
    "o.ref_no,o.testing_div,e.capacity,e.voltageratio," +
    " ifnull(cm.address,''),ifnull(o.consumer_address,''),ifnull(o.testing_div,''),ifnull(d.division,'') " +
    " ,o.type,o.quantity,o.advance,q.cost,(select cgst from quot_taxes where qid=q.qid),(select sgst from quot_taxes where qid=q.qid)" +
    "FROM order_acceptance o left join test_division d on d.id=o.testing_div " +
    "inner join quotation q on q.qid=o.qid inner join enquiry_master e on e.id=q.eid " +
    "inner join customer_master cm on cm.id=e.cid inner join production_plan_details pp on pp.oa_id=o.id order by id desc limit 1";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<---------------------------------------------------------------------------------------->
//<------------------------------------get proinvoice------------------------>
router.get("/getProinvoice", (req, res) => {
  const q =
    "SELECT SQL_CALC_FOUND_ROWS o.id,o.qid,o.orderacc_date,q.quotref,cm.custname,o.ostatus,ifnull(o.consumer,''), " +
    "ifnull(o.ref_no,''),ifnull(o.testing_div,''),ifnull(e.capacity,''),ifnull(e.voltageratio,''), " +
    " ifnull(cm.address,''),ifnull(o.consumer_address,''),ifnull(o.testing_div,''),ifnull(d.division,'') " +
    " ,ifnull(o.type,'') ,ifnull(o.quantity,'') ,ifnull(o.advance,'') ,ifnull(q.cost,''),(select cgst from quot_taxes where qid=q.qid),(select sgst from quot_taxes where qid=q.qid)" +
    "FROM order_acceptance o left join test_division d on d.id=o.testing_div " +
    "inner join quotation q on q.qid=o.qid inner join enquiry_master e on e.id=q.eid " +
    "inner join customer_master cm on cm.id=e.cid inner join production_plan_details pp on pp.oa_id=o.id where o.id=2  and pp.prod_plan_id =1 ";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//>-------------------------------------------------------------------------------------------->
//<-------------------------------get challan----------------------------------->
// router.get("/getchallan", (req, res) => {
//   const q =
// `  SELECT  id, challan_no, chdate, custname, buyer_address, deliver_at, delivery_address, po_no, po_date, vehicle,costing_id FROM challans ORDER BY id DESC  ;`

//   pool.query(q, (err, data) => {
//     if (err) {

//       return res.json(err);
//     }

//     return res.json(data);
//   });
// });
// router.get("/getchallanlist", (req, res) => {
//   const q = `SELECT 
//     c.id,
//     c.challan_no,
//     c.chdate,
//     c.custname,
//     c.buyer_address,
//     c.deliver_at,
//     c.delivery_address,
//     c.po_no,
//     c.po_date,
//     c.vehicle,
//     c.costing_id,
//     d.qty AS challan_qty,
//     d.remainingqty,
//     pp.wo_no,
//     oa.ref_no,
//     COALESCE(SUM(idt.qty), 0) AS invoice_qty
// FROM 
//     challans c
// LEFT JOIN 
//     challan_details d ON c.id = d.challan_id
// LEFT JOIN 
//     invoices i ON c.id = i.challan_id
// LEFT JOIN 
//     invoice_details idt ON i.id = idt.invoice_id
// LEFT JOIN 
//     production_plan pp ON pp.id = d.plan_id
// LEFT JOIN 
//     production_plan_details ppd ON ppd.prod_plan_id = d.plan_id
// LEFT JOIN 
//     order_acceptance oa ON oa.id = ppd.oa_id
// GROUP BY 
//     c.id, c.challan_no, c.chdate, c.custname, c.buyer_address, 
//     c.deliver_at, c.delivery_address, c.po_no, c.po_date, c.vehicle, 
//     c.costing_id, d.qty, d.remainingqty, pp.wo_no, oa.ref_no
// ORDER BY 
//     c.id DESC;
// `;

//   pool.query(q, (err, data) => {
//     if (err) {
//       console.error("Database query error: ", err);
//       return res.json(err);
//     }
//     return res.json(data);
//   });
// });

router.get("/getchallanlist", (req, res) => {
  const q = `
    SELECT 
        c.id,
        c.challan_no,
        c.chdate,
        c.custname,
        c.buyer_address,
        c.deliver_at,
        c.delivery_address,
        c.po_no,
        c.po_date,
        c.vehicle,
        c.costing_id,
        d.qty AS challan_qty,
        d.remainingqty,
        pp.wo_no,
        oa.ref_no,
        oa.consumer,            -- ✅ Added field
        oa.consumer_address,    -- ✅ Added field
        COALESCE(SUM(idt.qty), 0) AS invoice_qty
    FROM 
        challans c
    LEFT JOIN 
        challan_details d ON c.id = d.challan_id
    LEFT JOIN 
        invoices i ON c.id = i.challan_id
    LEFT JOIN 
        invoice_details idt ON i.id = idt.invoice_id
    LEFT JOIN 
        production_plan pp ON pp.id = d.plan_id
    LEFT JOIN 
        production_plan_details ppd ON ppd.prod_plan_id = d.plan_id
    LEFT JOIN 
        order_acceptance oa 
        ON oa.id = c.orderacceptance_id  -- ✅ Direct join using challans.orderacceptance_id
    GROUP BY 
        c.id, c.challan_no, c.chdate, c.custname, c.buyer_address, 
        c.deliver_at, c.delivery_address, c.po_no, c.po_date, c.vehicle, 
        c.costing_id, d.qty, d.remainingqty, pp.wo_no, 
        oa.ref_no, oa.consumer, oa.consumer_address
    ORDER BY 
        c.id DESC;
  `;

  pool.query(q, (err, data) => {
    if (err) {
      console.error("Database query error: ", err);
      return res.json(err);
    }
    return res.json(data);
  });
});


router.get("/getchallan", (req, res) => {
  const q = `
    SELECT
        c.id,
        c.challan_no,
        c.chdate,
        c.custname,
        c.buyer_address,
        c.deliver_at,
        c.delivery_address,
        c.po_no,
        c.po_date,
        c.vehicle,
        c.costing_id,
        d.qty,
        oa.consumer
    FROM
        challans c
    LEFT JOIN
        challan_details d ON c.id = d.challan_id
    LEFT JOIN
        order_acceptance oa ON c.costing_id = oa.qid
    WHERE
        NOT EXISTS (
            SELECT 1 FROM invoices i WHERE i.challan_id = c.id
        )
    ORDER BY
        c.id DESC;
  `;

  pool.query(q, (err, data) => {
    if (err) {
      console.error("Database query error: ", err);
      return res.json(err);
    }
    return res.json(data);
  });
});

//<-------------------------------------------------------------->
//<------------------------------------delete challan--------------------------->
// router.delete("/deleteChallan/:id", (req, res) => {
//   const id = req.params.id;

//   // Step 1: Check if challan_id exists in the invoice table
//   const checkInvoiceQuery = `SELECT 1 FROM invoices WHERE challan_id = ? LIMIT 1`;

//   pool.query(checkInvoiceQuery, [id], (err, invoiceRows) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     console.log("invoiceRows", invoiceRows);

//     if (invoiceRows.length > 0) {
//       return res.status(400).json({
//         message: "Challan cannot be deleted as it exists in the invoice table",
//       });
//     }

//     // Step 2: Fetch the plan_id and qty from challan_details
//     const fetchQuery = `SELECT plan_id, qty FROM challan_details WHERE challan_id = ?`;

//     pool.query(fetchQuery, [id], (err, rows) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }

//       if (rows.length === 0) {
//         return res.status(404).json({ message: "Challan not found" });
//       }

//       const { plan_id, qty } = rows[0];
//       console.log(qty, "hhhhhhhhggggggggggg");
//       // Step 3: Update production_plan_details
//       const updateQueries = rows.map((row) => {
//         return new Promise((resolve, reject) => {
//           const updateQuery = `UPDATE production_plan_details
//                                SET readyqty = readyqty + ?, 
//                                    challan_qty = GREATEST(challan_qty - ?, 0)
//                                WHERE prod_plan_id = ?`;

//           pool.query(
//             updateQuery,
//             [parseInt(qty), parseInt(qty), plan_id],
//             (updateErr) => {
//               if (updateErr) {
//                 reject(updateErr);
//               } else {
//                 resolve();
//               }
//             }
//           );
//         });
//       });

//       // Execute all update queries in parallel
//       Promise.all(updateQueries)
//         .then(() => {
//           // Step 4: Delete from challan_details and challans
//           const deleteQuery = `DELETE cd, c
//                                FROM challan_details AS cd
//                                JOIN challans AS c ON cd.challan_id = c.id
//                                WHERE c.id = ?`;

//           pool.query(deleteQuery, [id], (deleteErr, data) => {
//             if (deleteErr) {
//               return res.status(500).json({ error: deleteErr.message });
//             }

//             return res.json({ message: "Challan deleted successfully", data });
//           });
//         })
//         .catch((updateErr) => {
//           return res.status(500).json({ error: updateErr.message });
//         });
//     });
//   });
// });
router.delete("/deleteChallan/:id", (req, res) => {
  const id = req.params.id;

  pool.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: "Database connection failed" });

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Failed to start transaction" });
      }

      // Step 1: Check if challan exists in invoices
      const checkInvoiceQuery = `SELECT 1 FROM invoices WHERE challan_id = ? LIMIT 1`;
      connection.query(checkInvoiceQuery, [id], (err, invoiceRows) => {
        if (err) {
          connection.rollback(() => connection.release());
          return res.status(500).json({ error: err.message });
        }

        if (invoiceRows.length > 0) {
          connection.rollback(() => connection.release());
          return res.status(400).json({
            message: "Challan cannot be deleted as it exists in the invoice table",
          });
        }

        // Step 2: Fetch plan_id and qty before deleting
        const fetchQuery = `SELECT plan_id, qty FROM challan_details WHERE challan_id = ?`;
        connection.query(fetchQuery, [id], (err, challanRows) => {
          if (err) {
            connection.rollback(() => connection.release());
            return res.status(500).json({ error: err.message });
          }

          if (challanRows.length === 0) {
            connection.rollback(() => connection.release());
            return res.status(404).json({ message: "Challan not found" });
          }

          // Step 3: Delete challan + challan_details first
          const deleteQuery = `
            DELETE cd, c
            FROM challan_details AS cd
            JOIN challans AS c ON cd.challan_id = c.id
            WHERE c.id = ?
          `;

          connection.query(deleteQuery, [id], (err) => {
            if (err) {
              connection.rollback(() => connection.release());
              return res.status(500).json({ error: "Error deleting challan" });
            }

            // Step 4: After successful delete, update production_plan_details
            const updatePromises = challanRows.map((row) => {
              return new Promise((resolve, reject) => {
                const updateQuery = `
                  UPDATE production_plan_details
                  SET readyqty = readyqty + ?, 
                      challan_qty = GREATEST(challan_qty - ?, 0)
                  WHERE prod_plan_id = ?
                `;
                connection.query(
                  updateQuery,
                  [parseInt(row.qty), parseInt(row.qty), row.plan_id],
                  (err) => (err ? reject(err) : resolve())
                );
              });
            });

            Promise.all(updatePromises)
              .then(() => {
                connection.commit((err) => {
                  if (err) {
                    connection.rollback(() => connection.release());
                    return res.status(500).json({ error: "Transaction commit failed" });
                  }

                  connection.release();
                  res.json({ message: "Challan deleted and plan updated successfully" });
                });
              })
              .catch((err) => {
                connection.rollback(() => connection.release());
                res.status(500).json({ error: "Error updating production_plan_details", details: err.message });
              });
          });
        });
      });
    });
  });
});

//<----------------------------------------------------------------------------->
//<-----------------------------------edit challan---------------------------->
router.get("/editChallan/:id", (req, res) => {
  const q =
    "SELECT SQL_CALC_FOUND_ROWS c.id, c.challan_no, c.chdate, c.buyer_id, c.buyer_address, c.deliver_at, c.delivery_address, c.po_no, c.po_date,cm.custname, c.vehicle,c.costing_id FROM challans c " +
    "inner join customer_master cm on cm.id=c.buyer_id where  c.id =?";

  const id = req.params.id;

  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});
//<-------------------------------------------------------------------->
//<-------------------------------update challan---------------------------->
router.put("/updateChallan/:id", (req, res) => {
  const q =
    "UPDATE challans c " +
    "JOIN challan_details cd ON c.challan_no = cd.challan_id " +
    "SET " +
    "c.challan_no = ?, c.chdate = ?, c.custname = ?, c.buyer_address = ?, c.deliver_at = ?, c.delivery_address = ?, c.po_no = ?, c.po_date = ?, c.vehicle = ?,c.modeoftransport= ?, " +
    "cd.capacity = ?, cd.desc = ?, cd.qty = ? " +
    "WHERE c.id = ?";

  pool.query(
    q,
    [
      req.body.challan_no,
      req.body.chdate,
      req.body.custname,
      req.body.buyer_address,
      req.body.deliver_at,
      req.body.delivery_address,
      req.body.po_no,
      req.body.po_date,
      req.body.vehicle,
      req.body.modeoftransport,
      req.body.capacity,
      req.body.desc,
      req.body.qty,

      req.params.id,
    ],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to update data" });
      } else {
        return res.json({ message: "Challan updated successfully" });
      }
    }
  );
});

//<------------------------------------------------------------------------>
//<-------------------------------get challan1------------------------>

router.get("/editChallan1/:id", (req, res) => {
  const id = req.params.id;
  const q = `
    SELECT 
      c.challan_no,
      c.chdate,
      c.buyer_address,
      c.deliver_at,
      c.delivery_address,
      c.po_no,
      c.po_date,
      c.vehicle,
      c.custname,
      c.modeoftransport,
      cd.capacity,
      cd.desc,
      cd.qty
    FROM challans c
    JOIN challan_details cd ON c.id = cd.challan_id
    WHERE c.id = ?;
  `;

  pool.query(q, [id], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while executing the query." });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Challan not found" });
    }

    return res.json(rows[0]);
  });
});

//<----------------------------------------------------------->
//<-------------------------------- add quotation----------------------------->
router.get("/getaddQuoattion", (req, res) => {
  const q =
    "SELECT DISTINCT `id`, `edate`,`custname`,`contactperson`,`contactno`,`capacity`, `voltageratio`, `enqstatus` FROM `enquiry_master` order by id desc limit 5;";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});

//<------------------------------------------------------------------------------------>
//<----------------------------------get quotation by id------------------->
router.get("/getQuotationById", (req, res) => {
  const q =
    "SELECT q.`qid`,q.`eid`,q.`quotref`,q.`qdate`,q.`cost`,q.`deliveryperiod`,q.`guranteeperiod`, " +
    "q.`validityofquote`,q.`taxes`,q.`termscondition` ,cm.custname,e.`edate`,e.`comment`,e.`capacity`, " +
    "q.`status`,cm.`address`,cm.`cperson`,e.`type`,e.`matofwind`,e.`typecolling`,e.`vectorgroup`, " +
    "e.`hvvoltage`,e.`lvvoltage`,e.`typetaping`,q.`rversion`,e.`core`,e.`voltageratio`,q.transport,q.unloading, qt.cgst, qt.cgsttype, " +
    "qt.sgst,qt.sgsttype,q.qty from quotation q inner join enquiry_master e on q.eid=e.id inner join customer_master cm on cm.id=e.cid left join quot_taxes qt " +
    "on qt.qid=q.qid order by q.qid desc limit 6";
  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<---------------------------------------------------------------------->
//<--------------------------------get capacitylist----------------------->
// router.get("/getCapacityList/:custname", (req, res) => {
//   const custname = req.params.custname;

//   const q = `SELECT em.id, em.capacity, em.address,em.priratio,em.voltageratio,em.typecolling,em.lvvoltage,hvvoltage, em.secratio, q.cost,oa.consumer_address, oa.type, oa.basicrate,oa.ponum,oa.podate,ppd.prod_plan_id, ppd.oa_id,ppd.readyqty, em.cid
//   FROM enquiry_master em
//   INNER JOIN quotation q ON q.eid = em.id
//   INNER JOIN order_acceptance oa ON oa.qid = q.qid
//   INNER JOIN production_plan_details ppd ON ppd.oa_id = oa.id
//   WHERE em.custname = ?`;

//   pool.query(q, [custname], (err, data) => {

//     if (err) {

//       return res.json(err);
//     }

//     if (data.length === 0) {

//       return res.json({ message: 'No costing related to this name' });
//     }
//     return res.json(data);
//   });
// });
router.post("/getCapacityList", (req, res) => {
  const custname = req.body.custname;
  console.log("custname", custname);
  // const q = `
  //   SELECT 
  //     em.id, 
  //     em.capacity, 
  //     em.address,
  //     em.priratio,
  //     em.voltageratio,
  //     em.typecolling,
  //     em.lvvoltage,
  //     em.hvvoltage,
  //     em.secratio, 
  //     em.selectedcosting,
  //     q.cost,
  //     oa.consumer,
  //     oa.consumer_address, 
  //     oa.type, 
  //     oa.basicrate,
  //     oa.ponum,
  //     oa.podate,
  //     ppd.prod_plan_id, 
  //     ppd.oa_id,
  //     ppd.readyqty, 
  //     em.cid
  //   FROM enquiry_master em
  //   INNER JOIN quotation q ON q.eid = em.id
  //   INNER JOIN order_acceptance oa ON oa.qid = q.qid
  //   INNER JOIN production_plan_details ppd ON ppd.oa_id = oa.id
  //   WHERE em.custname = ? AND ppd.bomissued IS NOT NULL  AND ppd.readyqty <> 0 ;
  // `;
  const q = `
    SELECT 
      em.id, 
      em.capacity, 
      em.address,
      em.priratio,
      em.voltageratio,
      em.typecolling,
      em.lvvoltage,
      em.hvvoltage,
      em.secratio, 
      cm.costingname AS selectedcosting,
      q.cost,
      oa.consumer,
      oa.consumer_address, 
      oa.type, 
      oa.basicrate,
      oa.ponum,
      oa.podate,
      ppd.prod_plan_id, 
      ppd.oa_id,
      ppd.readyqty, 
      em.cid
    FROM enquiry_master em
    INNER JOIN quotation q ON q.eid = em.id
    INNER JOIN order_acceptance oa ON oa.qid = q.qid
    INNER JOIN production_plan_details ppd ON ppd.oa_id = oa.id
    LEFT JOIN costing_master cm ON cm.id = em.cid
    WHERE em.custname = ? AND ppd.bomissued IS NOT NULL  AND ppd.readyqty <> 0 ;
  `;
  pool.query(q, [custname], (err, data) => {
    if (err) {
      return res.json(err);
    }

    if (data.length === 0) {
      return res.json({ message: "No costing related to this name" });
    }

    return res.json(data);
  });
});


router.get("/getCapacityLists/:custname", (req, res) => {
  const custname = req.params.custname;

  // const q = `
  //   SELECT 
  //     em.id, 
  //     em.capacity, 
  //     em.address,
  //     em.priratio,
  //     em.voltageratio,
  //     em.typecolling,
  //     em.lvvoltage,
  //     em.hvvoltage,
  //     em.secratio, 
  //     em.selectedcosting,
  //     q.cost,
  //     oa.consumer,
  //     oa.consumer_address, 
  //     oa.type, 
  //     oa.basicrate,
  //     oa.ponum,
  //     oa.podate,
  //     ppd.prod_plan_id, 
  //     ppd.oa_id,
  //     ppd.readyqty, 
  //     em.cid
  //   FROM enquiry_master em
  //   INNER JOIN quotation q ON q.eid = em.id
  //   INNER JOIN order_acceptance oa ON oa.qid = q.qid
  //   INNER JOIN production_plan_details ppd ON ppd.oa_id = oa.id
  //   WHERE em.custname = ? AND ppd.bomissued IS NOT NULL  ;
  // `;
  const q = `
    SELECT 
      em.id, 
      em.capacity, 
      em.address,
      em.priratio,
      em.voltageratio,
      em.typecolling,
      em.lvvoltage,
      em.hvvoltage,
      em.secratio, 
      cm.costingname AS selectedcosting,
      q.cost,
      oa.consumer,
      oa.consumer_address, 
      oa.type, 
      oa.basicrate,
      oa.ponum,
      oa.podate,
      ppd.prod_plan_id, 
      ppd.oa_id,
      ppd.readyqty, 
      em.cid
    FROM enquiry_master em
    INNER JOIN quotation q ON q.eid = em.id
    INNER JOIN order_acceptance oa ON oa.qid = q.qid
    INNER JOIN production_plan_details ppd ON ppd.oa_id = oa.id
    LEFT JOIN costing_master cm ON cm.id = em.cid
    WHERE em.custname = ? AND ppd.bomissued IS NOT NULL  ;
  `;
  pool.query(q, [custname], (err, data) => {
    if (err) {
      return res.json(err);
    }

    if (data.length === 0) {
      return res.json({ message: "No costing related to this name" });
    }

    return res.json(data);
  });
});

//<------------------------------------------------------------------->
//<----------------------------autocustmoner------------------------------>
// router.get("/autoCustomer/:name", (req, res) => {
//   const name = req.params.name;

//   const q = `SELECT id,capacity,type,hvvoltage,lvvoltage,typecolling,voltageratio,custname FROM enquiry_master WHERE custname LIKE '%${name}%'`;
//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }
//     return res.json(data);
//   });
// });

// router.get("/autoCustomer/:name", (req, res) => {
//   const name = decodeURIComponent(req.params.name);

//   // Use parameterized query to prevent SQL injection
//   const q = `SELECT id,capacity,type,hvvoltage,lvvoltage,typecolling,voltageratio,custname FROM enquiry_master WHERE custname LIKE ?`;

//   pool.query(q, [`%${name}%`], (err, data) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     return res.json(data);
//   });
// });



router.post("/autoCustomer", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Customer name is required" });
  }

  // Use parameterized query to prevent SQL injection
  const q = `SELECT id, capacity, type, hvvoltage, lvvoltage, typecolling, voltageratio, custname 
             FROM enquiry_master 
             WHERE custname LIKE ?`;

  pool.query(q, [`%${name}%`], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
    return res.json(data);
  });
});

router.get("/autoCustomerforenquery/:name", (req, res) => {
  const name = req.params.name;

  const q = `SELECT id,custname,address,desg,contactno,altcontactno,email,gstno,cperson FROM customer_master WHERE custname LIKE '%${name}%'`;
  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    console.log(data, "bbbbbbbbbbbbbbbb");
    return res.json(data);
  });
});
//<----------------------------------------------------------------->
//<---------------------------company profile------------------------>
router.get("/CompProfile", (req, res) => {
  const q =
    "SELECT name,contact,email,telefax,website,address,accholdername,accno,branch,ifsccode,isoline from com_profile where id=1";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<------------------------------------------------------------------------------------------------>
//<--------------------------challan------------------------------->

// router.post("/challan", (req, res) => {
//   console.log("hiii",req.body)
//   const {
//     detailList,
//     id,
//     challan_no,
//     chdate,
//     custname,
//     buyer_address,
//     deliver_at,
//     delivery_address,
//     po_no,
//     po_date,
//     costing_id,
//     uid,
//     vehicle,
//     orderacceptance_id,
//     modeoftransport
//   } = req.body;

//   if (!detailList?.length) {
//     return res.status(400).send("Sorry, please select capacity");
//   }

//   pool.query("SELECT MAX(challan_no) AS max_challan_no FROM challans", (err, rows) => {
//     if (err) {

//     } else {
//       const maxChallanNo = parseInt(rows[0].max_challan_no, 10) || 0; // Convert to integer
//       const newChallanNo = maxChallanNo + 1;

//       const data = req.body;
//       data.challan_no = newChallanNo;

//       pool.query("SELECT MAX(id) AS max_id FROM challans", (err, rows) => {
//         if (err) {

//         } else {
//           const maxId1 = rows[0].max_id || 0;
//           const newId1 = maxId1 + 1;

//           data.costing_id = data.detailList[0].costing_id;

//           pool.query(
//             "insert into challans values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//             [
//               newId1,
//               data.challan_no,
//               data.chdate,
//               data.buyer_id,
//               data.buyer_address,
//               data.deliver_at,
//               data.delivery_address,
//               data.po_no,
//               data.po_date,
//               data.costing_id,
//               data.uid,
//               data.vehicle || null,
//               data.orderacceptance_id,
//               data.buyer.custname,
//               modeoftransport
//             ],
//             (err, result) => {
//               if (err) {

//               } else {
//                 data.detailList.forEach(({ plan_id, capacity, desc, qty, rate, amt }, index) => {

//                   pool.query("SELECT MAX(id) AS max_id FROM challan_details", (err, rows) => {
//                     if (err) {

//                     } else {
//                       const maxId = rows[0].max_id || 0;
//                       const newId = maxId + 1;

//                       pool.query(
//                         "insert into challan_details values(?,?,?,?,?,?,?,?)",
//                         [
//                           newId,
//                           result.insertId,
//                           plan_id,
//                           capacity,
//                           desc,
//                           qty,
//                           rate,
//                           amt
//                         ],
//                         (err, result) => {
//                           if (err) {
//                             return res.status(500).json({ error: "Internal server error" });
//                           } else if (data.detailList.length - 1 === index) {
//                             return  res.send("POSTED");
//                           }
//                         }
//                       );
//                     }
//                   });
//                 });
//               }
//             }
//           );
//         }
//       });
//     }
//   });
// });
router.post("/challan", (req, res) => {
  const {
    detailList,
    id,
    challan_no,
    chdate,
    custname,
    buyer_address,
    deliver_at,
    delivery_address,
    po_no,
    po_date,
    costing_id,
    uid,
    vehicle,
    orderacceptance_id,
    modeoftransport,
    buyer_id,
  } = req.body;

  if (!buyer_id) {
    return res.status(400).send("Buyer ID is required");
  }
  if (!detailList?.length) {
    return res.status(400).send("Sorry, please select capacity");
  }
  pool.query(
    `SELECT id, fname, lname, quot_serial FROM usermaster WHERE id=${uid}`,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }

      pool.query("SELECT MAX(id) AS max_id FROM challans", (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal server error" });
        }

        const maxChallanNo = parseInt(rows[0].max_id, 10) || 0;
        const newChallanNo = maxChallanNo + 1;
        const challanno = getChallanNumber(newChallanNo, user);

        const data = req.body;
        data.challan_no = challanno;

        pool.query("SELECT MAX(id) AS max_id FROM challans", (err, rows) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
          }

          const maxId1 = rows[0].max_id || 0;
          const newId1 = maxId1 + 1;

          data.costing_id = data.detailList[0].costing_id;

          pool.query(
            "INSERT INTO challans VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              newId1,
              data.challan_no,
              data.chdate,
              data.buyer_id,
              data.buyer_address,
              data.deliver_at,
              data.delivery_address,
              data.po_no,
              data.po_date,
              data.costing_id,
              data.uid,
              data.vehicle ? data.vehicle.trim() : null,
              data.orderacceptance_id,
              data.buyer.custname,
              modeoftransport,
            ],
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
              }

              // Handle inserting data into challan_details
              let detailsProcessed = 0;
              data.detailList.forEach(
                ({ plan_id, capacity, desc, qty, rate, amt }, index) => {
                  pool.query(
                    "SELECT MAX(id) AS max_id FROM challan_details",
                    (err, rows) => {
                      if (err) {
                        console.log(err);
                        return res
                          .status(500)
                          .json({ error: "Internal server error" });
                      }

                      const maxId = rows[0].max_id || 0;
                      const newId = maxId + 1;

                      pool.query(
                        "INSERT INTO challan_details VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
                        [
                          newId,
                          result.insertId,
                          plan_id,
                          capacity,
                          desc,
                          qty,
                          rate,
                          amt,
                          qty,
                        ],
                        (err) => {
                          if (err) {
                            console.log(err);
                            return res
                              .status(500)
                              .json({ error: "Internal server error" });
                          }

                          detailsProcessed++;
                          if (detailsProcessed === data.detailList.length) {
                            // Now update the production_plan_details
                            data.detailList.forEach(({ plan_id, qty }) => {
                              const updateQuery = `
                        UPDATE production_plan_details
                        SET readyqty = readyqty - ?,
                         challan_qty = challan_qty + ?
                        WHERE prod_plan_id = ?;
                      `;

                              pool.query(
                                updateQuery,
                                [parseInt(qty), parseInt(qty), plan_id],
                                (err) => {
                                  if (err) {
                                    console.log(err);
                                    console.error("Update error:", err);
                                    return res
                                      .status(500)
                                      .json({ error: "Internal server error" });
                                  }
                                }
                              );
                            });

                            return res.send("POSTED");
                          }
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });
      });
    }
  );
});

router.get("/fetchChallanPrint/:id", (req, res) => {
  const id = req.params.id;

  const q = `SELECT c.*, cd.*, 
    o.consumer AS delivary_at_name, 
    o.consumer_address,
    o.OAcomment,
    (SELECT voltageratio FROM enquiry_master WHERE cid = c.costing_id LIMIT 1) AS voltageratio,
    (SELECT capacity FROM enquiry_master WHERE cid = c.costing_id LIMIT 1) AS capacity,
    (SELECT hvvoltage FROM enquiry_master WHERE cid = c.costing_id LIMIT 1) AS hvvoltage,
    (SELECT type FROM enquiry_master WHERE cid = c.costing_id LIMIT 1) AS type
  FROM challans AS c
  LEFT JOIN challan_details AS cd ON c.id = cd.challan_id
  LEFT JOIN production_plan_details p ON p.prod_plan_id = cd.plan_id
  LEFT JOIN order_acceptance o ON o.id = p.oa_id
  WHERE c.id = ?;`;

  pool.query(q, [id], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log("kkkkkkkkkkkkkkkkkkkkkkk", data);

    return res.json(data);
  });
});
//<-------------------------------------------------------->
// router.get("/fetchChallanPrint/:id", (req, res) => {
//   const id = req.params.id;

//   // const q = `SELECT c.*, em.*, cd.*,o.consumer AS delivary_at_name, o.consumer_address,em.custname,em.address
//   // FROM challans AS c
//   // LEFT JOIN enquiry_master AS em ON c.costing_id = em.cid
//   // LEFT JOIN challan_details AS cd ON c.id = cd.challan_id
//   // LEFT JOIN production_plan_details p ON p.prod_plan_id = cd.plan_id
//   // LEFT JOIN order_acceptance o ON o.id = p.oa_id
//   //  WHERE c.id = ?;`;


//   // const q = `SELECT c.*, cd.*, o.consumer AS delivary_at_name, o.consumer_address
//   // FROM challans AS c
//   // LEFT JOIN challan_details AS cd ON c.id = cd.challan_id
//   // LEFT JOIN production_plan_details p ON p.prod_plan_id = cd.plan_id
//   // LEFT JOIN order_acceptance o ON o.id = p.oa_id
//   // WHERE c.id = ?;`;

//   pool.query(q, [id], (err, data) => {
//     if (err) {
//       console.log(err);
//       return res.json(err);
//     }
//     console.log("kkkkkkkkkkkkkkkkkkkkkkk",data);

//     return res.json(data);
//   });
// });

// router.get("/fetchChallanPrint/:id", (req, res) => {
//   const id = req.params.id;

//   const q = `SELECT c.*, cd.*, 
//     o.consumer AS delivary_at_name, 
//     o.consumer_address,
//     (SELECT voltageratio FROM enquiry_master WHERE cid = c.costing_id LIMIT 1) AS voltageratio,
//     (SELECT capacity FROM enquiry_master WHERE cid = c.costing_id LIMIT 1) AS capacity,
//     (SELECT hvvoltage FROM enquiry_master WHERE cid = c.costing_id LIMIT 1) AS hvvoltage
//   FROM challans AS c
//   LEFT JOIN challan_details AS cd ON c.id = cd.challan_id
//   LEFT JOIN production_plan_details p ON p.prod_plan_id = cd.plan_id
//   LEFT JOIN order_acceptance o ON o.id = p.oa_id
//   WHERE c.id = ?;`;

//   pool.query(q, [id], (err, data) => {
//     if (err) {
//       console.log(err);
//       return res.json(err);
//     }
//     console.log("kkkkkkkkkkkkkkkkkkkkkkk", data);

//     return res.json(data);
//   });
// });

router.get("/fetchinvoicePrint/:id", (req, res) => {
  const id = req.params.id;

  const q = `SELECT 
    inv.*, 
    inv.advance AS inv_advance,
    inv_det.*,
    inv_det.qty AS inv_det_qty,
    inv.customeraddress AS invcustaddress,
    ch.*, 
    oa.*, 
    qt.*, 
    em.*,
    oa.gstno, 
    qt_tax.cgst AS quotation_cgst,
    qt_tax.sgst AS quotation_sgst,
    (
      SELECT IFNULL(SUM(amount), 0) FROM payments WHERE oid = oa.id
    ) AS paid_amount
  FROM invoices AS inv
  LEFT JOIN invoice_details AS inv_det ON inv.id = inv_det.invoice_id
  LEFT JOIN challans AS ch ON inv.challan_id = ch.id
  LEFT JOIN order_acceptance AS oa ON ch.orderacceptance_id = oa.id
  LEFT JOIN quotation AS qt ON oa.qid = qt.qid
  LEFT JOIN enquiry_master AS em ON qt.eid = em.id
  LEFT JOIN quot_taxes AS qt_tax ON qt.qid = qt_tax.qid
  WHERE inv.id = ?;`;

  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});
//<------------------------------getchallandetails----------------------->
// router.get("/getChallanDetail/:id", (req, res) => {
//   const id = req.params.id;
//   const q = `
//    SELECT 
//     c.*, 
//     cd.*, 
//     em.custname AS buyername, 
//     em.address AS buyeraddress,
//     qt.cgst AS tax_cgst,
//     qt.sgst AS tax_sgst,
//     qt.cgsttype AS tax_cgsttype,
//     qt.sgsttype AS tax_sgsttype,
// oa.advance,
// oa.remainingadvance,
// oa.id AS oa_id,
//  oa.gstNo 
// FROM 
//     challans c
// LEFT JOIN 
//     challan_details cd ON c.id = cd.challan_id
// LEFT JOIN 
//     costing_master cm ON c.costing_id = cm.id
// LEFT JOIN 
//     enquiry_master em ON cm.eid = em.id
// LEFT JOIN 
//     quotation q ON em.id = q.eid
// LEFT JOIN 
//  order_acceptance  oa ON  q.qid=oa.qid
// LEFT JOIN 
//     quot_taxes qt ON q.qid = qt.qid
// WHERE 
//     c.id = ?;

//   `;

//   pool.query(q, [id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Challan not found" });
//     }

//     return res.json(results[0]);
//   });
// });

// router.get("/getChallanDetail/:id", (req, res) => {
//   const id = req.params.id;
//   const q = `
//   SELECT 
//     c.id,
//     c.challan_no,
//     c.chdate,
//     c.buyer_id,
//     c.buyer_address,
//     c.deliver_at,
//     c.delivery_address,
//     c.po_no,
//     c.po_date,
//     c.costing_id,
//     c.uid,
//     c.vehicle,
//     c.orderacceptance_id,
//     c.custname,
//     c.modeoftransport,
//     cd.id AS detail_id,
//     cd.challan_id,
//     cd.plan_id,
//     cd.capacity,
//     cd.desc,
//     cd.qty,
//     cd.rate,
//     cd.amt,
//     cd.remainingqty,
//     em.custname AS buyername,
//     em.address AS buyeraddress,
//     oa.advance,
//     oa.remainingadvance,
//     oa.id AS oa_id,
//     oa.gstNo,
//     qt.cgst AS tax_cgst,
//     qt.sgst AS tax_sgst,
//     qt.cgsttype AS tax_cgsttype,
//     qt.sgsttype AS tax_sgsttype
// FROM 
//     challans c
// LEFT JOIN 
//     challan_details cd ON c.id = cd.challan_id
// LEFT JOIN 
//     enquiry_master em ON c.buyer_id = em.id
// LEFT JOIN 
//     order_acceptance oa ON c.orderacceptance_id = oa.id
// LEFT JOIN 
//     quotation q ON oa.qid = q.qid
// LEFT JOIN 
//     quot_taxes qt ON q.qid = qt.qid
// WHERE 
//     c.id = ?;

//   `;

//   pool.query(q, [id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Challan not found" });
//     }

//     return res.json(results[0]);
//   });
// });

// router.get("/getChallanDetail/:id", (req, res) => {
//   const id = req.params.id;
//   const q = `
//   SELECT 
//     c.id,
//     c.challan_no,
//     c.chdate,
//     c.buyer_id,
//     c.buyer_address,
//     c.deliver_at,
//     c.delivery_address,
//     c.po_no,
//     c.po_date,
//     c.costing_id,
//     c.uid,
//     c.vehicle,
//     c.orderacceptance_id,
//     c.custname,
//     c.modeoftransport,
//     cd.id AS detail_id,
//     cd.challan_id,
//     cd.plan_id,
//     cd.capacity,
//     cd.desc,
//     cd.qty,
//     cd.rate,
//     cd.amt,
//     cd.remainingqty,
//     em.custname AS buyername,
//     em.address AS buyeraddress,
//     COALESCE(p.total_payment_advance, 0) AS advance,
//     oa.remainingadvance,
//     oa.id AS oa_id,
//     oa.gstNo,
//     qt.cgst AS tax_cgst,
//     qt.sgst AS tax_sgst,
//     qt.cgsttype AS tax_cgsttype,
//     qt.sgsttype AS tax_sgsttype
// FROM 
//     challans c
// LEFT JOIN 
//     challan_details cd ON c.id = cd.challan_id
// LEFT JOIN 
//     enquiry_master em ON c.buyer_id = em.id
// LEFT JOIN 
//     order_acceptance oa ON c.orderacceptance_id = oa.id
// LEFT JOIN 
//     quotation q ON oa.qid = q.qid
// LEFT JOIN 
//     quot_taxes qt ON q.qid = qt.qid
// LEFT JOIN (
//     SELECT 
//         oid, 
//         SUM(advance) AS total_payment_advance
//     FROM 
//         payments
//     GROUP BY 
//         oid
// ) p ON oa.id = p.oid
// WHERE 
//     c.id = ?;
//   `;

//   pool.query(q, [id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Challan not found" });
//     }

//     return res.json(results[0]);
//   });
// });

router.get("/getChallanDetail/:id", (req, res) => {
  const id = req.params.id;

  const q = `
    SELECT 
        c.id,
        c.challan_no,
        c.chdate,
        c.buyer_id,
        c.buyer_address,
        c.deliver_at,
        c.delivery_address,
        c.po_no,
        c.po_date,
        c.costing_id,
        c.uid,
        c.vehicle,
        c.orderacceptance_id,
        c.custname,
        c.modeoftransport,
        cd.id AS detail_id,
        cd.challan_id,
        cd.plan_id,
        cd.capacity,
        cd.desc,
        cd.qty,
        cd.rate,
        cd.amt,
        cd.remainingqty,
        em.custname AS buyername,
        em.address AS buyeraddress,
        oa.remainingadvance,
        oa.id AS oa_id,
        oa.gstNo,
        qt.cgst AS tax_cgst,
        qt.sgst AS tax_sgst,
        qt.cgsttype AS tax_cgsttype,
        qt.sgsttype AS tax_sgsttype,
        COALESCE(CAST(lb.invoice_balance AS DECIMAL(18,2)), 0) AS advance
    FROM 
        challans c
    LEFT JOIN 
        challan_details cd ON c.id = cd.challan_id
    LEFT JOIN 
        enquiry_master em ON c.buyer_id = em.id
    LEFT JOIN 
        order_acceptance oa ON c.orderacceptance_id = oa.id
    LEFT JOIN 
        quotation q ON oa.qid = q.qid
    LEFT JOIN 
        quot_taxes qt ON q.qid = qt.qid
    LEFT JOIN (
        SELECT 
            oid, 
            SUM(advance) AS total_payment_advance
        FROM 
            payments
        GROUP BY 
            oid
    ) p ON oa.id = p.oid
    LEFT JOIN (
        -- Get last invoice transaction balance using created_at
        SELECT it1.oid, it1.invoice_balance
        FROM invoice_transactions it1
        WHERE it1.created_at = (
            SELECT MAX(it2.created_at)
            FROM invoice_transactions it2
            WHERE it2.oid = it1.oid
        )
    ) lb ON oa.id = lb.oid
    WHERE 
        c.id = ?;
  `;

  pool.query(q, [id], (err, results) => {
    if (err) {
      console.error("Error fetching challan details:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Challan not found" });
    }

    // Convert last_invoice_balance to number
    const result = results[0];
    result.last_invoice_balance = parseFloat(result.last_invoice_balance || 0);

    return res.json(result);
  });
});




//<--------------------------------------------------------------->
//<---------------------------------------get quotation number --------------------->
router.get("/getQuotNumber/:userId", (req, res) => {
  const userId = req.params.userId;

  const getMaxQidQuery = "SELECT MAX(qid) AS maxQid FROM quotation";
  pool.query(getMaxQidQuery, (err, maxQidData) => {
    if (err) {
      return res.json(err);
    }

    const maxQid = maxQidData[0]?.maxQid || 0;

    const getUserQuery =
      "SELECT quot_serial, id, fname, lname FROM usermaster WHERE id=?";
    pool.query(getUserQuery, [userId], (err, user) => {
      if (err) {
        return res.json(err);
      }

      const quotNo = getQuotNumber(maxQid, user);

      return res.json({ quotNo });
    });
  });
});

const getQuotNumber = (maxQid, user) => {
  const { fname = "", lname = "", quot_serial = "" } = user[0] || {};
  let quotNo = `SEP/${quot_serial}/${getCurrentFinancialYear()}/`;

  const nextQid = maxQid + 1;

  quotNo = `${quotNo}${nextQid}`;

  return quotNo;
};

router.get("/getProNumber/:uid", (req, res) => {
  const userId = req.params.uid;
  const q =
    "SELECT quot_serial, uid, qid FROM quotation WHERE uid=? ORDER BY qid DESC LIMIT 1";

  pool.query(q, [userId], (err, data) => {
    if (err) {
      return res.json(err);
    }

    const q = "SELECT quot_serial, id, fname, lname FROM usermaster WHERE id=?";
    pool.query(q, [userId], (err, user) => {
      if (err) {
        return res.json(err);
      }

      const getMaxIdQuery = "SELECT MAX(id) AS max_id FROM proforma_invoice";
      pool.query(getMaxIdQuery, (err, result) => {
        if (err) {
          return res.json(err);
        }

        const maxId = result[0].max_id || 0;
        const newId = maxId + 1;

        const quotNo = getproNumber(data, user, newId);

        return res.json({ quotNo });
      });
    });
  });
});

router.post("/saveProInvoice", async (req, res) => {
  try {
    const { pro_invrefno, pro_invdate, oid, proformaqty } = req.body;
    const proqty = parseInt(proformaqty);

    const insertQuery =
      "INSERT INTO proforma_invoice (pro_invrefno, pro_invdate, oid,proformaqty) VALUES (?, ?, ?,?)";

    const result = await pool.query(insertQuery, [
      pro_invrefno,
      pro_invdate,
      oid,
      proqty,
    ]);

    if (result.affectedRows === 1) {
      return res
        .status(200)
        .json({ message: "Pro Invoice data saved successfully" });
    } else {
      return res
        .status(500)
        .json({ error: "An error occurred while saving Pro Invoice data" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while saving Pro Invoice data" });
  }
});

//<------------------------------------------------------------------>

router.get("/getQuotprint/:qid", (req, res) => {
  const qid = req.params.qid;

  const q1 = `
    SELECT * 
    FROM quotation
    WHERE qid = ?
    ORDER BY qid DESC
    LIMIT 1
  `;

  const q2 = `
    SELECT e.custname, e.contactperson,e.capacity,e.address,e.hvvoltage,e.lvvoltage,e.typecolling,e.core,e.typetaping,e.type,e.matofwind,e.vectorgroup,e.priratio,e.secratio,e.voltageratio,
    e.tapingSwitch,e.frequency,e.phase
    FROM quotation q
    INNER JOIN enquiry_master e ON e.id = q.eid
    WHERE q.qid = ?
    ORDER BY q.qid 
    
  `;

  const q3 = `
    SELECT cgst,sgst,cgsttype,sgsttype
    FROM quot_taxes
    WHERE qid = ?
    
    
  `;

  pool.query(q1, [qid], (err1, data1) => {
    if (err1) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    pool.query(q2, [qid], (err2, data2) => {
      if (err2) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      pool.query(q3, [qid], (err2, data3) => {
        if (err2) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data1?.length && data2?.length) {
          const response = {
            quotref: data1[0].quotref,
            validityofquote: data1[0].validityofquote,
            qdate: data1[0].qdate,
            transport: data1[0].transport,
            qty: data1[0].qty,
            cost: data1[0].cost,
            paymentdesc: data1[0].paymentdesc,
            deliverydesc: data1[0].deliverydesc,
            deliveryperiod: data1[0].deliveryperiod,
            guranteetext: data1[0].guranteetext,
            guranteeperiod: data1[0].guranteeperiod,
            inspectiondesc: data1[0].inspectiondesc,
            custname: data2[0].custname,
            contactperson: data2[0].contactperson,
            capacity: data2[0].capacity,
            address: data2[0].address,
            hvvoltage: data2[0].hvvoltage,
            lvvoltage: data2[0].lvvoltage,
            core: data2[0].core,
            typecolling: data2[0].typecolling,
            typetaping: data2[0].typetaping,
            tapingSwitch: data2[0].tapingSwitch,
            frequency: data2[0].frequency,
            phase: data2[0].phase,
            type: data2[0].type,
            matofwind: data2[0].matofwind,
            vectorgroup: data2[0].vectorgroup,
            priratio: data2[0].priratio,
            secratio: data2[0].secratio,
            voltageratio: `${data2[0].priratio}/${data2[0].secratio}`,
            cgst: data3[0].cgst,
            sgst: data3[0].sgst,
            cgsttype: data3[0].cgsttype,
            sgsttype: data3[0].sgsttype,
          };
          return res.json(response);
        } else {
          return res
            .status(404)
            .json({ error: "No data found for the provided ID" });
        }
      });
    });
  });
});

//<------------------------------------print profoma------------------------->
// router.get("/profomainvoice/:id", (req, res) => {
//   const id = req.params.id;

//   const q = `SELECT gstno FROM customer_master WHERE id = ${id}`;
//   console.log(q, "qqqqqqqqqqqqqqqqqqqqqqq");
//   pool.query(q, (err, data) => {
//     if (err) {
//       return res.json(err);
//     }

//     return res.json(data);
//   });
// });
//<------------------------------------------------------------------------->

//<------------------------------get invoice number-------------------->
router.get("/getInvoiceNumber", (req, res) => {
  const q = `SELECT id FROM invoices ORDER By id DESC LIMIT 1`;

  pool.query(q, (err, invoice) => {
    if (err) {
      return res.json(err);
    }
    return res.json({ invoiceNumber: (invoice[0]?.id || 0) + 1 });
  });
});
//<------------------------------------------------------------------>
//<-------------------------------add new invoice--------------------->

function convertTime(time) {
  if (time.trim() === "") {
    // Get the current time
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    var AMPM = "";
    if (hours >= 12 && hours != 24) {
      hours = hours - 12;
      AMPM = " pm";
    } else if (hours < 12) {
      AMPM = " am";
    }

    if (hours == 24) {
      hours = hours - 12;
      AMPM = " am";
    }

    if (hours == 0) {
      hours = hours + 12;
    }

    // Formatting hours and minutes
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) {
      sHours = "0" + sHours;
    }
    if (minutes < 10) {
      sMinutes = "0" + sMinutes;
    }

    return sHours + ":" + sMinutes + AMPM;
  }

  var arr = time.split(":");
  var hours = Number(arr[0]);
  var minutes = Number(arr[1]);
  var AMPM = "";

  if (hours >= 12 && hours != 24) {
    hours = hours - 12;
    AMPM = " pm";
  } else if (hours < 12) {
    AMPM = " am";
  }

  if (hours == 24) {
    hours = hours - 12;
    AMPM = " am";
  }

  if (hours == 0) {
    hours = hours + 12;
  }

  var sHours = hours.toString();
  var sMinutes = minutes.toString();

  if (hours < 10) {
    sHours = "0" + sHours;
  }

  if (minutes < 10) {
    sMinutes = "0" + sMinutes;
  }

  return sHours + ":" + sMinutes + AMPM;
}

// Helper function to get current financial year
// const getCurrentFinancialYear = () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth() + 1; // January is 0

//   if (month >= 4) {
//     return `${year}-${year + 1}`;
//   } else {
//     return `${year - 1}-${year}`;
//   }
// };

// // Helper function to generate invoice number
// const getInvNumber = (number, user) => {
//   const { fname = "", lname = "", quot_serial } = user[0] || {};
//   let orderNo = `SEP/${quot_serial}/${getCurrentFinancialYear()}/${number}`;
//   return orderNo;
// };

router.post("/addNewInvoice", (req, res) => {
  const {
    detailList,
    inv_date,
    challan_id,
    buyername,
    buyer_id,
    challan_no,
    custname,
    customeraddress,
    modeoftransport,
    po_no,
    po_date,
    vehicle_no,
    grand_total,
    advance,
    net_total,
    date_issue,
    time_issue,
    date_removal,
    time_removal,
    uid,
    by_road,
    buyer_addr,
    consign_addr,
    roundoff,
    consigneename,
    orderacceptance_id,
    cgst,
    basic_total,
    sgst,
    igst,
    oa_id,
    gstno,
    costing_id,
    enquiry_id,
  } = req.body;

  const chqty = req.body.qty;
  const detailArray = Array.isArray(detailList) ? detailList : [detailList];

  // Safe numeric conversions
  const numericAdvance = 0;
  const numericNetTotal = parseFloat(net_total) || 0;
  const numericGrandTotal = parseFloat(grand_total) || 0;
  const numericBasicTotal = parseFloat(basic_total) || 0;
  const numericCGST = parseFloat(cgst) || 0;
  const numericSGST = parseFloat(sgst) || 0;
  const numericIGST = parseFloat(igst) || 0;
  const numericRoundoff = parseFloat(roundoff) || 0;

  // Format dates safely
  // Format dates safely - handles both DD-MM-YYYY and ISO formats
  const formatDateForDB = (dateString) => {
    if (!dateString) return null;

    let date;

    // Check if date is in DD-MM-YYYY format
    if (dateString.includes('-') && dateString.split('-')[0].length <= 2) {
      const [day, month, year] = dateString.split('-');
      // Create date in YYYY-MM-DD format for proper parsing
      date = new Date(`${year}-${month}-${day}`);
    } else {
      // Handle ISO format or other standard formats
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return null;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const formattedPODate = formatDateForDB(po_date);
  const formattedInvDate = formatDateForDB(inv_date);
  console.log("inv_date", inv_date);

  console.log(formattedInvDate, "formattedInvDate");


  // Update remaining advance in order_acceptance
  let remainingAdvance = numericNetTotal <= 0 ? Math.abs(numericNetTotal) : 0;
  pool.query(
    "UPDATE order_acceptance SET remainingadvance = ? WHERE id = ?",
    [remainingAdvance, oa_id],
    (err) => {
      if (err) {
        console.log("Error updating remainingadvance:", err);
        return res.status(500).send("Error updating remaining advance");
      }
    }
  );

  // Fetch challan_id from challan_no if needed
  pool.query(
    `SELECT id FROM challans WHERE challan_no = ?`,
    [challan_no],
    (err, chid) => {
      if (err) {
        console.log("Error fetching challan ID:", err);
        return res.status(500).send("Error fetching challan ID");
      }

      const challanId = chid[0]?.id || null;

      // Fetch user info for invoice number generation
      pool.query(
        `SELECT id, fname, lname, quot_serial FROM usermaster WHERE id = ?`,
        [uid],
        (err, user) => {
          if (err) {
            console.log("Error fetching user info:", err);
            return res.status(500).send("Error fetching user info");
          }

          // Fetch last invoice number to generate new invoice_no
          pool.query(
            "SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1",
            (err, result) => {
              if (err) {
                console.log("Error fetching last invoice:", err);
                return res.status(500).send("Error fetching last invoice");
              }

              let lastNumber = 0;
              if (result[0] && result[0].invoice_no) {
                const match = result[0].invoice_no.match(/(\d+)$/);
                lastNumber = match ? parseInt(match[0]) : 0;
              }

              const newInvoiceNumber = lastNumber + 1;
              const invno = getInvNumber(newInvoiceNumber, user);

              // Insert into invoices table
              pool.query(
                `INSERT INTO invoices (
                  invoice_no, inv_date, challan_id, buyer_id, buyername, customeraddress, transport_mode,
                  po_no, po_date, vehicle_no, basic_total, cgst, sgst, igst, grand_total, advance,
                  net_total, date_issue, date_removal, uid, by_road, buyer_addr, consign_addr,
                  roundoff, consigneename, orderacceptance_id, gstno
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  invno,
                  formattedInvDate,
                  challanId,
                  buyer_id,
                  buyername,
                  customeraddress,
                  modeoftransport,
                  po_no,
                  formattedPODate,
                  vehicle_no,
                  numericBasicTotal,
                  numericCGST,
                  numericSGST,
                  numericIGST,
                  numericGrandTotal,
                  numericAdvance,
                  numericNetTotal,
                  formatDateForDB(date_issue),
                  formatDateForDB(date_removal),
                  uid,
                  by_road,
                  buyer_addr,
                  consign_addr,
                  numericRoundoff,
                  consigneename,
                  orderacceptance_id,
                  gstno,
                ],
                (err, result) => {
                  if (err) {
                    console.log("Error inserting invoice:", err);
                    return res.status(500).send("Error inserting invoice");
                  }

                  const insertedInvoiceId = result.insertId;

                  // Fetch last invoice_balance for this order
                  pool.query(
                    `SELECT invoice_balance FROM invoice_transactions WHERE oid = ? ORDER BY invoice_id DESC LIMIT 1`,
                    [orderacceptance_id],
                    (err, balanceResult) => {
                      if (err) {
                        console.log("Error fetching last invoice balance:", err);
                        return res.status(500).send("Error fetching last invoice balance");
                      }

                      const lastBalance = parseFloat(balanceResult[0]?.invoice_balance || 0);
                      const newInvoiceBalance = numericAdvance - numericNetTotal;

                      // Insert invoice details and transactions
                      let pendingDetails = detailArray.length;
                      let pendingTransactions = detailArray.length;

                      if (pendingDetails === 0) return res.send("POSTED");

                      detailArray.forEach(({ plan_id, desc, qty, hsn, rate, amt }) => {
                        // Insert into invoice_details table
                        pool.query(
                          "INSERT INTO invoice_details (invoice_id, plan_id, `desc`, qty, hsn, rate, amt) VALUES (?, ?, ?, ?, ?, ?, ?)",
                          [insertedInvoiceId, plan_id, desc, qty, hsn, rate, amt],
                          (err) => {
                            if (err) {
                              console.log("Error inserting invoice details:", err);
                              return res.status(500).send("Error inserting invoice details");
                            }

                            pendingDetails--;
                            if (pendingDetails === 0) {
                              console.log("All invoice details inserted successfully");

                              // ✅ Update challan_details after all invoice details are inserted
                              if (challanId) {
                                pool.query(
                                  `UPDATE challan_details 
                                   SET remainingqty = GREATEST(remainingqty - ?, 0)
                                   WHERE challan_id = ?`,
                                  [parseInt(chqty), challanId],
                                  (err) => {
                                    if (err) {
                                      console.log("Error updating remainingqty in challan_details:", err);
                                      return res.status(500).send("Error updating challan_details");
                                    }
                                    console.log("Challan details updated successfully");
                                  }
                                );
                              }
                            }
                          }
                        );

                        // Insert into invoice_transactions table
                        pool.query(
                          `INSERT INTO invoice_transactions (
                            invoice_id, invoice_no, oid, costing_id, enquiry_id, plan_id,
                            item_desc, qty, hsn, rate, item_amount, basic_total, cgst, sgst, igst,
                            roundoff, grand_total, advance, net_total, invoice_balance,
                            buyer_id, buyer_name, invoice_date, uid, created_at
                          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`,
                          [
                            insertedInvoiceId,
                            invno,
                            orderacceptance_id,
                            costing_id,
                            enquiry_id,
                            plan_id,
                            desc,
                            qty,
                            hsn,
                            rate,
                            amt,
                            numericBasicTotal,
                            numericCGST,
                            numericSGST,
                            numericIGST,
                            numericRoundoff,
                            numericGrandTotal,
                            numericAdvance,
                            numericNetTotal,
                            newInvoiceBalance,
                            buyer_id,
                            custname,
                            formattedInvDate,
                            uid
                          ],
                          (err) => {
                            if (err) {
                              console.log("Error inserting invoice transaction:", err);
                              return res.status(500).send("Error inserting invoice transaction");
                            }

                            pendingTransactions--;
                            if (pendingTransactions === 0) {
                              console.log("All invoice transactions inserted successfully");
                              return res.send("POSTED");
                            }
                          }
                        );
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

// router.post("/addNewInvoice", (req, res) => {
//   const {
//     detailList,
//     inv_date,
//     challan_id,
//     buyername,
//     buyer_id,
//     challan_no,
//     custname,
//     customeraddress,
//     modeoftransport,
//     po_no,
//     po_date,
//     vehicle_no,
//     grand_total,
//     advance,
//     net_total,
//     date_issue,
//     time_issue,
//     date_removal,
//     time_removal,
//     uid,
//     by_road,
//     buyer_addr,
//     consign_addr,
//     roundoff,
//     consigneename,
//     orderacceptance_id,
//     cgst,
//     basic_total,
//     sgst,
//     igst,
//     oa_id,
//     gstno,
//     costing_id,
//     enquiry_id,
//   } = req.body;

//   const chqty = req.body.qty;
//   const detailArray = Array.isArray(detailList) ? detailList : [detailList];

//   // Safe numeric conversions
//   const numericAdvance = 0;
//   const numericNetTotal = parseFloat(net_total) || 0;
//   const numericGrandTotal = parseFloat(grand_total) || 0;
//   const numericBasicTotal = parseFloat(basic_total) || 0;
//   const numericCGST = parseFloat(cgst) || 0;
//   const numericSGST = parseFloat(sgst) || 0;
//   const numericIGST = parseFloat(igst) || 0;
//   const numericRoundoff = parseFloat(roundoff) || 0;

//   // Format dates safely
//   const formatDateForDB = (dateString) => {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return null;
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   const formattedPODate = formatDateForDB(po_date);
//   const formattedInvDate = formatDateForDB(inv_date);

//   // Update remaining advance in order_acceptance
//   let remainingAdvance = numericNetTotal <= 0 ? Math.abs(numericNetTotal) : 0;
//   pool.query(
//     "UPDATE order_acceptance SET remainingadvance = ? WHERE id = ?",
//     [remainingAdvance, oa_id],
//     (err) => {
//       if (err) {
//         console.log("Error updating remainingadvance:", err);
//         return res.status(500).send("Error updating remaining advance");
//       }
//     }
//   );

//   // Fetch challan_id from challan_no if needed
//   pool.query(
//     `SELECT id FROM challans WHERE challan_no = ?`,
//     [challan_no],
//     (err, chid) => {
//       if (err) {
//         console.log("Error fetching challan ID:", err);
//         return res.status(500).send("Error fetching challan ID");
//       }

//       const challanId = chid[0]?.id || null;

//       // Fetch last invoice number to generate new invoice_no
//       pool.query(
//         "SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1",
//         (err, result) => {
//           if (err) {
//             console.log("Error fetching last invoice:", err);
//             return res.status(500).send("Error fetching last invoice");
//           }

//           let lastNumber = 0;
//           if (result[0] && result[0].invoice_no) {
//             const match = result[0].invoice_no.match(/(\d+)$/);
//             lastNumber = match ? parseInt(match[0]) : 0;
//           }

//           const newInvoiceNumber = lastNumber + 1;
//           const invno = `INV/${newInvoiceNumber}`; 

//           // Insert into invoices table
//           pool.query(
//             `INSERT INTO invoices (
//               invoice_no, inv_date, challan_id, buyer_id, buyername, customeraddress, transport_mode,
//               po_no, po_date, vehicle_no, basic_total, cgst, sgst, igst, grand_total, advance,
//               net_total, date_issue, date_removal, uid, by_road, buyer_addr, consign_addr,
//               roundoff, consigneename, orderacceptance_id, gstno
//             ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//             [
//               invno,
//               formattedInvDate,
//               challanId,
//               buyer_id,
//               buyername,
//               customeraddress,
//               modeoftransport,
//               po_no,
//               formattedPODate,
//               vehicle_no,
//               numericBasicTotal,
//               numericCGST,
//               numericSGST,
//               numericIGST,
//               numericGrandTotal,
//               numericAdvance,
//               numericNetTotal,
//               formatDateForDB(date_issue),
//               formatDateForDB(date_removal),
//               uid,
//               by_road,
//               buyer_addr,
//               consign_addr,
//               numericRoundoff,
//               consigneename,
//               orderacceptance_id,
//               gstno,
//             ],
//             (err, result) => {
//               if (err) {
//                 console.log("Error inserting invoice:", err);
//                 return res.status(500).send("Error inserting invoice");
//               }

//               const insertedInvoiceId = result.insertId;

//               // Fetch last invoice_balance for this order
//               pool.query(
//                 `SELECT invoice_balance FROM invoice_transactions WHERE oid = ? ORDER BY invoice_id DESC LIMIT 1`,
//                 [orderacceptance_id],
//                 (err, balanceResult) => {
//                   if (err) {
//                     console.log("Error fetching last invoice balance:", err);
//                     return res.status(500).send("Error fetching last invoice balance");
//                   }

//                   const lastBalance = parseFloat(balanceResult[0]?.invoice_balance || 0);
//                   const newInvoiceBalance = numericAdvance - numericNetTotal;

//                   // Insert invoice details and transactions
//                   let pendingDetails = detailArray.length;
//                   let pendingTransactions = detailArray.length;

//                   if (pendingDetails === 0) return res.send("POSTED");

//                   detailArray.forEach(({ plan_id, desc, qty, hsn, rate, amt }) => {
//                     // Insert into invoice_details table
//                     pool.query(
//                       "INSERT INTO invoice_details (invoice_id, plan_id, `desc`, qty, hsn, rate, amt) VALUES (?, ?, ?, ?, ?, ?, ?)",
//                       [insertedInvoiceId, plan_id, desc, qty, hsn, rate, amt],
//                       (err) => {
//                         if (err) {
//                           console.log("Error inserting invoice details:", err);
//                           return res.status(500).send("Error inserting invoice details");
//                         }

//                         pendingDetails--;
//                         if (pendingDetails === 0) {
//                           console.log("All invoice details inserted successfully");

//                           // ✅ Update challan_details after all invoice details are inserted
//                           if (challanId) {
//                             pool.query(
//                               `UPDATE challan_details 
//                                SET remainingqty = GREATEST(remainingqty - ?, 0)
//                                WHERE challan_id = ?`,
//                               [parseInt(chqty), challanId],
//                               (err) => {
//                                 if (err) {
//                                   console.log("Error updating remainingqty in challan_details:", err);
//                                   return res.status(500).send("Error updating challan_details");
//                                 }
//                                 console.log("Challan details updated successfully");
//                               }
//                             );
//                           }
//                         }
//                       }
//                     );

//                     // Insert into invoice_transactions table
//                     pool.query(
//                       `INSERT INTO invoice_transactions (
//                         invoice_id, invoice_no, oid, costing_id, enquiry_id, plan_id,
//                         item_desc, qty, hsn, rate, item_amount, basic_total, cgst, sgst, igst,
//                         roundoff, grand_total, advance, net_total, invoice_balance,
//                         buyer_id, buyer_name, invoice_date, uid, created_at
//                       ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`,
//                       [
//                         insertedInvoiceId,
//                         invno,
//                         orderacceptance_id,
//                         costing_id,
//                         enquiry_id,
//                         plan_id,
//                         desc,
//                         qty,
//                         hsn,
//                         rate,
//                         amt,
//                         numericBasicTotal,
//                         numericCGST,
//                         numericSGST,
//                         numericIGST,
//                         numericRoundoff,
//                         numericGrandTotal,
//                         numericAdvance,
//                         numericNetTotal,
//                         newInvoiceBalance,
//                         buyer_id,
//                         custname,
//                         formattedInvDate,
//                         uid
//                       ],
//                       (err) => {
//                         if (err) {
//                           console.log("Error inserting invoice transaction:", err);
//                           return res.status(500).send("Error inserting invoice transaction");
//                         }

//                         pendingTransactions--;
//                         if (pendingTransactions === 0) {
//                           console.log("All invoice transactions inserted successfully");
//                           return res.send("POSTED");
//                         }
//                       }
//                     );
//                   });
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// });
// router.post("/addNewInvoice", (req, res) => {
//   const {
//     detailList,
//     inv_date,
//     challan_id,
//     buyername,
//     buyer_id,
//     challan_no,
//     custname,
//     customeraddress,
//     modeoftransport,
//     po_no,
//     po_date,
//     vehicle_no,
//     grand_total,
//     advance,
//     net_total,
//     date_issue,
//     time_issue,
//     date_removal,
//     time_removal,
//     uid,
//     by_road,
//     buyer_addr,
//     consign_addr,
//     roundoff,
//     consigneename,
//     orderacceptance_id,
//     cgst,
//     basic_total,
//     sgst,
//     igst,
//     oa_id,
//     gstno,
//     costing_id,
//     enquiry_id,
//   } = req.body;

//   const chqty = req.body.qty;
//   const detailArray = Array.isArray(detailList) ? detailList : [detailList];

//   // Safe numeric conversions
//   const numericAdvance = 0;
//   const numericNetTotal = parseFloat(net_total) || 0;
//   const numericGrandTotal = parseFloat(grand_total) || 0;
//   const numericBasicTotal = parseFloat(basic_total) || 0;
//   const numericCGST = parseFloat(cgst) || 0;
//   const numericSGST = parseFloat(sgst) || 0;
//   const numericIGST = parseFloat(igst) || 0;
//   const numericRoundoff = parseFloat(roundoff) || 0;

//   // Format dates safely
//   const formatDateForDB = (dateString) => {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return null;
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   const formattedPODate = formatDateForDB(po_date);
//   const formattedInvDate = formatDateForDB(inv_date);

//   // Update remaining advance in order_acceptance
//   let remainingAdvance = numericNetTotal <= 0 ? Math.abs(numericNetTotal) : 0;
//   pool.query(
//     "UPDATE order_acceptance SET remainingadvance = ? WHERE id = ?",
//     [remainingAdvance, oa_id],
//     (err) => {
//       if (err) {
//         console.log("Error updating remainingadvance:", err);
//         return res.status(500).send("Error updating remaining advance");
//       }
//     }
//   );

//   // Fetch challan_id from challan_no if needed
//   pool.query(
//     `SELECT id FROM challans WHERE challan_no = ?`,
//     [challan_no],
//     (err, chid) => {
//       if (err) {
//         console.log("Error fetching challan ID:", err);
//         return res.status(500).send("Error fetching challan ID");
//       }

//       const challanId = chid[0]?.id || null;

//       // Fetch last invoice number to generate new invoice_no
//       pool.query(
//         "SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1",
//         (err, result) => {
//           if (err) {
//             console.log("Error fetching last invoice:", err);
//             return res.status(500).send("Error fetching last invoice");
//           }

//           let lastNumber = 0;
//           if (result[0] && result[0].invoice_no) {
//             const match = result[0].invoice_no.match(/(\d+)$/);
//             lastNumber = match ? parseInt(match[0]) : 0;
//           }

//           const newInvoiceNumber = lastNumber + 1;
//           const invno = `INV/${newInvoiceNumber}`; // customize format as needed

//           // Insert into invoices table
//           pool.query(
//             `INSERT INTO invoices (
//               invoice_no, inv_date, challan_id, buyer_id, buyername, customeraddress, transport_mode,
//               po_no, po_date, vehicle_no, basic_total, cgst, sgst, igst, grand_total, advance,
//               net_total, date_issue, date_removal, uid, by_road, buyer_addr, consign_addr,
//               roundoff, consigneename, orderacceptance_id, gstno
//             ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//             [
//               invno,
//               formattedInvDate,
//               challanId,
//               buyer_id,
//               buyername,
//               customeraddress,
//               modeoftransport,
//               po_no,
//               formattedPODate,
//               vehicle_no,
//               numericBasicTotal,
//               numericCGST,
//               numericSGST,
//               numericIGST,
//               numericGrandTotal,
//               numericAdvance,
//               numericNetTotal,
//               formatDateForDB(date_issue),
//               formatDateForDB(date_removal),
//               uid,
//               by_road,
//               buyer_addr,
//               consign_addr,
//               numericRoundoff,
//               consigneename,
//               orderacceptance_id,
//               gstno,
//             ],
//             (err, result) => {
//               if (err) {
//                 console.log("Error inserting invoice:", err);
//                 return res.status(500).send("Error inserting invoice");
//               }

//               const insertedInvoiceId = result.insertId;

//               // Fetch last invoice_balance for this order
//               pool.query(
//                 `SELECT invoice_balance FROM invoice_transactions WHERE oid = ? ORDER BY invoice_id DESC LIMIT 1`,
//                 [orderacceptance_id],
//                 (err, balanceResult) => {
//                   if (err) {
//                     console.log("Error fetching last invoice balance:", err);
//                     return res.status(500).send("Error fetching last invoice balance");
//                   }

//                   const lastBalance = parseFloat(balanceResult[0]?.invoice_balance || 0);
//                   const newInvoiceBalance = numericAdvance - numericNetTotal;

//                   // Insert invoice details and transactions
//                   let pendingDetails = detailArray.length;
//                   let pendingTransactions = detailArray.length;

//                   if (pendingDetails === 0) return res.send("POSTED");

//                   detailArray.forEach(({ plan_id, desc, qty, hsn, rate, amt }) => {
//                     // Insert into invoice_details table
//                     pool.query(
//                       "INSERT INTO invoice_details (invoice_id, plan_id, `desc`, qty, hsn, rate, amt) VALUES (?, ?, ?, ?, ?, ?, ?)",
//                       [insertedInvoiceId, plan_id, desc, qty, hsn, rate, amt],
//                       (err) => {
//                         if (err) {
//                           console.log("Error inserting invoice details:", err);
//                           return res.status(500).send("Error inserting invoice details");
//                         }

//                         pendingDetails--;
//                         if (pendingDetails === 0) {
//                           console.log("All invoice details inserted successfully");
//                         }
//                       }
//                     );

//                     // Insert into invoice_transactions table
//                     pool.query(
//                       `INSERT INTO invoice_transactions (
//                         invoice_id, invoice_no, oid, costing_id, enquiry_id, plan_id,
//                         item_desc, qty, hsn, rate, item_amount, basic_total, cgst, sgst, igst,
//                         roundoff, grand_total, advance, net_total, invoice_balance,
//                         buyer_id, buyer_name, invoice_date, uid, created_at
//                       ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`,
//                       [
//                         insertedInvoiceId,
//                         invno,
//                         orderacceptance_id,
//                         costing_id,
//                         enquiry_id,
//                         plan_id,
//                         desc,
//                         qty,
//                         hsn,
//                         rate,
//                         amt,
//                         numericBasicTotal,
//                         numericCGST,
//                         numericSGST,
//                         numericIGST,
//                         numericRoundoff,
//                         numericGrandTotal,
//                         numericAdvance,
//                         numericNetTotal,
//                         newInvoiceBalance,
//                         buyer_id,
//                         custname,
//                         formattedInvDate,
//                         uid
//                       ],
//                       (err) => {
//                         if (err) {
//                           console.log("Error inserting invoice transaction:", err);
//                           return res.status(500).send("Error inserting invoice transaction");
//                         }

//                         pendingTransactions--;
//                         if (pendingTransactions === 0) {
//                           console.log("All invoice transactions inserted successfully");
//                           return res.send("POSTED");
//                         }
//                       }
//                     );
//                   });
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// });


// router.post("/addNewInvoice", (req, res) => {
//   const {
//     detailList,
//     inv_date,
//     challan_id,
//     buyername,
//     buyer_id,
//     challan_no,
//     custname,
//     customeraddress,
//     modeoftransport,
//     po_no,
//     po_date,
//     vehicle_no,
//     grand_total,
//     advance,
//     net_total,
//     date_issue,
//     time_issue,
//     date_removal,
//     time_removal,
//     uid,
//     by_road,
//     buyer_addr,
//     consign_addr,
//     roundoff,
//     consigneename,
//     orderacceptance_id,
//     cgst,
//     basic_total,
//     sgst,
//     igst,
//     oa_id,
//     gstno,
//     costing_id,
//     enquiry_id,
//   } = req.body;

//   const chqty = req.body.qty;
//   const detailArray = Array.isArray(detailList) ? detailList : [detailList];

//   // Safe numeric conversions
//   const numericAdvance = 0;
//   const numericNetTotal = parseFloat(net_total) || 0;
//   const numericGrandTotal = parseFloat(grand_total) || 0;
//   const numericBasicTotal = parseFloat(basic_total) || 0;
//   const numericCGST = parseFloat(cgst) || 0;
//   const numericSGST = parseFloat(sgst) || 0;
//   const numericIGST = parseFloat(igst) || 0;
//   const numericRoundoff = parseFloat(roundoff) || 0;

//   // Format dates safely
//   const formatDateForDB = (dateString) => {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return null;
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   const formattedPODate = formatDateForDB(po_date);
//   const formattedInvDate = formatDateForDB(inv_date);

//   // Update remaining advance in order_acceptance
//   let remainingAdvance = numericNetTotal <= 0 ? Math.abs(numericNetTotal) : 0;
//   pool.query(
//     "UPDATE order_acceptance SET remainingadvance = ? WHERE id = ?",
//     [remainingAdvance, oa_id],
//     (err) => {
//       if (err) {
//         console.log("Error updating remainingadvance:", err);
//         return res.status(500).send("Error updating remaining advance");
//       }
//     }
//   );

//   // Fetch challan_id from challan_no if needed
//   pool.query(
//     `SELECT id FROM challans WHERE challan_no = ?`,
//     [challan_no],
//     (err, chid) => {
//       if (err) {
//         console.log("Error fetching challan ID:", err);
//         return res.status(500).send("Error fetching challan ID");
//       }

//       const challanId = chid[0]?.id || null;

//       // Fetch last invoice number to generate new invoice_no
//       pool.query(
//         "SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1",
//         (err, result) => {
//           if (err) {
//             console.log("Error fetching last invoice:", err);
//             return res.status(500).send("Error fetching last invoice");
//           }

//           let lastNumber = 0;
//           if (result[0] && result[0].invoice_no) {
//             const match = result[0].invoice_no.match(/(\d+)$/);
//             lastNumber = match ? parseInt(match[0]) : 0;
//           }

//           const newInvoiceNumber = lastNumber + 1;
//           const invno = `INV/${newInvoiceNumber}`; // customize format as needed

//           // Insert into invoices table
//           pool.query(
//             `INSERT INTO invoices (
//               invoice_no, inv_date, challan_id, buyer_id, buyername, customeraddress, transport_mode,
//               po_no, po_date, vehicle_no, basic_total, cgst, sgst, igst, grand_total, advance,
//               net_total, date_issue, date_removal, uid, by_road, buyer_addr, consign_addr,
//               roundoff, consigneename, orderacceptance_id, gstno
//             ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//             [
//               invno,
//               formattedInvDate,
//               challanId,
//               buyer_id,
//               buyername,
//               customeraddress,
//               modeoftransport,
//               po_no,
//               formattedPODate,
//               vehicle_no,
//               numericBasicTotal,
//               numericCGST,
//               numericSGST,
//               numericIGST,
//               numericGrandTotal,
//               numericAdvance,
//               numericNetTotal,
//               formatDateForDB(date_issue),
//               formatDateForDB(date_removal),
//               uid,
//               by_road,
//               buyer_addr,
//               consign_addr,
//               numericRoundoff,
//               consigneename,
//               orderacceptance_id,
//               gstno,
//             ],
//             (err, result) => {
//               if (err) {
//                 console.log("Error inserting invoice:", err);
//                 return res.status(500).send("Error inserting invoice");
//               }

//               const insertedInvoiceId = result.insertId;

//               // Fetch last invoice_balance for this order
//               pool.query(
//                 `SELECT invoice_balance FROM invoice_transactions WHERE oid = ? ORDER BY invoice_id DESC LIMIT 1`,
//                 [orderacceptance_id],
//                 (err, balanceResult) => {
//                   if (err) {
//                     console.log("Error fetching last invoice balance:", err);
//                     return res.status(500).send("Error fetching last invoice balance");
//                   }

//                   const lastBalance = parseFloat(balanceResult[0]?.invoice_balance || 0);
//                   const newInvoiceBalance = numericAdvance - numericNetTotal;

//                   // Insert all invoice transaction details
//                   let pending = detailArray.length;
//                   if (pending === 0) return res.send("POSTED");

//                   detailArray.forEach(({ plan_id, desc, qty, hsn, rate, amt }) => {
//                     pool.query(
//                       `INSERT INTO invoice_transactions (
//                         invoice_id, invoice_no, oid, costing_id, enquiry_id, plan_id,
//                         item_desc, qty, hsn, rate, item_amount, basic_total, cgst, sgst, igst,
//                         roundoff, grand_total, advance, net_total, invoice_balance,
//                         buyer_id, buyer_name, invoice_date, uid, created_at
//                       ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`,
//                       [
//                         insertedInvoiceId,
//                         invno,
//                         orderacceptance_id,
//                         costing_id,
//                         enquiry_id,
//                         plan_id,
//                         desc,
//                         qty,
//                         hsn,
//                         rate,
//                         amt,
//                         numericBasicTotal,
//                         numericCGST,
//                         numericSGST,
//                         numericIGST,
//                         numericRoundoff,
//                         numericGrandTotal,
//                         numericAdvance,
//                         numericNetTotal,
//                         newInvoiceBalance,
//                         buyer_id,
//                         custname,
//                         formattedInvDate,
//                         uid
//                       ],
//                       (err) => {
//                         if (err) {
//                           console.log("Error inserting invoice transaction:", err);
//                           return res.status(500).send("Error inserting invoice transaction");
//                         }

//                         pending--;
//                         if (pending === 0) {
//                           console.log("All invoice transactions inserted successfully");
//                           return res.send("POSTED");
//                         }
//                       }
//                     );
//                   });
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// });


// router.post("/addNewInvoice", (req, res) => {
//   const {
//     detailList,
//     invoice_no,
//     inv_date,
//     challan_id,
//     buyername,
//     buyer_id,
//     challan_no,
//     consignee_id,
//     custname,
//     customeraddress,
//     consignee_cat,
//     modeoftransport,
//     po_no,
//     po_date,
//     vehicle_no,
//     grand_total,
//     advance,
//     net_total,
//     date_issue,
//     time_issue,
//     date_removal,
//     time_removal,
//     uid,
//     by_road,
//     buyer_addr,
//     consign_addr,
//     roundoff,
//     consigneename,
//     orderacceptance_id,
//     cgst,
//     basic_total,
//     sgst,
//     igst,
//     oa_id,
//     gstno,
//     costing_id,
//     enquiry_id,
//   } = req.body;
//   const chqty = req.body.qty;

//   console.log(req.body);

//   let finalnettotal;
//   if (net_total <= 0) {
//     finalnettotal = Math.abs(net_total);

//     pool.query(
//       "UPDATE order_acceptance SET remainingadvance = ? WHERE id = ?",
//       [finalnettotal, oa_id],
//       (err) => {
//         if (err) {
//           console.log("Error updating remainingadvance:", err);
//           return res.status(500).send("Error updating remaining advance");
//         }
//       }
//     );
//   } else {
//     pool.query(
//       "UPDATE order_acceptance SET remainingadvance = 0 WHERE id = ?",
//       [oa_id],
//       (err) => {
//         if (err) {
//           console.log("Error updating remainingadvance:", err);
//           return res.status(500).send("Error updating remaining advance");
//         }
//       }
//     );
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const formatDateForDB = (dateString) => {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return null; // Return null if invalid date
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${year}-${month}-${day}`;
//   };


//   const formattedDate = formatDate(po_date);

//   // Fetch challan_id
//   pool.query(
//     `SELECT id FROM challans WHERE challan_no='${challan_no}'`,
//     (err, chid) => {
//       if (err) {
//         console.log("Error fetching challan ID:", err);
//         return res.status(500).send("Error fetching challan ID");
//       }
//       const challanid = chid[0]?.id || null;

//       pool.query(
//         `SELECT id, fname, lname, quot_serial FROM usermaster WHERE id=${uid}`,
//         (err, user) => {
//           if (err) {
//             console.log("Error fetching user info:", err);
//             return res.status(500).send("Error fetching user info");
//           }

//           pool.query(
//             "SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1;",
//             (err, result) => {
//               if (err) {
//                 console.log("Error fetching new invoice ID:", err);
//                 return res.status(500).send("Error fetching new invoice ID");
//               }

//               let lastNumber;
//               if (result[0] && result[0].invoice_no) {
//                 const match = result[0].invoice_no.match(/(\d+)$/);
//                 lastNumber = match ? parseInt(match[0]) : 0;
//               } else {
//                 lastNumber = 0;
//               }

//               const newId = lastNumber + 1;
//               console.log("New invoice number base:", newId);
//               console.log("match", lastNumber);

//               const formattedTimeIssue = convertTime(time_issue);
//               const formattedTimeRemoval = convertTime(time_removal);
//               const invno = getInvNumber(newId, user);
//               const detailArray = Array.isArray(detailList)
//                 ? detailList
//                 : [detailList];

//               // Insert into invoices
//               pool.query(
//                 `INSERT INTO invoices (
//             invoice_no, inv_date, challan_id, consignee_id, consignee_cat, transport_mode, po_no, po_date, vehicle_no,
//             basic_total, cgst, sgst, igst, grand_total, advance, net_total, date_issue, time_issue, date_removal,
//             time_removal, uid, by_road, buyer_addr, consign_addr, roundoff, consigneename, orderacceptance_id, 
//             buyer_id, buyername, customeraddress, gstno
//           ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//                 [
//                   invno,
//                   inv_date,
//                   challanid,
//                   null,
//                   null,
//                   modeoftransport,
//                   po_no,
//                   formattedDate,
//                   vehicle_no,
//                   basic_total,
//                   cgst,
//                   sgst,
//                   igst,
//                   grand_total,
//                   advance,
//                   net_total,
//                   date_issue,
//                   formattedTimeIssue,
//                   date_removal,
//                   formattedTimeRemoval,
//                   uid,
//                   by_road,
//                   buyer_addr,
//                   consign_addr,
//                   roundoff,
//                   consigneename,
//                   orderacceptance_id,
//                   buyer_id,
//                   custname,
//                   customeraddress,
//                   gstno,
//                 ],
//                 (err, result) => {
//                   if (err) {
//                     console.log("Error inserting invoice record:", err);
//                     return res
//                       .status(500)
//                       .send("Error inserting invoice record");
//                   }

//                   const insertedInvoiceId = result.insertId;

//                   // Insert invoice details using insertedInvoiceId instead of newId
//                   let pendingInserts = detailArray.length;

//                   if (pendingInserts === 0) {
//                     return res.send("POSTED");
//                   }

//                   detailArray.forEach(
//                     ({ id, plan_id, desc, qty, hsn, rate, amt }) => {
//                       pool.query(
//                         "INSERT INTO invoice_details (invoice_id, plan_id, `desc`, qty, hsn, rate, amt) VALUES ( ?, ?, ?, ?, ?, ?, ?)",
//                         [insertedInvoiceId, plan_id, desc, qty, hsn, rate, amt],
//                         (err, result) => {
//                           if (err) {
//                             console.log(
//                               "Error inserting invoice details:",
//                               err
//                             );
//                             return res
//                               .status(500)
//                               .send("Error inserting invoice details");
//                           }

//                           pendingInserts -= 1;
//                           if (pendingInserts === 0) {
//                             // Update challan details
//                             pool.query(
//                               `UPDATE challan_details 
//                        SET remainingqty = GREATEST(remainingqty - ?, 0)
//                        WHERE challan_id = ?`,
//                               [parseInt(chqty), challan_id],
//                               (err) => {
//                                 if (err) {
//                                   console.log(
//                                     "Error updating invoice_qty in challan_details:",
//                                     err
//                                   );
//                                   return res
//                                     .status(500)
//                                     .send(
//                                       "Error updating invoice_qty in challan_details"
//                                     );
//                                 }
//                                 console.log(
//                                   "invoice_qty updated successfully in challan_details"
//                                 );

//                                 // ✅ Insert invoice transaction details into new invoice_transactions table
//                                 // This stores all financial details for each invoice with order items
//                                 let pendingTransactions = detailArray.length;

//                                 detailArray.forEach(({ plan_id, desc, qty, hsn, rate, amt }) => {
//                                   pool.query(
//                                     `INSERT INTO invoice_transactions (
//                                       invoice_id, 
//                                       invoice_no, 
//                                       oid,
//                                       costing_id,
//                                       enquiry_id,
//                                       plan_id,
//                                       item_desc,
//                                       qty,
//                                       hsn,
//                                       rate,
//                                       item_amount,
//                                       basic_total, 
//                                       cgst, 
//                                       sgst, 
//                                       igst, 
//                                       roundoff,
//                                       grand_total, 
//                                       advance, 
//                                       net_total,
//                                       buyer_id,
//                                       buyer_name,
//                                       invoice_date,
//                                       uid,
//                                       created_at
//                                     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
//                                     [
//                                       insertedInvoiceId,
//                                       invno,
//                                       orderacceptance_id,
//                                       costing_id,
//                                       enquiry_id,
//                                       plan_id,
//                                       desc,
//                                       qty,
//                                       hsn,
//                                       rate,
//                                       amt,
//                                       basic_total,
//                                       cgst,
//                                       sgst,
//                                       igst,
//                                       roundoff,
//                                       grand_total,
//                                       advance,
//                                       net_total,
//                                       buyer_id,
//                                       custname,
//                                       formatDateForDB(inv_date), // Convert to MySQL format
//                                       uid
//                                     ],
//                                     (err) => {
//                                       if (err) {
//                                         console.log(
//                                           "Error inserting invoice transaction:",
//                                           err
//                                         );
//                                         return res
//                                           .status(500)
//                                           .send("Error inserting invoice transaction");
//                                       }

//                                       pendingTransactions -= 1;
//                                       if (pendingTransactions === 0) {
//                                         console.log("All invoice transactions inserted successfully");
//                                         return res.send("POSTED");
//                                       }
//                                     }
//                                   );
//                                 });
//                               }
//                             );
//                           }
//                         }
//                       );
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// });

// router.post("/addNewInvoice", (req, res) => {
//   const {
//     detailList,
//     invoice_no,
//     inv_date,
//     challan_id,
//     buyername,
//     buyer_id,
//     challan_no,
//     consignee_id,
//     custname,
//     customeraddress,
//     consignee_cat,
//     modeoftransport,
//     po_no,
//     po_date,
//     vehicle_no,
//     grand_total,
//     advance,
//     net_total,
//     date_issue,
//     time_issue,
//     date_removal,
//     time_removal,
//     uid,
//     by_road,
//     buyer_addr,
//     consign_addr,
//     roundoff,
//     consigneename,
//     orderacceptance_id,
//     cgst,
//     basic_total,
//     sgst,
//     igst,
//     oa_id,
//     gstno,
//   } = req.body;
//   const chqty = req.body.qty;

//   console.log(req.body);

//   let finalnettotal;
//   if (net_total <= 0) {
//      finalnettotal = Math.abs(net_total);
//       //  finalnettotal = net_total)

//     pool.query(
//       "UPDATE order_acceptance SET remainingadvance = ? WHERE id = ?",
//       [finalnettotal, oa_id],
//       (err) => {
//         if (err) {
//           console.log("Error updating remainingadvance:", err);
//           return res.status(500).send("Error updating remaining advance");
//         }
//       }
//     );
//   } else {
//     pool.query(
//       "UPDATE order_acceptance SET remainingadvance = 0 WHERE id = ?",
//       [oa_id],
//       (err) => {
//         if (err) {
//           console.log("Error updating remainingadvance:", err);
//           return res.status(500).send("Error updating remaining advance");
//         }
//       }
//     );
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const formattedDate = formatDate(po_date);

//   // Fetch challan_id
//   pool.query(
//     `SELECT id FROM challans WHERE challan_no='${challan_no}'`,
//     (err, chid) => {
//       if (err) {
//         console.log("Error fetching challan ID:", err);
//         return res.status(500).send("Error fetching challan ID");
//       }
//       const challanid = chid[0]?.id || null;

//       pool.query(
//         `SELECT id, fname, lname, quot_serial FROM usermaster WHERE id=${uid}`,
//         (err, user) => {
//           if (err) {
//             console.log("Error fetching user info:", err);
//             return res.status(500).send("Error fetching user info");
//           }

//           pool.query(
//             "SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1;",
//             (err, result) => {
//               if (err) {
//                 console.log("Error fetching new invoice ID:", err);
//                 return res.status(500).send("Error fetching new invoice ID");
//               }

//               let lastNumber;
//               if (result[0] && result[0].invoice_no) {
//                 const match = result[0].invoice_no.match(/(\d+)$/);
//                 lastNumber = match ? parseInt(match[0]) : 0; // ✅ Change default to 0
//               } else {
//                 lastNumber = 0; // ✅ Ensure first entry starts from 1
//               }

//               const newId = lastNumber + 1; // ✅ Declare newId before logging it
//               console.log("New invoice number base:", newId);
//               console.log("match", lastNumber);

//               console.log("New invoice number base:", newId);

//               console.log("match", lastNumber);

//               const formattedTimeIssue = convertTime(time_issue);
//               const formattedTimeRemoval = convertTime(time_removal);
//               const invno = getInvNumber(newId, user);
//               const detailArray = Array.isArray(detailList)
//                 ? detailList
//                 : [detailList];

//               // Insert into invoices
//               pool.query(
//                 `INSERT INTO invoices (
//             invoice_no, inv_date, challan_id, consignee_id, consignee_cat, transport_mode, po_no, po_date, vehicle_no,
//             basic_total, cgst, sgst, igst, grand_total, advance, net_total, date_issue, time_issue, date_removal,
//             time_removal, uid, by_road, buyer_addr, consign_addr, roundoff, consigneename, orderacceptance_id, 
//             buyer_id, buyername, customeraddress,gstno
//           ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//                 [
//                   invno,
//                   inv_date,
//                   challanid,
//                   null,
//                   null,
//                   modeoftransport,
//                   po_no,
//                   formattedDate,
//                   vehicle_no,
//                   basic_total,
//                   cgst,
//                   sgst,
//                   igst,
//                   grand_total,
//                   advance,
//                   net_total,
//                   date_issue,
//                   formattedTimeIssue,
//                   date_removal,
//                   formattedTimeRemoval,
//                   uid,
//                   by_road,
//                   buyer_addr,
//                   consign_addr,
//                   roundoff,
//                   consigneename,
//                   orderacceptance_id,
//                   buyer_id,
//                   custname,
//                   customeraddress,
//                   gstno,
//                 ],
//                 (err, result) => {
//                   if (err) {
//                     console.log("Error inserting invoice record:", err);
//                     return res
//                       .status(500)
//                       .send("Error inserting invoice record");
//                   }

//                   const insertedInvoiceId = result.insertId; // ✅ Get the actual invoice ID

//                   // Insert invoice details using insertedInvoiceId instead of newId
//                   let pendingInserts = detailArray.length;

//                   if (pendingInserts === 0) {
//                     return res.send("POSTED");
//                   }

//                   detailArray.forEach(
//                     ({ id, plan_id, desc, qty, hsn, rate, amt }) => {
//                       pool.query(
//                         "INSERT INTO invoice_details (invoice_id, plan_id, `desc`, qty, hsn, rate, amt) VALUES ( ?, ?, ?, ?, ?, ?, ?)",
//                         [insertedInvoiceId, plan_id, desc, qty, hsn, rate, amt], // ✅ Use insertedInvoiceId
//                         (err, result) => {
//                           if (err) {
//                             console.log(
//                               "Error inserting invoice details:",
//                               err
//                             );
//                             return res
//                               .status(500)
//                               .send("Error inserting invoice details");
//                           }

//                           pendingInserts -= 1;
//                           if (pendingInserts === 0) {
//                             pool.query(
//                               `UPDATE challan_details 
//                        SET remainingqty = GREATEST(remainingqty - ?, 0)
//                        WHERE challan_id = ?`,
//                               [parseInt(chqty), challan_id],
//                               (err) => {
//                                 if (err) {
//                                   console.log(
//                                     "Error updating invoice_qty in challan_details:",
//                                     err
//                                   );
//                                   return res
//                                     .status(500)
//                                     .send(
//                                       "Error updating invoice_qty in challan_details"
//                                     );
//                                 }
//                                 console.log(
//                                   "invoice_qty updated successfully in challan_details"
//                                 );
//                                 return res.send("POSTED");
//                               }
//                             );
//                           }
//                         }
//                       );
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// });

//<------------------------------------------------------------------->




//<----------------------------edit invoice------------------------------>
router.get("/editInvoice/:id", (req, res) => {
  console.log(req.params);
  const cid = req.params.id;
  const q = `SELECT 
    i.*, 
    d.*, 
    c.chdate,
    c.challan_no,
    i.buyername AS consumer,
    i.customeraddress AS consumer_address
FROM 
    invoices i
JOIN 
    invoice_details d ON i.id = d.invoice_id
LEFT JOIN 
    challans c ON i.challan_id = c.id
WHERE 
    i.id = ?;

`;

  pool.query(q, [cid], (err, rows) => {
    if (err) {
      console.log(err);

      return res.json(err);
    }
    console.log(rows);
    return res.json(rows[0]);
  });
});
//<--------------------------------------------------------------------------->
//<-----------------------------------edit invoice 1------------------------->
router.get("/editInvoice1/:cid", (req, res) => {
  const cid = req.params.cid;
  const q =
    "SELECT id, Invoice_id, plan_id,invoice_details.desc, qty,hsn,rate,amt FROM invoice_details where invoice_id=" +
    cid +
    ";";

  pool.query(q, [cid], (err, rows) => {
    if (err) {
      return res.json(err);
    }

    return res.json(rows[0]);
  });
});
//<0------------------------------------------------------------------------------>
//<------------------------------get invoice---------------------------------------->
router.get("/getinvoice", (req, res) => {
  const q = `SELECT 
    i.id, 
    i.invoice_no, 
    i.inv_date, 
    i.buyername, 
    i.po_no, 
    i.po_date, 
    c.challan_no,  -- Fetching challan number
    pp.wo_no,  -- Fetching wo_no from production_plan instead of prod_plan_id
    oa.ref_no  -- Fetching from order_acceptance
FROM 
    invoices i
LEFT JOIN 
    challans c ON i.challan_id = c.id
LEFT JOIN 
    challan_details d ON c.id = d.challan_id
LEFT JOIN 
    production_plan_details ppd ON ppd.prod_plan_id = d.plan_id
LEFT JOIN 
    production_plan pp ON pp.id = ppd.prod_plan_id  -- Joining with production_plan to get wo_no
LEFT JOIN 
    order_acceptance oa ON oa.id = ppd.oa_id
ORDER BY 
    i.id DESC;


  `;

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    // Reverse the data array
    const reversedData = data.reverse();

    return res.json(reversedData);
  });
});


router.get("/getpodata/:id", (req, res) => {
  const id = req.params.id;
  // const q = `
  //   SELECT 
  //     po.*,
  //     e.cid,
  //     e.selectedcosting
  //   FROM po_master po
  //   LEFT JOIN indent i ON i.id = po.indentid
  //   LEFT JOIN bom_request br ON br.id = i.bomid
  //   LEFT JOIN production_plan_details ppd ON ppd.prod_plan_id = br.plan_id
  //   LEFT JOIN order_acceptance oa ON oa.id = ppd.oa_id
  //   LEFT JOIN quotation q ON q.qid = oa.qid
  //   LEFT JOIN enquiry_master e ON e.id = q.eid
  //   WHERE po.id = ?
  //   LIMIT 1
  // `;

  const q = `
  SELECT 
    po.*,
    e.cid,
    cm.costingname AS selectedcosting
  FROM po_master po
  LEFT JOIN indent i ON i.id = po.indentid
  LEFT JOIN bom_request br ON br.id = i.bomid
  LEFT JOIN production_plan_details ppd ON ppd.prod_plan_id = br.plan_id
  LEFT JOIN order_acceptance oa ON oa.id = ppd.oa_id
  LEFT JOIN quotation q ON q.qid = oa.qid
  LEFT JOIN enquiry_master e ON e.id = q.eid
  LEFT JOIN costing_master cm ON cm.id = e.cid
  WHERE po.id = ?
  LIMIT 1
`;

  let data = {};
  pool.query(q, [id], (err, costings) => {
    if (err) {
      return res.json(err);
    }

    if (costings && costings.length > 0) {
      const poid = costings[0].id;

      const q1 = `
          SELECT 
            pd.*,
            mt.id AS itemid,
            mt.item_code,
            mt.material_description,
            mt.unit,
            um.unit 
          FROM
            po_details pd
          INNER JOIN
            material_master mt ON mt.id = pd.itemid
          LEFT JOIN
            unitmaster um ON mt.unit = um.id
          WHERE
            pd.poid = ?
        `;
      pool.query(q1, [poid], (err, rows) => {
        if (err) {
          return res.json(err);
        }

        data = {
          ...costings[0],
          materialList: rows.map((material) => {
            const {
              id,
              itemid,
              item_code,
              material_description,
              unit,
              mid,
              qty,
              rates,
              indentid,
            } = material;
            return {
              id,
              mid,
              code: { item_code, material_description, unit },
              unit,
              itemid,
              description: material_description,
              qty,
              rate: rates,
              indentid,
            };
          }),
        };
        return res.json(data);
      });
    } else {
      return res.json({});
    }
  });
});


// router.get("/getpodata/:id", (req, res) => {
//   const id = req.params.id;
//   const q = "SELECT * FROM po_master WHERE id=? LIMIT 1";

//   let data = {};
//   pool.query(q, [id], (err, costings) => {
//     if (err) {
//       return res.json(err);
//     }

//     if (costings && costings.length > 0) {
//       const poid = costings[0].id;

//       const q1 = `
//           SELECT 
//             pd.*,
//             mt.id AS itemid,
//             mt.item_code,
//             mt.material_description,
//             mt.unit,
//             um.unit 
//           FROM
//             po_details pd
//           INNER JOIN
//             material_master mt ON mt.id = pd.itemid
//           LEFT JOIN
//             unitmaster um ON mt.unit = um.id
//           WHERE
//             pd.poid = ${poid}
//         `;
//       pool.query(q1, (err, rows) => {
//         if (err) {
//           return res.json(err);
//         }

//         data = {
//           ...costings[0],
//           materialList: rows.map((material) => {
//             const {
//               id,
//               itemid,
//               item_code,
//               material_description,
//               unit,
//               mid,
//               qty,
//               rates,
//               indentid,
//             } = material;
//             return {
//               id,
//               mid,
//               code: { item_code, material_description, unit },
//               unit,
//               itemid,
//               description: material_description,
//               qty,
//               rate: rates,
//               indentid,
//             };
//           }),
//         };
//         return res.json(data);
//       });
//     } else {
//       return res.json({});
//     }
//   });
// });

router.put("/editInvoiceInfo/:id", (req, res) => {
  console.log("Request Body:", req.body);

  const q = `
    UPDATE invoices i
    JOIN invoice_details id ON i.id = id.invoice_id
    LEFT JOIN challans c ON i.challan_id = c.id
    SET 
      i.buyername = ?, 
      i.consigneename = ?, 
      i.buyer_addr = ?, 
      i.consignee_cat = ?, 
      i.gstno = ?,
      i.po_no = ?, 
      i.po_date = ?,
      i.vehicle_no = ?,
      i.grand_total = ?,
      i.advance = ?,
      i.date_issue = ?,
      i.time_issue = ?,
      i.date_removal = ?,
      i.time_removal = ?,
      i.by_road = ?,
      i.consign_addr = ?,
      i.customeraddress = ?,
      id.hsn = ?, 
      id.rate = ?,
      c.challan_no = ?,
      c.chdate = ?
    WHERE i.id = ?`;

  pool.query(
    q,
    [
      req.body.buyername,
      req.body.consigneename,
      req.body.buyer_addr,
      req.body.consignee_cat,
      req.body.gstno,
      req.body.po_no,
      req.body.po_date,
      req.body.vehicle_no,
      req.body.grand_total,
      req.body.advance,
      req.body.date_issue,
      req.body.time_issue,
      req.body.date_removal,
      req.body.time_removal,
      req.body.by_road,
      req.body.consign_addr,
      req.body.consumer_address, // Assuming this maps to customeraddress
      req.body.hsn,
      req.body.rate,
      req.body.challan_no,
      req.body.chdate,
      req.params.id,
    ],
    (err, result, fields) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ error: "Failed to update data" });
      } else {
        return res.json({ message: "Invoice updated successfully" });
      }
    }
  );
});
//<---------------------------------------------------------------------------------->
//<-------------------------------------delete invoice ---------------------------------->
// router.delete("/deleteInvoice/:id", (req, res) => {
//   const id = req.params.id;

//   // Start a transaction
//   pool.getConnection((err, connection) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ error: "Error connecting to the database" });
//     }

//     connection.beginTransaction((err) => {
//       if (err) {
//         connection.release();
//         return res.status(500).json({ error: "Error starting transaction" });
//       }

//       // Step 1: Select qty from invoice_details based on invoice_id
//       const selectQtyQuery =
//         "SELECT qty FROM invoice_details WHERE invoice_id = ?";
//       connection.query(selectQtyQuery, [id], (err, qtyResults) => {
//         if (err) {
//           return connection.rollback(() => {
//             connection.release();
//             return res
//               .status(500)
//               .json({ error: "Error fetching quantity from invoice_details" });
//           });
//         }

//         console.log("Selected Quantities:", qtyResults);

//         const invoiceQty = qtyResults[0].qty || 0;

//         // Step 2: Select challan_id from invoices based on id
//         const selectChallanQuery =
//           "SELECT challan_id FROM invoices WHERE id = ?";
//         connection.query(selectChallanQuery, [id], (err, challanResults) => {
//           if (err) {
//             return connection.rollback(() => {
//               connection.release();
//               return res
//                 .status(500)
//                 .json({ error: "Error fetching challan_id from invoices" });
//             });
//           }

//           if (challanResults.length === 0) {
//             return connection.rollback(() => {
//               connection.release();
//               return res
//                 .status(404)
//                 .json({ error: "Challan ID not found for this invoice" });
//             });
//           }

//           const challanId = challanResults[0].challan_id;
//           console.log("Selected Challan ID:", challanId);

//           // Step 3: Delete from invoice_details
//           const deleteDetailsQuery =
//             "DELETE FROM invoice_details WHERE invoice_id = ?";
//           connection.query(deleteDetailsQuery, [id], (err, result) => {
//             if (err) {
//               return connection.rollback(() => {
//                 connection.release();
//                 return res
//                   .status(500)
//                   .json({ error: "Error deleting from invoice_details" });
//               });
//             }

//             // Step 4: Delete from invoices
//             const deleteInvoiceQuery = "DELETE FROM invoices WHERE id = ?";
//             connection.query(deleteInvoiceQuery, [id], (err, result) => {
//               if (err) {
//                 return connection.rollback(() => {
//                   connection.release();
//                   return res
//                     .status(500)
//                     .json({ error: "Error deleting from invoices" });
//                 });
//               }

//               // Step 5: Update challan_details qty based on challan_id
//               const updateChallanQuery = `
//                 UPDATE challan_details 
//                 SET remainingqty = remainingqty + ? WHERE challan_id =?
//               `;

//               connection.query(
//                 updateChallanQuery,
//                 [parseInt(invoiceQty), challanId],
//                 (err, updateResult) => {
//                   if (err) {
//                     return connection.rollback(() => {
//                       connection.release();
//                       return res
//                         .status(500)
//                         .json({ error: "Error updating challan_details qty" });
//                     });
//                   }

//                   // Step 6: Commit transaction
//                   connection.commit((err) => {
//                     if (err) {
//                       return connection.rollback(() => {
//                         connection.release();
//                         return res
//                           .status(500)
//                           .json({ error: "Error committing transaction" });
//                       });
//                     }

//                     connection.release();
//                     return res.json({
//                       message:
//                         "Invoice deleted and challan_details updated successfully",
//                       selectedQty: qtyResults,
//                       selectedChallanID: challanId,
//                     });
//                   });
//                 }
//               );
//             });
//           });
//         });
//       });
//     });
//   });
// });

router.delete("/deleteInvoice/:id", (req, res) => {
  const id = req.params.id;

  // Start a transaction
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error connecting to the database" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Error starting transaction" });
      }

      // Step 1: Select qty from invoice_details based on invoice_id
      const selectQtyQuery =
        "SELECT qty FROM invoice_details WHERE invoice_id = ?";
      connection.query(selectQtyQuery, [id], (err, qtyResults) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            return res
              .status(500)
              .json({ error: "Error fetching quantity from invoice_details" });
          });
        }

        console.log("Selected Quantities:", qtyResults);

        const invoiceQty = qtyResults[0]?.qty || 0;

        // Step 2: Select challan_id from invoices based on id
        const selectChallanQuery =
          "SELECT challan_id FROM invoices WHERE id = ?";
        connection.query(selectChallanQuery, [id], (err, challanResults) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return res
                .status(500)
                .json({ error: "Error fetching challan_id from invoices" });
            });
          }

          if (challanResults.length === 0) {
            return connection.rollback(() => {
              connection.release();
              return res
                .status(404)
                .json({ error: "Challan ID not found for this invoice" });
            });
          }

          const challanId = challanResults[0].challan_id;
          console.log("Selected Challan ID:", challanId);

          // Step 3: Delete from invoice_transactions
          const deleteTransactionsQuery =
            "DELETE FROM invoice_transactions WHERE invoice_id = ?";
          connection.query(deleteTransactionsQuery, [id], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return res
                  .status(500)
                  .json({ error: "Error deleting from invoice_transactions" });
              });
            }

            console.log("Deleted from invoice_transactions:", result.affectedRows);

            // Step 4: Delete from invoice_details
            const deleteDetailsQuery =
              "DELETE FROM invoice_details WHERE invoice_id = ?";
            connection.query(deleteDetailsQuery, [id], (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  return res
                    .status(500)
                    .json({ error: "Error deleting from invoice_details" });
                });
              }

              console.log("Deleted from invoice_details:", result.affectedRows);

              // Step 5: Delete from invoices
              const deleteInvoiceQuery = "DELETE FROM invoices WHERE id = ?";
              connection.query(deleteInvoiceQuery, [id], (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    return res
                      .status(500)
                      .json({ error: "Error deleting from invoices" });
                  });
                }

                console.log("Deleted from invoices:", result.affectedRows);

                // Step 6: Update challan_details qty based on challan_id
                const updateChallanQuery = `
                  UPDATE challan_details 
                  SET remainingqty = remainingqty + ? 
                  WHERE challan_id = ?
                `;

                connection.query(
                  updateChallanQuery,
                  [parseInt(invoiceQty), challanId],
                  (err, updateResult) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        return res
                          .status(500)
                          .json({ error: "Error updating challan_details qty" });
                      });
                    }

                    console.log("Updated challan_details:", updateResult.affectedRows);

                    // Step 7: Commit transaction
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release();
                          return res
                            .status(500)
                            .json({ error: "Error committing transaction" });
                        });
                      }

                      connection.release();
                      return res.json({
                        message:
                          "Invoice deleted successfully (invoices, invoice_details, invoice_transactions) and challan_details updated",
                        selectedQty: qtyResults,
                        selectedChallanID: challanId,
                      });
                    });
                  }
                );
              });
            });
          });
        });
      });
    });
  });
});

//<--------------------------------------------------------------->
//<----------------------------get employee---------------------------->
router.get("/getemployee", (req, res) => {
  const q = "SELECT * from employee_master";

  pool.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data);
  });
});
//<------------------------------------------------------------>
//<--------------------add employee----------------------------->
router.post("/addemployee", (req, res) => {
  const { id, emp_id, name, email, contactno } = req.body;
  pool.query(
    `insert into employee_master values(?,?,?,?,?)`,
    [id, emp_id, name, email, contactno],
    (err, result) => {
      if (err) {
      } else {
        return res.send("POSTED");
      }
    }
  );
});

//<------------------------------------------------------------->

const getproNumber = (quot, user, newId) => {
  const { fname = "", lname = "", quot_serial = "" } = user[0] || {};
  let quotNo = `P.INV/${quot_serial}/${getCurrentFinancialYear()}/`;
  if (quot?.length) {
    const number = quot[0]?.ref_no?.split("/")[3];
    quotNo = `${quotNo}${(+newId[0]?.quot_serial || 0) + 1 || ""}`;
  } else {
    quotNo = `${quotNo}${1}`;
  }

  return quotNo;
};

const getOrderRefNumber = (quot, user) => {
  const { fname = "", lname = "", quot_serial = "" } = user[0] || {};
  let quotNo = `OA/${quot_serial}/${getCurrentFinancialYear()}/`;
  if (quot?.length) {
    const number = quot[0]?.ref_no?.split("/")[3];
    quotNo = `${quotNo}${(+number || 0) + 1 || ""}`;
  } else {
    quotNo = `${quotNo}${1}`;
  }

  return quotNo;
};

const getProductionNumber = (number, user) => {
  const { fname = "", lname = "", quot_serial } = user[0] || {};
  let orderNo = `PROD/${quot_serial}/${getCurrentFinancialYear()}/${number}`;
  return orderNo;
};
const getChallanNumber = (number, user) => {
  const { fname = "", lname = "", quot_serial } = user[0] || {};
  let orderNo = `CHL/${quot_serial}/${getCurrentFinancialYear()}/${number}`;
  return orderNo;
};
const getInvNumber = (number, user) => {
  const { fname = "", lname = "", quot_serial } = user[0] || {};
  let orderNo = `SEP/${quot_serial}/${getCurrentFinancialYear()}/${number}`;
  return orderNo;
};
const getBOMNumber = (number, user) => {
  const { fname = "", lname = "", quot_serial } = user[0] || {};
  let orderNo = `BOM/${quot_serial}/${getCurrentFinancialYear()}/${number}`;
  return orderNo;
};

const getIndentNumber = (number, user) => {
  const { fname = "", lname = "", quot_serial } = user[0] || {};
  let orderNo = `IND/${quot_serial}/${getCurrentFinancialYear()}/${number}`;
  return orderNo;
};

const getPONumber = (number, user) => {
  const { fname = "", lname = "", quot_serial } = user[0] || {};
  let orderNo = `PO/${quot_serial}/${getCurrentFinancialYear()}/${number}`;
  return orderNo;
};

const getInwardNumber = (number, user) => {
  const { fname = "", lname = "", quot_serial } = user || {};
  let orderNo = `INW/${user}/${getCurrentFinancialYear()}/${number}`;
  return orderNo;
};
const getquantityInwardNumber = (number, user) => {
  const { fname = "", lname = "", quot_serial } = user[0] || {};
  let orderNo = `QC/${user}/${getCurrentFinancialYear()}/${number}`;
  return orderNo;
};

const getCurrentFinancialYear = () => {
  const today = new Date();
  let fiscalyear = "";
  if (today.getMonth() + 1 <= 3) {
    fiscalyear =
      (today.getFullYear() - 1).toString().slice(2) +
      "-" +
      today.getFullYear().toString().slice(2);
  } else {
    fiscalyear =
      today.getFullYear().toString().slice(2) +
      "-" +
      (today.getFullYear() + 1).toString().slice(2);
  }
  return fiscalyear;
};
//<----------------------------------------------------------------------------------->
//<--------------------------print for profomainvoice------------------------->
router.get("/profomainvoice/:id", (req, res) => {
  // console.log(req.params.id,'reqqqqqqqqqqqqqqqqqq');
  const q = `
    SELECT
      o.id,
      o.qid,
      o.orderacc_date,
      quotref,
      e.custname,
      o.testing_div,
      o.fileflag,
      deliveryperiod,
      ref_no,
      capacity,
      address,
      voltageratio,
      consumer,
      consumer_address,  -- Include the 'consumer_address' field in the query
      o.ostatus,
      o.consignor,
      o.consignee,
      o.quantity,
      o.ponum,
      o.podate,
      o.basicrate,
      o.advance,
      o.gstno,
      e.priratio,
      e.secratio,
      e.type
    FROM
      order_acceptance o
    INNER JOIN
      quotation q ON q.qid = o.qid
    INNER JOIN
      enquiry_master e ON e.id = q.eid
    WHERE
      o.ostatus = 1
    AND o.id  IN (SELECT oid FROM proforma_invoice) AND o.id=?
    ORDER BY
      o.id DESC;
  `;

  const q1 = `
    SELECT cgst, sgst,cgsttype,sgsttype
    FROM quot_taxes
    WHERE qid = ?
    ORDER BY qid DESC
    LIMIT 1
  `;

  const q2 = `
    SELECT pro_invrefno, pro_invdate
    FROM proforma_invoice
    WHERE oid = ?;
  `;

  const customerId = req.params.id;

  pool.query(q, [customerId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // console.log(data,'messssssssaaaaaaaggggggggggeeeeeeeeeeeeeeee')
    pool.query(q1, [customerId], (err2, data1) => {
      if (err2) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      pool.query(q2, [customerId], (err3, data2) => {
        if (err3) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data?.length) {
          const response = {
            custname: data[0].custname,
            cgsttype: data1[0].cgsttype,
            sgsttype: data1[0].sgsttype,
            gstno: data[0].gstno,
            address: data[0].address,
            consumer_address: data[0].consumer_address, // Include 'consumer_address' in the response
            ponum: data[0].ponum,
            podate: data[0].podate,
            capacity: data[0].capacity,
            type: data[0].type,
            voltageratio: data[0].voltageratio,
            pro_invrefno: data2[0]?.pro_invrefno,
            quantity: data[0].quantity,
            basicrate: data[0].basicrate,
            advance: data[0].advance,
            consumer: data[0].consumer,
            cgst: data1[0]?.cgst || 9,
            sgst: data1[0]?.sgst || 9,
            pro_invdate: data2[0]?.pro_invdate,
          };
          // console.log(response)
          return res.json(response);
        } else {
          return res
            .status(404)
            .json({ error: "No data found for the provided ID" });
        }
      });
    });
  });
});

//<------------------------------------------------------------------>
//<-----------------------------View and print for Costing 1-------------------------------->

router.get("/view/:id", (req, res) => {
  const cid = req.params.id;
  const sql = `
  SELECT
  cm.*,
  cd.id AS detail_id,
  cd.mid,
  cd.quantity,
  cd.rate,
  cd.amount,
  mt.item_code,
  mt.material_description,
  mt.unit,
  um.unit AS corresponding_unit,
  em.capacity,
  em.voltageratio,
  em.typetaping,
  em.typetaping AS Tapping
  
FROM
  costing_master cm
LEFT JOIN
  costing_details cd ON cm.id = cd.cid
LEFT JOIN
  material_master mt ON mt.id = cd.mid
LEFT JOIN
  unitmaster um ON mt.unit = um.id
LEFT JOIN
  enquiry_master em ON cm.eid = em.id 
WHERE
  cm.id = ?;


  `;

  pool.query(sql, [cid], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching data" });
    }
    data.forEach((row) => {
      if (
        row.typetaping.includes(
          "℅ H. V. variation of +2.5℅ to -5℅ in equal steps of 2.5℅ Off circuit tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -10℅ in equal steps of 2.5℅ Off circuit tap changer"
        )
      ) {
        row.typetaping = "OCTC";
      } else if (
        row.typetaping.includes(
          "℅ H. V. variation of +10℅ to -10℅ in equal steps of 1.25℅ On load tap changer"
        ) ||
        row.typetaping.includes(
          "℅ H. V. variation of +5℅ to -15℅ in equal steps of 1.25℅ On load tap changer"
        )
      ) {
        row.typetaping = "OLTC";
      } else if (row.typetaping.includes("No Tapping")) {
        row.typetaping = "NP";
      } else {
        row.typetaping = "";
      }
    });

    return res.json(data);
  });
});

//<-----------------------------View and print for Costing 2-------------------------------->
router.get("/view2/:id", (req, res) => {
  const cid = req.params.id;
  const sql = `
  SELECT
  cm2.*,
  cd2.id AS detail_id,
  cd2.mid,
  cd2.quantity,
  cd2.rate,
  cd2.amount,
  mt.item_code,
  mt.material_description,
  mt.unit,
  um.unit AS corresponding_unit,
  em.capacity,
  em.voltageratio
FROM
  costing_master2 cm2
LEFT JOIN
  costing_details2 cd2 ON cm2.id = cd2.cid
LEFT JOIN
  material_master mt ON mt.id = cd2.mid
LEFT JOIN
  unitmaster um ON mt.unit = um.id
LEFT JOIN
  enquiry_master em ON cm2.id = em.id 
WHERE
  cm2.id = ?;


  `;

  pool.query(sql, [cid], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching data" });
    }

    return res.json(result);
  });
});

//<-----------------------------Delete for eqnquiry-------------------------------->

router.delete("/deleteEnq/:id", (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM enquiry_master WHERE id=? AND enqstatus != 5";

  pool.query(q, [id], (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the item." });
    }

    if (data.affectedRows > 0) {
      return res.json({ message: "Item Deleted Successfully!!!!" });
    } else {
      return res
        .status(200)
        .json({ message: "Cannot delete item with enqstatus 5." });
    }
  });
});

//<-----------------------------Delete for material master-------------------------------->
router.delete("/deleteMaterial/:id", (req, res) => {
  const id = req.params.id;
  const deleteMaterialQuery = "DELETE FROM material_master WHERE id=?;";
  const deleteStockQuery = "DELETE FROM stock WHERE itemid=?;";

  pool.query(deleteMaterialQuery, [id], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    } else {
      // After deleting from material_master, delete from stock
      pool.query(deleteStockQuery, [id], (stockErr, stockData) => {
        if (stockErr) {
          return res.status(500).json(stockErr);
        } else {
          return res.json(data);
        }
      });
    }
  });
});

//<-----------------------------Delete for po-------------------------------->

router.delete("/deletePorder/:id", (req, res) => {
  const { id } = req.params;

  const selectQuery =
    "SELECT itemid, qty,indentid FROM po_details WHERE poid = ?";

  pool.query(selectQuery, [id], (selectErr, selectResult) => {
    if (selectErr) {
      return res
        .status(500)
        .json({ error: "Failed to fetch items for deletion" });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "No items found for deletion" });
    }

    const updatePromises = selectResult.map((item) => {
      const updateQuery = `
          UPDATE indent_details
          SET qty = qty + ?
          WHERE indentid = ? AND itemid = ?;
        `;

      return new Promise((resolve, reject) => {
        pool.query(
          updateQuery,
          [item.qty, item.indentid, item.itemid],
          (updateErr, updateResult) => {
            if (updateErr) {
              return reject(updateErr);
            } else {
              return resolve();
            }
          }
        );
      });
    });

    Promise.all(updatePromises)
      .then(() => {
        const deletePoMasterQuery = "DELETE FROM po_master WHERE id = ?";

        return new Promise((resolve, reject) => {
          pool.query(deletePoMasterQuery, [id], (deleteErr, deleteResult) => {
            if (deleteErr) {
              return reject(deleteErr);
            }

            if (deleteResult.affectedRows === 0) {
              return reject(new Error("Record not found"));
            }

            resolve();
          });
        });
      })
      .then(() => {
        const deletePoDetailsQuery = "DELETE FROM po_details WHERE poid = ?";

        pool.query(
          deletePoDetailsQuery,
          [id],
          (deletePoDetailsErr, deletePoDetailsResult) => {
            if (deletePoDetailsErr) {
              return res
                .status(500)
                .json({ error: "Failed to delete po_details records" });
            }

            if (deletePoDetailsResult.affectedRows === 0) {
              return res
                .status(404)
                .json({ error: "No po_details records found to delete" });
            }

            return res
              .status(200)
              .json({ message: "Record deleted successfully" });
          }
        );
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ error: error.message || "An error occurred" });
      });
  });
});

//<--------------------------------Add costing----------------------------->
router.put("/addcost", (req, res) => {
  const q = "Update enquiry_master SET enqstatus=1 Where id=?";

  if (!req.body?.length) {
    return res.status(400).send("Sorry, please select enquiries");
  }

  req.body?.forEach?.((element, index) => {
    pool.query(q, [element], (err, result, feilds) => {
      if (err) {
      } else {
        if (index === req.body?.length - 1) {
          return res.send("Updated");
        }
      }
    });
  });
});
//<--------------------------------View production plan list----------------------------->

router.get("/getproductinlist/:id", (req, res) => {
  const id = req.params.id;
  const q = `
  SELECT
      pp.*,
      e.id AS e_id,
      e.custname,
      e.capacity,
      e.priratio,
      e.secratio,
      e.address, 
      e.hvvoltage,
      e.lvvoltage,
      e.consumertype,
      e.areaofdispatch,
      e.vectorgroup,
      e.matofwind,
      e.typecolling,
      e.typetaping,
      e.tapingSwitch,
      e.uid,
      e.core,
      e.voltageratio,
      e.type,
      o.consumer,
      o.orderacc_date, 

      o.ostatus,
      o.testing_div, 
      q.*,
      q.transport,
      qt.*
  FROM
      production_plan pp
  INNER JOIN
      production_plan_details ppd ON ppd.prod_plan_id = pp.id
  INNER JOIN
      order_acceptance o ON o.id = ppd.oa_id
  INNER JOIN
      quotation q ON q.qid = o.qid
  INNER JOIN
      quot_taxes qt ON qt.qid = o.qid
  INNER JOIN
      enquiry_master e ON e.id = q.eid
  WHERE
      pp.id = ?
`;

  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json(data[0] || {});
  });
});

//<--------------------------------Get Customer List for Transfer Stock----------------------------->
router.get("/getCustomerListForTransferStock", (req, res) => {
  try {
    const query = `
      SELECT
      MIN(em.id) AS enquiry_master_id,
      em.custname
      FROM
          bom_request br
      INNER JOIN
          production_plan pp ON pp.id = br.plan_id
      INNER JOIN
          production_plan_details ppd ON ppd.prod_plan_id = pp.id
      INNER JOIN
          order_acceptance oa ON oa.id = ppd.oa_id
      INNER JOIN
          quotation q ON q.qid = oa.qid
      INNER JOIN 
          enquiry_master em ON em.id = q.eid
      INNER JOIN 
          costing_master cm ON cm.id = br.costing_id 
      WHERE
          br.isissue = 0
      GROUP BY em.custname;
    `;

    pool.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Internal Server Error");
      }

      return res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

// router.get("/getCostingListForTransStock/:custname", (req, res) => {
//   try {
//     const { custname } = req.params;
//     if (!custname) {
//       return res.status(400).send("Something went wrong");
//     }

//     const query = `
//     SELECT DISTINCT
//       -- em.id AS enquiry_master_id,
//       IFNULL(cm.costingname, em.selectedcosting) AS costingname
//       FROM
//           bom_request br
//       INNER JOIN
//           production_plan pp ON pp.id = br.plan_id
//       INNER JOIN
//           production_plan_details ppd ON ppd.prod_plan_id = pp.id
//       INNER JOIN
//           order_acceptance oa ON oa.id = ppd.oa_id
//       INNER JOIN
//           quotation q ON q.qid = oa.qid
//       INNER JOIN 
//           enquiry_master em ON em.id = q.eid
//       INNER JOIN 
//            costing_master cm ON cm.id = br.costing_id  
//        WHERE
//     br.isissue = 0 AND em.custname = ?;
//     `;

//     pool.query(query, [custname], (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.send("Internal Server Error");
//       }

//       return res.send(result);
//     });
//   } catch (error) {
//     console.log(error);
//     return res.send("Internal Server Error");
//   }
// });

router.post("/getCostingListForTransStock", (req, res) => {
  try {
    const { custname } = req.body;
    if (!custname) {
      return res.status(400).send("Something went wrong");
    }

    const query = `
    SELECT DISTINCT
      IFNULL(cm.costingname, em.selectedcosting) AS costingname
      FROM
          bom_request br
      INNER JOIN
          production_plan pp ON pp.id = br.plan_id
      INNER JOIN
          production_plan_details ppd ON ppd.prod_plan_id = pp.id
      INNER JOIN
          order_acceptance oa ON oa.id = ppd.oa_id
      INNER JOIN
          quotation q ON q.qid = oa.qid
      INNER JOIN 
          enquiry_master em ON em.id = q.eid
      INNER JOIN 
          costing_master cm ON cm.id = br.costing_id  
       WHERE
    br.isissue = 0 AND em.custname = ?;
    `;

    // const query = `
    // SELECT DISTINCT
    //   cm.costingname AS costingname
    //   FROM
    //       bom_request br
    //   INNER JOIN
    //       production_plan pp ON pp.id = br.plan_id
    //   INNER JOIN
    //       production_plan_details ppd ON ppd.prod_plan_id = pp.id
    //   INNER JOIN
    //       order_acceptance oa ON oa.id = ppd.oa_id
    //   INNER JOIN
    //       quotation q ON q.qid = oa.qid
    //   INNER JOIN 
    //       enquiry_master em ON em.id = q.eid
    //   INNER JOIN 
    //       costing_master cm ON cm.id = em.cid  
    //    WHERE
    // br.isissue = 0 AND em.custname = ?;
    // `;

    pool.query(query, [custname], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }

      return res.json(result);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/getProdRefFroTransStock", (req, res) => {
  const { costingname, custname } = req.body;
  try {
    if (!costingname) {
      return res.status(400).send("Something went wrong");
    }

    const query = `
      SELECT
      em.id AS enquiry_master_id,
      em.custname,
      (ppd.qty - IFNULL(ppd.challan_qty, 0)) AS qty,
      pp.wo_no,
      IFNULL(cm.costingname, em.selectedcosting) AS costingname,
      ppd.id AS prod_plan_de_id,
      br.id AS bom_req_id
      FROM
          bom_request br
      INNER JOIN
          production_plan pp ON pp.id = br.plan_id
      INNER JOIN
          production_plan_details ppd ON ppd.prod_plan_id = pp.id
      INNER JOIN
          order_acceptance oa ON oa.id = ppd.oa_id
      INNER JOIN
          quotation q ON q.qid = oa.qid
      INNER JOIN 
          enquiry_master em ON em.id = q.eid
      INNER JOIN 
         costing_master cm ON cm.id = br.costing_id
      WHERE
      br.isissue = 0 AND
      em.custname = ? AND
      (em.selectedcosting = ? OR cm.costingname = ?);
    `;
    // const query = `
    //   SELECT
    //   em.id AS enquiry_master_id,
    //   em.custname,
    //   (ppd.qty - IFNULL(ppd.challan_qty, 0)) AS qty,
    //   pp.wo_no,
    //   cm.costingname AS costingname,
    //   ppd.id AS prod_plan_de_id,
    //   br.id AS bom_req_id
    //   FROM
    //       bom_request br
    //   INNER JOIN
    //       production_plan pp ON pp.id = br.plan_id
    //   INNER JOIN
    //       production_plan_details ppd ON ppd.prod_plan_id = pp.id
    //   INNER JOIN
    //       order_acceptance oa ON oa.id = ppd.oa_id
    //   INNER JOIN
    //       quotation q ON q.qid = oa.qid
    //   INNER JOIN 
    //       enquiry_master em ON em.id = q.eid
    //   INNER JOIN 
    //      costing_master cm ON cm.id = em.cid
    //   WHERE
    //   br.isissue = 0 AND
    //   em.custname = ? AND
    //   cm.costingname = ?;
    // `;

    pool.query(query, [custname, costingname, costingname], (err, result) => {
      if (err) {
        console.log(err);
        return res.send("Internal Server Error");
      }
      return res.send(result);
    });
  } catch (error) {
    console.log(error);
    return res.send("Internal Server Error");
  }
});

router.post("/getFromCustomerListForTransferStock", (req, res) => {
  console.log(req.body, "ithe yeaty ka");

  try {
    const { costingname, custname } = req.body;
    if (!costingname) {
      return res.status(400).send("Something went wrong");
    }

    const query = `
      SELECT
        MIN(em.id) AS enquiry_master_id,
        em.custname
      FROM
        bom_request br
      INNER JOIN production_plan pp ON pp.id = br.plan_id
      INNER JOIN production_plan_details ppd ON ppd.prod_plan_id = pp.id
      INNER JOIN order_acceptance oa ON oa.id = ppd.oa_id
      INNER JOIN quotation q ON q.qid = oa.qid
      INNER JOIN enquiry_master em ON em.id = q.eid
      LEFT JOIN costing_master cm  ON cm.id = br.costing_id 
      WHERE
        (em.selectedcosting = ? 
        OR cm.costingname = ?)
        AND IFNULL(ppd.readyqty, 0) > 0
        AND em.custname NOT IN(?)
      GROUP BY
        em.custname;
    `;
    // const query = `
    //   SELECT
    //     MIN(em.id) AS enquiry_master_id,
    //     em.custname
    //   FROM
    //     bom_request br
    //   INNER JOIN production_plan pp ON pp.id = br.plan_id
    //   INNER JOIN production_plan_details ppd ON ppd.prod_plan_id = pp.id
    //   INNER JOIN order_acceptance oa ON oa.id = ppd.oa_id
    //   INNER JOIN quotation q ON q.qid = oa.qid
    //   INNER JOIN enquiry_master em ON em.id = q.eid
    //   LEFT JOIN costing_master cm ON cm.id = em.cid 
    //   WHERE
    //     cm.costingname = ?
    //     AND IFNULL(ppd.readyqty, 0) > 0
    //     AND em.custname NOT IN(?)
    //   GROUP BY
    //     em.custname;
    // `;

    pool.query(query, [costingname, costingname, custname], (err, result) => {
      if (err) {
        console.log("Database Error:", err);
        return res.send("Internal Server Error");
      }

      // Log full result for clarity
      // console.log("Query Result:", result);

      // Log only the customer names
      // result.forEach(row => {
      //   console.log("Fetched Customer Name:", row.custname);
      // });

      return res.send(result);
    });
  } catch (error) {
    console.log("Catch Error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/getProdRefForFromCust", (req, res) => {
  const { costingname, custname } = req.body;

  if (!costingname || !custname) {
    return res.status(400).send("Something went wrong");
  }

  try {

    const query = `
      SELECT
        em.id AS enquiry_master_id,
        em.custname,
        ppd.readyqty,
        IFNULL(cm.costingname, em.selectedcosting) AS costingname,
        pp.wo_no,
        ppd.id AS prod_plan_de_id,
        br.id AS bom_req_id,
        MIN(pm.id) AS po_id,       -- ✅ First PO ID to avoid duplicates
        MIN(i.id) AS indent_id     -- ✅ First indent ID
      FROM production_plan pp
      INNER JOIN production_plan_details ppd 
        ON ppd.prod_plan_id = pp.id
      INNER JOIN order_acceptance oa 
        ON oa.id = ppd.oa_id
      INNER JOIN quotation q 
        ON q.qid = oa.qid
      INNER JOIN enquiry_master em 
        ON em.id = q.eid
      LEFT JOIN bom_request br 
        ON br.plan_id = pp.id
      LEFT JOIN costing_master cm 
        ON cm.id = br.costing_id         -- ✅ FIXED JOIN
      LEFT JOIN indent i 
        ON i.bomid = br.id
      LEFT JOIN po_master pm 
        ON pm.indentid = i.id
      WHERE
        (em.selectedcosting = ? OR cm.costingname = ?)
        AND IFNULL(ppd.readyqty, 0) > 0
        AND em.custname = ?
      GROUP BY
        pp.wo_no, em.id, em.custname, ppd.readyqty, cm.costingname, em.selectedcosting, 
        ppd.id, br.id;
    `;

    // const query = `
    //   SELECT
    //     em.id AS enquiry_master_id,
    //     em.custname,
    //     ppd.readyqty,
    //     IFNULL(cm.costingname, em.selectedcosting) AS costingname,
    //     pp.wo_no,
    //     ppd.id AS prod_plan_de_id,
    //     br.id AS bom_req_id,
    //     pm.id AS po_id,
    //     i.id AS indent_id
    //   FROM production_plan pp
    //   INNER JOIN production_plan_details ppd 
    //     ON ppd.prod_plan_id = pp.id
    //   INNER JOIN order_acceptance oa 
    //     ON oa.id = ppd.oa_id
    //   INNER JOIN quotation q 
    //     ON q.qid = oa.qid
    //   INNER JOIN enquiry_master em 
    //     ON em.id = q.eid
    //   INNER JOIN costing_master cm 
    //     ON cm.eid = em.id
    //   LEFT JOIN bom_request br 
    //     ON br.plan_id = pp.id              -- Changed to LEFT JOIN so missing BOMs won't drop the row
    //   LEFT JOIN indent i 
    //     ON i.bomid = br.id                 -- Changed to LEFT JOIN so missing indents won't drop the row
    //   LEFT JOIN po_master pm 
    //     ON pm.indentid = i.id               -- Already a LEFT JOIN
    //   WHERE
    //     (em.selectedcosting = ? OR cm.costingname = ?)
    //     AND IFNULL(ppd.readyqty, 0) > 0
    //     AND em.custname = ?;
    // `;
    //     const query = `
    //   SELECT
    //     em.id AS enquiry_master_id,
    //     em.custname,
    //     ppd.readyqty,
    //     IFNULL(cm.costingname, em.selectedcosting) AS costingname,
    //     pp.wo_no,
    //     ppd.id AS prod_plan_de_id,
    //     br.id AS bom_req_id,
    //     MIN(pm.id) AS po_id,         -- Take the first PO ID to avoid duplicates
    //     MIN(i.id) AS indent_id       -- Take the first indent ID
    //   FROM production_plan pp
    //   INNER JOIN production_plan_details ppd 
    //     ON ppd.prod_plan_id = pp.id
    //   INNER JOIN order_acceptance oa 
    //     ON oa.id = ppd.oa_id
    //   INNER JOIN quotation q 
    //     ON q.qid = oa.qid
    //   INNER JOIN enquiry_master em 
    //     ON em.id = q.eid
    //   INNER JOIN costing_master cm 
    //     ON cm.eid = em.id
    //   LEFT JOIN bom_request br 
    //     ON br.plan_id = pp.id
    //   LEFT JOIN indent i 
    //     ON i.bomid = br.id
    //   LEFT JOIN po_master pm 
    //     ON pm.indentid = i.id
    //   WHERE
    //     (em.selectedcosting = ? OR cm.costingname = ?)
    //     AND IFNULL(ppd.readyqty, 0) > 0
    //     AND em.custname = ?
    //   GROUP BY
    //     pp.wo_no, em.id, em.custname, ppd.readyqty, cm.costingname, em.selectedcosting, 
    //     ppd.id, br.id
    // `;

    pool.query(query, [costingname, costingname, custname], (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).send("Internal Server Error");
      }
      console.log("Final Query Result:", result);
      return res.send(result);
    });
  } catch (error) {
    console.error("Catch Error:", error);
    return res.status(500).send("Internal Server error");
  }
});


// router.post("/getProdRefForFromCust", (req, res) => {
//   const { costingname, custname } = req.body;
//   try {
//     if (!costingname || !custname) {
//       return res.status(400).send("Something went wrong");
//     }

//     const query = `
//    SELECT
//       em.id AS enquiry_master_id,
//       em.custname,
//       ppd.readyqty,
//       IFNULL(cm.costingname, em.selectedcosting) AS costingname,
//       pp.wo_no,
//       ppd.id AS prod_plan_de_id,
//       br.id AS bom_req_id,
//       pm.id AS po_id,
//       i.id as indent_id
//       FROM
//           bom_request br
//       INNER JOIN
//           production_plan pp ON pp.id = br.plan_id
//       INNER JOIN
//           production_plan_details ppd ON ppd.prod_plan_id = pp.id
//       INNER JOIN
//           order_acceptance oa ON oa.id = ppd.oa_id
//       INNER JOIN
//           quotation q ON q.qid = oa.qid
//       INNER JOIN 
//           enquiry_master em ON em.id = q.eid
//       INNER JOIN 
//           costing_master cm ON cm.eid = em.id
//       INNER JOIN 
//           indent i ON i.bomid = br.id
//       LEFT JOIN 
//           po_master pm ON pm.indentid = i.id
//       WHERE
//       (em.selectedcosting = ? OR cm.costingname = ?)
//       AND IFNULL(ppd.readyqty,0) > 0 AND em.custname = ?;
//     `;

//     pool.query(query, [costingname, costingname, custname], (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.send("Internal Server Error");
//       }
//       console.log("Query Result:", result);

//       return res.send(result);
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal Server error");
//   }
// });

// router.post('/transferStock', async (req, res) => {
//   console.log(req.body);
//   const { fromcust, tocust, costing } = req.body;
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();

//     const query = 'CALL transferStcok(?,?,?);'

//     for (const from of fromcust) {
//       const { prod_plan_de_id, bom_req_id, transferQty } = from;
//       if (transferQty <= 0) {
//         continue
//       }
//       await connection.query(query, [prod_plan_de_id, bom_req_id, transferQty]);
//     }

//     const query1 = `
//       UPDATE production_plan_details
// 	    SET readyqty = ?,
// 	    remaningredyqty = 0,
// 	    bomissued = 1
// 	    WHERE id = ?;
//     `
//     const { qty, prod_plan_de_id, bom_req_id } = tocust
//     await connection.query(query1, [qty, prod_plan_de_id]);

//     const query2 = `UPDATE bom_request SET isissue = 1 WHERE id = ?;`
//     await connection.query(query2, [bom_req_id]);

//     await connection.commit();
//     return res.send("Stock Transfered Successfully");
//   } catch (error) {
//     console.log(error)
//     await connection.rollback();
//     return res.status(500).send("Internal Server Error")
//   } finally {
//     connection.release();
//   }
// })

// router.post("/transferStock", async (req, res) => {
//   console.log(req.body);
//   // return res.status(500).send("Internal Server Error");

//   const { fromcust, tocust, costing } = req.body;
//   const query = "CALL transferStcok(?,?,?);";
//   const query1 = "CALL updateProdPlanDet_transStock(?,?,?,?,?)";

//   // const query2 = `UPDATE bom_request SET isissue = 1 WHERE id = ?;`;

//   const query3 = `
//       SELECT cd.id, cd.mid, cd.quantity FROM costing_details cd
//       LEFT JOIN enquiry_master em ON em.cid = cd.cid
//       WHERE em.id = ?;
//   `;

//   // return res.send("Stock");
//   try {
//     pool.getConnection((err, connection) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }
//       const reciveQty = fromcust?.reduce(
//         (total, current) => total + current.transferQty,
//         0
//       );

//       connection.beginTransaction(async (err) => {
//         if (err) {
//           console.log(err);
//           throw err;
//         }

//         for (const from of fromcust) {
//           const {
//             prod_plan_de_id,
//             bom_req_id,
//             transferQty,
//             enquiry_master_id,
//             readyqty,
//             po_id,
//             indent_id,
//           } = from;
//           if (transferQty <= 0) {
//             continue;
//           }

//           connection.query(
//             query,
//             [prod_plan_de_id, bom_req_id, transferQty],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//                 connection.rollback(() => {
//                   connection.release();
//                   return res.status(500).send("Internal Server Error");
//                 });
//               }

//               const remainingQty = result?.[0]?.[0]?.remainingQty;
//               // });

//               connection.query(
//                 "UPDATE po_details SET isTransfer = 1 WHERE poid = ?;",
//                 [po_id],
//                 (err, result) => {
//                   if (err) {
//                     console.log(err);
//                     connection.rollback(() => {
//                       connection.release();
//                       return res.status(500).send("Internal Server Error");
//                     });
//                   }
//                 }
//               );

//               connection.query(
//                 "UPDATE indent SET isTransfer = 1 WHERE id = ?;",
//                 [indent_id],
//                 (err, result) => {
//                   if (err) {
//                     console.log(err);
//                     connection.rollback(() => {
//                       connection.release();
//                       return res.status(500).send("Internal Server Error");
//                     });
//                   }
//                 }
//               );

//               connection.query(
//                 "SELECT * FROM bom_request_details WHERE bomid = ?;",
//                 [bom_req_id],
//                 (err, result) => {
//                   if (err) {
//                     console.log(err);
//                     connection.rollback(() => {
//                       connection.release();
//                       return res.status(500).send("Internal Server Error");
//                     });
//                   }

//                   for (const item of result) {
//                     const { bomid, itemid, assignqty } = item;

//                     connection.query(
//                       "UPDATE bom_request_details SET totqty = ? WHERE bomid = ? AND itemid = ?;",
//                       [remainingQty * assignqty, bomid, itemid],
//                       (err, result1) => {
//                         if (err) {
//                           console.log(err);
//                           connection.rollback(() => {
//                             connection.release();
//                             return res
//                               .status(500)
//                               .send("Internal Server Error");
//                           });
//                         }
//                       }
//                     );
//                   }
//                 }
//               );
//             }
//           );
//         }

//         connection.query(
//           query1,
//           [reciveQty, tocust.qty - reciveQty, 0, tocust.prod_plan_de_id,tocust.bom_req_id],
//           (err, result) => {
//             if (err) {
//               console.log(err);
//               connection.rollback(() => {
//                 connection.release();
//                 return res.status(500).send("Internal Server Error");
//               });
//             }
//           }
//         );

//         // connection.query(query2, [tocust.bom_req_id], (err, result) => {
//         //   if (err) {
//         //     console.log(err);
//         //     connection.rollback(() => {
//         //       connection.release();
//         //       return res.status(500).send("Internal Server Error");
//         //     });
//         //   }
//         // });

//         const insertTransferStockQuery = `
//             INSERT INTO transfer_stock (eid, ppd_id, bom_reqid, recive_qty, costingname, transfer_date)
//             VALUES (?, ?, ?, ?, ?, NOW())
//           `;

//         const transferStockValues = [
//           tocust.enquiry_master_id,
//           tocust.prod_plan_de_id,
//           tocust.bom_req_id,
//           reciveQty,
//           costing.costingname,
//         ];

//         connection.query(
//           insertTransferStockQuery,
//           transferStockValues,
//           (err, result) => {
//             if (err) {
//               console.log(err);
//               return connection.rollback(() => {
//                 connection.release();
//                 return res
//                   .status(500)
//                   .send("Insert into transfer_stock failed");
//               });
//             }

//             const insertedTransferStockId = result.insertId;

//             const insertDetailQuery = `
//           INSERT INTO transfer_stock_details (transfer_stock_id, eid, ppd_id, costingname, transfer_qty)
//           VALUES (?, ?, ?, ?, ?) `;

//             for (const from of fromcust) {
//               if (from.transferQty <= 0) {
//                 continue;
//               }

//               const detailValues = [
//                 insertedTransferStockId,
//                 from.enquiry_master_id,
//                 from.prod_plan_de_id,
//                 costing.costingname,
//                 from.transferQty,
//               ];

//               connection.query(
//                 insertDetailQuery,
//                 detailValues,
//                 (err, result) => {
//                   if (err) {
//                     console.log(err);
//                     return connection.rollback(() => {
//                       connection.release();
//                       return res
//                         .status(500)
//                         .send("Insert into transfer_stock_details failed");
//                     });
//                   }
//                 }
//               );
//             }
//           }
//         );

//         connection.commit((err) => {
//           if (err) {
//             console.log(err);
//             connection.rollback(() => {
//               connection.release();
//               return res.status(500).send("Internal Server Error");
//             });
//           } else {
//             connection.release();
//             return res.json({
//               message: "Stock Transfered Successfully",
//               success: true,
//             });
//           }
//         });
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal server error");
//   }
// });


// router.post("/getProdRefForFromCust", (req, res) => {
//   const { costingname, custname } = req.body;

//   if (!costingname || !custname) {
//     return res.status(400).send("Something went wrong");
//   }

//   // STEP 1 - Start from enquiry_master
//   const step1 = `
//     SELECT em.id AS enquiry_master_id, em.custname, em.selectedcosting
//     FROM enquiry_master em
//     WHERE em.custname = ?
//   `;

//   pool.query(step1, [custname], (err, result1) => {
//     if (err) return res.status(500).send("Step 1 error");
//     console.log("STEP 1: enquiry_master", result1);

//     // STEP 2 - Join costing_master
//     const step2 = `
//       SELECT em.id AS enquiry_master_id, em.custname,
//              IFNULL(cm.costingname, em.selectedcosting) AS costingname
//       FROM enquiry_master em
//       INNER JOIN costing_master cm ON cm.eid = em.id
//       WHERE em.custname = ? AND (em.selectedcosting = ? OR cm.costingname = ?)
//     `;

//     pool.query(step2, [custname, costingname, costingname], (err, result2) => {
//       if (err) return res.status(500).send("Step 2 error");
//       console.log("STEP 2: costing_master join", result2);

//       // STEP 3 - Join quotation + order_acceptance
//       const step3 = `
//         SELECT em.id AS enquiry_master_id, em.custname,
//                IFNULL(cm.costingname, em.selectedcosting) AS costingname,
//                q.qid, oa.id AS oa_id
//         FROM enquiry_master em
//         INNER JOIN costing_master cm ON cm.eid = em.id
//         INNER JOIN quotation q ON q.eid = em.id
//         INNER JOIN order_acceptance oa ON oa.qid = q.qid
//         WHERE em.custname = ? AND (em.selectedcosting = ? OR cm.costingname = ?)
//       `;
//       pool.query(step3, [custname, costingname, costingname], (err, result3) => {
//         if (err) return res.status(500).send("Step 3 error");
//         console.log("STEP 3: quotation + order_acceptance join", result3);

//         // STEP 4 - Join production_plan_details + production_plan
//         const step4 = `
//           SELECT em.id AS enquiry_master_id, em.custname,
//                  IFNULL(cm.costingname, em.selectedcosting) AS costingname,
//                  pp.wo_no, ppd.id AS prod_plan_de_id, ppd.readyqty
//           FROM enquiry_master em
//           INNER JOIN costing_master cm ON cm.eid = em.id
//           INNER JOIN quotation q ON q.eid = em.id
//           INNER JOIN order_acceptance oa ON oa.qid = q.qid
//           INNER JOIN production_plan_details ppd ON ppd.oa_id = oa.id
//           INNER JOIN production_plan pp ON pp.id = ppd.prod_plan_id
//           WHERE em.custname = ? 
//             AND (em.selectedcosting = ? OR cm.costingname = ?)
//             AND IFNULL(ppd.readyqty, 0) > 0
//         `;
//         pool.query(step4, [custname, costingname, costingname], (err, result4) => {
//           if (err) return res.status(500).send("Step 4 error");
//           console.log("STEP 4: production_plan joins", result4);

//           // STEP 5 - Join bom_request, indent, po_master
//           const finalQuery = `
//             SELECT
//               em.id AS enquiry_master_id,
//               em.custname,
//               ppd.readyqty,
//               IFNULL(cm.costingname, em.selectedcosting) AS costingname,
//               pp.wo_no,
//               ppd.id AS prod_plan_de_id,
//               br.id AS bom_req_id,
//               pm.id AS po_id,
//               i.id as indent_id
//             FROM bom_request br
//             INNER JOIN production_plan pp ON pp.id = br.plan_id
//             INNER JOIN production_plan_details ppd ON ppd.prod_plan_id = pp.id
//             INNER JOIN order_acceptance oa ON oa.id = ppd.oa_id
//             INNER JOIN quotation q ON q.qid = oa.qid
//             INNER JOIN enquiry_master em ON em.id = q.eid
//             INNER JOIN costing_master cm ON cm.eid = em.id
//             INNER JOIN indent i ON i.bomid = br.id
//             LEFT JOIN po_master pm ON pm.indentid = i.id
//             WHERE
//               (em.selectedcosting = ? OR cm.costingname = ?)
//               AND IFNULL(ppd.readyqty, 0) > 0
//               AND em.custname = ?;
//           `;
//           pool.query(finalQuery, [costingname, costingname, custname], (err, finalResult) => {
//             if (err) return res.status(500).send("Final query error");
//             console.log("FINAL RESULT", finalResult);
//             res.send(finalResult);
//           });
//         });
//       });
//     });
//   });
// });


// router.post("/transferStock", async (req, res) => {
//   const { fromcust, tocust, costing } = req.body;

//   const query = "CALL transferStock(?,?,?);";
//   const query1 = "CALL updateProdPlanDet_transStock(?,?,?,?,?)";

//   try {
//     pool.getConnection((err, connection) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send("Internal Server Error");
//       }

//       const reciveQty = fromcust?.reduce(
//         (total, current) => total + current.transferQty,
//         0
//       );

//       connection.beginTransaction(async (err) => {
//         if (err) {
//           console.log(err);
//           throw err;
//         }

//         for (const from of fromcust) {
//           const {
//             prod_plan_de_id,
//             bom_req_id,
//             transferQty,
//             enquiry_master_id,
//             readyqty,
//             po_id,
//             indent_id,
//           } = from;

//           if (transferQty <= 0) continue;

//           connection.query(
//             query,
//             [prod_plan_de_id, bom_req_id, transferQty],
//             (err, result) => {
//               if (err) {
//                 console.log(err);
//                 return connection.rollback(() => {
//                   connection.release();
//                   return res.status(500).send("Internal Server Error");
//                 });
//               }

//               const remainingQty = result?.[0]?.[0]?.remainingQty;

//               connection.query(
//                 "UPDATE po_details SET isTransfer = 1 WHERE poid = ?;",
//                 [po_id],
//                 (err) => {
//                   if (err) {
//                     console.log(err);
//                     return connection.rollback(() => {
//                       connection.release();
//                       return res.status(500).send("Internal Server Error");
//                     });
//                   }
//                 }
//               );

//               connection.query(
//                 "UPDATE indent SET isTransfer = 1 WHERE id = ?;",
//                 [indent_id],
//                 (err) => {
//                   if (err) {
//                     console.log(err);
//                     return connection.rollback(() => {
//                       connection.release();
//                       return res.status(500).send("Internal Server Error");
//                     });
//                   }
//                 }
//               );

//               connection.query(
//                 "SELECT * FROM bom_request_details WHERE bomid = ?;",
//                 [bom_req_id],
//                 (err, result) => {
//                   if (err) {
//                     console.log(err);
//                     return connection.rollback(() => {
//                       connection.release();
//                       return res.status(500).send("Internal Server Error");
//                     });
//                   }

//                   for (const item of result) {
//                     const { bomid, itemid, assignqty } = item;
//                     connection.query(
//                       "UPDATE bom_request_details SET totqty = ? WHERE bomid = ? AND itemid = ?;",
//                       [remainingQty * assignqty, bomid, itemid],
//                       (err) => {
//                         if (err) {
//                           console.log(err);
//                           return connection.rollback(() => {
//                             connection.release();
//                             return res
//                               .status(500)
//                               .send("Internal Server Error");
//                           });
//                         }
//                       }
//                     );
//                   }
//                 }
//               );
//             }
//           );
//         }

//         // Update plan
//         connection.query(
//           query1,
//           [
//             reciveQty,
//             tocust.qty - reciveQty,
//             0,
//             tocust.prod_plan_de_id,
//             tocust.bom_req_id,
//           ],
//           (err) => {
//             if (err) {
//               console.log(err);
//               return connection.rollback(() => {
//                 connection.release();
//                 return res.status(500).send("Internal Server Error");
//               });
//             }
//           }
//         );

//         // Insert into transfer_stock
//         const insertTransferStockQuery = `
//             INSERT INTO transfer_stock (eid, ppd_id, bom_reqid, recive_qty, costingname, transfer_date)
//             VALUES (?, ?, ?, ?, ?, NOW())
//         `;

//         const transferStockValues = [
//           tocust.enquiry_master_id,
//           tocust.prod_plan_de_id,
//           tocust.bom_req_id,
//           reciveQty,
//           costing.costingname,
//         ];

//         connection.query(
//           insertTransferStockQuery,
//           transferStockValues,
//           (err, result) => {
//             if (err) {
//               console.log(err);
//               return connection.rollback(() => {
//                 connection.release();
//                 return res
//                   .status(500)
//                   .send("Insert into transfer_stock failed");
//               });
//             }

//             const insertedTransferStockId = result.insertId;

//             const insertDetailQuery = `
//               INSERT INTO transfer_stock_details (transfer_stock_id, eid, ppd_id, costingname, transfer_qty)
//               VALUES (?, ?, ?, ?, ?)`;

//             for (const from of fromcust) {
//               if (from.transferQty <= 0) continue;

//               const detailValues = [
//                 insertedTransferStockId,
//                 from.enquiry_master_id,
//                 from.prod_plan_de_id,
//                 costing.costingname,
//                 from.transferQty,
//               ];

//               connection.query(insertDetailQuery, detailValues, (err) => {
//                 if (err) {
//                   console.log(err);
//                   return connection.rollback(() => {
//                     connection.release();
//                     return res
//                       .status(500)
//                       .send("Insert into transfer_stock_details failed");
//                   });
//                 }
//               });
//             }

//             // update bom_request_details with (totqty - reciveQty * assignqty)
//             connection.query(
//               "SELECT id, bomid, itemid, totqty, assignqty FROM bom_request_details WHERE bomid = ?",
//               [tocust.bom_req_id],
//               (err, bomItems) => {
//                 if (err) {
//                   console.log(err);
//                   return connection.rollback(() => {
//                     connection.release();
//                     return res
//                       .status(500)
//                       .send("Failed to fetch bom_request_details");
//                   });
//                 }

//                 for (const item of bomItems) {
//                   const newTotQty = item.totqty - reciveQty * item.assignqty;

//                   connection.query(
//                     `UPDATE bom_request_details SET totqty = ? WHERE id = ?`,
//                     [newTotQty, item.id],
//                     (err) => {
//                       if (err) {
//                         console.log(err);
//                         return connection.rollback(() => {
//                           connection.release();
//                           return res
//                             .status(500)
//                             .send("Failed to update totqty");
//                         });
//                       }
//                     }
//                   );
//                 }

//                 // ✅ Commit finally after all
//                 connection.commit((err) => {
//                   if (err) {
//                     console.log(err);
//                     return connection.rollback(() => {
//                       connection.release();
//                       return res.status(500).send("Commit Failed");
//                     });
//                   } else {
//                     connection.release();
//                     return res.json({
//                       message: "Stock Transferred Successfully",
//                       success: true,
//                     });
//                   }
//                 });
//               }
//             );
//           }
//         );
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal server error");
//   }
// });


router.post("/transferStock", (req, res) => {
  const { fromcust, tocust, costing } = req.body;

  const queryTransferStock = "CALL transferStock(?,?,?);";
  const queryUpdatePlan = "CALL updateProdPlanDet_transStock(?,?,?,?,?)";

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }

    const reciveQty = fromcust?.reduce(
      (total, current) => total + current.transferQty,
      0
    );

    connection.beginTransaction((err) => {
      if (err) {
        console.log(err);
        connection.release();
        return res.status(500).send("Transaction start failed");
      }

      // Process fromcust in series
      let fromIndex = 0;

      function processFromcust() {
        if (fromIndex >= fromcust.length) {
          // Done with fromcust → get remainingbomissueqty for tocust
          return getRemainingBomIssueQty();
        }

        const from = fromcust[fromIndex++];
        const {
          prod_plan_de_id,
          bom_req_id,
          transferQty,
          po_id,
          indent_id,
        } = from;

        if (transferQty <= 0) {
          return processFromcust();
        }

        // Step 1: Call transferStock
        connection.query(
          queryTransferStock,
          [prod_plan_de_id, bom_req_id, transferQty],
          (err, result) => {
            if (err) return rollback(err);

            const remainingQty = result?.[0]?.[0]?.remainingQty || 0;

            // Step 2: Update po_details
            connection.query(
              "UPDATE po_details SET isTransfer = 1 WHERE poid = ?;",
              [po_id],
              (err) => {
                if (err) return rollback(err);

                // Step 3: Update indent
                connection.query(
                  "UPDATE indent SET isTransfer = 1 WHERE id = ?;",
                  [indent_id],
                  (err) => {
                    if (err) return rollback(err);

                    // Step 4: Update bom_request_details
                    connection.query(
                      "SELECT * FROM bom_request_details WHERE bomid = ?;",
                      [bom_req_id],
                      (err, bomRows) => {
                        if (err) return rollback(err);

                        let updateIndex = 0;
                        function updateBomDetails() {
                          if (updateIndex >= bomRows.length) {
                            return processFromcust();
                          }
                          const item = bomRows[updateIndex++];
                          connection.query(
                            "UPDATE bom_request_details SET totqty = ? WHERE bomid = ? AND itemid = ?;",
                            [remainingQty * item.assignqty, item.bomid, item.itemid],
                            (err) => {
                              if (err) return rollback(err);
                              updateBomDetails();
                            }
                          );
                        }
                        updateBomDetails();
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }

      function getRemainingBomIssueQty() {
        connection.query(
          "SELECT remainingbomissueqty FROM production_plan_details WHERE id = ?",
          [tocust.prod_plan_de_id],
          (err, rows) => {
            if (err) return rollback(err);

            const remainingBomIssueQty = rows?.[0]?.remainingbomissueqty || 0;
            console.log("remainingBomIssueQty", remainingBomIssueQty);


            // Update plan
            connection.query(
              queryUpdatePlan,
              [
                reciveQty,
                tocust.qty - reciveQty,
                remainingBomIssueQty, // fixed
                tocust.prod_plan_de_id,
                tocust.bom_req_id,
              ],
              (err) => {
                if (err) return rollback(err);
                insertTransferStock();
              }
            );
          }
        );
      }

      function insertTransferStock() {
        const insertTransferStockQuery = `
          INSERT INTO transfer_stock (eid, ppd_id, bom_reqid, recive_qty, costingname, transfer_date)
          VALUES (?, ?, ?, ?, ?, NOW())
        `;

        const transferStockValues = [
          tocust.enquiry_master_id,
          tocust.prod_plan_de_id,
          tocust.bom_req_id,
          reciveQty,
          costing.costingname,
        ];

        connection.query(
          insertTransferStockQuery,
          transferStockValues,
          (err, result) => {
            if (err) return rollback(err);

            const insertedTransferStockId = result.insertId;

            // Insert transfer_stock_details
            let detailIndex = 0;
            function insertDetails() {
              if (detailIndex >= fromcust.length) {
                return updateBomRequestDetailsForTocust();
              }

              const from = fromcust[detailIndex++];
              if (from.transferQty <= 0) return insertDetails();

              const detailValues = [
                insertedTransferStockId,
                from.enquiry_master_id,
                from.prod_plan_de_id,
                costing.costingname,
                from.transferQty,
              ];

              connection.query(
                `INSERT INTO transfer_stock_details (transfer_stock_id, eid, ppd_id, costingname, transfer_qty)
                 VALUES (?, ?, ?, ?, ?)`,
                detailValues,
                (err) => {
                  if (err) return rollback(err);
                  insertDetails();
                }
              );
            }
            insertDetails();
          }
        );
      }

      function updateBomRequestDetailsForTocust() {
        connection.query(
          "SELECT id, bomid, itemid, totqty, assignqty FROM bom_request_details WHERE bomid = ?",
          [tocust.bom_req_id],
          (err, bomItems) => {
            if (err) return rollback(err);

            let bomIndex = 0;
            function updateBomItems() {
              if (bomIndex >= bomItems.length) {
                return commit();
              }
              const item = bomItems[bomIndex++];
              const newTotQty = item.totqty - reciveQty * item.assignqty;

              connection.query(
                `UPDATE bom_request_details SET totqty = ? WHERE id = ?`,
                [newTotQty, item.id],
                (err) => {
                  if (err) return rollback(err);
                  updateBomItems();
                }
              );
            }
            updateBomItems();
          }
        );
      }

      function rollback(err) {
        console.log(err);
        connection.rollback(() => {
          connection.release();
          return res.status(500).send("Transaction failed");
        });
      }

      function commit() {
        connection.commit((err) => {
          if (err) return rollback(err);
          connection.release();
          res.json({ message: "Stock Transferred Successfully", success: true });
        });
      }

      processFromcust();
    });
  });
});


router.get("/getTransferStockList", (req, res) => {
  try {
    const query = `
     SELECT
  ts.id,
  em.custname,
  IFNULL(cm.costingname, em.selectedcosting) AS capacity, 
  ts.costingname,
  pl.wo_no,
  oa.ref_no,
  ts.recive_qty,
  ppd.qty AS production_qty
FROM 
  transfer_stock ts
LEFT JOIN enquiry_master em ON em.id = ts.eid
LEFT JOIN costing_master cm ON cm.eid = em.id 
LEFT JOIN production_plan_details ppd ON ppd.id = ts.ppd_id
LEFT JOIN production_plan pl ON pl.id = ppd.prod_plan_id
LEFT JOIN order_acceptance oa ON oa.id = ppd.oa_id;
    `;

    pool.query(query, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      return res.json(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

router.get("/getTransferStockDetails/:id", (req, res) => {
  // console.log("Hit ts det", req.params.id);
  const id = req.params.id;
  const q = `
   SELECT
    ts.id,
        em.custname,
       IFNULL(cm.costingname, em.selectedcosting) AS costingname,
        pl.wo_no,
        oa.ref_no,
        ts.recive_qty,
        ppd.qty AS production_qty
      FROM 
        transfer_stock ts
      LEFT JOIN enquiry_master em ON em.id = ts.eid
      LEFT JOIN costing_master cm ON cm.id = ts.eid 

      LEFT JOIN production_plan_details ppd ON ppd.id = ts.ppd_id
      LEFT JOIN production_plan pl ON pl.id = ppd.prod_plan_id
      LEFT JOIN order_acceptance oa ON oa.id = ppd.oa_id
      WHERE ts.id = ?;`;

  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }

    // Modify e.typetaping based on conditions
    // if (data.length > 0) {
    //   data.forEach((row) => {
    //     if (
    //       row.typetaping.includes(
    //         "H. V. variation of +2.5 to -5 in equal steps of 2.5 Off circuit tap changer"
    //       ) ||
    //       row.typetaping.includes(
    //         "H. V. variation of +5 to -10 in equal steps of 2.5 Off circuit tap changer"
    //       )
    //     ) {
    //       row.typetaping = "OCTC";
    //     } else if (
    //       row.typetaping.includes(
    //         "H. V. variation of +10 to -10 in equal steps of 1.25 On load tap changer"
    //       ) ||
    //       row.typetaping.includes(
    //         "H. V. variation of +5 to -15 in equal steps of 1.25 On load tap changer"
    //       )
    //     ) {
    //       row.typetaping = "OLTC";
    //     } else if (row.typetaping.includes("No Tapping")) {
    //       row.typetaping = "NP";
    //     } else {
    //       row.typetaping = "";
    //     }
    //   });
    // }

    return res.json(data[0] || {});
  });
});

// Get all from-customers for a given transfer_stock_id
router.get("/getTransferStockFromDetails/:transfer_stock_id", (req, res) => {
  const id = req.params.transfer_stock_id;
  const q = `
    SELECT
      tsd.id,
      em.custname AS from_customer_name,
      tsd.costingname,
      pp.wo_no,
      ppd.readyqty,
      tsd.transfer_qty
    FROM
      transfer_stock_details tsd
    LEFT JOIN enquiry_master em ON em.id = tsd.eid
    LEFT JOIN production_plan_details ppd ON ppd.id = tsd.ppd_id
    LEFT JOIN production_plan pp ON pp.id = ppd.prod_plan_id
    WHERE tsd.transfer_stock_id = ?
  `;
  pool.query(q, [id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});


//<---------------------------check if costing is used in EditEnquiry----------------------->
router.get("/checkcostingusage/:costingId", (req, res) => {
  const costingId = req.params.costingId;

  // First get the costing name from costing_master
  const getCostingNameQuery = `SELECT costingname FROM costing_master WHERE id = ?`;

  pool.query(getCostingNameQuery, [costingId], (err, costingData) => {
    if (err) {
      return res.json({ error: err.message });
    }

    if (costingData.length === 0) {
      return res.json({ isUsed: false });
    }

    const costingName = costingData[0].costingname;

    // Check if this costing name is used in any enquiry
    const checkUsageQuery = `SELECT COUNT(*) as count FROM enquiry_master WHERE selectedcosting = ?`;

    pool.query(checkUsageQuery, [costingName], (err, usageData) => {
      if (err) {
        return res.json({ error: err.message });
      }

      const isUsed = usageData[0].count > 0;
      return res.json({ isUsed, count: usageData[0].count });
    });
  });
});

module.exports = router;
