import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeartbeat,
  faCalendarCheck,
  faChalkboardTeacher,
  faComments,
  faBrain,
  faPills,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Services.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Services = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <div className="clinic-services-wrapper">
      <div className="clinic-services-header text-center">
        <h1>What Services We Offer</h1>
        <p>
          From general health care and wellness to treating mental health
          issues, managing chronic conditions, providing emergency care, and
          promoting overall well-being – we have you covered at the University
          Clinic. All of our locations offer comprehensive services, with
          compassionate care, at transparent pricing.
        </p>
      </div>

      <Container className="clinic-services-section my-5">
        <Row className="text-center mb-4">
          <Col>
            <h2>Our Services</h2>
            <p className="clinic-services-subtitle">
              Here are some of the essential services we provide.
            </p>
          </Col>
        </Row>

        {/* First Row */}
        <Row>
          <Col md="4">
            <Card className="clinic-service-card shadow mb-3">
              <Card.Body>
                <div className="clinic-service-icon mb-3">
                  <FontAwesomeIcon icon={faHeartbeat} size="2x" />
                </div>
                <Card.Title>Direct Health Services</Card.Title>
                <Card.Text>
                  The clinic offers primary healthcare for students and staff,
                  treats minor emergencies, provides vaccination services, and
                  more.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/direct")}>
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md="4">
            <Card className="clinic-service-card shadow mb-3">
              <Card.Body>
                <div className="clinic-service-icon mb-3">
                  <FontAwesomeIcon icon={faCalendarCheck} size="2x" />
                </div>
                <Card.Title>Appointment Scheduling</Card.Title>
                <Card.Text>
                  Facilitating online appointment booking via the web app,
                  ensuring easy and convenient scheduling for routine check-ups.
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate("/appointment")}
                >
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md="4">
            <Card className="clinic-service-card shadow mb-3">
              <Card.Body>
                <div className="clinic-service-icon mb-3">
                  <FontAwesomeIcon icon={faComments} size="2x" />
                </div>
                <Card.Title>Communication & Support</Card.Title>
                <Card.Text>
                  Providing channels for communication between patients and
                  healthcare providers, ensuring feedback and continuous
                  improvement.
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate("/communication")}
                >
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Second Row */}
        <Row>
          <Col md="4">
            <Card className="clinic-service-card shadow mb-3">
              <Card.Body>
                <div className="clinic-service-icon mb-3">
                  <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" />
                </div>
                <Card.Title>Health Education & Awareness</Card.Title>
                <Card.Text>
                  Offering workshops, seminars, and resources to promote health
                  awareness among students and staff.
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate("/education")}
                >
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md="4">
            <Card className="clinic-service-card shadow mb-3">
              <Card.Body>
                <div className="clinic-service-icon mb-3">
                  <FontAwesomeIcon icon={faBrain} size="2x" />
                </div>
                <Card.Title>Mental Health Services</Card.Title>
                <Card.Text>
                  Offering counseling services to support mental health, helping
                  students and staff manage stress and anxiety.
                </Card.Text>
                <Button variant="primary" onClick={() => navigate("/mental")}>
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md="4">
            <Card className="clinic-service-card shadow mb-3">
              <Card.Body>
                <div className="clinic-service-icon mb-3">
                  <FontAwesomeIcon icon={faPills} size="2x" />
                </div>
                <Card.Title>Medication Management</Card.Title>
                <Card.Text>
                  Patients can request prescribed or common medications via the
                  app, with on-campus delivery services for requested
                  medications.
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate("/medication")}
                >
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Services;
