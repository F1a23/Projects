import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Card,
  Table,
  FormGroup,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "../Features/CartSlice";
import { getProducts } from "../Features/ProductSlice";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const products = useSelector((state) => state.products.allProducts);
  const user = useSelector((state) => state.users.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Create the state variables
  const [selectedDate, setSelectedDate] = useState();
  const [time, setTime] = useState();

  const isValidDate = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    return (
      selectedDate.setHours(0, 0, 0, 0) >= currentDate.setHours(0, 0, 0, 0)
    );
  };

  const isValidTime = (time) => {
    const selectedTime = parseInt(time.split(":")[0], 10);
    return selectedTime >= 8 && selectedTime <= 22;
  };

  const handleAddtoCart = (productId) => {
    if (!selectedDate || !time) {
      alert("Date and Time are required!");
      return;
    }

    if (!isValidDate(selectedDate)) {
      alert("Please select a valid date (today or later).");
      return;
    }

    if (!isValidTime(time)) {
      alert("Please select a valid time (8 AM to 10 PM).");
      return;
    }

    const cartData = {
      userId: user._id,
      productId: productId,
      Date: selectedDate,
      Time: time,
    };
    dispatch(addToCart(cartData));
    alert("Item added to cart.");
    navigate("/cart");
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    } else {
      dispatch(getProducts());
    }
  }, [user]);
  return (
    <Container>
      <br />
      <br />
      <p className="h1">Home Services:</p>
      <br />
      <br />
      <br />
      <br />
      <Row>
        {products.map((product) => (
          <Col md={6} key={product._id}>
            <div className="card">
              <img
                src={product.image}
                alt={product.serviceType}
                className="styled-image1" // Adjust size as needed
              />
              <div className="card-body">
                <p className="pz">{product.description}</p>
                <p className="pz" style={{ color: "red", fontWeight: "bold" }}>
                  Number of workers: {product.noWorks}
                </p>
                <p className="pz" style={{ color: "red", fontWeight: "bold" }}>
                  Price: {Math.round(product.price, 2)} OMR
                </p>

                <FormGroup className="form-groupsn">
                  <Input
                    type="date"
                    className="date-input"
                    required
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="form-groupsn">
                  <Input
                    type="time"
                    className="time-input"
                    required
                    onChange={(e) => setTime(e.target.value)}
                  />
                </FormGroup>
                <br />
                <Button
                  type="submit"
                  onClick={() => handleAddtoCart(product._id)}
                  outline
                  size="lg"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products;
