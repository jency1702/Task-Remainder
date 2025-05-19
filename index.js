// const express = require("express");
// const cors = require("cors");
// const db = require("./db");

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// app.get("/tasks", (req, res) => {
//   db.query("SELECT * FROM tasks", (err, results) => {
//     if (err) return res.status(500).send(err);
//     res.json(results);
//   });
// });

// app.post("/tasks", (req, res) => {
//   const { title, description } = req.body;
//   db.query(
//     "INSERT INTO TASKS (title, description) VALUES (?, ?)",
//     [title, description],
//     (err, result) => {
//       if (err) return res.status(500).send(err);
//       res.json({ id: result.insertId });
//     }
//   );
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
