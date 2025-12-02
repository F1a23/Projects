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
import "../App.css";
import login1 from "../component/images/login6.png";
import logo from "../component/images/logo.png";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Features/UserSlice";
import axios from "axios";
import { toast } from "react-toastify";
import ForgotPassword from "./ForgotPassword";
import { useNavigate } from "react-router-dom"; // 👈 Import useNavigate

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // 👈 Initialize navigate
  const { user, isSuccess, isError } = useSelector((state) => state.users);

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

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
        setIsForgotPassword(false);
      } else {
        toast.error("Email not found. Please try again.");
      }
    } catch (error) {
      console.error("Error sending password reset request:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error("Login failed. Please check your credentials.");
    } else if (isSuccess) {
      toast.success("Login successful!");
      navigate("/"); //  Navigate to home after successful login
    }
  }, [isSuccess, isError, navigate]);

  return (
    <Container className="login-container">
      <Row className="login-wrapper">
        <Col md="6" className="left-section">
          <h2 className="text-login">
            Your health is our priority, offering specialized care within a
            supportive academic setting.
          </h2>
          <div className="img-container">
            <img src={login1} alt="stethoscope" className="stethoscope-img" />
          </div>
        </Col>

        <Col md="6" className="right-section">
          <div className="login-box">
            <img src={logo} alt="logo" className="logo-img" />
            <h1 className="text-center mb-4">
              {isForgotPassword ? "Reset Password" : "Login"}
            </h1>

            <Form
              onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}
            >
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="input-field"
                  onChange={(e) => setemail(e.target.value)}
                  value={email}
                  required
                />
              </FormGroup>
              {!isForgotPassword && (
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    className="input-field"
                    onChange={(e) => setpassword(e.target.value)}
                    value={password}
                    required
                  />
                </FormGroup>
              )}

              <Button color="primary" block type="submit" className="login-btn">
                {isForgotPassword ? "Send Reset Link" : "Login"}
              </Button>
            </Form>

            <p className="forgot-password mt-3">
              <a
                href="#"
                onClick={() => setIsForgotPassword(!isForgotPassword)}
              >
                {isForgotPassword ? "Back to Login" : "Forgot your password?"}
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
