import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  allProducts: [],
  status: "",
};

export const addProduct = createAsyncThunk(
  "manageProduct/addProduct",
  async (productData) => {
    try {
      //sends a POST request to the server along the request body object
      const response = await axios.post(`${ENV.SERVER_URL}/addProduct`, {
        scode: productData.scode,
        serviceType: productData.serviceType,
        description: productData.description,
        gender: productData.gender,
        noWorks: productData.noWorks,
        image: productData.image,
        price: productData.price,
      });
      console.log(response);
      const product = response.data.product; //retrieve the response from the server
      return product; //return the response from the server as payload to the thunk
    } catch (error) {
      console.log(error);
    }
  }
);

export const getProducts = createAsyncThunk(
  "manageProduct/getProducts",
  async () => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/getProducts`);
      return response.data.products;
      //console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "manageProduct/deleteProduct",
  async (id) => {
    try {
      const response = await axios.delete(
        `${ENV.SERVER_URL}/deleteProduct/${id}`
      );
      return id;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "manageProduct/updateProduct",
  async ({ productData, prod_id }) => {
    try {
      //sends a POST request to the server along the request body object
      const response = await axios.put(
        `${ENV.SERVER_URL}/updateProduct/${prod_id}`, // Ensure SERVER_URL is correct
        {
          scode: productData.scode,
          serviceType: productData.serviceType,
          description: productData.description,
          gender: productData.gender,
          noWorks: productData.noWorks,
          image: productData.image,
          price: productData.price,
        }
      );

      console.log(response);
      const product = response.data.product; //retrieve the response from the server
      return product; //return the response from the server as payload to the thunk
    } catch (error) {
      console.log(error);
    }
  }
);

export const ProductSlice = createSlice({
  name: "allProducts", //name of the state
  initialState, // initial value of the state
  reducers: { reset: () => initialState },
  extraReducers: (builder) => {
    //Asynchronous actions that update the state directly,
    builder
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the state with new product
        state.allProducts.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the state with fetched posts
        //console.log(action.payload);
        state.allProducts = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = "failed";
        state.iserror = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.allProducts = state.allProducts.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateProduct.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export const { reset } = ProductSlice.actions;
export default ProductSlice.reducer;
