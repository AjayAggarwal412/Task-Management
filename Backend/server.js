// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Task = require("./models/Task");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error));

// Basic route
app.get("/api", (req, res) => {
  res.send("API is running...");
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log("Fetched Tasks:", tasks);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get task by taskTitle
app.get("/api/tasks/:title", async (req, res) => {
  const { title } = req.params;
  try {
    const task = await Task.findOne({ title: title }); // "i" for case-insensitive search
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching task by title", error: err });
  }
});

// Create a new task
app.post("/api/newtask", async (req, res) => {
  const { title, description, deadline, status } = req.body;
  const task = new Task({
    title,
    description,
    deadline,
    status: status || "To Do",
  });

  try {
    const newTask = await task.save();
    console.log("Created Task:", newTask);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// updating status of the task

app.put("/api/tasks/update-status/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { status: status },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Error updating task status", error: err });
  }
});

// Update task details by ID
app.put("/api/tasks/update/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { title, description, deadline, status } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId },
      { title, description, deadline },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating task details", error: err });
  }
});

// Endpoint to delete a task permanently

app.delete("/api/tasks/delete/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err });
  }
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
