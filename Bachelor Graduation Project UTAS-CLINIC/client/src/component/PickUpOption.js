import React from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const PickUpOption = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Container className="mt-5">
      <Card className="shadow">
        <CardBody>
          <CardTitle tag="h2">Pick-Up Option</CardTitle>
          <CardText>
            You can pick up your medication directly from our university clinic.
            Our team ensures a fast and hassle-free process for collecting your
            prescribed medicines.
          </CardText>
          <CardText>
            📍 **Location:** University Clinic, Main Pharmacy Desk 🕒 **Pick-Up
            Hours:** Monday - Friday, 8:00 AM - 6:00 PM
          </CardText>
          <CardText>
            Please bring a valid university ID and your prescription details
            when collecting your medication.
          </CardText>
          <Link to="/">
            <Button color="primary">Back to Home</Button>
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
};

export default PickUpOption;
