import React from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeliveryOption = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Container className="mt-5">
      <Card className="shadow">
        <CardBody>
          <CardTitle tag="h2">Delivery Option</CardTitle>
          <CardText>
            Get your medication delivered directly to your location on campus.
            Our delivery service ensures that you receive your prescribed
            medicines safely and on time.
          </CardText>
          <CardText>
            🚚 **Delivery Coverage:** University Campus & Nearby Residences 🕒
            **Delivery Hours:** Monday - Friday, 9:00 AM - 5:00 PM 📞
            **Contact:** +968 99453522
          </CardText>
          <CardText>
            Please ensure you have a valid university ID when receiving your
            medication.
          </CardText>
          <Link to="/">
            <Button color="primary">Back to Home</Button>
          </Link>
        </CardBody>
      </Card>
    </Container>
  );
};

export default DeliveryOption;
