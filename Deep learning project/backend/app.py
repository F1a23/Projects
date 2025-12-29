from flask import Flask, request, jsonify, send_from_directory
from ultralytics import YOLO
import os
from werkzeug.utils import secure_filename

# ✅ (Optional but very helpful if you open HTML directly)
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "best.pt")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app)  # ✅ allow requests from your frontend
app.config["UPLOAD_FOLDER"] = UPLOAD_DIR

# Load YOLO model once
model = YOLO(MODEL_PATH)
names = model.names  # class id -> name

ALLOWED_EXT = {"png", "jpg", "jpeg", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT

@app.route("/outputs/<path:filename>")
def serve_output(filename):
    return send_from_directory(OUTPUT_DIR, filename)

@app.route("/predict", methods=["POST"])
def predict():
    # form fields
    full_name = request.form.get("name", "")
    pid = request.form.get("pid", "")
    age = request.form.get("age", "")
    scan = request.form.get("scanType", "X-Ray")

    # IMPORTANT: must match the frontend key => "xray"
    if "xray" not in request.files:
        return jsonify({"error": "No file part 'xray'"}), 400

    file = request.files["xray"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Use PNG/JPG/JPEG/WebP"}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_DIR, filename)
    file.save(save_path)

    # Run prediction and save annotated image
    results = model.predict(
        source=save_path,
        imgsz=640,
        conf=0.20,
        iou=0.55,
        save=True,
        project=OUTPUT_DIR,   # outputs/
        name="pred",
        exist_ok=True,
        verbose=False
    )

    r = results[0]

    # Gather predictions
    preds = []
    if r.boxes is not None and len(r.boxes) > 0:
        for cls_id, confv in zip(r.boxes.cls.tolist(), r.boxes.conf.tolist()):
            preds.append((names[int(cls_id)], float(confv)))

    # Decide Fracture / No Fracture
    # Any class != Healthy => fracture suspected
    has_fracture = any(c != "Healthy" for c, _ in preds)
    best_conf = max([c for _, c in preds], default=0.0)

    result_label = "Fracture Detected" if has_fracture else "No Fracture"

    # Annotated image path created by ultralytics
    # outputs/pred/<same filename>
    pred_folder = os.path.join(OUTPUT_DIR, "pred")
    annotated_path = os.path.join(pred_folder, filename)

    # fallback: find same stem
    annotated_file = None
    if os.path.exists(annotated_path):
        annotated_file = filename
    else:
        stem = os.path.splitext(filename)[0]
        if os.path.exists(pred_folder):
            for f in os.listdir(pred_folder):
                if os.path.splitext(f)[0] == stem:
                    annotated_file = f
                    break

    annotated_url = f"/outputs/pred/{annotated_file}" if annotated_file else None

    return jsonify({
        "patient": {"name": full_name, "pid": pid, "age": age, "scanType": scan},
        "result": result_label,
        "confidence": round(best_conf, 3),
        "detections": preds,
        "annotated_image_url": annotated_url
    })

if __name__ == "__main__":
    # http://127.0.0.1:5000
    app.run(host="0.0.0.0", port=5000, debug=True)
