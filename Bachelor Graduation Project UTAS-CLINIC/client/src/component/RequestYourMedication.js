import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import Medication from "./Medication";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const RequestYourMedication = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  // الحالة لتخزين بيانات النموذج
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    medication: "",
    quantity: "",
  });

  // تحديث حالة النموذج عندما يتغير أي حقل
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // إرسال النموذج (يمكن إضافة منطق لإرسال البيانات إلى الخادم في المستقبل)
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your request has been submitted!");
    // هنا يمكنك إضافة منطق لإرسال البيانات إلى الخادم.
    console.log(formData);
  };

  return (
    <Container className="mt-5">
      <Row className="text-center mb-4">
        <Col></Col>
        <Row>
          <Col>
            <Medication />
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default RequestYourMedication;
