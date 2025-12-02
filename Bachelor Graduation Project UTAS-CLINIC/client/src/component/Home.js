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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import { faComments } from "@fortawesome/free-solid-svg-icons";
import heroImage from "../component/images/hom.jpg";
import "./home.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comments from "./Comments";

function Home() {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="home-page">
      {/* قسم الهيرو */}
      <div
        className="hero-section d-flex align-items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay"></div>
        <Container className="position-relative">
          <Row className="justify-content-center text-center">
            <Col md="10" lg="8">
              <div className="hero-content-box p-5">
                <h1 className="hero-title mb-4">
                  Caring for students' and teachers' health to enhance daily
                  performance.
                </h1>
                <p className="hero-subtitle mb-4">
                  We are committed to providing comprehensive and diverse
                  medical services aimed at maintaining the health of students
                  and teachers. We believe that good health is the foundation of
                  excellent performance.
                </p>
                <div className="btn-container d-flex gap-3 justify-content-center mt-3">
                  <Button color="info" className="shadow-lg px-4 py-2">
                    Call Now
                  </Button>
                  <Button color="danger" className="shadow-lg px-4 py-2">
                    Watch Video
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* قسم الخدمات (بطاقات) */}
      <Container>
        <div className="clinic-timeline-section py-5">
          <div className="clinic-section-title text-center mb-5">
            <h2>Our Services</h2>
            <p className="subtitle">
              Here are some of the essential services we provide.
            </p>
            <Button
              variant="primary"
              className="see-sevice"
              onClick={() => navigate("/services")}
            >
              {" "}
              Go to Services
            </Button>
          </div>
          <div className="clinic-timeline-wrapper">
            <div className="clinic-vertical-line"></div>

            {/* بطاقات */}
            <div className="clinic-card-container clinic-left">
              <div className="clinic-circle">1</div>
              <div className="clinic-card-content">
                <h4>Direct Health Services</h4>
                <p>
                  The clinic offers primary healthcare for students and staff,
                  treats minor emergencies, provides vaccination services
                  against infectious diseases, and more.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-right">
              <div className="clinic-circle">2</div>
              <div className="clinic-card-content">
                <h4>Appointment Scheduling</h4>
                <p>
                  Facilitating online appointment booking via the web app,
                  ensuring easy and convenient scheduling for routine check-ups
                  and consultations.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-left">
              <div className="clinic-circle">3</div>
              <div className="clinic-card-content">
                <h4>Communication & Support</h4>
                <p>
                  The clinic provides channels for communication between
                  patients and healthcare providers, ensuring feedback and
                  continuous improvement.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-right">
              <div className="clinic-circle">4</div>
              <div className="clinic-card-content">
                <h4>Health Education & Awareness</h4>
                <p>
                  Offering workshops, seminars, and resources to promote health
                  awareness among students and staff.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-left">
              <div className="clinic-circle">5</div>
              <div className="clinic-card-content">
                <h4>Mental Health Services</h4>
                <p>
                  Offering counseling services to support mental health, helping
                  students and staff manage stress and anxiety.
                </p>
              </div>
            </div>

            <div className="clinic-card-container clinic-right">
              <div className="clinic-circle">6</div>
              <div className="clinic-card-content">
                <h4>Medication Management</h4>
                <p>
                  Patients can request prescribed or common medications via the
                  app, with on-campus delivery services for requested
                  medications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
      {/* قسم آراء العملاء */}
      <Container className="services-section my-6">
        <Row className="justify-content-center">
          <Col md="8">
            <Comments />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
