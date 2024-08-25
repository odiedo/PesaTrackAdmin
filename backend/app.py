from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import json
import os
from decimal import Decimal

app = Flask(__name__)
CORS(app)

# Database connection
db_config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'pesatrack'
}

def get_db_connection():
    connection = mysql.connector.connect(**db_config)
    return connection

# Helper function to convert Decimal to float
def decimal_to_float(data):
    if isinstance(data, Decimal):
        return float(data)
    elif isinstance(data, dict):
        return {k: decimal_to_float(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [decimal_to_float(i) for i in data]
    return data

@app.route('/sync-products', methods=['POST'])
def sync_products():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()

        cursor.close()
        connection.close()

        # Convert Decimal values to float
        products = decimal_to_float(products)

        # path to the JSON file
        json_file_path = os.path.join(os.path.dirname(__file__), 'products.json')

        # Write the data to the JSON file
        with open(json_file_path, 'w') as json_file:
            json.dump({'products': products}, json_file, indent=4)

        return jsonify({'message': 'Products synced successfully!'})
    except mysql.connector.Error as db_err:
        return jsonify({'error': f"Database error: {str(db_err)}"}), 500
    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500

@app.route('/products-json', methods=['GET'])
def get_products_json():
    try:
        json_file_path = os.path.join(os.path.dirname(__file__), 'products.json')
        
        if not os.path.exists(json_file_path):
            return jsonify({'error': 'JSON file not found'}), 404

        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
