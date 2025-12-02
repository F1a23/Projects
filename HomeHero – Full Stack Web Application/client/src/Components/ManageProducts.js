import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Container,
  Row,
  Col,
  Table,
} from "reactstrap";
import { useEffect, useState } from "react";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../Features/ProductSlice";
import { serviceSchemaValidation } from "../Validations/ServicesValidations";
import { Link, useParams, useNavigate } from "react-router-dom";

const ManageProducts = () => {
  const user = useSelector((state) => state.users.user);
  const products = useSelector((state) => state.products.allProducts);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(user);
  //Create the state variables
  const [scode, setscode] = useState("");
  const [serviceType, setserviceType] = useState("");
  const [description, setdescription] = useState("");
  const [gender, setgender] = useState("");
  const [noWorks, setnoWorks] = useState(0);
  const [image, setimage] = useState("");
  const [price, setprice] = useState(0);
  //For form validation using react-hook-form
  const {
    register,
    handleSubmit, // Submit the form when this is called
    formState: { errors, reset },
    setValue,
  } = useForm({
    resolver: yupResolver(serviceSchemaValidation), //Associate your Yup validation schema using the resolver
  });
  // console.log("Validation Errors", errors);

  // Handle form submission
  const onSubmit = (data) => {
    try {
      let tax = 0;

      // Calculate tax based on the number of works
      if (data.noWorks === 1) {
        tax = data.noWorks;
      } else if (data.noWorks >= 2 && data.noWorks <= 4) {
        tax = data.noWorks * 3;
      } else if (data.noWorks > 5) {
        tax = data.noWorks * 5;
      }

      const productData = {
        scode: data.scode,
        serviceType: data.serviceType,
        description: data.description,
        gender: data.gender,
        noWorks: data.noWorks,
        image: data.image,
        price: data.price + tax,
      };

      console.log("Form Data", data);
      dispatch(addProduct(productData));
      alert("Product Added.");
    } catch (error) {
      console.log("Error.");
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleUpdate = (id) => {
    navigate("/update/" + id);
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    } else {
      dispatch(getProducts()); // Dispatch getProducts action
    }
  }, [user, dispatch, navigate]);
  return (
    <div className="registration-container">
      <div className="form-wrapper">
        <h2 className="form-title">Add Services</h2>
        <Form onSubmit={handleSubmit(onSubmit)} className="form-box">
          <Row>
            <Col md={12}>
              {/* Service Code */}
              <FormGroup>
                <Label for="ServiceCode">Service Code</Label>
                <input
                  className="form-control"
                  placeholder="Enter Service Code"
                  {...register("scode", {
                    required: "Service Code is required",
                  })}
                />
                <p className="error-text">{errors.scode?.message}</p>
              </FormGroup>

              {/* Service Type */}
              <FormGroup>
                <Label for="serviceType">Service Type</Label>
                <select
                  className="form-control"
                  {...register("serviceType", {
                    required: "Service Type is required",
                  })}
                  value={serviceType}
                  onChange={(e) => {
                    setserviceType(e.target.value);
                    setValue("serviceType", e.target.value); // Update form value
                  }}
                >
                  <option value="">Select Service Type...</option>
                  <option value="Cleaning Service">Cleaning Service</option>
                  <option value="Electronics Service">
                    Electronics Service
                  </option>

                  <option value="Internet and Network Service">
                    Internet and Network Service
                  </option>
                  <option value="Gas Service">Gas Service</option>

                  <option value="Plumbing Service">Plumbing Service</option>
                  <option value="Furniture installation service">
                    Furniture installation service
                  </option>
                  <option value="Cooking service">Cooking service</option>
                </select>
                <p className="error-text">{errors.serviceType?.message}</p>
              </FormGroup>

              {/* Description */}
              <FormGroup>
                <Label for="Description">Description</Label>
                <textarea
                  className="form-control"
                  placeholder="Enter Description"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                <p className="error-text">{errors.description?.message}</p>
              </FormGroup>

              {/* Gender */}
              <FormGroup>
                <Label for="Gender">Gender</Label>
                <select
                  className="form-control"
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="">Select Gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <p className="error-text">{errors.gender?.message}</p>
              </FormGroup>

              {/* Number of Works */}
              <FormGroup>
                <Label for="noWorks">Number of Workers</Label>
                <input
                  className="form-control"
                  placeholder="Enter Number of Works"
                  type="number"
                  value={noWorks}
                  {...register("noWorks", {
                    required: "Number of Works is required",
                  })}
                  onChange={(e) => {
                    setnoWorks(e.target.value);
                    setValue("noWorks", e.target.value); // Update form value
                  }}
                />
                <p className="error-text">{errors.noWorks?.message}</p>
              </FormGroup>

              {/* Image */}
              <FormGroup>
                <Label for="image">Image URL</Label>
                <input
                  className="form-control"
                  placeholder="Enter Image URL"
                  type="url"
                  {...register("image", { required: "Image URL is required" })}
                />
                <p className="error-text">{errors.image?.message}</p>
              </FormGroup>

              {/* Price */}
              <FormGroup>
                <Label for="price">Price</Label>
                <input
                  className="form-control"
                  placeholder="Enter Price"
                  type="number"
                  step="0.01"
                  {...register("price", { required: "Price is required" })}
                />
                <p className="error-text">{errors.price?.message}</p>
              </FormGroup>

              {/* Buttons */}
              <div className="form-buttons">
                <Button color="primary" size="lg" type="submit">
                  Save Service
                </Button>
                <Button
                  color="secondary"
                  size="lg"
                  type="reset"
                  className="ml-3"
                >
                  Clear
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default ManageProducts;
