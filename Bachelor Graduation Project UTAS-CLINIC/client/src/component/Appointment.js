import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import "./AppointmentScheduling.css";
import { useNavigate } from "react-router-dom";
const Appointment = () => {
  const user = useSelector((state) => state.users?.user);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // ✅ جديد: لتحديد نوع الرسالة

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [contactNo, setcontactNo] = useState(user?.contactNo || "");

  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user || !user.email) {
      navigate("/login");
    }
  }, [user, navigate]);
  //
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setcontactNo(user.contactNo || "");
    }
  }, [user]);

  const isValidTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours >= 8 && (hours < 14 || (hours === 14 && minutes === 0));
  };

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 5 || day === 6; // 5 for Friday, 6 for Saturday
  };

  const checkTimeAvailability = async (date, time) => {
    try {
      const response = await axios.get(
        "http://localhost:3001/checkAppointment",
        {
          params: { date, time },
        }
      );

      if (response.data.isTimeTaken) {
        setMessage("This time has already been selected.");
        setMessageType("error"); // ❌
        return false;
      }
      setMessage("");
      setMessageType("");
      return true;
    } catch (error) {
      console.error("Error checking appointment:", error);
      setMessage("Failed to check appointment time.");
      setMessageType("error"); // ❌
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isWeekend(appointmentDate)) {
      setMessage("Appointments cannot be scheduled on Friday or Saturday.");
      setMessageType("error"); // ❌
      return;
    }

    if (!isValidTime(appointmentTime)) {
      setMessage("Appointment time must be between 8:00 AM and 2:00 PM.");
      setMessageType("error"); // ❌
      return;
    }

    const isTimeAvailable = await checkTimeAvailability(
      appointmentDate,
      appointmentTime
    );
    if (!isTimeAvailable) return;

    try {
      const response = await axios.post(
        "http://localhost:3001/saveAppointment",
        {
          name,
          email,
          contactNo,
          appointmentDate,
          appointmentTime,
          serviceType,
        }
      );

      console.log(response.data.msg);
      setMessage("Appointment successfully scheduled.");
      setMessageType("success"); // ✅
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to schedule appointment.");
      setMessageType("error"); // ❌
    }
  };

  return (
    <div className="appointment-container mt-5">
      <h1>Appointment Scheduling</h1>
      <p>
        Schedule your appointment with us easily. Simply fill out the form below
        and choose your preferred date, time, and service.
      </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="name">Full Name</Label>
          <Input type="text" id="name" value={name} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="email">Email Address</Label>
          <Input type="email" id="email" value={email} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="phone">Phone Number</Label>
          <Input type="text" id="phone" value={contactNo} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="appointmentDate">Appointment Date</Label>
          <Input
            type="date"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </FormGroup>

        <FormGroup>
          <Label for="appointmentTime">Appointment Time</Label>
          <Input
            type="time"
            id="appointmentTime"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="serviceType">Service Type</Label>
          <Input
            type="select"
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
          >
            <option value="">Select Service</option>
            <option value="primary-healthcare">Primary Healthcare</option>
            <option value="mental-health">Mental Health</option>
            <option value="vaccination">Vaccination</option>
            <option value="chronic-disease">Chronic Disease Management</option>
          </Input>
        </FormGroup>

        <Button color="primary" type="submit">
          Schedule Appointment
        </Button>
      </Form>

      {message && (
        <div
          className={`alert mt-4 ${
            messageType === "success" ? "alert-success" : "alert-error"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Appointment;
