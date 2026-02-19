import csv
import os
from pathlib import Path

import db as database
import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore
from flask import Flask, jsonify, request

# import db as database
from flask_cors import CORS

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
CORS(app)


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


# SALES_RECORDS = load_sales_csv()


# ------ Health check endpoint -----
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})


# ------ CSV preview endpoint ------
@app.route("/csv/get", methods=["GET"])
def get_csv():
    # Return first 10 rows so frontend/devs can inspect data
    return jsonify({"total_records": len(SALES_RECORDS), "sample": SALES_RECORDS[:10]})


# ------ Dashboard stats endpoint ------
@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    total_sales = len(SALES_RECORDS)

    food_count = {}
    for r in SALES_RECORDS:
        food_id = r["food_id"]
        food_count[food_id] = food_count.get(food_id, 0) + 1

    return jsonify({"total_sales_records": total_sales, "sales_by_food": food_count})


# User Actions
@app.route("/actions/add_inventory", methods=["POST"])
def add_inventory():
    # Receive CSV File
    file = request.files["file"]
    database.add_inventory(file)
    print("Adding inventory")
    return jsonify({"status": "success"})


@app.route("/actions/create_menu_item", methods=["POST"])
def create_menu_item():
    # Receive CSV File
    file = request.files["file"]
    database.create_menu_item(file)
    print("Create menu item")
    return jsonify({"status": "success"})


@app.route("/actions/create_ingredients", methods=["POST"])
def create_ingredients():
    # Receive CSV File
    file = request.files["file"]
    database.create_ingredients(file)
    print("Create ingredients")
    return jsonify({"status": "success"})


@app.route("/actions/record_sales", methods=["POST"])
def record_sales():
    # Receive CSV File
    file = request.files["file"]
    database.record_sales(file)
    print("Record sales")
    return jsonify({"status": "success"})


# Run the server
if __name__ == "__main__":
    app.run(debug=True)
