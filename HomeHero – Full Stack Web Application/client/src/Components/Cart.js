import { Container, Row, Col, Button, Table, Input } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { deleteCartItem, getCart } from "../Features/CartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart || { items: [] });
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to track saved and selected items
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem("savedCartItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getCart(user._id));
    }
  }, [user, dispatch, navigate]);

  const handleDelete = (id) => {
    if (!savedItems.includes(id)) {
      dispatch(deleteCartItem(id));
    }
  };

  const handleUpdate = (id) => {
    if (!savedItems.includes(id)) {
      navigate("/update/" + id);
    }
  };

  const handleSelect = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSave = () => {
    const newSavedItems = [...savedItems, ...selectedItems];
    setSavedItems(newSavedItems);
    setSelectedItems([]);
    localStorage.setItem("savedCartItems", JSON.stringify(newSavedItems));
    alert("Selected items have been saved. No further changes are allowed.");
  };

  const roundToTwo = (num) => Math.round(num * 100) / 100;

  const selectedTotalPrice = cart.items
    .filter((item) => selectedItems.includes(item._id))
    .reduce((total, item) => total + item.price, 0);

  if (!cart || cart.items.length === 0) {
    return (
      <Container>
        <br></br>
        <br></br>
        <p className="h1">Cart</p>
        <br></br>
        <br></br>
        <p className="h1">Your cart is empty. Please add items to the cart.</p>
      </Container>
    );
  }

  return (
    <Container>
      <br />
      <br />
      <p className="h1">My Orders</p>
      <Row>
        <Col md={12}>
          <Table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Service ID</th>
                <th>Service Type</th>
                <th>Gender</th>
                <th>Number of Works</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <Input
                      type="checkbox"
                      disabled={savedItems.includes(item._id)}
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelect(item._id)}
                    />
                  </td>
                  <td>{item.scode}</td>
                  <td>{item.serviceType}</td>
                  <td>{item.gender}</td>
                  <td>{item.noWorks}</td>
                  <td>{item.Date}</td>
                  <td>{item.Time}</td>
                  <td>{roundToTwo(item.price)} OMR</td>
                  <td>
                    <Button
                      color="danger"
                      onClick={() => {
                        if (
                          !savedItems.includes(item._id) &&
                          window.confirm(
                            "Are you sure you want to delete this product?"
                          )
                        ) {
                          handleDelete(item._id);
                        }
                      }}
                      disabled={savedItems.includes(item._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="8" className="h1">
                  <strong>Total Price for Selected Items:</strong>
                </td>
                <td colSpan="2">
                  <strong>{roundToTwo(selectedTotalPrice)} OMR</strong>
                </td>
              </tr>
            </tbody>
          </Table>
          <br></br>
          <br></br>
          <Button
            outline
            size="lg"
            className="h1a"
            color="success"
            onClick={handleSave}
            disabled={selectedItems.length === 0}
          >
            Save Items
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
