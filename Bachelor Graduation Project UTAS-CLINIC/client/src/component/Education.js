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
  faBook,
  faChalkboardTeacher,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import HealthResource1 from "./images/Health Resource 1.jpeg";
import HealthResource2 from "./images/Health Resource 2.jpeg";
import HealthResource3 from "./images/Health Resource 3.jpeg";
import "./HealthEducation.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HealthEducation = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <div className="health-education-container mt-5">
      <h1 className="health-education-title text-center mb-4">
        Health Education & Awareness
      </h1>
      <p className="health-education-description text-center mb-5">
        Our mission is to promote health education and awareness to all members
        of the university community. We offer various resources, workshops, and
        seminars to help students, staff, and faculty stay informed about the
        importance of physical and mental well-being.
      </p>

      <Container className="my-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="programs-title">Our Programs & Resources</h2>
            <p className="programs-description text-muted">
              Explore the various ways we help you stay informed and healthy.
            </p>
          </Col>
        </Row>

        <Row className="d-flex justify-content-center">
          <Col md="4" className="mb-4">
            <Card className="mb-3 shadow health-service-card">
              <CardBody>
                <div className="health-service-icon mb-3 text-center">
                  <FontAwesomeIcon icon={faBook} size="3x" />
                </div>
                <CardTitle tag="h5" className="text-center">
                  Workshops & Seminars
                </CardTitle>
                <CardText>
                  We conduct regular workshops and seminars on topics such as
                  healthy living, mental health, and stress management. Join us
                  to learn valuable tips and strategies for a healthier
                  lifestyle.
                </CardText>
                <div className="text-center">
                  <Button className="health-support-button">Learn More</Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md="4" className="mb-4">
            <Card className="mb-3 shadow health-service-card">
              <CardBody>
                <div className="health-service-icon mb-3 text-center">
                  <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" />
                </div>
                <CardTitle tag="h5" className="text-center">
                  Health Tips & Resources
                </CardTitle>
                <CardText>
                  Access a wide variety of health tips and resources covering
                  topics such as nutrition, fitness, sleep, and mental
                  well-being.
                </CardText>
                <div className="text-center">
                  <Button className="health-support-button">Learn More</Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md="4" className="mb-4">
            <Card className="mb-3 shadow health-service-card">
              <CardBody>
                <div className="health-service-icon mb-3 text-center">
                  <FontAwesomeIcon icon={faLightbulb} size="3x" />
                </div>
                <CardTitle tag="h5" className="text-center">
                  Health Awareness Campaigns
                </CardTitle>
                <CardText>
                  Participate in our health awareness campaigns that focus on
                  critical health issues affecting students and faculty. Stay
                  informed and engaged to make better health choices.
                </CardText>
                <div className="text-center">
                  <Button className="health-support-button">Learn More</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="text-center mb-4">
          <Col>
            <h2 className="section-title">Join Our Upcoming Health Webinar</h2>
            <p className="mb-4">
              We regularly host online webinars to provide deeper insights into
              various health topics. Whether it's mental health or nutrition,
              our expert speakers share valuable knowledge and answer your
              questions.
            </p>
            <div className="d-flex justify-content-center">
              <Button className="health-support-button">Register Now</Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* قسم الصور المتحركة */}
      <div className="health-image-gallery text-center mb-5">
        <h2 className="section-title mb-4">Explore Our Health Resources</h2>
        <div className="health-images-container">
          <img
            src={HealthResource1}
            alt="Health Resource 1"
            className="animated-health-image"
          />
          <img
            src={HealthResource2}
            alt="Health Resource 2"
            className="animated-health-image"
          />
          <img
            src={HealthResource3}
            alt="Health Resource 3"
            className="animated-health-image"
          />
        </div>
      </div>
    </div>
  );
};

export default HealthEducation;
