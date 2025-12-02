import React from "react";
import "./DirectHealth.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DirectHealth = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="direct-health-container mt-5">
      <h1 className="direct-health-header">Direct Health Services</h1>
      <p className="direct-health-description">
        The University Clinic offers a wide range of direct health services to
        ensure the well-being of students, faculty, and staff. Our services are
        designed to provide quick, effective, and compassionate care. Whether
        you need routine check-ups, emergency care, or vaccinations, we are here
        to help.
      </p>

      <div className="direct-health-services-list">
        <h3>Our Key Direct Health Services:</h3>
        <ul>
          <li>
            <strong>Primary Healthcare:</strong> We offer comprehensive
            healthcare services, including routine check-ups, physical exams,
            and treatment for common illnesses.
          </li>
          <li>
            <strong>Minor Emergency Care:</strong> For any unexpected medical
            situations, we provide prompt emergency care, including first aid,
            wound treatment, and stabilization of patients until further care is
            available.
          </li>
          <li>
            <strong>Vaccinations:</strong> Our clinic provides essential
            vaccinations for students and staff to protect against common
            infectious diseases.
          </li>
          <li>
            <strong>Health Screenings:</strong> We offer screenings for various
            health conditions, including diabetes, hypertension, and cholesterol
            management.
          </li>
          <li>
            <strong>Chronic Disease Management:</strong> For individuals with
            chronic conditions like asthma, diabetes, or hypertension, we offer
            ongoing management and care to help you live a healthy life.
          </li>
        </ul>
      </div>

      <div className="direct-health-additional-info mt-4">
        <h3>How to Access Our Direct Health Services:</h3>
        <p>
          Accessing our services is easy! Simply schedule an appointment via our
          online platform or walk in during our clinic hours. We ensure that all
          our patients are treated with respect, dignity, and the highest level
          of medical care.
        </p>
        <p>
          For urgent medical situations, you can contact our clinic directly,
          and we will prioritize your care immediately.
        </p>
      </div>

      <div className="direct-health-contact-info mt-4">
        <h3>Contact Us for More Information:</h3>
        <p>
          If you have any questions or would like more information about our
          direct health services, please feel free to reach out to us. Our team
          is always ready to assist you.
        </p>
        <ul>
          <li>
            <strong>Email:</strong> clinic@university.edu
          </li>
          <li>
            <strong>Phone:</strong> +968 99292300
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DirectHealth;
