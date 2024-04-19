const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3030;
// Menggunakan body-parser untuk mengambil data JSON dari permintaan HTTP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Menghubungkan ke database MongoDB
mongoose.connect("mongodb://127.0.0.1/todo_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Koneksi database gagal:"));
// Mendefinisikan model Todos
const Todo = require("./models/todo");
// Mendefinisikan rute API
const router = express.Router();
// Rute untuk membuat todo baru
router.post("/todos", async (req, res) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.json({ message: "Todo berhasil dibuat!" });
  } catch (err) {
    res.status(500).json({ error: "Gagal membuat todo." });
  }
});
// Rute untuk mendapatkan semua todos
router.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil daftar todos." });
  }
});
// Rute untuk mendapatkan todo berdasarkan ID
router.get("/todos/:todo_id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todo_id);
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil todo berdasarkan ID." });
  }
});
// Rute untuk mengupdate todo berdasarkan ID
router.put("/todos/:todo_id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.todo_id,
      req.body,
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengupdate todo berdasarkan ID." });
  }
});
// Rute untuk menghapus todo berdasarkan ID
router.delete("/todos/:todo_id", async (req, res) => {
  try {
    await Todo.findByIdAndRemove(req.params.todo_id);
    res.json({ message: "Todo berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus todo berdasarkan ID." });
  }
});
// Mendaftarkan rute
app.use("/api", router);
// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`);
});
