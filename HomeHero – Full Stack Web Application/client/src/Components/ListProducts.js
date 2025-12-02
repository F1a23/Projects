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

const ListProducts = () => {
  const user = useSelector((state) => state.users.user);
  const products = useSelector((state) => state.products.allProducts);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <Container>
      <Row>
        <Col md={8}>
          <Table>
            <thead className="h3">
              <tr>
                <th>ID</th>
                <th>Service Code</th>
                <th>Service Type</th>
                <th>Description</th>
                <th>Gender</th>
                <th>Number of workers</th>
                <th>image</th>
                <th>Price</th>
                <th colSpan={2}>&nbsp;&nbsp;&nbsp;Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.scode}</td>

                  <td>{product.serviceType}</td>
                  <td>{product.description}</td>
                  <td>{product.gender}</td>
                  <td>{product.noWorks}</td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.serviceType}
                      className="styled-image1"
                    />
                  </td>
                  <td>{Math.round(product.price, 2)} OMR</td>
                  <td>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this product?"
                          )
                        ) {
                          handleDelete(product._id);
                        }
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdate(product._id)}
                      className="btn btn-primary"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ListProducts;
