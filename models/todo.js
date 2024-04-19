const mongoose = require("mongoose");
const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  done: Boolean,
});
module.exports = mongoose.model("Todo", TodoSchema);
