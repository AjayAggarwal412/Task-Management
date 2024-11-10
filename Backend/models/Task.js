const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["To Do", "On Progress", "Done"], // Limited to these 3 status values
    default: "To Do", // Default status is 'To Do'
  },
});

module.exports = mongoose.model("Tasks", taskSchema);
