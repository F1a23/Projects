import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const ForgotPassword = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/forgot-password",
        { email }
      );

      if (response.data.success) {
        toast.success(
          "Check your email for instructions to reset your password."
        );
        navigate("/login");
      } else {
        toast.error(response.data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error sending password reset request:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <Container className="forgot-password-container">
      <Row className="forgot-password-wrapper">
        <Col md="6" className="left-section">
          <h2 className="text-login">Reset Your Password</h2>
          <p>
            If you forgot your password, enter your email and we'll send you a
            link to reset it.
          </p>
        </Col>

        <Col md="6" className="right-section">
          <div className="forgot-password-box">
            <h1 className="text-center mb-4">Forgot Password</h1>
            <Form onSubmit={handleForgotPassword}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="input-field"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </FormGroup>
              <Button color="primary" block type="submit" className="reset-btn">
                Send Reset Link
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
