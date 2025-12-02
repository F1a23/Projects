# 🌦️ Weather ETL Pipeline – Prefect + MySQL

An automated ETL pipeline that fetches hourly weather data for **Muscat** using the OpenWeatherMap API, transforms it, and loads it into a MySQL database.  
This project demonstrates real-world data engineering concepts including API extraction, data cleaning, orchestration, scheduling, and database loading.

---

## 🚀 Tech Stack
- **Python**
- **Prefect** (Flow orchestration & scheduling)
- **OpenWeatherMap API**
- **MySQL** (Data storage)
- **pandas**
- **Docker** (optional environment setup)

---

## 📖 Description

This ETL pipeline consists of three main steps implemented using Prefect tasks:

### **1. Extract**
Fetches current weather data using the OpenWeatherMap API, retrieving:
- Timestamp  
- Temperature (Kelvin)  
- Humidity  
- Weather condition description  

### **2. Transform**
Processes and cleans the extracted data by:
- Converting temperature from Kelvin to Celsius  
- Handling missing values  
- Adding a custom `feels_like` metric  
- Logging potential data quality issues  
- Alerting when extreme values appear (very high temperature or humidity)

### **3. Load**
Loads the cleaned data into a MySQL table named **hourly_weather** using:

