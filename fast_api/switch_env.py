#!/usr/bin/env python3

"""
Environment Switcher Script for FastAPI Backend

This script allows easy switching between development and production environments
for the FastAPI backend by updating the NODE_ENV variable in the .env file.
"""

import sys
import os

def switch_environment(environment):
    if environment not in ['development', 'production']:
        print('Usage: python switch_env.py <development|production>')
        print('Example: python switch_env.py development')
        sys.exit(1)

    env_path = '.env'
    env_content = f'# Environment Configuration\nNODE_ENV={environment}\n'

    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        
        print(f'✅ Environment switched to: {environment}')
        print(f'📁 Updated .env file with NODE_ENV={environment}')
        
        if environment == 'development':
            print('🔧 Development mode:')
            print('   - API URL: http://localhost:8000')
            print('   - Firebase Project: reciclapp-dev-23776')
            print('   - Collection prefix: dev_')
            print('   - Service Account: firestore-service-account-dev.json')
        else:
            print('🚀 Production mode:')
            print('   - API URL: https://fastapi-dot-norse-voice-343214.uc.r.appspot.com')
            print('   - Firebase Project: norse-voice-343214')
            print('   - Collection prefix: (none)')
            print('   - Service Account: firestore-service-account.json')
        
        print('\nℹ️  Restart your FastAPI server to apply changes.')
    except Exception as error:
        print(f'❌ Error updating environment: {error}')
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        switch_environment('')  # This will trigger the usage message
    
    environment = sys.argv[1]
    switch_environment(environment)