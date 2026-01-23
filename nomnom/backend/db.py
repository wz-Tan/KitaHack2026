import os
from datetime import datetime, timezone

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

load_dotenv()

cred = credentials.Certificate(os.getenv("firebase_credential"))

# Create Firebase App Object
app = firebase_admin.initialize_app(cred)

# Connect to Firestore
firestore_client = firestore.client(app)

# Writing Data into Firebase
batch_data = [
    {"date": datetime.now(), "items": [{"a1": 100}, {"a2": 200}]},
    {"date": datetime.now(), "items": [{"a3": 300}, {"a4": 400}]},
    {"date": datetime.now(), "items": [{"a5": 500}, {"a6": 600}]},
    {"date": datetime.now(), "items": [{"a7": 700}, {"a8": 800}]},
    {"date": datetime.now(), "items": [{"a9": 900}, {"a10": 1000}]},
    {"date": datetime.now(), "items": [{"a1": 110}, {"a2": 220}]},
    {"date": datetime.now(), "items": [{"a3": 330}, {"a4": 440}]},
    {"date": datetime.now(), "items": [{"a5": 550}, {"a6": 660}]},
    {"date": datetime.now(), "items": [{"a7": 770}, {"a8": 880}]},
    {"date": datetime.now(), "items": [{"a9": 990}, {"a10": 1110}]},
]

number = 1

for batch in batch_data:
    firestore_client.collection("inventory").document(f"batch_{number}").set(batch)
    number += 1

# Retrieve All Fields from A Collection
docs = firestore_client.collection("ingredients").stream()

# Retrieve Data Entry
doc = firestore_client.collection("ingredients").document("a1").get()
