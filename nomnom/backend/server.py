import csv
import os
from pathlib import Path

import db as database
import firebase_admin
from chatbot import build_context_from_firebase, generate_insights
from dotenv import load_dotenv
from firebase_admin import credentials, firestore
from flask import Flask, jsonify, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

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

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[]
)

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
# @app.route("/csv/get", methods=["GET"])
# def get_csv():
#     # Return first 10 rows so frontend/devs can inspect data
#     return jsonify({"total_records": len(SALES_RECORDS), "sample": SALES_RECORDS[:10]})


# # ------ Dashboard stats endpoint ------
# @app.route("/api/dashboard", methods=["GET"])
# def dashboard():
#     total_sales = len(SALES_RECORDS)

#     food_count = {}
#     for r in SALES_RECORDS:
#         food_id = r["food_id"]
#         food_count[food_id] = food_count.get(food_id, 0) + 1

#     return jsonify({"total_sales_records": total_sales, "sales_by_food": food_count})


@app.route("/dashboard/ingredients", methods=["GET"])
def list_ingredients():
    ingredients = database.list_ingredients()
    return jsonify({"ingredients": ingredients})


@app.route("/dashboard/menu_items", methods=["GET"])
def list_menuItems():
    menu_items = database.list_menuItems()
    return jsonify({"menu_items": menu_items})


# Queries to Be Displayed into the Graph


@app.route("/dashboard/ingredients_usage", methods=["POST"])
def return_ingredients_usage():
    received_data = request.get_json()
    startDate = received_data["startDate"]
    endDate = received_data["endDate"]
    ingredient = received_data["currentIngredient"]
    ingredient_usage = database.retrieveIngredientSales(startDate, endDate, ingredient)
    print("ingredient usage is ", ingredient_usage)
    # Function Call Here
    return jsonify({"ingredient_usage": ingredient_usage})


@app.route("/dashboard/menu_item_usage", methods=["POST"])
def return_menu_item_usage():
    received_data = request.get_json()
    startDate = received_data["startDate"]
    endDate = received_data["endDate"]
    menuItem = received_data["currentMenuItem"]
    menuItemUsage = database.retrieveMenuItemSales(startDate, endDate, menuItem)
    # Function Call Here
    return jsonify({"menu_item_usage": menuItemUsage})


@app.route("/dashboard/sales", methods=["POST"])
def return_sales():
    received_data = request.get_json()
    startDate = received_data["startDate"]
    endDate = received_data["endDate"]
    sales_data = database.retrieveSales(startDate, endDate)
    # Function Call Here
    return jsonify({"sales": sales_data})


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


@app.route("/api/insights", methods=["POST"])
@limiter.limit('1 per second')
def get_insights():
    """
    Generate AI-powered insights from Firebase data.

    Request body (JSON):
    {
        "startDate": "2024-01-01",      # optional, defaults to 30 days ago
        "endDate":   "2024-01-31",      # optional, defaults to today
        "question":  "Which ingredients should I buy less of?"  # optional
    }

    Response:
    {
        "insights": "... Gemini's analysis ..."
    }
    """
    from chatbot import build_context_from_firebase, generate_insights

    try:
        received_data = request.get_json() or {}
        start_date = received_data["startDate"]
        end_date = received_data["endDate"]
        question = received_data["question"]

        print('getting insights')
        context = build_context_from_firebase(start_date, end_date)
        # print("context are ", context)
        insights = generate_insights(context, question)
        # print("insights are ", insights)
        print('-------')
        print(insights)
        print('-------')
        return jsonify({"insights": insights})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# Run the server
if __name__ == "__main__":
    app.run(debug=True)
