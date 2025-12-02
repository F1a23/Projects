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
import {
  faHeadSideVirus,
  faHeart,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import "./MentalHealthServices.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const MentalHealthServices = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <div className="mental-health-services-container container mt-5 text-center">
      <h1 className="main-title">Mental Health Services</h1>
      <p className="intro-paragraph">
        At our university clinic, we are dedicated to promoting mental
        well-being for all members of the university community. Our mental
        health services are designed to provide support, resources, and guidance
        to students, faculty, and staff dealing with a variety of mental health
        concerns.
      </p>

      <Container className="my-5">
        <Row className="text-center mb-4">
          <Col>
            <h2>Our Services</h2>
            <p className="text-muted">
              Explore the mental health services available to support your
              emotional and psychological well-being.
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="4">
            <Card className="mb-3 shadow service-card">
              <CardBody>
                <div className="service-icon mb-3">
                  <FontAwesomeIcon icon={faHeadSideVirus} size="2x" />
                </div>
                <CardTitle tag="h5">Counseling & Therapy</CardTitle>
                <CardText>
                  Our licensed counselors are available for individual and group
                  therapy sessions to help you manage stress, anxiety,
                  depression, and other mental health concerns.
                </CardText>
                <Button color="primary">Schedule a Session</Button>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card className="mb-3 shadow service-card">
              <CardBody>
                <div className="service-icon mb-3">
                  <FontAwesomeIcon icon={faHeart} size="2x" />
                </div>
                <CardTitle tag="h5">Emotional Support</CardTitle>
                <CardText>
                  We provide a safe space for students and staff to discuss
                  their emotional challenges and receive support from
                  compassionate professionals.
                </CardText>
                <Button color="primary">Talk to Us</Button>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card className="mb-3 shadow service-card">
              <CardBody>
                <div className="service-icon mb-3">
                  <FontAwesomeIcon icon={faComments} size="2x" />
                </div>
                <CardTitle tag="h5">Support Groups</CardTitle>
                <CardText>
                  Join our support groups to connect with others who understand
                  what you're going through. Our groups provide a sense of
                  community and shared experience.
                </CardText>
                <Button color="primary">Join a Group</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="resources-section text-center">
              <h3>Resources & Workshops</h3>
              <p>
                We regularly offer workshops on topics such as stress
                management, mindfulness, coping strategies, and emotional
                resilience. Check out our upcoming events and resources for more
                information.
              </p>
              <Button className="resources-button" color="primary">
                View Resources
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* قسم التسجيل وطلب الدعم */}
      {/* قسم التسجيل وطلب الدعم */}
      <div className="request-assistance text-center">
        <h2>Need Immediate Support?</h2>
        <p>
          If you're feeling overwhelmed or in need of urgent support, please
          don't hesitate to reach out to our team. We are here to listen, help,
          and guide you towards the resources you need.
        </p>
        <Button className="support-button" color="danger">
          Request Immediate Support
        </Button>
      </div>
    </div>
  );
};

export default MentalHealthServices;
