import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { persistore } from "../Store/store";
import { resetStore } from "../Store/store";
import { logout } from "../Features/UserSlice";
import { getCart } from "../Features/CartSlice";
import { useEffect } from "react";
import React, { useState } from "react";
import { MdMessage } from "react-icons/md";
import { IoMdLogOut, IoMdAddCircle } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";
import {
  FaHome,
  FaUser,
  FaServicestack,
  FaPhone,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FiSun,
  FiMoon,
  FaUsersCog,
} from "react-icons/fa";

import { RiTeamFill, RiUserCommunityFill } from "react-icons/ri";
const Header = () => {
  const user = useSelector((state) => state.users.user);
  const cart = useSelector((state) => state.cart);

  // console.log(cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlelogout = async () => {
    resetStore(); // Reset the store when logging out
    persistore.purge();
    dispatch(logout());
    //ensure that the state update from the logout action has been processed before proceeding to the next step.
    await new Promise((resolve) => setTimeout(resolve, 100));

    navigate("/login"); //redirect to login page route.
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    } else {
      dispatch(getCart(user._id));
    }
  }, [user]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <ul>
        <li
          className="nav-link"
          onClick={toggleSidebar}
          style={{
            left: isOpen || !isOpen ? "190px" : "0px",
          }}
        >
          <FaBars />
        </li>
        <br></br>
        <li>
          <Link to="/" className="nav-link">
            <FaHome className="icon" />
            {isOpen && <span>Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/products" className="nav-link">
            <AiFillProduct className="icon" />
            {isOpen && <span>Services Page</span>}
          </Link>
        </li>
        <li>
          <Link to="/cart" className="nav-link">
            <FaShoppingCart className="icon" />
            {isOpen && <span> Cart</span>}
          </Link>
        </li>
        <li>
          <Link to="/profile" className="nav-link">
            <FaUser className="icon" />
            {isOpen && <span> Profile</span>}
          </Link>
        </li>
        <li>
          <Link to="/Contactus" className="nav-link">
            <RiUserCommunityFill className="icon" />
            {isOpen && <span>Contactus</span>}
          </Link>
        </li>
        <li>
          <Link to="/About" className="nav-link">
            <RiTeamFill className="icon" />
            {isOpen && <span>About</span>}
          </Link>
        </li>
        <li>
          {user.userType == "admin" && (
            <Link to="/post" className="nav-link">
              <MdMessage className="icon" />
              {isOpen && <span> User Feedback</span>}
            </Link>
          )}
        </li>
        <li>
          {user.userType == "admin" && (
            <Link to="/ManageUsers" className="nav-link">
              <FaUsersCog className="icon" />
              {isOpen && <span> ManageUsers</span>}
            </Link>
          )}
        </li>
        <li>
          {user.userType == "admin" && (
            <Link to="/manage" className="nav-link">
              <IoMdAddCircle className="icon" />
              {isOpen && <span> Manage Products</span>}
            </Link>
          )}
        </li>
        <li>
          {user.userType == "admin" && (
            <Link to="/ListProducts" className="nav-link">
              <IoMdAddCircle className="icon" />
              {isOpen && <span> List Products</span>}
            </Link>
          )}
        </li>
        <li>
          <Link to="/logout" className="nav-link">
            <IoMdLogOut className="icon" />
            {isOpen && <span>Logout</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
