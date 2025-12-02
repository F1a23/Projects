import {
  Button,
  Col,
  Label,
  Container,
  Row,
  FormGroup,
  Input,
  Form,
  Table,
} from "reactstrap";
import contactus from "../images/contactus.png";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { savePost, getPosts } from "../Features/PostSlice";
import { FaUser } from "react-icons/fa";
const Contactus = () => {
  const posts = useSelector((state) => state.posts.posts);
  const user = useSelector((state) => state.users.user);
  const [postMsg, setpostMsg] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const email = useSelector((state) => state.users.user.email);

  const handlePost = async () => {
    // Validate that postMsg is not empty

    if (!postMsg.trim()) {
      alert("Post message is required."); // Display an alert or set an error state

      return; // Exit the function early if validation fails
    }

    const postData = {
      postMsg: postMsg,
      email: email,
    };

    dispatch(savePost(postData)); // Dispatch the savePost thunk from the Posts Slice.
    setpostMsg("");
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user]);
  return (
    <div className="img">
      <Container>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="loginnn-container">
          <Form className="boxcontact">
            <Row>
              <h2 className="h1">Contact Us</h2>
            </Row>
            <br></br>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <img src={contactus} className="contactusimg"></img>
                </FormGroup>
              </Col>
              <Col md={8}>
                <br></br>
                <p className="ph">Let us know your feedback</p>
                <FormGroup className="textareainput">
                  <Input
                    id="share"
                    name="share"
                    placeholder="Share your thoughts..."
                    type="textarea"
                    value={postMsg}
                    onChange={(e) => setpostMsg(e.target.value)}
                  />
                </FormGroup>
                <Button outline size="lg" onClick={() => handlePost()}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Contactus;
