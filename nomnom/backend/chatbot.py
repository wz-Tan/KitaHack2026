import os
from dotenv import load_dotenv

from google import genai

# Load API key
load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')

# Gemini
client = genai.Client()

response = client.models.generate_content(
    model='models/gemini-2.5-flash',
    contents='How many states in indonesia?'
)
print(response.text)
