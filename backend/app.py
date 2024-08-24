from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from sqlalchemy import create_engine, text

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

@app.route('/products', methods=['GET'])
def get_products():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({'products': products})
    except mysql.connector.Error as db_err:
        return jsonify({'error': f"Database error: {str(db_err)}"}), 500
    except Exception as e:
        return jsonify({'error': f"Unexpected error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
