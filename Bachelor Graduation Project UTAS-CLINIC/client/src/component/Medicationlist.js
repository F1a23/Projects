import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Input,
} from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./medication.css"; // نفس الأنماط من الصفحة الأولى
import { useSelector } from "react-redux";
import { useEffect } from "react";

const medications = [
  {
    id: 1,
    name: "Moov ointment Gel",
    image:
      "https://focallurebangladesh.com/wp-content/uploads/2025/01/Moov-Pain-Relief-Cream.jpg",
  },
  {
    id: 2,
    name: "Naphcon-A eye drop",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSmh3BtM89VGn9rqZr6mRYtR990AHOvp-NXkLIeHAj25qFuh1tMoWFZMShoYY4NDogeyg&usqp=CAU",
  },
  {
    id: 3,
    name: "Mebo ointment",
    image:
      "https://m.media-amazon.com/images/I/61ptGDADJZL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 4,
    name: "Lubricant eye Drop",
    image:
      "https://pharmacyforlife.ca/cdn/shop/products/05639429017_0dcd7ef7-1d77-4f74-a171-c7777b1ae9ce.jpg?v=1585665619",
  },
  {
    id: 5,
    name: "Panadol Tab Cold & Flu Day",
    image:
      "https://i-cf65.ch-static.com/content/dam/cf-consumer-healthcare/panadol-reborn/en_ME/product-detail/380x463-new/Cold-n-Flu-Day.jpg?auto=format",
  },
  {
    id: 6,
    name: "Panadol Tab Cold & Flu all in one",
    image:
      "https://i-cf65.ch-static.com/content/dam/cf-consumer-healthcare/panadol-reborn/en_ME/product-detail/380x463-new/Cold-n-Flu-All-in-One-p.png?auto=format",
  },
  {
    id: 7,
    name: "Buscopan tablets",
    image:
      "https://medicinaonline.ae/cdn/shop/products/UAE_DG_BUSCOPAN50tab-4.jpg?v=1739957008",
  },
  {
    id: 8,
    name: "Strepsils",
    image:
      "https://www.goodlife.co.ke/wp-content/smush-webp/2024/03/1135580.jpg.webp",
  },
];

const Order = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);
  const [deliveryMethod, setDeliveryMethod] = useState(""); // state to store delivery option
  const [deliveryDetails, setDeliveryDetails] = useState({
    building: "",
    room: "",
    buildingName: "", // إضافة اسم المبنى
  });
  const location = useLocation();
  const { selectedMedications = [], quantities = {} } = location.state || {};

  const selectedData = medications.filter((med) =>
    selectedMedications.includes(med.id)
  );

  const handleNextClick = () => {
    if (
      deliveryMethod === "delivery" &&
      (!deliveryDetails.building || !deliveryDetails.buildingName)
    ) {
      alert(
        "Please provide the delivery details (building name, building number, room)."
      );
      return;
    }

    navigate("/summaryReport", {
      state: {
        selectedMedications,
        quantities,
        deliveryMethod,
        deliveryDetails,
      },
    });
  };

  const handleBackClick = () => {
    navigate("/medication"); // ارجع إلى صفحة الأدوية
  };

  const handleDeliveryChange = (e) => {
    setDeliveryMethod(e.target.value);
    setDeliveryDetails({ building: "", room: "", buildingName: "" }); // Reset details on change
  };

  // التحقق إذا كانت البيانات كاملة
  const isNextDisabled =
    !deliveryMethod ||
    (deliveryMethod === "delivery" &&
      (!deliveryDetails.building ||
        !deliveryDetails.buildingName ||
        !deliveryDetails.room));

  return (
    <Container className="medication-summary-container">
      <h2 className="medication-summary-title">Selected Medications</h2>
      {/* عرض الأدوية المختارة */}
      <Row className="medication-summary-row">
        {selectedData.map((med) => (
          <Col
            xs={12}
            sm={6}
            md={4}
            key={med.id}
            className="medication-summary-col"
          >
            <Card className="medication-summary-card">
              <CardImg
                className="medication-summary-img"
                top
                width="100%"
                src={med.image}
                alt={med.name}
              />
              <CardBody className="medication-summary-body">
                <CardTitle tag="h5" className="medication-summary-name">
                  {med.name}
                </CardTitle>
                <CardText className="medication-summary-quantity">
                  <strong>Quantity:</strong> {quantities[med.id]}
                </CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="delivery-options">
        <h5>Choose Delivery Option</h5>
        <div>
          <input
            type="radio"
            id="delivery"
            name="deliveryMethod"
            value="delivery"
            onChange={handleDeliveryChange}
          />
          <label htmlFor="delivery">Delivery</label>
        </div>
        <div>
          <input
            type="radio"
            id="pickup"
            name="deliveryMethod"
            value="pickup"
            onChange={handleDeliveryChange}
          />
          <label htmlFor="pickup">Pickup from Clinic</label>
        </div>
      </div>

      {deliveryMethod === "delivery" && (
        <div className="delivery-details">
          <h5>Enter Delivery Details</h5>
          <div>
            <label htmlFor="building">Building Number</label>
            <Input
              type="text"
              id="building"
              value={deliveryDetails.building}
              onChange={(e) =>
                setDeliveryDetails((prev) => ({
                  ...prev,
                  building: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label htmlFor="buildingName">Building Name</label>
            <Input
              type="text"
              id="buildingName"
              value={deliveryDetails.buildingName}
              onChange={(e) =>
                setDeliveryDetails((prev) => ({
                  ...prev,
                  buildingName: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label htmlFor="room">Room Number</label>
            <Input
              type="text"
              id="room"
              value={deliveryDetails.room}
              onChange={(e) =>
                setDeliveryDetails((prev) => ({
                  ...prev,
                  room: e.target.value,
                }))
              }
            />
          </div>
        </div>
      )}

      {deliveryMethod === "pickup" && (
        <div className="pickup-details">
          <h5 className="pickup-heading">Pickup Information</h5>
          <div className="pickup-text">
            <p>
              You can pick up your medication directly from our university
              clinic.
            </p>
            <p>
              <strong>📍 Location:</strong> University Clinic, Main Pharmacy
              Desk
            </p>
            <p>
              <strong>🕒 Pick-Up Hours:</strong> Monday - Friday, 8:00 AM - 6:00
              PM
            </p>
            <p>
              Please bring a valid university ID and your prescription details
              when collecting your medication.
            </p>
          </div>
        </div>
      )}

      <div className="button-group">
        <Button
          color="secondary"
          onClick={handleBackClick}
          className="action-button"
        >
          Back
        </Button>
        <Button
          color="success"
          onClick={handleNextClick}
          className="action-button"
          disabled={isNextDisabled} // تعطيل الزر إذا لم تكن الشروط متوفرة
        >
          OK
        </Button>
      </div>
    </Container>
  );
};

export default Order;
