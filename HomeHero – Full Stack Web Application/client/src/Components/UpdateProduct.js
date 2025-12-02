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
import { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { updateProduct } from "../Features/ProductSlice";
import { serviceSchemaValidation } from "../Validations/ServicesValidations";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const user = useSelector((state) => state.users.user);
  const products = useSelector((state) => state.products.allProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { prod_id } = useParams();
  console.log(prod_id);

  // Function to search for a product by ID
  const findProductById = (prod_id) => {
    return products.find((product) => product._id === prod_id);
  };

  //This is the product object that is to be updated as returned by the find function
  const productToUpdate = findProductById(prod_id);

  console.log(productToUpdate);

  // Set the value from the productToUpdate object as initial value for the state
  const [scode, setScode] = useState(productToUpdate?.scode || "");
  const [serviceType, setServiceType] = useState(
    productToUpdate?.serviceType || ""
  );
  const [description, setDescription] = useState(
    productToUpdate?.description || ""
  );
  const [gender, setGender] = useState(productToUpdate?.gender || "");
  const [noWorks, setNoWorks] = useState(productToUpdate?.noWorks || 0);
  const [image, setImage] = useState(productToUpdate?.image || "");
  const [price, setPrice] = useState(productToUpdate?.price || 0);

  // For form validation using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(serviceSchemaValidation), // Associate your Yup validation schema using the resolver
  });

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
      dispatch(updateProduct({ productData, prod_id }));
      alert("Product Updated.");
      navigate("/ListProducts");
    } catch (error) {
      console.log("Error updating product:", error);
    }
  };

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user]);
  return (
    <div className="registration-container">
      <div className="form-wrapper">
        <h1 className="h1">Update Service</h1>
        <Form onSubmit={handleSubmit(onSubmit)} className="form-box">
          <Row>
            <Col md={12}>
              <FormGroup className="form-groupsn">
                <Label for="ServiceCode">Service Code</Label>
                <input
                  className="form-control"
                  placeholder="Product Code..."
                  {...register("scode", {
                    onChange: (e) => setScode(e.target.value),
                  })}
                  value={scode}
                />
                <p className="error">{errors.scode?.message}</p>
              </FormGroup>
              <FormGroup className="form-groupsn">
                <Label for="serviceType">Service Type</Label>
                <input
                  type="text"
                  className="form-control"
                  id="serviceType"
                  placeholder="serviceType..."
                  {...register("serviceType", {
                    onChange: (e) => setServiceType(e.target.value),
                  })}
                  value={serviceType}
                />
                <p className="error">{errors.serviceType?.message}</p>
              </FormGroup>
              <FormGroup className="form-groupsn">
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  placeholder="description..."
                  {...register("description", {
                    onChange: (e) => setDescription(e.target.value),
                  })}
                  value={description}
                />
                <p className="error">{errors.description?.message}</p>
              </FormGroup>
              <FormGroup>
                <Label for="Gender">Gender</Label>
                <input
                  type="text"
                  className="form-control"
                  id="gender"
                  placeholder="gender..."
                  {...register("gender", {
                    onChange: (e) => setGender(e.target.value),
                  })}
                  value={gender}
                />
                <p className="error">{errors.gender?.message}</p>
              </FormGroup>
              <FormGroup>
                <Label for="noWorks">Number of Works</Label>
                <input
                  type="number"
                  className="form-control"
                  id="noWorks"
                  placeholder="noWorks..."
                  {...register("noWorks", {
                    onChange: (e) => setNoWorks(e.target.value),
                  })}
                  value={noWorks}
                />
                <p className="error">{errors.noWorks?.message}</p>
              </FormGroup>
              <FormGroup>
                <Label for="image">Image URL</Label>
                <input
                  type="text"
                  className="form-control"
                  id="image"
                  placeholder="Image URL..."
                  {...register("image", {
                    onChange: (e) => setImage(e.target.value),
                  })}
                  value={image}
                />
                <p className="error">{errors.image?.message}</p>
              </FormGroup>
              <FormGroup>
                <Label>Price</Label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  placeholder="price..."
                  {...register("price", {
                    onChange: (e) => setPrice(e.target.value),
                  })}
                  value={price}
                />
                <p className="error">{errors.price?.message}</p>
              </FormGroup>
              <Button color="primary" size="lg" type="submit">
                Save Service
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProduct;
