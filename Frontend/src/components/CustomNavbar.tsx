import { Dropdown, Form } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import "./style/customNavbar.css";

interface CustomNavbarProps {
  onSearch: (searchTerm: string) => void; // Pass the search term handler from parent
}

const CustomNavbar = ({ onSearch }: CustomNavbarProps) => {
  return (
    <div className="navbar-container">
      <Navbar expand="" className="custom-navbar">
        <Form className="search-form">
          <Form.Control
            onChange={(e) => onSearch(e.target.value)}
            type="search"
            placeholder="Search Project"
            aria-label="Search"
            className="search-input"
          />
        </Form>

        <div className="dropdown-container">
          <Dropdown>
            <Dropdown.Toggle
              variant="secondary"
              id="filter-dropdown"
              className="filter-dropdown"
              disabled
            >
              Filter
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/all">All</Dropdown.Item>
              <Dropdown.Item href="#/recent">Recent</Dropdown.Item>
              <Dropdown.Item href="#/popular">Popular</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
