import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "./components/CustomNavbar";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status" />
          <span>Loading...</span>
        </div>
      )}

      <CustomNavbar onSearch={setSearchTerm} />
      <Dashboard searchTerm={searchTerm} />
    </div>
  );
}

export default App;
