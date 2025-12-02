import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Communication.css"; // تأكد من أن هذا الملف موجود في مجلد src
import { useDispatch, useSelector } from "react-redux";
import { saveUserMsg, getUserMsgs } from "../Features/MessageSlice";
import { useNavigate } from "react-router-dom";

const Communication = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users?.user);
  const { userMessages, status, error } = useSelector(
    (state) => state.userMessages || {}
  );

  const [message, setMessage] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savedMessage, setSavedMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status

  useEffect(() => {
    if (status === "idle") {
      dispatch(getUserMsgs());
    }
  }, [dispatch, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message || !name || !email) {
      alert("Please provide a valid message, name, and email.");
      return;
    }

    const userMessageData = {
      name: name || "Anonymous",
      email: email || "",
      userMsg: message,
    };

    setIsSubmitting(true); // Set submitting state to true

    try {
      const response = await dispatch(saveUserMsg(userMessageData)).unwrap();
      alert("Message submitted successfully!");
      setMessage(""); // Clear the message input field
      setSavedMessage(response.usermessage); // Store the saved message
    } catch (error) {
      console.error("Message Error:", error);
      alert(
        "There was an error submitting your message. Please try again later."
      );
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  // التحقق من تسجيل الدخول
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Container className="communication-container my-5">
      <h1 className="text-center mb-4">Communication & Support</h1>

      {/* الفقرة التوضيحية */}
      <div className="intro-text text-center mb-5">
        <p>
          <strong>Effective communication and reliable support</strong> are at
          the heart of our university clinic's operations. We provide seamless
          channels for students, staff, and faculty to connect with healthcare
          professionals, ensuring their concerns are heard and addressed
          promptly.
        </p>
        <p>
          Whether through our online platform, direct consultations, or feedback
          systems, we prioritize clarity and accessibility in every interaction.
        </p>
        <p>
          Our support services are designed to guide you through booking
          appointments, accessing health information, and addressing
          emergencies. At the university clinic, we are committed to creating a
          supportive environment where everyone feels cared for and empowered to
          prioritize their well-being.
        </p>
      </div>

      {/* معلومات التواصل */}
      <Row className="mb-4">
        <Col md="4">
          <Card className="text-center p-3">
            <FontAwesomeIcon
              icon={faPhone}
              size="2x"
              className="mb-3 text-primary"
            />
            <h5>Phone</h5>
            <p>+968 99292300</p>
          </Card>
        </Col>
        <Col md="4">
          <Card className="text-center p-3">
            <FontAwesomeIcon
              icon={faEnvelope}
              size="2x"
              className="mb-3 text-danger"
            />
            <h5>Email</h5>
            <p>clinic@university.edu</p>
          </Card>
        </Col>
        <Col md="4">
          <Card className="text-center p-3">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size="2x"
              className="mb-3 text-success"
            />
            <h5>Address</h5>
            <p>Salalah, Oman</p>
          </Card>
        </Col>
      </Row>

      {/* نموذج التواصل */}
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="p-4 shadow">
            <h3 className="text-center">Send us a Message</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isSubmitting}
              >
                Send Message
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Communication;
