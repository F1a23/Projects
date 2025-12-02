import React, { useState } from "react";
import {
  Button,
  Container,
  Input,
  FormGroup,
  Label,
  Card,
  CardBody,
} from "reactstrap";
import {
  FaLocationArrow,
  FaBuilding,
  FaHashtag,
  FaClipboard,
} from "react-icons/fa";
import "./OrderDelivery.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const OrderDelivery = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [buildingName, setBuildingName] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [location, setLocation] = useState(null);

  // Function to get the user's current location (using geolocation API)
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!buildingName || !buildingNumber || !roomNumber) {
      alert("Please fill in all fields.");
    } else {
      alert("Delivery request submitted!");
      // Here you can handle the submission logic (send data to server, etc.)
    }
  };

  return (
    <Container className="order-delivery-container">
      <Card className="order-delivery-card">
        <CardBody>
          <h2 className="order-delivery-title">📦 Delivery Request</h2>
          <FormGroup>
            <Label for="buildingNumber">
              <FaHashtag className="icon" /> Building Number
            </Label>
            <Input
              type="text"
              id="buildingNumber"
              placeholder="Enter building number"
              value={buildingNumber}
              onChange={(e) => setBuildingNumber(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="buildingName">
              <FaBuilding className="icon" /> Building Name
            </Label>
            <Input
              type="text"
              id="buildingName"
              placeholder="Enter building name"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label for="roomNumber">
              <FaClipboard className="icon" /> Room Number
            </Label>
            <Input
              type="text"
              id="roomNumber"
              placeholder="Enter room number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </FormGroup>

          <div className="location-section">
            <Button
              color="primary"
              onClick={getCurrentLocation}
              className="location-btn"
            >
              <FaLocationArrow className="location-icon" /> Get My Location
            </Button>
            {location && (
              <p className="location-info">
                Latitude: {location.latitude}, Longitude: {location.longitude}
              </p>
            )}
          </div>

          <Button color="success" className="submit-btn" onClick={handleSubmit}>
            Submit Delivery Request
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default OrderDelivery;
