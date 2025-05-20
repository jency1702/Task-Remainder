const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, description, reminder } = req.body;
  db.query(
    "INSERT INTO tasks (title, description, reminder) VALUES (?, ?, ?)",
    [title, description, reminder],
    (err, result) => {
      if (err) return res.status(500).send(err);

      // Get the inserted task with the new id
      db.query(
        "SELECT * FROM tasks WHERE id = ?",
        [result.insertId],
        (err2, rows) => {
          if (err2) return res.status(500).send(err2);
          console.log("Inserted Task:", rows[0]);
          res.json(rows[0]); // Return full task object
        }
      );
    }
  );
});

// app.patch("/tasks/:id", (req, res) => {
//   const { id } = req.params;
//   const { reminder } = req.body;
//   db.query(
//     "UPDATE tasks SET reminder = ? WHERE id = ?",
//     [reminder, id],
//     (err) => {
//       if (err) return res.status(500).send(err);
//       res.sendStatus(200);
//     }
//   );
// });

app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, reminder, is_completed } = req.body;

  const fieldsToUpdate = [];
  const values = [];

  if (title !== undefined) {
    fieldsToUpdate.push("title = ?");
    values.push(title);
  }

  if (description !== undefined) {
    fieldsToUpdate.push("description = ?");
    values.push(description);
  }

  if (reminder !== undefined) {
    fieldsToUpdate.push("reminder = ?");
    values.push(reminder);
  }

  if (is_completed !== undefined) {
    fieldsToUpdate.push("is_completed = ?");
    values.push(is_completed);
  }

  if (fieldsToUpdate.length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  values.push(id);

  const sql = `UPDATE tasks SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
