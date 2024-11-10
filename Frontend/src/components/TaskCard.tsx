import Card from "react-bootstrap/Card";
import "./style/taskCard.css"; // Import the CSS file

interface TaskCardProps {
  image: string; // Path or URL of the image
  task_heading: string; // The title of the task
  number: string; // The task number
  image_color: string;
}

function TaskCard({ image, task_heading, number, image_color }: TaskCardProps) {
  return (
    <Card className="task-card">
      <div className="image-container" style={{ backgroundColor: image_color }}>
        <img src={image} alt="Expired" className="expired-image" />
      </div>
      <Card.Body>
        <Card.Text className="task-heading">{task_heading}</Card.Text>
        <Card.Title className="number">{number}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default TaskCard;
