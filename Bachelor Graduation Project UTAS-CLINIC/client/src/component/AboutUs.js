import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUsers, FaCalendarAlt, FaClock } from "react-icons/fa";
import "./AboutUs.css"; // تأكد من إنشاء ملف CSS مخصص
import doctorImage from "./images/team.png";
import icon1 from "./images/de1.png";
import icon2 from "./images/des.png";
import icon3 from "./images/mang.png";
import "./tailwind.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const AboutUs = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <div className="about-container">
      <div className="about-header">
        <h1 className="about-title">About Our University Clinic</h1>
        <p className="about-description">
          The university clinic is dedicated to enhancing the campus experience
          by providing comprehensive healthcare services to students, teachers,
          and staff. With a focus on promoting physical and mental well-being,
          the clinic plays a vital role in supporting academic success and
          work-life balance.
        </p>
      </div>

      <div className="clinic-stats">
        <div className="stat">
          <FaUsers size={40} className="icon" />
          <h3>1,500+</h3>
          <p>Active Users</p>
        </div>
        <div className="stat">
          <FaClock size={40} className="icon" />
          <h3>365 Days</h3>
          <p>Working Days</p>
        </div>
        <div className="stat">
          <FaCalendarAlt size={40} className="icon" />
          <h3>Dec 5, 2024</h3>
          <p>Founded</p>
        </div>
      </div>

      {/* ما نقدمه لك */}
      <h2 className="title animate-title">What We Offer You With Us</h2>

      <div className="timeline-wrapper">
        <div className="vertical-line"></div>

        <div className="card-container top">
          <div className="circle">1</div>
          <div className="card-content">
            <h4>Wide Range of Services</h4>
            <p>
              The clinic offers a wide range of services, including primary
              care, mental health counseling, chronic condition management, and
              emergency support.
            </p>
          </div>
        </div>

        <div className="card-container middle">
          <div className="circle">2</div>
          <div className="card-content">
            <h4>Fostering A Healthier Environment</h4>
            <p>
              We are dedicated to creating a healthier, more productive
              environment where students and staff can thrive.
            </p>
          </div>
        </div>

        <div className="card-container bottom">
          <div className="circle">3</div>
          <div className="card-content">
            <h4>Empowering Academic & Personal Success</h4>
            <p>
              We aim to empower the academic and personal success of our
              community by providing essential healthcare services.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="bodyteam">
          <div className="team-introduction">
            <div className="team-introduction-text">
              <h1 className="h-team">Meet our team!</h1>
              <p>
                {" "}
                Get to know the dedicated professionals who are here to support
                your health and well-being every step of the way..
              </p>
            </div>
            <div className="team-introduction-image">
              <img src={doctorImage} alt="Doctor" />
            </div>
          </div>

          {/* Team Members Section */}
          <div className="team-members">
            <div className="team-member-box">
              <img src={icon1} alt="Salma Al-Amri" />
              <h3>
                <b>Salma Al-Amri</b>
              </h3>
              <h5>University Clinic Developer</h5>
              <p>
                {" "}
                Salma Al Amri is a skilled developer specializing in user
                interface design for university health services. Her expertise
                lies in creating innovative platforms that improve access to
                healthcare for students and staff while promoting a healthy
                campus environment...
              </p>
            </div>
            <div className="team-member-box">
              <img src={icon2} alt="Fatma Al-Amri" />
              <h3>
                <b>Fatima Al-Amri</b>
              </h3>
              <h5>Data Systems Designer</h5>
              <p>
                {" "}
                Fatma is a skilled data systems designer specializing in
                developing innovative solutions for the university clinic. Her
                expertise lies in creating efficient systems for managing and
                analyzing healthcare data, ensuring that services are tailored
                to meet the needs of students and staff...
              </p>
            </div>
            <div className="team-member-box">
              <img src={icon3} alt="Tafool Kashoob" />
              <h3>
                <b>Tafool Kashoob</b>
              </h3>
              <h5>University Clinic Manager</h5>
              <p>
                {" "}
                Tafool is the manager of the university clinic, committed to
                advancing health services for students and staff. With a strong
                background in leadership and community health, Tafool strives to
                create a supportive environment that prioritizes well-being and
                care...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
