import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Card, CardBody } from "reactstrap";
import { FaPills, FaHashtag, FaTruck, FaClinicMedical } from "react-icons/fa";
import "./Order.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const OrderSummary = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const location = useLocation();
  const { name, quantity } = location.state || {};

  return (
    <Container className="order-container">
      <Card className="order-card">
        <CardBody>
          <h2 className="order-title">🧾 Order Summary</h2>
          <div className="order-detail">
            <p>
              <FaPills className="icon" /> <strong>Medication:</strong> {name}
            </p>
            <p>
              <FaHashtag className="icon" /> <strong>Quantity:</strong>{" "}
              {quantity}
            </p>
          </div>
          <h5 className="delivery-title">🚚 Delivery Option</h5>
          <div className="delivery-buttons">
            <Button
              color="success"
              className="delivery-btn"
              onClick={() => navigate("/orderdelivery")}
            >
              <FaTruck className="btn-icon" /> Delivery
            </Button>
            <Button
              color="info"
              className="pickup-btn"
              onClick={() => navigate("/pick-up-option")}
            >
              <FaClinicMedical className="btn-icon" /> Pickup at Clinic
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default OrderSummary;
