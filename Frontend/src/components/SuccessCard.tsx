import { Card, Button } from "react-bootstrap";

interface SuccessCardProps {
  closeSuccessCard: () => void;
}

const SuccessCard = ({ closeSuccessCard }: SuccessCardProps) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 999,
      }}
    >
      <Card
        style={{
          width: "315px",
          height: "227px",
          padding: "5px",
          textAlign: "center",
          borderRadius: "30px",
          boxShadow: "1px 2px 6px 0px #006EE94D",
        }}
      >
        <Card.Body>
          <Card.Img
            variant="top"
            src={require("../images/Vector.png")}
            style={{
              width: "83.33px",
              height: "83.33px",
              marginBottom: "5px",
              display: "block",
              margin: "0 auto",
            }}
          />
          <Card.Text
            style={{ fontWeight: "500", fontSize: "16px", textAlign: "center" }}
          >
            new task has been created successfully
          </Card.Text>
          <Button
            onClick={closeSuccessCard}
            style={{
              backgroundColor: "black",
              borderColor: "black",
              width: "100%",
            }}
          >
            Back
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SuccessCard;
