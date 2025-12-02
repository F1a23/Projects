import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // استبدال useHistory بـ useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "./Logout.css";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Features/UserSlice";
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
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="logout-container text-center">
      <h2>You Have Successfully Logged Out.</h2>
      <p>We Hope To See You Again Soon!</p>

      {/* النص الخاص بالعيادة */}
      <div className="clinic-info">
        <h3>The Salalah Branch Clinic Is Pleased To Welcome You</h3>
        <p>
          Where We Prioritize The Health And Well-Being Of Our Students,
          Faculty, And Staff. We Are Here To Provide Comprehensive Medical
          Services Aimed At Enhancing The Well-Being Of Everyone And Creating A
          Healthy Environment That Supports Academic And Creative Success.
        </p>
        <p>
          At Our Clinic, We Strive To Offer Outstanding Care That Includes
          Prevention, Treatment, Health Awareness Programs, And Psychological
          Support. We Are Committed To Providing The Best Medical Experience To
          Meet Your Health Needs At All Times, Wishing You Continued Health And
          Wellness.
        </p>
      </div>

      <div className="logout-buttons">
        <button className="btn btn-danger" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Logout;
