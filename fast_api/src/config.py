"""
Environment Configuration Module for FastAPI Backend

This module provides centralized environment management for the FastAPI backend,
allowing easy switching between development and production environments.
"""

import os
from typing import List

from dotenv import load_dotenv


class Config:
    """
    Configuration class that loads environment-specific settings
    """

    def __init__(self):
        # First load the main .env file to get NODE_ENV
        load_dotenv("./.env")

        self.environment = os.getenv("NODE_ENV", "development")

        # Load environment-specific .env file
        env_file = f"./.env.{self.environment}"
        if os.path.exists(env_file):
            load_dotenv(env_file, override=True)

    @property
    def is_development(self) -> bool:
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def is_stage(self) -> bool:
        return self.environment == "stage"

    # API Configuration
    @property
    def fast_api_url(self) -> str:
        return os.getenv("FAST_API_URL", "http://localhost:8000")

    # Firebase/Firestore Configuration
    @property
    def firebase_project_id(self) -> str:
        return os.getenv("FIREBASE_PROJECT_ID", "reciclapp-dev-23776")

    @property
    def firestore_database_id(self) -> str:
        return os.getenv("FIRESTORE_DATABASE_ID", "(default)")

    # OAuth Configuration
    @property
    def oauth_redirect_uri(self) -> str:
        return os.getenv("OAUTH_REDIRECT_URI", "http://localhost:3000")

    # CORS Configuration
    @property
    def allowed_origins(self) -> List[str]:
        origins = os.getenv(
            "ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
        )
        return [origin.strip() for origin in origins.split(",")]

    # File paths
    @property
    def firestore_service_account_file(self) -> str:
        return os.getenv(
            "FIRESTORE_SERVICE_ACCOUNT_FILE",
            "./routers/firestore-service-account-dev.json",
        )

    @property
    def client_secret_file(self) -> str:
        return os.getenv("CLIENT_SECRET_FILE", "./client_secret_dev.json")


config = Config()
