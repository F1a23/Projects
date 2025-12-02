import { Button, Row, Col, Container } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "../Features/CartSlice";
import { getProducts } from "../Features/ProductSlice";
import { getPosts, likePost } from "../Features/PostSlice";
import { useNavigate } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import moment from "moment";
import c from "../images/feamlecleaning.webp";
import b from "../images/feCooking.jpg";
import R from "../images/R.jpeg";
import d from "../images/electronicsr.png";
import e from "../images/Furnitureinstallationr.jpg";
import f from "../images/PlumbingService.jpeg";
import g from "../images/Gas.jpg";

import logo from "../images/logo.png";
const Home = () => {
  const user = useSelector((state) => state.users.user);
  const posts = useSelector((state) => state.posts.posts);
  const email = useSelector((state) => state.users.user.email);
  const userId = useSelector((state) => state.users.user._id);

  const [selectedDate, setSelectedDate] = useState();
  const [time, setTime] = useState();
  // console.log(cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* Like users posts*/
  const handleLikePost = (postId) => {
    const postData = {
      postId: postId,
      userId: userId,
    };
    dispatch(likePost(postData));
    navigate("/");
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    } else {
      dispatch(getProducts());
    }
  }, [user, dispatch, navigate]);

  /*number of pages*/
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  return (
    <div>
      <Row md={12}>
        <img src={R} className="img3"></img>
      </Row>

      <p className="h1">
        <br></br>
        <br></br>Our Services
      </p>
      <div className="boxhome">
        <Row>
          <Col md={4}>
            <br></br>
            <br></br>
            <img src={logo} alt="Homehero Logo" />
          </Col>

          <Col md={8}>
            <p className="h2">
              On the HOMEHERO website, we provide different home services that
              all people need and these services are : <br></br>
              <br></br>1. Cleaning Service
              <br></br>2. Electronics Service <br></br>3. Internet and Network
              Service
              <br></br>
              4. Gas Service <br></br>5. Plumbing Service<br></br> 6. Furniture
              installation service<br></br> 7.Cooking service
            </p>
          </Col>
        </Row>
      </div>

      <p className="h1">Our Services Information</p>
      <br></br>
      <br></br>
      <Row>
        <Col md={4} className="service-card">
          <img src={c} className="img" alt="Cleaning Service" />
          <p className="text">
            Reliable cleaning services for a spotless and hygienic home or
            office, ensuring every space feels fresh.
          </p>
        </Col>

        <Col md={4} className="service-card">
          <img src={b} className="img" alt="Cooking Service" />
          <p className="text">
            Reliable cooking services deliver delicious, home-style meals
            tailored to your taste, bringing comfort and flavor to every table.
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="service-card">
          <img src={d} className="img" alt="Electronic Service" />
          <p className="text">
            Reliable electronic services for repair, maintenance, and setup,
            ensuring your devices run smoothly and efficiently.
          </p>
        </Col>

        <Col md={4} className="service-card">
          <img src={f} className="img" alt="Furniture Moving Service" />
          <p className="text">
            Provide reliable and secure furniture moving services, with a
            professional team ensuring your furniture is transported safely and
            efficiently to your new destination.
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="service-card">
          <img className="img" src={g} alt="Gas Service" />
          <p className="text">
            Home gas service provides safe and fast delivery and installation of
            gas cylinders, meeting your household needs easily and conveniently.
          </p>
        </Col>
      </Row>
      <br></br>
      <br></br>
      <br></br>
      <p className="h1">Users Feedback</p>

      <br></br>
      <br></br>
      <br></br>
      <div className="row">
        {currentPosts.map((post) => (
          <div className="col-md-4 mb-4" key={post._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{post.email}</h5>
                <p className="card-text">
                  {post.postMsg} <br />
                  <small className="text-muted">
                    {moment(post.createdAt).fromNow()}
                  </small>
                </p>
                <a
                  href="#"
                  className="buttona"
                  onClick={() => handleLikePost(post._id)}
                >
                  Like <FaThumbsUp /> ({post.likes.count})
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h1">
        <button
          className="h1"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        ></button>

        <div className="page-numbers">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`page-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          className="page-btn"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        ></button>
      </div>
    </div>
  );
};

export default Home;
