import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
  Row,
  Col,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPills } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"; // استيراد Link من React Router
import "./MedicationManagement.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const MedicationManagement = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="container mt-5">
      <h1>Medication Management</h1>
      <p>
        Our Medication Management services ensure that students, staff, and
        faculty have easy access to the medications they need, with convenience
        and safety in mind. Whether you need prescribed medications or common
        over-the-counter items, we offer a streamlined process to request and
        receive your medications on campus.
      </p>

      <Container className="my-5">
        <Row className="text-center mb-4">
          <Col>
            <h2>How It Works</h2>
            <p className="text-muted">
              Follow these steps to request and receive your medications:
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="4">
            <Card className="mb-3 shadow service-card">
              <CardBody>
                <div className="service-icon mb-3">
                  <FontAwesomeIcon icon={faPills} size="2x" />
                </div>
                <CardTitle tag="h5">Request Your Medication</CardTitle>
                <CardText>
                  Through our app, you can easily request your prescribed
                  medications and over-the-counter items. Simply select the
                  medication, provide any necessary details, and submit your
                  request.
                </CardText>
                <Link to="/request-medication">
                  <Button color="primary">Request Medication</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card className="mb-3 shadow service-card">
              <CardBody>
                <div className="service-icon mb-3">
                  <FontAwesomeIcon icon={faPills} size="2x" />
                </div>
                <CardTitle tag="h5">Medication Preparation</CardTitle>
                <CardText>
                  Once your request is submitted, our pharmacy team will prepare
                  your medications for delivery or pick-up at the clinic. You
                  will receive a notification when your medication is ready.
                </CardText>
                <Button color="primary">Prepare Medication</Button>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card className="mb-3 shadow service-card">
              <CardBody>
                <div className="service-icon mb-3">
                  <FontAwesomeIcon icon={faPills} size="2x" />
                </div>
                <CardTitle tag="h5">Delivery or Pick-Up</CardTitle>
                <CardText>
                  After preparation, you can either pick up your medication at
                  the clinic or request delivery directly to your location on
                  campus for added convenience.
                </CardText>
                <Link to="/delivery-or-pick-up">
                  <Button color="primary">Choose Delivery or Pick-Up</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* صور داخل بطاقات */}
        <Row className="my-5">
          <Col md="4">
            <Card>
              <CardBody>
                <CardTitle tag="h5">Medication Service</CardTitle>
                <CardText>
                  Our medication service ensures you get the medications you
                  need on time. We offer both prescribed and over-the-counter
                  options for your convenience.
                </CardText>
                <Link to="/request-medication">
                  <Button color="primary">Learn More</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <CardBody>
                <CardTitle tag="h5">Medication Delivery</CardTitle>
                <CardText>
                  We offer medication delivery to your location on campus,
                  ensuring you never miss your medication.
                </CardText>
                <Link to="/delivery-or-pick-up">
                  <Button color="primary">Request Delivery</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <CardBody>
                <CardTitle tag="h5">Pick-Up Service</CardTitle>
                <CardText>
                  For those who prefer to pick up their medications, our clinic
                  offers an easy and fast pick-up process.
                </CardText>
                <Link to="/delivery-or-pick-up">
                  <Button color="primary">Choose Pick-Up</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="text-center">
          <Col>
            <h3>Need Help?</h3>
            <p>
              If you have any questions or concerns about your medication or the
              request process, our support team is here to help. Contact us for
              assistance.
            </p>
            <Button color="primary">Contact Support</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MedicationManagement;
