import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import UserModel from "./Models/UserModel.js";
import UserFeedbackModel from "./Models/UserFeedback.js";
import * as ENV from "./config.js";
import validator from "validator"; //تُستخدم للتحقق من صحة البيانات المدخلة
import ContactMode from "./Models/ContactMode.js";
import AppointmentModel from "./Models/AppointmentModel.js";
import MedicationModel from "./Models/MedicationModel.js";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });

// POST API - Register User
app.post("/registerUser", async (req, res) => {
  try {
    console.log(" Received Request Body:", req.body);

    const { email } = req.body;

    // تحقق مبدئي من وجود الإيميل
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log(" Email already exists in DB");
      return res.status(400).json({ error: "Email already exists" });
    }

    const {
      id,
      name,
      gender,
      civilNumber,
      birthDate,
      contactNo,
      department,
      specialization,
      userType,
      password,
    } = req.body;

    // طباعة القيم كل واحدة لوحدها للمساعدة على التتبع
    console.log(" Extracted Fields:");
    console.log("id:", id);
    console.log("name:", name);
    console.log("gender:", gender);
    console.log("civilNumber:", civilNumber);
    console.log("birthDate:", birthDate);
    console.log("contactNo:", contactNo);
    console.log("email:", email);
    console.log("department:", department);
    console.log("specialization:", specialization);
    console.log("userType:", userType);
    console.log("password:", password);

    // تحقق سريع من الحقول الفارغة
    const requiredFields = {
      id,
      name,
      gender,
      civilNumber,
      birthDate,
      contactNo,
      email,
      department,
      specialization,
      userType,
      password,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || value === "") {
        console.log(` Missing or empty field: ${key}`);
        return res.status(400).json({ error: `Missing field: ${key}` });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      id,
      name,
      gender,
      civilNumber,
      birthDate: new Date(birthDate), // تأكد أنه تاريخ
      contactNo,
      email,
      department,
      specialization,
      userType,
      password: hashedPassword,
    });

    // محاولة الحفظ
    await user.save();
    console.log(" User saved successfully.");
    res.status(200).json({ user, msg: "User added successfully." });
  } catch (error) {
    console.error(" Error occurred during registration:");
    console.error(error);

    if (error.name === "ValidationError") {
      console.log(" Validation error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res
      .status(500)
      .json({ error: "An unexpected error occurred", details: error.message });
  }
});

// POST API - Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(500).json({ error: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    res.status(200).json({ user, message: "Success." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST API - Logout
app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Save Feedback API

app.post("/saveFeedback", async (req, res) => {
  try {
    const { name, email, rating, feedbackMsg } = req.body;

    const feedback = new UserFeedbackModel({
      name,
      email,
      rating,
      feedbackMsg,
    });

    await feedback.save(); // حفظ الملاحظات في قاعدة البيانات

    res.send({ feedback, msg: "Added successfully!" });
  } catch (error) {
    console.error("Error in /saveFeedback:", error);
    res.status(500).json({ error: "An error occurred while saving feedback." });
  }
});

//get all feedbacks
app.get("/getFeedbacks", async (req, res) => {
  try {
    const feedbacks = await UserFeedbackModel.find();
    res.send({ feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching feedbacks." });
  }
});

//user contact
app.post("/saveUserMsg", async (req, res) => {
  try {
    const { name, email, userMsg } = req.body;

    const usermessage = new ContactMode({
      name,
      email,
      userMsg,
    });

    await usermessage.save(); // حفظ الملاحظات في قاعدة البيانات

    res.send({ usermessage, msg: "Added successfully!" });
  } catch (error) {
    console.error("Error in / save usermessage:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving user message." });
  }
});

// get all usermessages
app.get("/getUserMsg", async (req, res) => {
  try {
    const usermessages = await ContactMode.find();
    res.send({ usermessages });
  } catch (error) {
    console.error("Error fetching usermessages:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching usermessages." });
  }
});

app.get("/checkAppointment", async (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) {
    return res.status(400).send({ error: "Date and time are required" });
  }

  // تحقق من اليوم (إذا كان الجمعة أو السبت)
  const appointmentDate = new Date(date);
  const dayOfWeek = appointmentDate.getDay(); // 0=الأحد, 1=الإثنين, 5=الجمعة, 6=السبت
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return res.status(400).send({
      error: "Appointments cannot be scheduled on Friday or Saturday.",
    });
  }

  // Validate appointmentTime format
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
  if (!timeRegex.test(time)) {
    return res
      .status(400)
      .send({ error: "Invalid time format. Use HH:mm (24-hour)." });
  }

  const appointmentHour = new Date(`1970-01-01T${time}:00`).getHours();

  // Check if the time is within 8 AM to 2 PM (8:00 to 14:00)
  if (appointmentHour < 8 || appointmentHour > 14) {
    return res
      .status(400)
      .send({ error: "Appointment time must be between 8 AM and 2 PM." });
  }

  try {
    // تحقق من وجود حجز في نفس التاريخ والوقت
    const appointment = await AppointmentModel.findOne({
      appointmentDate: date,
      appointmentTime: time,
    });

    if (appointment) {
      return res.json({
        isTimeTaken: true,
        error:
          "The selected time is already taken. Please choose a different time.",
      });
    }

    return res.json({ isTimeTaken: false });
  } catch (error) {
    console.error("Error checking appointment:", error);
    return res.status(500).send({ error: "Error checking appointment." });
  }
});

