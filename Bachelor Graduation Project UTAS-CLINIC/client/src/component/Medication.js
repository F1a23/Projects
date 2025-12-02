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
  Input,
  Button,
} from "reactstrap";
import "./medication.css";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const medications = [
  {
    id: 1,
    name: "Moov ointment Gel",
    description: "Moov Ointment Gel is used to relieve muscle and joint pain.",
    image:
      "https://focallurebangladesh.com/wp-content/uploads/2025/01/Moov-Pain-Relief-Cream.jpg",
  },
  {
    id: 2,
    name: "Naphcon-A eye drop",
    description:
      "Naphcon-A eye drops are used to relieve eye irritation, redness.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSmh3BtM89VGn9rqZr6mRYtR990AHOvp-NXkLIeHAj25qFuh1tMoWFZMShoYY4NDogeyg&usqp=CAU",
  },
  {
    id: 3,
    name: "Mebo ointment",
    description:
      "Mebo ointment is used to promote healing of wounds, burns, and skin ulcers.",
    image:
      "https://m.media-amazon.com/images/I/61ptGDADJZL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 4,
    name: "Lubricant eye Drop",
    description:
      "Are used to relieve dryness, irritation, and discomfort in the eyes caused by factors like dryness, wind.",
    image:
      "https://pharmacyforlife.ca/cdn/shop/products/05639429017_0dcd7ef7-1d77-4f74-a171-c7777b1ae9ce.jpg?v=1585665619",
  },
  {
    id: 5,
    name: "Panadol Tab Cold & Flu Day",
    description:
      "Are used to relieve symptoms of cold and flu, such as fever, headaches, body aches, nasal congestion, and sore throat, without causing drowsiness.",
    image:
      "https://i-cf65.ch-static.com/content/dam/cf-consumer-healthcare/panadol-reborn/en_ME/product-detail/380x463-new/Cold-n-Flu-Day.jpg?auto=format",
  },
  {
    id: 6,
    name: "Panadol Tab Cold & Flu all in one",
    description:
      "Are used to relieve multiple cold and flu symptoms, including fever, headaches, body aches, nasal congestion, and sore throat.",
    image:
      "https://i-cf65.ch-static.com/content/dam/cf-consumer-healthcare/panadol-reborn/en_ME/product-detail/380x463-new/Cold-n-Flu-All-in-One-p.png?auto=format",
  },
  {
    id: 7,
    name: "Buscopan tablets",
    description:
      "Used to relieve abdominal cramps and discomfort caused by gastrointestinal disorders.",
    image:
      "https://medicinaonline.ae/cdn/shop/products/UAE_DG_BUSCOPAN50tab-4.jpg?v=1739957008",
  },
  {
    id: 8,
    name: "Strepsils",
    description:
      "Are lozenges used to soothe sore throats and relieve symptoms of throat irritation.",
    image:
      "https://www.goodlife.co.ke/wp-content/smush-webp/2024/03/1135580.jpg.webp",
  },
];

const Medication = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [quantities, setQuantities] = useState({});
  const [selectedMedications, setSelectedMedications] = useState({});

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (id) => {
    setSelectedMedications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = (id) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[id];
      return newQuantities;
    });

    setSelectedMedications((prev) => {
      const newSelectedMedications = { ...prev };
      delete newSelectedMedications[id];
      return newSelectedMedications;
    });
  };

  const handleSubmit = () => {
    const selected = Object.keys(selectedMedications)
      .filter((id) => selectedMedications[id] && quantities[id] > 0)
      .map((id) => parseInt(id));

    const filteredQuantities = {};
    selected.forEach((id) => {
      filteredQuantities[id] = quantities[id];
    });

    navigate("/order", {
      state: {
        selectedMedications: selected,
        quantities: filteredQuantities,
      },
    });
  };

  // التحقق من أن جميع الأدوية المحددة تحتوي على كمية أكبر من صفر
  const isSubmitDisabled =
    Object.keys(selectedMedications).length === 0 ||
    Object.keys(selectedMedications)
      .filter((id) => selectedMedications[id])
      .some((id) => !quantities[id] || quantities[id] <= 0);

  return (
    <Container fluid className="medication-container">
      <div className="fancy-box">
        <h1 className="fancy-box-title">Request Your Medication</h1>
        <p className="fancy-box-text">
          Committed to excellence in healthcare for students and staff.
          Providing trusted medical solutions and quality care.
        </p>
      </div>
      <Row className="medication-row">
        {medications.map((medication) => (
          <Col md={4} key={medication.id} className="mb-4">
            <Card className="medication-card">
              <CardImg
                className="medication-card-img"
                top
                width="100%"
                src={medication.image}
                alt={medication.name}
              />
              <CardBody className="medication-card-body">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    type="checkbox"
                    checked={!!selectedMedications[medication.id]}
                    onChange={() => handleCheckboxChange(medication.id)}
                    style={{ marginRight: "10px" }}
                  />
                  <CardTitle tag="h5">{medication.name}</CardTitle>
                </div>
                <CardText>{medication.description}</CardText>

                <div
                  className="input-group small-input-group"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Input
                    type="number"
                    disabled={!selectedMedications[medication.id]}
                    value={quantities[medication.id] || ""}
                    onChange={(e) =>
                      handleQuantityChange(medication.id, e.target.value)
                    }
                    placeholder="Enter the quantity"
                    min="0"
                  />
                  <button
                    onClick={() => handleDelete(medication.id)}
                    className="DeletB btn btn-outline-danger"
                    title="Clear quantity"
                    disabled={!selectedMedications[medication.id]}
                  >
                    <FaTrash />
                  </button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <div
        className="submit-wrapper"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          Submit
        </Button>
      </div>
    </Container>
  );
};

export default Medication;
