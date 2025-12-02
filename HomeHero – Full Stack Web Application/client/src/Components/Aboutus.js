import { Col, Container, Row } from "reactstrap";
import logo from "../images/logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { FaBars } from "react-icons/fa";
const Aboutus = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user]);
  return (
    <div>
      <Container className="mt-5">
        <Row>
          <Col md={12} className="text-center">
            <img src={logo} alt="Homehero Logo" />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <br></br>
            <br></br>
            <p className="h1">
              My name is Fatima Al-Amri, I am the developer of this web app that
              provides all the various home services that a person needs through
              one platform. I am very happy that you are one of the users of
              this application. I wish you a wonderful day.<br></br> Best
              regards.
            </p>

            <h1 className="h1">
              <br></br>
              <br></br>
              &copy; {new Date().getFullYear()} HOMEHERO, Salalah, Dhofar,
              Oman.All rights reserved
            </h1>
            <br></br>
            <br></br>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Aboutus;
