import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import {
  faComments,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { getFeedbacks } from "../Features/FeedbackSlice";
import "./Comments.css";
import { useNavigate } from "react-router-dom";

const Comments = () => {
  const dispatch = useDispatch();
  const { feedbacks, status } = useSelector((state) => state.feedbacks);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  const user = useSelector((state) => state.users.user);
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);
  useEffect(() => {
    if (status === "idle") {
      dispatch(getFeedbacks());
    }
  }, [status, dispatch]);

  const displayedFeedbacks = feedbacks.slice(currentIndex, currentIndex + 3);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  const handleNext = () => {
    if (currentIndex + 3 < feedbacks.length) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  return (
    <Container className="comments-container my-6">
      <Row className="text-center mb-4">
        <Col>
          <h2>What Our Clients Say About Us</h2>
        </Col>
      </Row>

      <div className="comments-wrapper d-flex align-items-center">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="arrow-button left-arrow"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>

        <Row className="flex-grow-1">
          {status === "loading" ? (
            <Col className="text-center">
              <p>Loading feedbacks...</p>
            </Col>
          ) : displayedFeedbacks.length > 0 ? (
            displayedFeedbacks.map((feedback, index) => (
              <Col md="4" key={index}>
                <Card className="feedback-card shadow mb-4">
                  <CardBody className="text-center">
                    <FontAwesomeIcon
                      icon={faComments}
                      size="2x"
                      className="feedback-icon mb-3"
                    />
                    <CardTitle tag="h6" className="feedback-Rating">
                      <span className="feedback-rating"> Rating</span> :
                      {feedback.rating}
                    </CardTitle>
                    <CardTitle tag="h6" className="feedback-name">
                      {feedback.name} :
                    </CardTitle>
                    <CardText className="feedback-msg">
                      {feedback.feedbackMsg}
                    </CardText>
                    <small className="text-muted">
                      {moment(feedback.createdAt).fromNow()}
                    </small>
                  </CardBody>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p>No feedback available yet.</p>
            </Col>
          )}
        </Row>

        <Button
          onClick={handleNext}
          disabled={currentIndex + 3 >= feedbacks.length}
          className="arrow-button right-arrow"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>
    </Container>
  );
};

export default Comments;
