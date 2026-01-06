# 🦴 Bone Fracture Detection using YOLOv8

An end-to-end deep learning object detection system for detecting bone fractures from X-ray images using YOLOv8, integrated into a simple AI web application.

---

## 📌 Project Overview
Diagnosing bone fractures from X-ray images can be time-consuming and depends heavily on expert interpretation.  
This project aims to assist medical professionals by automatically detecting fractures and highlighting their locations using bounding boxes.

⚠️ This system is for educational and supportive purposes only and does not replace medical diagnosis.

---

## 🎯 Objectives
- Detect bone fractures from X-ray images using object detection
- Localize fractures using bounding boxes
- Improve recall to reduce missed fracture cases
- Build and deploy a complete AI application

---

## 📂 Dataset
Human Bone Fractures Multi-modal Image Dataset (HBFMID) – Kaggle  
- X-ray images with YOLO-format annotations  
- Multiple fracture types and body parts  
- Predefined train, validation, and test splits  

---

## 🔍 Data Preparation
- Verified image and label consistency  
- Checked for missing or empty label files  
- Visualized bounding boxes to ensure correct annotation  
- Prevented data leakage by preserving dataset splits  

---

## ⚖️ Class Imbalance Handling
The dataset contained rare fracture classes.

To address this issue:
- Oversampling was applied to minority classes
- The original dataset was not modified
- Only training data was balanced
- Validation and test sets remained unchanged

This strategy improved recall while maintaining fair evaluation.

---

## 🧠 Model Details
- Model: YOLOv8s  
- Pretrained weights: yolov8s.pt  
- Image size: 640 × 640  
- Epochs: 30  
- Batch size: 8  
- Number of classes: 10  

---

## 📊 Performance (Test Set)
- Precision: 0.946  
- Recall: 0.902  
- mAP@0.50: 0.935  
- mAP@0.50–0.95: 0.507  

Recall was prioritized due to its importance in medical screening.

---

## 🖥️ Web Application
Technologies used:
- Frontend: HTML, CSS, JavaScript  
- Backend: Python  
- Model: YOLOv8  

---

## 🔄 System Workflow
1. User enters personal information  
2. Uploads an X-ray image  
3. The YOLOv8 model performs inference  
4. The system displays fracture detection results with bounding boxes  

---

## 💡 Key Insights
- Built a complete YOLOv8 fracture detection pipeline  
- Improved detection of rare fracture cases  
- Maintained dataset integrity and evaluation fairness  
- Achieved strong performance on unseen test data  

---

## 👤 Fatima Al-Amri

Software Engineering | Data Science & AI Trainee at Code Academy through Makeen Bootcamp
Passionate about creating useful, accessible, and impactful technology.
