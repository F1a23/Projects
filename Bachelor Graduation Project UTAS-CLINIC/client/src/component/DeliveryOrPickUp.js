import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeliveryOrPickUp = () => {
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
      <Row className="text-center mb-4">
        <Col>
          <h1>Choose Your Delivery or Pick-Up Option</h1>
          <p>
            Now that your medication is ready, choose the most convenient option
            for you to receive it. You can either pick up your medication from
            the clinic or have it delivered to your location on campus.
          </p>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <Card className="mb-3 shadow">
            <CardBody>
              <CardTitle tag="h5">Pick-Up Option</CardTitle>
              <CardText>
                You can pick up your medication directly from the clinic during
                our working hours. Make sure to bring your ID and any required
                prescription details.
              </CardText>
              <Link to="/pick-up-option">
                <Button color="primary">Choose Pick-Up</Button>
              </Link>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card className="mb-3 shadow">
            <CardBody>
              <CardTitle tag="h5">Delivery Option</CardTitle>
              <CardText>
                If you prefer, we offer a delivery service to bring your
                medication to your campus location. Select a convenient time,
                and we'll handle the rest.
              </CardText>
              <Link to="/delivery-option">
                <Button className="m-2" color="primary">
                  Choose Delivery
                </Button>
              </Link>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="text-center mt-5">
        <Col>
          <h3>Need Assistance?</h3>
          <p>
            If you need help with your delivery or pick-up process, don't
            hesitate to contact our support team.
          </p>
          <Link to="/contact">
            <Button color="secondary">Contact Support</Button>
          </Link>
        </Col>
      </Row>

      <Row className="text-center mt-4">
        <Col>
          <Link to="/medication-preparation">
            <Button color="secondary">Back to Medication Preparation</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default DeliveryOrPickUp;
