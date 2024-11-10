import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SuccessCard from "./SuccessCard";
import axios from "axios";

interface TaskModalProps {
  show: boolean;
  handleClose: () => void;
  onTaskCreated: () => void;
}

function TaskModal({ show, handleClose, onTaskCreated }: TaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetail, setTaskDetail] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null); // Use null as default value

  const [showCalendar, setShowCalendar] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle opening and closing of calendar
  const handleDeadlineClick = () => {
    setShowCalendar(!showCalendar); // Toggle calendar visibility
  };

  // Function to handle task creation and API call
  const handleAssignedToClick = async () => {
    try {
      // Prepare the task data to be sent to the backend
      const taskData = {
        title: taskTitle,
        description: taskDetail,
        deadline: deadline,
      };

      // Send a POST request to the backend to create the task
      await axios.post(
        "http://localhost:5000/api/newtask", // Adjust the API URL if needed
        taskData
      );

      onTaskCreated();
      // Close the modal and show success message
      handleClose();
      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "600", fontSize: "20px" }}>
            <img
              src={require("../images/Ellipse 10.png")}
              style={{
                height: "10px",
                width: "10px",
                margin: " 15px 10px",
              }}
              alt="dotimage"
            />
            ADD TASK
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskName">
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                style={{
                  border: "none",
                  borderBottom: "2px solid #000",
                  borderRadius: "0",
                  boxShadow: "none",
                  marginBottom: "15px",
                }}
              />

              <Form.Control
                as="textarea"
                rows={10} // Adjust the number of rows as needed
                placeholder="Enter task"
                value={taskDetail}
                onChange={(e) => setTaskDetail(e.target.value)}
                style={{
                  fontWeight: "400",
                  fontSize: "14px",
                  border: "none",
                  borderBottom: "2px solid #fff",
                  borderRadius: "0",
                  boxShadow: "none",
                  marginBottom: "15px",
                  resize: "none", // Prevents resizing (optional)
                }}
              />
            </Form.Group>
          </Form>

          {/* Labels in the same row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "40px",
            }}
          >
            {/* Deadline button */}
            <Button
              onClick={handleDeadlineClick}
              style={{
                fontWeight: "700",
                color: "#5A5A5A",
                fontSize: "12px",
                backgroundColor: "transparent",
                border: "none",
                textDecoration: "none",
                padding: "0",
                cursor: "pointer",
              }}
            >
              Deadline
            </Button>

            {/* Show the calendar (date picker) when the button is clicked */}
            {showCalendar && (
              <DatePicker
                selected={deadline}
                onChange={(date: Date | null) => setDeadline(date)} // Accepts Date | null
              />
            )}

            {/* Assigned To button */}
            <Button
              onClick={handleAssignedToClick} // When clicked, console log the values
              style={{
                fontWeight: "700",
                color: "#5A5A5A",
                fontSize: "12px",
                backgroundColor: "transparent",
                border: "none",
                textDecoration: "none",
                padding: "0",
                cursor: "pointer",
              }}
            >
              Assigned To
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Success Modal */}
      {showSuccess && (
        <SuccessCard closeSuccessCard={() => setShowSuccess(false)} />
      )}
    </>
  );
}

export default TaskModal;
