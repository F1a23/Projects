import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  cart: {
    items: [], // Initialize as an empty array
    totalPrice: 0,
    count: 0,
    _id: null,
    userId: null,
    createdAt: null,
    updatedAt: null,
  },
  status: "idle",
  iserror: null,
};
export const addToCart = createAsyncThunk(
  "manageCart/addToCart",
  async (cartData) => {
    try {
      console.log(cartData);
      //sends a POST request to the server along the request body object
      const response = await axios.post(`${ENV.SERVER_URL}/addToCart`, {
        userId: cartData.userId,
        productId: cartData.productId,
        Date: cartData.Date,
        Time: cartData.Time,
      });
      console.log(response);
      const cart = response.data.cart; //retrieve the response from the server
      return cart; //return the response from the server as payload to the thunk
    } catch (error) {
      console.log(error);
    }
  }
);

export const getCart = createAsyncThunk(
  "manageCart/getCart",
  async (userId) => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/getCart/${userId}`);
      console.log(response.data);

      return response.data.cart;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "manageCart/deleteCartItem",
  async (id) => {
    try {
      const response = await axios.delete(
        `${ENV.SERVER_URL}/deleteCartItem/${id}`
      );
      return id;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "manageCart/updateProduct",
  async (cartData) => {
    try {
      //sends a POST request to the server along the request body object
      const response = await axios.put(
        `${ENV.SERVER_URL}/updateProduct/`, // Ensure SERVER_URL is correct
        {
          productId: cartData._id,
          scode: cartData.scode,
          serviceType: cartData.serviceType,
          description: cartData.description,
          gender: cartData.gender,
          noWorks: cartData.noWorks,
          image: cartData.image,
          price: cartData.price,
          Date: cartData.Date,
          Time: cartData.Time,
          total: cartData.price,
        }
      );

      console.log(response);
      const cart = response.data.cart; //retrieve the response from the server
      return cart; //return the response from the server as payload to the thunk
    } catch (error) {
      console.log(error);
    }
  }
);

export const CartSlice = createSlice({
  name: "cart", //name of the state
  initialState, // initial value of the state
  reducers: { reset: () => initialState },
  extraReducers: (builder) => {
    //Asynchronous actions that update the state directly,
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the state with new cart
        console.log(action.payload);
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.iserror = action.error.message;
      })
      .addCase(getCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the state with fetched posts
        //console.log(action.payload);
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = "failed";
        state.iserror = action.error.message;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        console.log(action.payload);
        state.cart.items = state.cart.items.filter(
          (cartItem) => cartItem._id !== action.payload
        );

        // Recalculate the total price
        state.cart.totalPrice = state.cart.items.reduce(
          (sum, item) => sum + item.total,
          0
        );
      })
      .addCase(deleteCartItem.rejected, (state) => {
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
export const { reset } = CartSlice.actions;
export default CartSlice.reducer;
