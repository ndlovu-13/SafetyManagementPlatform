
# ==========================================
# SAFETY MANAGEMENT PLATFORM
# Main Flask Application
# ==========================================

from flask import Flask, jsonify
from flask_cors import CORS

# Import the database initialization function.
from database.db import init_db

# Import our application configuration.
from config import Config

# Import incident reporting routes.
from routes.incident_routes import incident_bp

# Create the Flask application.
app = Flask(__name__)

# Load the settings from config.py.
app.config.from_object(Config)

# Allow React to communicate with our Flask backend.
CORS(app)

# Register the incident reporting API.
app.register_blueprint(incident_bp)

# Create the database tables when the application starts.
init_db()


# Main application route.
@app.route("/")
def home():

    return jsonify({
        "application": "Safety Management Platform",
        "status": "Running",
        "version": "1.0.0"
    })


# API endpoint used to check whether the backend is working.
@app.route("/api/health")
def health():

    return jsonify({
        "status": "healthy",
        "backend": "Flask",
        "database": "Connected",
        "application": "Safety Management Platform"
    })


# Start the development server.
if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
