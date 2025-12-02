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
import { Link } from "react-router-dom"; // إذا كنت بحاجة إلى العودة لصفحة أخرى مثل Medication Management
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const MedicationPreparation = () => {
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
          <h1>Medication Preparation</h1>
          <p>
            Once your medication request has been received, our team will begin
            preparing your medication. This page provides details about the
            preparation process and how to collect or receive your medications.
          </p>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <Card className="mb-3 shadow">
            <CardBody>
              <CardTitle tag="h5">Step 1: Review Your Request</CardTitle>
              <CardText>
                Our pharmacy team will review your medication request to ensure
                all details are accurate. If we need any additional information,
                we will contact you.
              </CardText>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card className="mb-3 shadow">
            <CardBody>
              <CardTitle tag="h5">Step 2: Medication Preparation</CardTitle>
              <CardText>
                Once the request is verified, our team will prepare your
                medication, whether it's a prescription or an over-the-counter
                item. We ensure all medications are packaged securely and
                labeled correctly.
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <Card className="mb-3 shadow">
            <CardBody>
              <CardTitle tag="h5">Step 3: Notification</CardTitle>
              <CardText>
                Once your medication is ready, you will receive a notification
                either via email or SMS. You will also be provided with details
                about the pick-up or delivery process.
              </CardText>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card className="mb-3 shadow">
            <CardBody>
              <CardTitle tag="h5">Step 4: Pick-Up or Delivery</CardTitle>
              <CardText>
                Choose whether to pick up your medication from the clinic or
                have it delivered to your campus location. We ensure a fast and
                convenient process.
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="text-center mt-5">
        <Col>
          <h3>Need Assistance?</h3>
          <p>
            If you have any questions regarding the medication preparation
            process, feel free to contact our team for help.
          </p>
          <Link to="/contact">
            <Button color="primary">Contact Support</Button>
          </Link>
        </Col>
      </Row>

      <Row className="text-center mt-4">
        <Col>
          <Link to="/medication">
            <Button color="secondary">Back to Medication Management</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default MedicationPreparation;
