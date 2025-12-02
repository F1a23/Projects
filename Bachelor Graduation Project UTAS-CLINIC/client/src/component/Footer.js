import React from "react";
import { Container, Row, Col } from "reactstrap";
import {
  FaPhoneAlt,
  FaInstagram,
  FaSnapchat,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo from "../component/images/logo.png"; // Path to your logo image
import "./Footer.css"; // استيراد ملف CSS

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5">
      <Container>
        <Row>
          {/* Left Section: Logo and About Info */}
          <Col md={4} className="text-left mb-4 mb-md-0">
            <img
              src={logo}
              alt="Logo"
              className="footer-logo mb-3"
              style={{ width: "180px", filter: "invert(1)" }}
            />
            <p className="footer-text">
              University Clinic is a medical center that provides health care
              services to students and teachers. We are committed to enhancing
              the daily performance of our clients by maintaining their health.
            </p>
          </Col>

          {/* Center Section: Contact Info (Align Left) */}
          <Col md={4} className="text-left mb-4 mb-md-0">
            <h6 className="footer-heading">Contact Information</h6>
            <p className="footer-text">
              <FaMapMarkerAlt /> <strong>Store Location:</strong> Salalah, Oman
            </p>
            <p className="footer-text">
              <FaPhoneAlt />{" "}
              <a href="tel:+96899292300" className="text-white">
                99292300
              </a>
            </p>
            <p className="footer-text">
              <FaEnvelope />{" "}
              <a href="clinic@university.edu" className="text-white">
                University Clinic
              </a>
            </p>
          </Col>

          {/* Right Section: Social Media */}
          <Col md={4} className="text-left">
            <h6 className="footer-heading">Social Media</h6>
            <ul className="list-unstyled">
              <li className="footer-text">
                <FaInstagram />{" "}
                <a
                  href="https://www.instagram.com/utas_clinic?igsh=N3dtNjBkNXF3bmpt"
                  target="_blank"
                  className="text-white social-icon"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Divider and Copyright */}
        <hr className="my-4" style={{ borderColor: "#fff", opacity: 0.2 }} />
        <Row>
          <Col className="text-center">
            <p className="footer-text mb-0">
              &copy; 2024 University Clinic. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
