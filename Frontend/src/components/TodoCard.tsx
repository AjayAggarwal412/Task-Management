import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { Col, Dropdown, Row } from "react-bootstrap";
import { FiMoreHorizontal } from "react-icons/fi";
import UpdateTaskModal from "./UpdateTaskModal";
import "./style/todoCard.css";

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description: string;
    deadline: string;
    status: string;
  };
  priority: string;
  bgColor: string;
  textColor: string;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onDelete: () => void;
  onUpdateTask: (updatedTask: any) => void; // Function to update task in UI
}

function TodoCard({
  task,
  priority,
  bgColor,
  textColor,
  onStatusChange,
  onDelete,
  onUpdateTask,
}: TaskCardProps) {
  const { title, description, deadline } = task;
  const formattedDeadline = new Date(deadline).toLocaleDateString("en-GB");
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(task._id, newStatus);
  };

  const handleUpdateClick = () => {
    setShowUpdateModal(true);
  };

  return (
    <>
      <Card className="card-container">
        <Row>
          <Col xs lg="9">
            <div
              className="low-label"
              style={{ color: textColor, backgroundColor: bgColor }}
            >
              {priority}
            </div>
          </Col>
          <Col>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-custom-components"
                bsPrefix="custom-dropdown-toggle"
                as="button"
              >
                <FiMoreHorizontal size={20} className="menu-icon" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handleStatusChange("On Progress")}
                >
                  On Progress
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleStatusChange("Done")}>
                  Done
                </Dropdown.Item>
                <Dropdown.Item onClick={handleUpdateClick}>
                  Update
                </Dropdown.Item>
                <Dropdown.Item onClick={onDelete}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        <Card.Body className="card-body">
          <Card.Title className="card-title">{title}</Card.Title>
          <Card.Text className="card-text">{description}</Card.Text>
          <Card.Text className="deadline-text">{`Deadline: ${formattedDeadline}`}</Card.Text>
        </Card.Body>
      </Card>

      {/* Update Task Modal */}
      {showUpdateModal && (
        <UpdateTaskModal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          task={task}
          onUpdate={(updatedTask) => {
            onUpdateTask(updatedTask);
            setShowUpdateModal(false);
          }}
        />
      )}
    </>
  );
}

export default TodoCard;
