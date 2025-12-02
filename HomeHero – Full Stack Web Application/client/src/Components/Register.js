import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useState } from "react";

import { userSchemaValidation } from "../Validations/UserValidations";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { addUser, deleteUser, updateUser } from "../Features/UserSlice";
import { registerUser } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import logo from "../images/logo.png";
const Register = () => {
  //Retrieve the current value of the state and assign it to a variable.
  const userList = useSelector((state) => state.users.value);
  //Create the state variables
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  //For form validation using react-hook-form
  const {
    register,
    handleSubmit, // Submit the form when this is called
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation), //Associate your Yup validation schema using the resolver
  });

  const dispatch = useDispatch(); //every time we want to call an action, make an action happen
  const navigate = useNavigate(); //declares a constant variable named navigate and assigns it the value returned by the useNavigate() hook

  // Handle form submission
  const onSubmit = (data) => {
    try {
      // You can handle the form submission here
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      console.log("Form Data", data);
      alert("Validation all good.");
      dispatch(registerUser(userData)); // Dispatch an action to add a new user by passing the user data to the Redux store
      navigate("/login"); //redirect to login component
    } catch (error) {
      console.log("Error.");
    }
  };

  const handleDelete = (email) => {
    dispatch(deleteUser(email));
  };

  const handleUpdate = (email) => {
    const userData = {
      name: name, //create an object with the values from the state variables
      email: email,
      password: password,
    };
    dispatch(updateUser(userData)); //use the useDispatch hook to dispatch an action, passing as parameter the userData
  };

  return (
    <div className="img">
      <br></br>
      <div className="loginnn-container">
        <Form onSubmit={handleSubmit(onSubmit)} className="boxregister">
          <Row>
            <Col md={5}>
              <br></br>
              <br></br>
              <br></br>
              <img src={logo} className="styledd-image"></img>
              <p className="h1">"Home services Web app"</p>
            </Col>
            <Col md={7}>
              <h1 className="h1">Register</h1>
              <FormGroup className="form-groupsn">
                <Label>Name</Label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  {...register("name", {
                    onChange: (e) => setname(e.target.value),
                  })}
                ></input>
                <p className="error">{errors.name?.message}</p>
              </FormGroup>

              <FormGroup className="form-groupsn">
                <Label>Email</Label>
                <input
                  id="exampleEmail"
                  name="email"
                  type="email"
                  {...register("email", {
                    onChange: (e) => setemail(e.target.value),
                  })}
                ></input>
                <p className="error">{errors.email?.message}</p>
              </FormGroup>
              <FormGroup className="form-groupsn">
                <Label>Password</Label>
                <input
                  id="examplePassword"
                  name="Password"
                  type="password"
                  {...register("password", {
                    onChange: (e) => setpassword(e.target.value),
                  })}
                ></input>
                <p className="error">{errors.password?.message}</p>
              </FormGroup>
              <FormGroup className="form-groupsn">
                <Label>confirm Password</Label>
                <input
                  id="examplePassword"
                  name="ConforimPassword"
                  type="password"
                  {...register("confirmPassword", {
                    onChange: (e) => setconfirmPassword(e.target.value),
                  })}
                ></input>
                <p className="error">{errors.confirmPassword?.message}</p>
              </FormGroup>
              <Button outline size="lg">
                Register
              </Button>
              <p className="ph">
                <br></br>
                Do you already have an Account?&nbsp;&nbsp;
                <Link to="/Login">Login now</Link>
              </p>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default Register;
