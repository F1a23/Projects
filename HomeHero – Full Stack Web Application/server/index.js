import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/Posts.js";
import bcrypt from "bcrypt";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import * as ENV from "./config.js";
import ServiceModel from "./Models/ServiceModel.js";
import CartModel from "./Models/CartModel.js";

const app = express();
app.use(express.json());
app.use(cors());

//Database connection
const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=projectCluster`;
mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Serve static files from the 'uploads' directory

// Convert the URL of the current module to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the current file path
const __dirname = dirname(__filename);

// Set up middleware to serve static files from the 'uploads' directory
// Requests to '/uploads' will serve files from the local 'uploads' folder
app.use("/uploads", express.static(__dirname + "/uploads"));

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
// Create multer instance
const upload = multer({ storage: storage });

app.post("/registerUser", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name: name,
      email: email,
      password: hashedpassword,
    });

    await user.save();
    res.send({ user: user, msg: "Added." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//POST API-login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; //using destructuring
    //search the product
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(500).json({ error: "User not found." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    //if everything is ok, send the product and message
    res.status(200).json({ user, message: "Success." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST API-logout
app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

//POST API - savePost
app.post("/savePost", async (req, res) => {
  try {
    const postMsg = req.body.postMsg;
    const email = req.body.email;

    console.log(email);
    const post = new PostModel({
      postMsg: postMsg,
      email: email,
    });

    await post.save();
    res.send({ post: post, msg: "Added." }); //send to the client the JSON object
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET API - getPost
app.get("/getPosts", async (req, res) => {
  try {
    // Fetch all posts from the "PostModel" collection, sorted by createdAt in descending order
    const posts = await PostModel.find({}).sort({ createdAt: -1 });

    const countPost = await PostModel.countDocuments({});

    res.send({ posts: posts, count: countPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/likePost/:postId/", async (req, res) => {
  const postId = req.params.postId; //Extract the ID of the post from the URL
  const userId = req.body.userId;

  try {
    //search the postId if it exists
    const postToUpdate = await PostModel.findOne({ _id: postId });

    if (!postToUpdate) {
      return res.status(404).json({ msg: "Post not found." });
    }

    //Search the user Id from the array of users who liked the post.
    const userIndex = postToUpdate.likes.users.indexOf(userId);

    //indexOf method returns the index of the first occurrence of a specified value in an array.
    //If the value is not found, it returns -1.

    //This code will toogle from like to unlike
    if (userIndex !== -1) {
      // User has already liked the post, so unlike it
      const udpatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": -1 }, // Decrement the like count $inc and $pull are update operators
          $pull: { "likes.users": userId }, // Remove userId from the users array
        },
        { new: true } // Return the modified document
      );

      res.json({ post: udpatedPost, msg: "Post unliked." });
    } else {
      // User hasn't liked the post, so like it
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": 1 }, // Increment the like count
          $addToSet: { "likes.users": userId }, // Add userId to the users array if not already present
        },
        { new: true } // Return the modified document
      );

      res.json({ post: updatedPost, msg: "Post liked." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

//ADMIN SIDE

//GET API - getUsers

app.get("/getUsers", async (req, res) => {
  try {
    // Fetch all users from the "UserModel" collection, sorted by name in descending order

    const users = await UserModel.find({}).sort({ name: 1 });

    const usersCount = await UserModel.countDocuments({});

    res.send({ users: users, count: usersCount });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete("/deleteUser/:id/", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);

    res

      .status(500)

      .json({ error: "An error occurred while deleting the user" });
  }
});

//GET API - for retrieving a single user

app.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Find the user by _id

    const user = await UserModel.findById(id);

    res.send({ user: user });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "An error occurred" });
  }
});

app.put(
  "/updateUserProfile/:email/",

  upload.single("profilePic"), // Middleware to handle single file upload

  async (req, res) => {
    const email = req.params.email;

    const name = req.body.name;

    const password = req.body.password;

    const userType = req.body.userType;
    try {
      // Find the user by email in the database

      const userToUpdate = await UserModel.findOne({ email: email });
      // Update user's name

      userToUpdate.name = name;
      if (userType) userToUpdate.userType = userType;

      //if there is a value of userType in the request assign the new value
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: "An error occurred" });
    }
  }
);

app.put(
  "/updateUserProfile/:email/",
  upload.single("profilePic"), // Middleware to handle single file upload
  async (req, res) => {
    const email = req.params.email;
    const name = req.body.name;
    const password = req.body.password;

    try {
      // Find the user by email in the database
      const userToUpdate = await UserModel.findOne({ email: email });

      // If the user is not found, return a 404 error
      if (!userToUpdate) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if a file was uploaded and get the filename
      let profilePic = null;
      if (req.file) {
        profilePic = req.file.filename; // Filename of uploaded file
        // Update profile picture if a new one was uploaded but delete first the old image
        if (userToUpdate.profilePic) {
          const oldFilePath = path.join(
            __dirname,
            "uploads",
            userToUpdate.profilePic
          );
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("Old file deleted successfully");
            }
          });
          userToUpdate.profilePic = profilePic; // Set new profile picture path
        }
      } else {
        console.log("No file uploaded");
      }

      // Update user's name
      userToUpdate.name = name;

      // Hash the new password and update if it has changed
      if (password !== userToUpdate.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userToUpdate.password = hashedPassword;
      } else {
        userToUpdate.password = password; // Keep the same password if unchanged
      }

      // Save the updated user information to the database
      await userToUpdate.save();

      // Send the updated user data and a success message as a response
      res.send({ user: userToUpdate, msg: "Updated." });
    } catch (err) {
      // Handle any errors during the update process
      res.status(500).json({ error: err.message });
    }
  }
);

//Services

//POST API - add Product
app.post("/addProduct", async (req, res) => {
  try {
    const scode = req.body.scode;
    const serviceType = req.body.serviceType;
    const description = req.body.description;
    const gender = req.body.gender;
    const noWorks = req.body.noWorks;
    const image = req.body.image;
    const price = req.body.price;

    const product = new ServiceModel({
      scode: scode,
      serviceType: serviceType,
      description: description,
      gender: gender,
      noWorks: noWorks,
      image: image,
      price: price,
    });

    await product.save();
    res.send({ product: product, msg: "Added." }); //send to the client the JSON object
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET API - getProducts
app.get("/getProducts", async (req, res) => {
  try {
    const products = await ServiceModel.find({}).sort({ pcode: 1 });

    const countProducts = await ServiceModel.countDocuments({});

    res.send({ products: products, count: countProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.delete("/deleteProduct/:id/", async (req, res) => {
  const id = req.params.id;

  try {
    const product = await ServiceModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
});

//GET API - for retrieving a single product
app.get("/getProduct/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Find the product by _id
    const product = await ServiceModel.findById(id);
    res.send({ product: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//POST API - add Product
app.put("/updateProduct/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const scode = req.body.scode;
    const serviceType = req.body.serviceType;
    const description = req.body.description;
    const gender = req.body.gender;
    const noWorks = req.body.noWorks;
    const image = req.body.image;
    const price = req.body.price;

    // Find the product by email in the database
    const productToUpdate = await ServiceModel.findOne({ _id: id });

    // If the product is not found, return a 404 error
    if (!productToUpdate) {
      return res.status(404).json({ error: "Product not found" });
    }

    productToUpdate.scode = scode;
    productToUpdate.serviceType = serviceType;
    productToUpdate.description = description;
    productToUpdate.gender = gender;
    productToUpdate.noWorks = noWorks;
    productToUpdate.image = image;
    productToUpdate.price = price;

    await productToUpdate.save();
    res.send({ product: productToUpdate, msg: "Product Update." }); //send to the client the JSON object
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

/*CART APIS */

// Add item to cart
app.post("/addToCart", async (req, res) => {
  const { userId, productId, Date, Time } = req.body;
  try {
    // Fetch product details
    const product = await ServiceModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(product);

    // Find or create cart for the user
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find((item) =>
      item.productId.equals(productId)
    );
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Item already exists in the cart" });
    }
    // Add new item to the cart
    cart.items.push({
      productId: product._id,
      scode: product.scode,
      serviceType: product.serviceType,
      description: product.description,
      gender: product.gender,
      noWorks: product.noWorks,
      image: product.image,
      price: product.price,
      Date,
      Time,
      total: product.price,
    });

    // Save the updated cart
    await cart.save();
    res.status(200).json({ cart, message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//GET API - getCart
app.get("/getCart/:userId", async (req, res) => {
  const { userId } = req.params; // Get userId from route parameters

  try {
    const cart = await CartModel.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemCount = cart.items.reduce((total, item) => total + 1, 0);
    res.status(200).json({ cart, count: itemCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
//delete cart
app.delete("/deleteCartItem/:id", async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the cart that contains the item
    const cart = await CartModel.findOne({ "items._id": itemId });

    if (!cart) {
      return res.status(404).json({ error: "Cart Item not found" });
    }

    // Find the item to be removed
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Cart Item not found in the cart" });
    }

    // Update the total price
    const item = cart.items[itemIndex];
    cart.totalPrice -= item.total;

    // Remove the item from the items array
    cart.items.splice(itemIndex, 1);

    // Fetch product details
    const product = await ServiceModel.findById(item.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.save();

    // Save the updated cart
    await cart.save();

    res.status(200).json({ msg: "Cart item deleted successfully", cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the cart item" });
  }
});
const port = ENV.PORT || 3001;

app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
