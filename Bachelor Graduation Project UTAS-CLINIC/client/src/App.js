import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./component/Header"; // استيراد الهيدر
import Home from "./component/Home";
import AboutUs from "./component/AboutUs";
import Feedback from "./component/Feedback";
import Services from "./component/Services";
import Contact from "./component/Contact";
import Footer from "./component/Footer";
import Logout from "./component/Logout";
import Login from "./component/Login";
import Appointment from "./component/Appointment";
import Education from "./component/Education";
import DirectHealth from "./component/DirectHealth";
import Communication from "./component/Communication";
import MentalHealthServices from "./component/MentalHealthServices";
import RequestYourMedication from "./component/RequestYourMedication";
import DeliveryOrPickUp from "./component/DeliveryOrPickUp";
import PickUpOption from "./component/PickUpOption";
import DeliveryOption from "./component/DeliveryOption";
import MedicationPreparation from "./component/MedicationPreparation";
import "./component/tailwind.css";
import Medication from "./component/Medication";
import OrderDelivery from "./component/OrderDelivery";
import Profile from "./component/Profile";
import MedicationSummary from "./component/Medicationlist";
import SummaryReport from "./component/SummaryReport";
import Order from "./component/Medicationlist";

import { useSelector } from "react-redux";
import ForgotPassword from "./component/ForgotPassword";
const App = () => {
  const email = useSelector((state) => state.users.user.email);

  return (
    <Router>
      {email ? (
        <>
          <Header />
        </>
      ) : null}{" "}
      {/* إبقاء الهيدر ثابتًا في جميع الصفحات */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/services" element={<Services />} />
        <Route path="/direct" element={<DirectHealth />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/education" element={<Education />} />
        <Route path="/mental" element={<MentalHealthServices />} />
        <Route path="/medication" element={<RequestYourMedication />} />
        <Route
          path="/medication-preparation"
          element={<MedicationPreparation />}
        />
        <Route path="/request-medication" element={<Medication />} />
        <Route path="/delivery-or-pick-up" element={<DeliveryOrPickUp />} />
        <Route path="/pick-up-option" element={<PickUpOption />} />
        <Route path="/delivery-option" element={<DeliveryOption />} />
        <Route path="/communication" element={<Communication />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/medication-summary" element={<MedicationSummary />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/order" element={<Order />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orderdelivery" element={<OrderDelivery />} />
        <Route path="/summaryReport" element={<SummaryReport />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
