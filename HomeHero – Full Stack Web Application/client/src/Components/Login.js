import {
  Form,
  Input,
  FormGroup,
  Label,
  Container,
  Button,
  Col,
  Row,
} from "reactstrap";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Login = () => {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.users.user);
  const isSuccess = useSelector((state) => state.users.isSuccess);
  const isError = useSelector((state) => state.users.isError);

  const handleLogin = () => {
    const userData = { email, password };
    dispatch(login(userData));
  };

  useEffect(() => {
    if (isError) {
      navigate("/login");
    } else if (isSuccess) {
      navigate("/");
    }
  }, [user, isError, isSuccess, navigate]);

  return (
    <div className="img">
      <div className="loginnn-container">
        <Container>
          <Form className="box">
            <Row>
              <Col md={5}>
                <img src={logo} className="styledd-image" alt="Logo" />
              </Col>
              <Col md={7}>
                <h1 className="h1">Login</h1>
                <FormGroup className="form-groupsn">
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter email..."
                    type="email"
                    onChange={(e) => setemail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="form-groupsn">
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter password..."
                    type="password"
                    onChange={(e) => setpassword(e.target.value)}
                  />
                </FormGroup>
                <Button onClick={handleLogin} outline size="lg">
                  Login
                </Button>
                <p className="ph">
                  You don't have an account?{" "}
                  <Link to="/register">Sign Up now</Link>
                </p>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default Login;
