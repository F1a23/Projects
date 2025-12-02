import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Location = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const [ip, setIp] = useState(null); // State to hold the IP address

  const [geoData, setGeoData] = useState(null); // State to hold geolocation data

  const API_KEY = "at_vFPBOcoGkZUxkUiQi9zptXN3QRDrb"; // State to hold geolocation data

  const fetchIpAddress = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");

      setIp(response.data.ip); // Set the IP address in state
    } catch (error) {
      console.error("Error fetching IP address:", error.message);
    }
  };
  // Fetch geolocation data based on the IP

  const getGeoLocationData = async () => {
    if (!ip) return; // Ensure IP is available before making the request

    try {
      const response = await axios.get(
        `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&ipAddress=${ip}`
      );

      setGeoData(response.data); // Set geolocation data in state

      console.log("GeoLocation Data:", response.data);
    } catch (error) {
      console.error("Error fetching geolocation data:", error.message);
    }
  };

  // Fetch the IP address when the component is loaded

  useEffect(() => {
    fetchIpAddress();
  }, []);

  // Fetch geolocation data when the IP is updated

  useEffect(() => {
    if (ip) {
      getGeoLocationData();
    }
  }, [ip]);

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user]);
  return (
    <div className="h22">
      <p>Location Information</p>

      {ip ? <p>IP Address: {ip}</p> : <p>Loading IP address...</p>}

      {geoData ? (
        <div>
          Country: {geoData.location.country}
          <br />
          Region: {geoData.location.region}
        </div>
      ) : (
        <p>Loading Geolocation Data...</p>
      )}
    </div>
  );
};

export default Location;
