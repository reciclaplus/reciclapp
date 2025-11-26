#!/usr/bin/env python3

"""
Environment Switcher Script for FastAPI Backend

This script switches the environment by updating NODE_ENV in .env file,
then displays the configuration from .env.{environment}.
"""

import os
import sys

from dotenv import dotenv_values


def switch_environment(environment):
    if environment not in ["development", "production", "stage"]:
        print("Usage: python switch_env.py <development|production|stage>")
        print("Example: python switch_env.py development")
        sys.exit(1)

    # Paths relative to the fast_api directory
    env_file_path = f"../.env.{environment}"
    main_env_path = "../.env"

    try:
        # Check if environment-specific file exists
        if not os.path.exists(env_file_path):
            print(f"❌ Environment file not found: .env.{environment}")
            sys.exit(1)

        # Update NODE_ENV in .env file
        env_content = f"# Environment Configuration\nNODE_ENV={environment}\n"
        with open(main_env_path, "w") as f:
            f.write(env_content)

        print(f"✅ Environment switched to: {environment}")
        print(f"📁 Updated .env with NODE_ENV={environment}")

        # Read and parse the environment-specific file using dotenv
        env_vars = dotenv_values(env_file_path)

        # Display environment-specific configuration
        icons = {
            "development": "🔧",
            "stage": "🎭",
            "production": "🚀",
        }

        print(f"{icons[environment]} {environment.capitalize()} configuration:")

        if "NEXT_PUBLIC_API_URL" in env_vars:
            print(f"   - API URL: {env_vars['NEXT_PUBLIC_API_URL']}")

        if "OAUTH_REDIRECT_URI" in env_vars:
            print(f"   - App URL: {env_vars['OAUTH_REDIRECT_URI']}")

        if "FIREBASE_PROJECT_ID" in env_vars:
            print(f"   - Firebase Project: {env_vars['FIREBASE_PROJECT_ID']}")

        if "FIRESTORE_DATABASE_ID" in env_vars:
            print(f"   - Firestore Database: {env_vars['FIRESTORE_DATABASE_ID']}")

        if "ALLOWED_ORIGINS" in env_vars:
            print(f"   - CORS Origins: {env_vars['ALLOWED_ORIGINS']}")

        if "FIRESTORE_SERVICE_ACCOUNT_FILE" in env_vars:
            print(f"   - Service Account: {env_vars['FIRESTORE_SERVICE_ACCOUNT_FILE']}")

        print(
            f"\nℹ️  Set NODE_ENV={environment} and restart your server to use this configuration."
        )
    except Exception as error:
        print(f"❌ Error updating environment: {error}")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        switch_environment("")  # This will trigger the usage message

    environment = sys.argv[1]
    switch_environment(environment)
