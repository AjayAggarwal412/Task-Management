import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

interface UpdateTaskModalProps {
  show: boolean;
  onHide: () => void;
  task: {
    _id: string;
    title: string;
    description: string;
    deadline: string;
    status: string;
  };
  onUpdate: (updatedTask: any) => void;
}

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
  show,
  onHide,
  task,
  onUpdate,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(task.deadline);

  const handleUpdate = async () => {
    try {
      const updatedTask = { ...task, title, description, deadline };
      await axios.put(`/api/tasks/update/${task._id}`, updatedTask);

      onUpdate(updatedTask);

      onHide();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Update Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="taskTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="taskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="taskDeadline">
            <Form.Label>Deadline</Form.Label>
            <Form.Control
              type="date"
              value={new Date(deadline).toISOString().slice(0, 10)}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateTaskModal;
