import os

from flask import Flask, jsonify
import csv
from pathlib import Path

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load .env
load_dotenv()

# Read env variables for Firebase
cred_path = os.getenv("firebase_credential")
if not cred_path:
    raise RuntimeError("firebase_credential not found in .env")

cred_path = Path(cred_path)

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate(str(cred_path))
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Initialize Flask app
app = Flask(__name__)

# Test for Firestore connection
@app.get("/api/firebase-test")
def firebase_test():
    collections = [c.id for c in db.collections()]
    return jsonify({"collections": collections})

# Path to CSV file
DATA_FILE = Path(__file__).parent / "data" / "restaurant_order_history_sorted.csv"

# Load CSV data into memory
def load_sales_csv():
    records = []
    with open(DATA_FILE, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)
    return records

SALES_RECORDS = load_sales_csv()

# ------ Health check endpoint -----
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy"
        })

# ------ CSV preview endpoint ------
@app.route("/csv/get", methods=["GET"])
def get_csv():
    # Return first 10 rows so frontend/devs can inspect data
    return jsonify({
        "total_records": len(SALES_RECORDS),
        "sample": SALES_RECORDS[:10]
    })

# ------ Dashboard stats endpoint ------
@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    total_sales = len(SALES_RECORDS)

    food_count = {}
    for r in SALES_RECORDS:
        food_id = r["food_id"]
        food_count[food_id] = food_count.get(food_id, 0) + 1

    return jsonify({
        "total_sales_records": total_sales,
        "sales_by_food": food_count
    })


# Run the server
if __name__ == "__main__":
    app.run(debug=True)