import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveUserMedication, resetState } from "../Features/MedicationSlice";
import { Container, Row, Col, Button, Alert } from "reactstrap";
import { useLocation } from "react-router-dom";
import "./medication.css";
import { useNavigate } from "react-router-dom";

const SummaryReport = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const location = useLocation();
  const dispatch = useDispatch();

  const { selectedMedications, quantities, deliveryMethod, deliveryDetails } =
    location.state || {};

  const { loading, error, successMessage } = useSelector(
    (state) => state.medication
  );


  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contactNo, setContactNo] = useState(user?.contactNo || "");
  const [deliveryError, setDeliveryError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setContactNo(user.contactNo || "");
    }

    return () => {
      dispatch(resetState());
    };
  }, [user, dispatch]);

  const medications = [
    { id: 1, name: "Moov ointment Gel" },
    { id: 2, name: "Naphcon-A eye drop" },
    { id: 3, name: "Mebo ointment" },
    { id: 4, name: "Lubricant eye Drop" },
    { id: 5, name: "Panadol Tab Cold & Flu Day" },
    { id: 6, name: "Panadol Tab Cold & Flu all in one" },
    { id: 7, name: "Buscopan tablets" },
    { id: 8, name: "Strepsils" },
  ];

  const selectedData = medications.filter((med) =>
    selectedMedications?.includes(med.id)
  );

  const handleSave = () => {
    // تحقق من الحقول
    if (deliveryMethod === "delivery" && !deliveryDetails) {
      setDeliveryError("Delivery details are required for delivery method.");
      return;
    }

    // تحقق من أن جميع الحقول تحتوي على قيم صحيحة
    if (!name || !email || !contactNo) {
      setDeliveryError("Please fill in all required fields.");
      return;
    }

    if (!selectedMedications || !quantities || quantities.length === 0) {
      setDeliveryError("Please select medications and provide quantities.");
      return;
    }

    // تحقق من أن الكميات مرتبطة بالأدوية بشكل صحيح
    for (let i = 0; i < selectedMedications.length; i++) {
      const medId = selectedMedications[i];
      if (!quantities[medId]) {
        setDeliveryError(
          `Please provide quantity for ${
            medications.find((med) => med.id === medId)?.name
          }`
        );
        return;
      }
    }

    // إضافة أسماء الأدوية إلى البيانات المرسلة
    const medicationDetails = selectedData.map((med) => ({
      name: med.name,
      quantity: quantities[med.id], // تأكد من أن الكميات مرتبطة بالـ ID بشكل صحيح
    }));

    const summaryData = {
      name,
      email,
      contactNo,
      selectedMedications,
      quantities,
      deliveryMethod,
      deliveryDetails,
      medications: medicationDetails, // إضافة أسماء الأدوية مع الكميات
    };

    console.log("Summary data being sent:", summaryData);

    // إرسال البيانات إلى Redux
    dispatch(saveUserMedication(summaryData));
  };

  return (
    <Container className="medication-summary-container">
      <h2 className="medication-summary-title">Medication Summary Report</h2>

      {loading && <p>Loading...</p>}
      {error && <Alert color="danger">{error}</Alert>}
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      {deliveryError && <Alert color="danger">{deliveryError}</Alert>}

      {/* User Details */}
      <div className="user-details">
        <h5>
          <strong>User Information</strong>
        </h5>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Phone Number:</strong> {contactNo}
        </p>
      </div>

      {/* Medications List */}
      <div className="medications-list">
        <h5>
          <strong>Selected Medications</strong>
        </h5>
        <Row>
          {selectedData.map((med) => (
            <Col
              xs={12}
              sm={6}
              md={4}
              key={med.id}
              className="medication-summary-col"
            >
              <div className="medication-item">
                <p className="medication-name">
                  <strong>{med.name}</strong>
                </p>
                <p className="medication-quantity">
                  <strong>Quantity:</strong> {quantities[med.id]}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Delivery Summary */}
      <div className="delivery-summary">
        <h5>
          <strong>Delivery Method</strong>
        </h5>
        <p>{deliveryMethod === "delivery" ? "Delivery" : "Pickup"}</p>
        {deliveryMethod === "delivery" && (
          <div>
            <p>
              <strong>Building Name:</strong> {deliveryDetails?.buildingName}
            </p>
            <p>
              <strong>Building Number:</strong> {deliveryDetails?.building}
            </p>
            <p>
              <strong>Room Number:</strong> {deliveryDetails?.room}
            </p>
          </div>
        )}
        {deliveryMethod === "pickup" && (
          <div>
            <p>
              You have chosen to pick up your medication from the university
              clinic.
            </p>
            <p>
              <strong>📍 Location:</strong> University Clinic, Main Pharmacy
              Desk
            </p>
            <p>
              <strong>🕒 Pick-Up Hours:</strong> Sunday - Thursday, 8:00 AM -
              2:00 PM
            </p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <Button color="primary" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
      <Button color="secondary" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </Container>
  );
};

export default SummaryReport;
