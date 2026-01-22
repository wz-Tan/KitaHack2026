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
print("Firestore client is ", firestore_client)
