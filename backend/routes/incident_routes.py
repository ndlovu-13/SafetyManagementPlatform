
# ==========================================
# SAFETY MANAGEMENT PLATFORM
# Incident Reporting API Routes
# ==========================================

from flask import Blueprint, request, jsonify
from database.db import get_db_connection

# Create the incidents API blueprint.
incident_bp = Blueprint("incidents", __name__)


# GET: Retrieve all reported incidents.
@incident_bp.route("/api/incidents", methods=["GET"])
def get_incidents():

    connection = get_db_connection()

    try:
        incidents = connection.execute("""
            SELECT *
            FROM incidents
            ORDER BY created_at DESC
        """).fetchall()

        return jsonify([dict(incident) for incident in incidents]), 200

    finally:
        connection.close()


# POST: Submit a new workplace incident.
@incident_bp.route("/api/incidents", methods=["POST"])
def create_incident():

    data = request.get_json(silent=True) or {}

    required_fields = [
        "title",
        "incident_type",
        "location",
        "incident_date"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    connection = get_db_connection()

    try:
        cursor = connection.execute("""
            INSERT INTO incidents (
                title,
                description,
                incident_type,
                location,
                incident_date,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            data["title"],
            data.get("description", ""),
            data["incident_type"],
            data["location"],
            data["incident_date"],
            "open"
        ))

        connection.commit()

        return jsonify({
            "message": "Incident reported successfully",
            "incident_id": cursor.lastrowid
        }), 201

    finally:
        connection.close()
