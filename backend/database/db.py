
# ==========================================
# SAFETY MANAGEMENT PLATFORM
# Database Connection and Initialization
# ==========================================

import sqlite3
from config import DATABASE_PATH


def get_db_connection():
    """Connect to the SQLite database."""

    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


def init_db():
    """Create database tables if they do not exist."""

    connection = get_db_connection()

    try:
        connection.executescript("""

            -- System users and roles
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'employee',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Workplace incidents
            CREATE TABLE IF NOT EXISTS incidents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                incident_type TEXT NOT NULL,
                location TEXT NOT NULL,
                incident_date TEXT NOT NULL,
                status TEXT DEFAULT 'open',
                reported_by INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (reported_by) REFERENCES users(id)
            );

            -- Workplace risk assessments
            CREATE TABLE IF NOT EXISTS risk_assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hazard TEXT NOT NULL,
                likelihood INTEGER NOT NULL,
                severity INTEGER NOT NULL,
                risk_score INTEGER NOT NULL,
                control_measures TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Workplace safety inspections
            CREATE TABLE IF NOT EXISTS inspections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                inspection_title TEXT NOT NULL,
                location TEXT NOT NULL,
                inspection_date TEXT NOT NULL,
                findings TEXT,
                status TEXT DEFAULT 'scheduled',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

        """)

        connection.commit()

    finally:
        connection.close()
