import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ContactUs.css"; // تأكد من أنك أنشأت ملف CSS لهذا التصميم
import { useDispatch, useSelector } from "react-redux";
import { saveUserMsg, getUserMsgs } from "../Features/MessageSlice";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="contact-container">
      <div className="header-contant">
        <h1>Contact Us</h1>
        <p>
          At the University Clinic, healthcare is more than just a service—it's
          a journey of healing and support. Every interaction, consultation, and
          service is designed to contribute to a healthier, brighter future for
          our students and staff. Together, we nurture well-being and empower
          our community to thrive.
        </p>
      </div>

      <div className="contact-form">
        <h2>We'd Love to Hear From You!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              className="form-control"
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Send Message"}
          </button>
        </form>
      </div>

      <div className="clinic-info">
        <h3>Visit Our University Clinic</h3>
        <p>
          Address: University of Technology and Applied Sciences Salalah Branch
          Southern Happiness Area - Salalah - Sultanate of Oman
        </p>
        <p>Phone: +968 99292300</p>
        <p>Email: clinic@university.edu</p>
      </div>

      {/* إضافة الخريطة التفاعلية لموقع الكلية */}
      <div className="map-container">
        <h3>Find Us Here</h3>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1439.0728316932013!2d56.10701351602378!3d17.008573695125472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e9a9bb0fe8e6f49%3A0xe1ee71ab91ad7e1a!2sSalalah%20University%20Campus!5e0!3m2!1sen!2s!4v1648582927012!5m2!1sen!2s"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="University Clinic Location"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
