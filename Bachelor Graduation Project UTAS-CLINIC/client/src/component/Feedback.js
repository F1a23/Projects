import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Feedback.css"; // تأكد من أن ملف الـ CSS موجود
import { useDispatch, useSelector } from "react-redux";
import { saveFeedback, getFeedbacks } from "../Features/FeedbackSlice";
import { useNavigate } from "react-router-dom";
const Feedback = () => {
  const user = useSelector((state) => state.users.user); // Assuming user is stored in Redux

  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);
  const { feedbacks, status, error } = useSelector((state) => state.feedbacks);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    rating: 5,
    feedbackMsg: "",
  });

  useEffect(() => {
    // Fetch existing feedbacks when component mounts
    dispatch(getFeedbacks());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure formData is valid
    if (!formData.feedbackMsg || !formData.rating) {
      alert("Please provide a rating and feedback message.");
      return;
    }

    const feedbackData = {
      ...formData,
      name: user?.name || "Anonymous",
      email: user?.email || "",
    };

    try {
      await dispatch(saveFeedback(feedbackData)).unwrap();
      alert("Feedback submitted successfully!");
      setFormData({
        rating: 5,
        feedbackMsg: "",
      });
    } catch (error) {
      console.error("Feedback Error:", error);
      alert("An error occurred while submitting feedback.");
    }
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">We Value Your Feedback</h2>
      <p>Your feedback helps us improve our services and better serve you!</p>

      <div className="feedback-form-container">
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={user?.name || "Anonymous"}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={user?.email || ""}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              className="form-control"
              value={formData.rating}
              onChange={handleChange}
              required
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="feedback">Your Feedback</label>
            <input
              type="text"
              id="feedback"
              name="feedbackMsg"
              className="form-control"
              value={formData.feedbackMsg}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary submit-btn">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
