import os

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
ingredient_data = {"name": "rice", "duration": 10, "price": 15}
firestore_client.collection("ingredients").document("a2").set(ingredient_data)

# Retrieve All Fields from A Collection
docs = firestore_client.collection("ingredients").stream()
for document in docs:
    print("Document is ", document.to_dict())

# Retrieve Data Entry
doc = firestore_client.collection("ingredients").document("a1").get()
if doc.exists:
    print("Document data is", doc.to_dict())
