from flask import Flask, request, jsonify
from pymongo import MongoClient, errors
from pymongo.server_api import ServerApi
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import requests
from urllib.parse import urlencode
import PyPDF2
import io
import pdfplumber
import xlsxwriter
import pandas as pd
from io import BytesIO
from flask import send_file
import tempfile
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract' 

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# MongoDB Connection
uri = "mongodb+srv://pc:nokia10@cluster0.qfovlbc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['translator']
users_collection = db.users

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if users_collection.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already exists'}), 409

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = {
            'name': data['name'],
            'email': data['email'],
            'password': hashed_password,
        }
        users_collection.insert_one(new_user)
        return jsonify({'message': 'User registered successfully'}), 201

    except errors.PyMongoError as e:
        return jsonify({'error': 'Database error', 'message': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Unknown error', 'message': str(e)}), 500

CORS(app)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({'email': data['email']})
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Login successful', 'user': user['name']}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401


CORS(app)
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.content_type == 'application/pdf':
        try:
            text = ''
            with pdfplumber.open(io.BytesIO(file.read())) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or "Empty or unreadable page"
            if not text:
                return jsonify({'error': 'No text could be extracted'}), 400
            return jsonify({'text': text}), 200
        except Exception as e:
            return jsonify({'error': 'Failed to process PDF file', 'message': str(e)}), 500
    elif file.content_type in ['text/plain', 'application/txt']:  
        try:
            text = file.stream.read().decode('utf-8')  
            return jsonify({'text': text}), 200
        except Exception as e:
            return jsonify({'error': 'Failed to process text file', 'message': str(e)}), 500
    elif file.content_type in ['image/png', 'image/jpeg', 'image/jpg']:
        try:
            image = Image.open(file)
            text = pytesseract.image_to_string(image)
            return jsonify({'text': text}), 200
        except Exception as e:
            return jsonify({'error': 'Failed to perform OCR on the image', 'message': str(e)}), 500
    else:
        return jsonify({'error': 'Unsupported file type'}), 400


CORS(app)
@app.route('/upload_excel', methods=['POST'])
def upload_excel():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file and file.filename.endswith('.xlsx'):
        try:
            temp = tempfile.NamedTemporaryFile(delete=False)
            file.save(temp.name)
            df = pd.read_excel(temp.name)
            text = "\n".join(df.apply(lambda x: ' '.join(x.dropna().astype(str)), axis=1))
            temp.close()
            return jsonify({'text': text}), 200
        except Exception as e:
            return jsonify({'error': 'Failed to process Excel file', 'message': str(e)}), 500
    else:
        return jsonify({'error': 'Unsupported file type'}), 400
CORS(app)
@app.route('/translateform', methods=['POST'])
def translate_form():
    data = request.get_json()
    text = data.get('text')
    target = data.get('target')
    apiUrl = "https://text-translator2.p.rapidapi.com/translate"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "1dd13224e7msh1bd2b5af679f914p10e822jsnc2d061ba5314",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com"
    }
    body = {
        'source_language': 'en',
        'target_language': target,
        'text': text
    }
    response = requests.post(apiUrl, headers=headers, data=urlencode(body))

    if response.status_code == 200:
        jsonData = response.json()
        translated_text = jsonData.get('data', {}).get('translatedText', 'No translation found')
        return jsonify({'translatedText': translated_text})
    else:
        return jsonify({'error': 'Failed to translate', 'statusCode': response.status_code}), response.status_code

if __name__ == '__main__':
    app.run(debug=True, port=3000)
