import requests
import pandas as pd
import pymysql
from datetime import datetime
from prefect import flow, task, get_run_logger


# ==========================================================
# Part 1 — Setup (10 points)
# 1. Create database weather_db and table hourly_weather.
# 2. Install required packages: pandas, pymysql, requests, prefect.
# ==========================================================


# -------------------- API Setup ---------------------------
# Part 2 — Extract:
# Use OpenWeatherMap API to fetch weather data (Muscat hourly).
API_KEY = "write API_KEY"
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


# ---------------- MySQL Connection Setup ------------------
# Part 2 — Load:
# Insert transformed data into hourly_weather table.
# Use REPLACE INTO to avoid duplicate timestamps.
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your password",
    "database": "database name",
    "cursorclass": pymysql.cursors.Cursor
}


# ==========================================================
# Part 3 — Prefect Tasks (30 points)
# Tasks required:
# 1. extract_task()
# 2. transform_task()
# 3. load_task()
# ==========================================================


# -------------------- Extract Task -------------------------
# Part 2 — Step 1: Extract
# - Fetch weather data from API
# - Extract timestamp, temperature, humidity, weather_condition
@task
def extract_task(city: str = "Muscat") -> pd.DataFrame:
    logger = get_run_logger()

    params = {
        "q": city,
        "appid": API_KEY
    }

    response = requests.get(BASE_URL, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    # Extract required fields
    ts = datetime.utcfromtimestamp(data["dt"])
    temp_k = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    condition = data["weather"][0]["description"]

    df = pd.DataFrame([{
        "timestamp": ts,
        "city": city,
        "temp_k": temp_k,
        "humidity": humidity,
        "weather_condition": condition
    }])

    logger.info(f"Extracted {len(df)} row(s)")
    return df



# -------------------- Transform Task -----------------------
# Part 2 — Step 2: Transform
@task
def transform_task(df: pd.DataFrame) -> pd.DataFrame:
    logger = get_run_logger()

    # Convert Kelvin → Celsius (required)
    df["temperature_c"] = df["temp_k"] - 273.15

    # Handle missing values (required)
    df["temperature_c"] = df["temperature_c"].fillna(method="ffill").fillna(0)
    df["humidity"] = df["humidity"].fillna(method="ffill").fillna(0)

    # Add FeelsLike column (optional in assignment)
    df["feels_like"] = df["temperature_c"] - df["humidity"] * 0.1

    # Log any missing values to a CSV file
    dq_issues = df[df[["temperature_c", "humidity"]].isna().any(axis=1)]
    if not dq_issues.empty:
        dq_issues.to_csv("data_quality_issues.csv", mode="a", header=False, index=False)
        logger.warning(f"Data quality issues found: {len(dq_issues)} rows")

    # Alert for extreme conditions
    for _, row in df.iterrows():
        if row["temperature_c"] > 50 or row["humidity"] > 90:
            logger.warning(
                f"ALERT: Extreme weather at {row['timestamp']} | "
                f"Temp={row['temperature_c']:.2f}°C, Humidity={row['humidity']}"
            )

    logger.info(f"Transformed {len(df)} row(s)")

    # Return final cleaned columns
    return df[[
        "timestamp",
        "city",
        "temperature_c",
        "humidity",
        "weather_condition",
        "feels_like"
    ]]



# -------------------- Load Task ----------------------------
@task
def load_task(df: pd.DataFrame):
    logger = get_run_logger()

    connection = pymysql.connect(**DB_CONFIG)
    cursor = connection.cursor()

    sql = """
    REPLACE INTO hourly_weather
        (ts, city, temperature_c, humidity, weather_condition, feels_like)
    VALUES (%s, %s, %s, %s, %s, %s);
    """

    records = [
        (
            row["timestamp"],
            row["city"],
            float(row["temperature_c"]),
            int(row["humidity"]),
            row["weather_condition"],
            float(row["feels_like"])
        )
        for _, row in df.iterrows()
    ]

    cursor.executemany(sql, records)
    connection.commit()
    cursor.close()
    connection.close()

    logger.info(f"Loaded {len(records)} row(s) into hourly_weather")



# ==========================================================
# FLOW
# ==========================================================
@flow(name="hourly-weather-etl")
def hourly_weather_etl(city: str = "Muscat"):
    raw = extract_task(city)
    clean = transform_task(raw)
    load_task(clean)


# ==========================================================
# DEPLOYMENT  
#
# ==========================================================
if __name__ == "__main__":
    hourly_weather_etl.serve(
        name="hourly-weather-etl",
        cron="0 * * * *",   # تشغيل كل ساعة عند بداية الساعة (بالـ UTC)
        parameters={
            "city": "Muscat"
        },
    )

