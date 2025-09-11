#!/usr/bin/env python3
"""
Script to initialize the first admin user in the access management system.
Run this script to set up your first admin user who can then manage other users.
"""

import json
import sys
from datetime import datetime

# This would normally import from firebase_admin, but for the example we'll show the structure
def create_admin_user_example():
    """
    Example of how to create the first admin user in Firestore.
    Replace with actual Firestore operations.
    """
    
    print("To create your first admin user, add a document to the 'users' collection in Firestore:")
    print()
    
    admin_user = {
        "email": "your-admin@example.com",  # Replace with actual admin email
        "name": "Admin User",              # Replace with actual admin name
        "role": "admin",
        "permissions": ["manage_users"],
        "created_at": datetime.now().isoformat(),
        "created_by": "system"
    }
    
    print("Document ID: your-admin@example.com")
    print("Document content:")
    print(json.dumps(admin_user, indent=2))
    print()
    
    print("Steps:")
    print("1. Go to Firebase Console -> Firestore Database")
    print("2. Create/navigate to 'users' collection") 
    print("3. Add document with ID as the admin email")
    print("4. Copy the JSON structure above as document fields")
    print("5. Save the document")
    print("6. Have the admin user log in through the web app")
    print("7. They will now have access to the Users management page")


def create_sample_users():
    """Sample user configurations for different roles"""
    
    users = {
        "admin": {
            "email": "admin@reciclaplus.com",
            "name": "System Administrator", 
            "role": "admin",
            "permissions": ["manage_users"]
        },
        "editor": {
            "email": "editor@reciclaplus.com",
            "name": "Data Editor",
            "role": "editor", 
            "permissions": [
                "read_pdr", "write_pdr",
                "read_recogida", "write_recogida", 
                "read_weight", "write_weight"
            ]
        },
        "viewer": {
            "email": "viewer@reciclaplus.com",
            "name": "Data Viewer",
            "role": "viewer",
            "permissions": ["read_pdr", "read_recogida", "read_weight"]
        }
    }
    
    print("\nSample user configurations:")
    print("=" * 50)
    
    for role, user_data in users.items():
        print(f"\n{role.upper()} USER:")
        print(f"Document ID: {user_data['email']}")
        print("Document content:")
        
        # Add timestamp
        user_data["created_at"] = datetime.now().isoformat()
        user_data["created_by"] = "system"
        
        print(json.dumps(user_data, indent=2))


def show_permission_reference():
    """Show all available permissions"""
    
    permissions = {
        "PDR Management": [
            "read_pdr - View PDR list and map",
            "write_pdr - Create and update PDR entries", 
            "delete_pdr - Delete PDR entries"
        ],
        "Collection Data": [
            "read_recogida - View collection data and statistics",
            "write_recogida - Update collection records"
        ],
        "Weight Data": [
            "read_weight - View weight measurements",
            "write_weight - Create, update, and delete weight records"
        ],
        "User Management": [
            "manage_users - Create, edit, and delete user accounts"
        ]
    }
    
    print("\nAvailable Permissions:")
    print("=" * 50)
    
    for category, perms in permissions.items():
        print(f"\n{category}:")
        for perm in perms:
            print(f"  • {perm}")


if __name__ == "__main__":
    print("ReciclApp Access Management Setup")
    print("=" * 50)
    
    if len(sys.argv) > 1 and sys.argv[1] == "--samples":
        create_sample_users()
    elif len(sys.argv) > 1 and sys.argv[1] == "--permissions":
        show_permission_reference()
    else:
        create_admin_user_example()
        print("\nRun with --samples to see sample user configurations")
        print("Run with --permissions to see all available permissions")