// Save Appointment API
app.post("/saveAppointment", async (req, res) => {
  const {
    name,
    email,
    contactNo,
    appointmentDate,
    appointmentTime,
    serviceType,
  } = req.body;

  if (
    !name ||
    !email ||
    !contactNo ||
    !appointmentDate ||
    !appointmentTime ||
    !serviceType
  ) {
    return res.status(400).send({ error: "All fields are required" });
  }

  // تحقق من اليوم (إذا كان الجمعة أو السبت)
  const appointmentDateObj = new Date(appointmentDate);
  const dayOfWeek = appointmentDateObj.getDay(); // 0=الأحد, 1=الإثنين, 5=الجمعة, 6=السبت
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return res.status(400).send({
      error: "Appointments cannot be scheduled on Friday or Saturday.",
    });
  }

  // Validate appointmentTime format
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
  if (!timeRegex.test(appointmentTime)) {
    return res
      .status(400)
      .send({ error: "Invalid time format. Use HH:mm (24-hour)." });
  }

  const appointmentHour = new Date(
    `1970-01-01T${appointmentTime}:00`
  ).getHours();

  // Check if the time is within 8 AM to 2 PM (8:00 to 14:00)
  if (appointmentHour < 8 || appointmentHour > 14) {
    return res
      .status(400)
      .send({ error: "Appointment time must be between 8 AM and 2 PM." });
  }

  try {
    // تحقق من وجود حجز في نفس الوقت
    const existingAppointment = await AppointmentModel.findOne({
      appointmentDate,
      appointmentTime,
    });

    if (existingAppointment) {
      return res.status(400).send({
        error:
          "The selected time slot is already taken. Please choose a different time.",
      });
    }

    const newAppointment = new AppointmentModel({
      name,
      email,
      contactNo,
      appointmentDate,
      appointmentTime,
      serviceType,
    });

    await newAppointment.save();
    res.status(200).send({ msg: "Appointment successfully scheduled" });
  } catch (error) {
    console.error("Error saving appointment:", error);
    res.status(500).send({ error: "Failed to schedule appointment" });
  }
});

//get all Appointments
app.get("/getAppointment", async (req, res) => {
  const { email } = req.query;

  try {
    const appointment = await AppointmentModel.findOne({ email }).select(
      "appointmentDate appointmentTime serviceType"
    );
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ message: "No appointment found for this user." });
    }
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Error fetching appointment." });
  }
});

// User Profile
app.get("/getUserProfile", async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from authentication middleware
    console.log(`Fetching profile for user ID: ${userId}`);

    const user = await UserModel.findOne({ id: userId });
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const userData = {
      name: user.name,
      email: user.email,
      contactNo: user.contactNo,
      birthDate: user.birthDate,
      civilNumber: user.civilNumber,
      department: user.department,
      specialization: user.specialization,
      userType: user.userType,
      clinicBooking: user.clinicBooking,
      medicineBooking: user.medicineBooking,
    };

    return res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Failed to retrieve user profile" });
  }
});

// POST: Save medication summary
app.post("/saveUserMedication", async (req, res) => {
  const {
    name,
    email,
    contactNo,
    selectedMedications,
    medications,
    deliveryMethod,
    deliveryDetails,
  } = req.body;

  // تحقق من وجود كافة البيانات المطلوبة
  if (!name || !email || !contactNo || !medications) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // إنشاء كائن جديد لحفظه في قاعدة البيانات
    const newMedication = new MedicationModel({
      name,
      email,
      contactNo,
      selectedMedications,
      medications,
      deliveryMethod,
      deliveryDetails,
    });

    // حفظ البيانات في قاعدة البيانات
    await newMedication.save();

    // إرجاع الرد بعد حفظ البيانات بنجاح
    return res.status(200).json({
      msg: "Medication data saved successfully!",
      userMedication: newMedication,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save medication" });
  }
});
// get medication summary of the user
app.get("/getUserMedications", async (req, res) => {
  try {
    const { email } = req.query;
    const medications = await MedicationModel.find({ email });
    res.json(medications);
  } catch (err) {
    console.error("Error fetching medications:", err);
    res.status(500).json({ message: "Error fetching medications" });
  }
});

//forget pass

app.use(bodyParser.json());

// إعداد البريد الإلكتروني باستخدام nodemailer و Outlook
const transporter = nodemailer.createTransport({
  service: "hotmail", // أو 'outlook' إذا كنت تستخدم Outlook
  auth: {
    user: process.env.EMAIL, // اكتب هنا الإيميل الذي سترسل منه الرسائل (مثل outlook.com أو hotmail.com)
    pass: process.env.EMAIL_PASSWORD, // كلمة مرور هذا الإيميل أو كلمة مرور خاصة إذا كان الحساب يستخدم المصادقة الثنائية
  },
});

// مسار استعادة كلمة السر
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // تحقق من وجود المستخدم في قاعدة البيانات
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    // توليد رابط إعادة تعيين كلمة السر (يجب عليك استخدام رابط حقيقي مع رمز تحقق)
    const resetLink = `http://localhost:3000/reset-password?email=${email}`;

    // إرسال البريد الإلكتروني للمستخدم عبر Outlook
    const mailOptions = {
      from: process.env.EMAIL, // الإيميل الذي سترسل منه
      to: email,
      subject: "Reset Your Password",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    // إرسال البريد الإلكتروني
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, message: "Error sending email" });
      }
      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during password reset",
    });
  }
});

// Start server
const port = ENV.PORT || 3001;
app.listen(port, () => {
  console.log(`You are connected at port: ${port}`);
});
