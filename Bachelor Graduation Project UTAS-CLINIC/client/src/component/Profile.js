import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card } from "reactstrap";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaClinicMedical,
} from "react-icons/fa";
import "./profile.css";

const Profile = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [userData, setUserData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [medicationData, setMedicationData] = useState([]);

  useEffect(() => {
    if (user) {
      setUserData(user);

      // جلب بيانات الحجز
      const fetchAppointmentData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3001/getAppointment",
            {
              params: { email: user.email },
            }
          );
          setAppointmentData(response.data);
        } catch (error) {
          console.error("Error fetching appointment data:", error);
        }
      };

      // جلب بيانات الأدوية
      const fetchMedications = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3001/getUserMedications",
            {
              params: { email: user.email },
            }
          );
          setMedicationData(response.data);
        } catch (error) {
          console.error("Error fetching medications:", error);
        }
      };

      fetchAppointmentData();
      fetchMedications();
    }
  }, [user]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ntrp-profile-wrapper">
      <h1 className="ntrp-profile-title">Profile</h1>

      <Container className="ntrp-container">
        <Card className="ntrp-card">
          <Row className="ntrp-row">
            <Col md="4" className="ntrp-sidebar">
              <h3 className="ntrp-username">
                <br />
                <br />
                <br />
                <br />
                <FaUser className="me-2" />
                <br />
                <br />
                {userData.name}
              </h3>
            </Col>

            <Col md="8" className="ntrp-info">
              <h4 className="ntrp-section-title">Personal Information</h4>

              <div className="ntrp-info-item">
                <span className="ntrp-label">
                  <FaEnvelope /> Email:
                </span>
                <span className="ntrp-value">{userData.email}</span>
              </div>

              <div className="ntrp-info-item">
                <span className="ntrp-label">
                  <FaPhone /> Phone Number:
                </span>
                <span className="ntrp-value">{userData.contactNo}</span>
              </div>

              <div className="ntrp-info-item">
                <span className="ntrp-label">
                  <FaCalendarAlt /> Birth Date:
                </span>
                <span className="ntrp-value">{userData.birthDate}</span>
              </div>

              <hr className="ntrp-divider" />

              <h4 className="ntrp-section-title">Clinic Booking</h4>

              {appointmentData ? (
                <>
                  <div className="ntrp-info-item">
                    <span className="ntrp-label">
                      <FaClinicMedical /> Service Type:
                    </span>
                    <span className="ntrp-value">
                      {appointmentData.serviceType}
                    </span>
                  </div>

                  <div className="ntrp-info-item">
                    <span className="ntrp-label">
                      <FaCalendarAlt /> Appointment Date:
                    </span>
                    <span className="ntrp-value">
                      {appointmentData.appointmentDate}
                    </span>
                  </div>

                  <div className="ntrp-info-item">
                    <span className="ntrp-label">
                      <FaClinicMedical /> Appointment Time:
                    </span>
                    <span className="ntrp-value">
                      {appointmentData.appointmentTime}
                    </span>
                  </div>
                </>
              ) : (
                <div className="ntrp-info-item">
                  <span className="ntrp-label">
                    <FaClinicMedical /> Clinic:
                  </span>
                  <span className="ntrp-value">No appointment scheduled</span>
                </div>
              )}

              <hr className="ntrp-divider" />

              <h4 className="ntrp-section-title">Medications Information</h4>

              {medicationData && medicationData.length > 0 ? (
                medicationData.map((med, index) =>
                  med.medications && med.medications.length > 0
                    ? med.medications.map((item, i) => (
                        <div key={`${index}-${i}`} className="ntrp-info-item">
                          <span className="ntrp-label">
                            <FaClinicMedical /> {item.name}:
                          </span>
                          <span className="ntrp-value">{item.quantity}</span>
                        </div>
                      ))
                    : null
                )
              ) : (
                <div className="ntrp-info-item">
                  <span className="ntrp-label">
                    <FaClinicMedical /> Medications:
                  </span>
                  <span className="ntrp-value">
                    No medication requests found
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
