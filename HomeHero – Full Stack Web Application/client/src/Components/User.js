import user from "../images/user.png";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const User = (userData) => {
  const navigate = useNavigate();

  const user = userData.userData;
  const picURL = "http://localhost:3001/uploads/" + user.profilePic;

  console.log(picURL);

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user]);
  return (
    <div>
      <Row>
        <Col md={2} className="h22">
          <img src={picURL} className="styled-image1" />
        </Col>
      </Row>

      <p className="h22">
        {user.name}
        <br />

        {user.email}
      </p>
    </div>
  );
};

export default User;
