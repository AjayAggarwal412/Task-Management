import { Button, Col, Row } from "react-bootstrap";
import TaskCard from "./TaskCard";
import TodoCard from "./TodoCard";
import { useState, useEffect } from "react";
import TaskModal from "./TaskModal";
import "./style/dashboard.css";
import axios from "axios";
import dayjs from "dayjs";

interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

interface DashboardProps {
  searchTerm: string; // Receive searchTerm as prop from CustomNavbar
}

const Dashboard = ({ searchTerm }: DashboardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expiredCount, setExpiredCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update task counts based on deadlines
  useEffect(() => {
    const today = dayjs();
    let expired = 0;
    let active = 0;
    let completed = 0;

    tasks.forEach((task) => {
      const deadline = dayjs(task.deadline);
      const daysDiff = today.diff(deadline, "day");

      if (task.status === "Done") {
        completed += 1;
      } else if (daysDiff > 10) {
        expired += 1;
      } else if (daysDiff <= 10) {
        active += 1;
      }
    });

    setExpiredCount(expired);
    setActiveCount(active);
    setCompletedCount(completed);
  }, [tasks]);

  // Fetch tasks again after a new task is created
  const handleTaskCreated = () => {
    fetchTasks();
  };

  // function to update the status of the task(todo, onProgress, etc)

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/update-status/${taskId}`,
        {
          status: newStatus,
        }
      );
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // function to delete the task

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`);
      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // function to update task details

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`/api/tasks/update/${updatedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTaskFromDB = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTaskFromDB._id ? updatedTaskFromDB : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Function to render a "No task available" message if no tasks are present in the column
  const renderNoTasksMessage = (taskStatus: string) => {
    const filteredTasks = tasks.filter((task) => task.status === taskStatus);
    if (filteredTasks.length === 0) {
      return (
        <div className="no-tasks-message">
          <p>No task available</p>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <Row className="dashboard-row">
        {/* First Column */}
        <Col className="dashboard-column">
          <Row>
            <TaskCard
              image={require("../images/expired.png")}
              task_heading="Expired Tasks"
              number={expiredCount.toString()}
              image_color="#F42D20"
            />
          </Row>
          <Row>
            <TaskCard
              image={require("../images/briefcase.png")}
              task_heading="All Active Tasks"
              number={activeCount.toString()}
              image_color="#E89271"
            />
          </Row>
          <Row>
            <TaskCard
              image={require("../images/expired.png")}
              task_heading="Completed Tasks"
              number={completedCount.toString()}
              image_color="#70A1E5"
            />
          </Row>
          <Row>
            <Button onClick={handleShowModal} className="add-task-button">
              + Add Task
            </Button>
          </Row>

          <TaskModal
            show={showModal}
            handleClose={handleCloseModal}
            onTaskCreated={handleTaskCreated}
          />
        </Col>

        {/* To Do Column */}
        <Col className="section-column">
          <Row className="section-heading">
            <img
              src={require("../images/Ellipse 13.png")}
              className="image"
              alt="image"
            />
            To Do
          </Row>
          <hr className="section-divider" />

          {renderNoTasksMessage("To Do")}

          {tasks
            .filter((task) => {
              // Filter tasks based on search term (searches by title or deadline)
              const lowerCaseSearchTerm = searchTerm.toLowerCase();
              const taskTitle = task.title.toLowerCase();
              const taskDeadline = dayjs(task.deadline).format("DD/MM/YYYY");

              return (
                taskTitle.includes(lowerCaseSearchTerm) ||
                taskDeadline.includes(lowerCaseSearchTerm)
              );
            })
            .map((task) => {
              // Calculate priority logic
              const deadlineDate = dayjs(task.deadline);
              const today = dayjs();
              const daysDiff = today.diff(deadlineDate, "day");

              let priority = "Low";
              let bgColor = "#dfa87433";
              let textColor = "#d58d49";

              if (task.status !== "Done") {
                const isHighPriority = daysDiff > 5;
                priority = isHighPriority ? "High" : "Low";
                bgColor = isHighPriority ? "#D8727D1A" : "#dfa87433";
                textColor = isHighPriority ? "#D8727D" : "#d58d49";
              } else {
                // For completed tasks
                priority = "Completed";
                bgColor = "#83C29D33";
                textColor = "#68B266";
              }

              return (
                task.status === "To Do" && (
                  <Row key={task._id}>
                    <TodoCard
                      task={task}
                      priority={priority}
                      bgColor={bgColor}
                      textColor={textColor}
                      onStatusChange={handleStatusChange}
                      onDelete={() => handleDeleteTask(task._id)}
                      onUpdateTask={handleUpdateTask}
                    />
                  </Row>
                )
              );
            })}
        </Col>

        {/* On Progress Column */}
        <Col className="section-column">
          <Row className="section-heading">
            <img
              src={require("../images/Ellipse 12.png")}
              className="image"
              alt="image"
            />
            On Progress
          </Row>
          <hr className="to-do-divider" />

          {renderNoTasksMessage("On Progress")}

          {tasks
            .filter((task) => {
              // Filter tasks in "On Progress" column based on search term
              const lowerCaseSearchTerm = searchTerm.toLowerCase();
              const taskTitle = task.title.toLowerCase();
              const taskDeadline = dayjs(task.deadline).format("DD/MM/YYYY");

              return (
                task.status === "On Progress" &&
                (taskTitle.includes(lowerCaseSearchTerm) ||
                  taskDeadline.includes(lowerCaseSearchTerm))
              );
            })
            .map((task) => {
              // Priority calculation logic (same as above)
              const deadlineDate = dayjs(task.deadline);
              const today = dayjs();
              const daysDiff = today.diff(deadlineDate, "day");

              let priority = "Low";
              let bgColor = "#dfa87433";
              let textColor = "#d58d49";

              if (task.status !== "Done") {
                const isHighPriority = daysDiff > 5;
                priority = isHighPriority ? "High" : "Low";
                bgColor = isHighPriority ? "#D8727D1A" : "#dfa87433";
                textColor = isHighPriority ? "#D8727D" : "#d58d49";
              } else {
                // For completed tasks
                priority = "Completed";
                bgColor = "#83C29D33";
                textColor = "#68B266";
              }

              return (
                task.status === "On Progress" && (
                  <Row key={task._id}>
                    <TodoCard
                      task={task}
                      priority={priority}
                      bgColor={bgColor}
                      textColor={textColor}
                      onStatusChange={handleStatusChange}
                      onDelete={() => handleDeleteTask(task._id)}
                      onUpdateTask={handleUpdateTask}
                    />
                  </Row>
                )
              );
            })}
        </Col>

        {/* Done Column */}
        <Col className="section-column">
          <Row className="section-heading">
            <img
              src={require("../images/Ellipse 11.png")}
              className="image"
              alt="image"
            />
            Done
          </Row>
          <hr className="done-divider" />

          {renderNoTasksMessage("Done")}

          {tasks
            .filter((task) => {
              // Filter tasks in "Done" column based on search term
              const lowerCaseSearchTerm = searchTerm.toLowerCase();
              const taskTitle = task.title.toLowerCase();
              const taskDeadline = dayjs(task.deadline).format("DD/MM/YYYY");

              return (
                task.status === "Done" &&
                (taskTitle.includes(lowerCaseSearchTerm) ||
                  taskDeadline.includes(lowerCaseSearchTerm))
              );
            })
            .map((task) => {
              // Priority calculation logic (same as above)
              const deadlineDate = dayjs(task.deadline);
              const today = dayjs();
              const daysDiff = today.diff(deadlineDate, "day");

              let priority = "Low";
              let bgColor = "#dfa87433";
              let textColor = "#d58d49";

              if (task.status !== "Done") {
                const isHighPriority = daysDiff > 5;
                priority = isHighPriority ? "High" : "Low";
                bgColor = isHighPriority ? "#D8727D1A" : "#dfa87433";
                textColor = isHighPriority ? "#D8727D" : "#d58d49";
              } else {
                // For completed tasks
                priority = "Completed";
                bgColor = "#83C29D33";
                textColor = "#68B266";
              }

              return (
                task.status === "Done" && (
                  <Row key={task._id}>
                    <TodoCard
                      task={task}
                      priority={priority}
                      bgColor={bgColor}
                      textColor={textColor}
                      onStatusChange={handleStatusChange}
                      onDelete={() => handleDeleteTask(task._id)}
                      onUpdateTask={handleUpdateTask}
                    />
                  </Row>
                )
              );
            })}
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
