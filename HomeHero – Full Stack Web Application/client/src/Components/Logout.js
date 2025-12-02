import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Form, Button } from "reactstrap";
import { useState, useEffect } from "react";
import { logout } from "../Features/UserSlice";
import { IoLogOut } from "react-icons/io5";
const Logout = () => {
  const email = useSelector((state) => state.users.user?.email);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleLogout = async () => {
    dispatch(logout());

    navigate("/login");
  };

  return (
    <div className="img">
      <div className="boxrlogout">
        <Form>
          <br />
          <br />
          <br></br>
          <br></br> <IoLogOut style={{ fontSize: "100px" }} />
          <br></br>
          <h2 className="h1">Are you sure you want to log out?</h2>
          <br />
          <br />
          <Button onClick={handleLogout} outline size="lg">
            Logout
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Logout;
