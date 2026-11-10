
# ==========================================
# SAFETY MANAGEMENT PLATFORM
# Application Configuration
# ==========================================

import os

# Get the location of the backend folder.
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Define where the SQLite database will be stored.
DATABASE_PATH = os.path.join(
    BASE_DIR,
    "database",
    "safety_management.db"
)

# Set a development secret key.
# We will replace this before production deployment.
SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "development-secret-change-before-production"
)


# Store application settings in one configuration class.
class Config:

    SECRET_KEY = SECRET_KEY
    DATABASE_PATH = DATABASE_PATH
