# Access Management System

## Overview

This application now includes a comprehensive per-user access management system with role-based access control and granular permissions.

## User Roles

### Admin
- Full access to all features
- Can manage users and assign permissions
- Automatically has all permissions regardless of specific permission settings

### Editor  
- Can view and edit data
- Typical permissions: `read_pdr`, `write_pdr`, `read_recogida`, `write_recogida`, `read_weight`, `write_weight`

### Viewer
- Can only view data
- Typical permissions: `read_pdr`, `read_recogida`, `read_weight`

## Permissions

### PDR (Points of Collection) Management
- `read_pdr`: View PDR list and map
- `write_pdr`: Create and update PDR entries
- `delete_pdr`: Delete PDR entries

### Collection Data (Recogida) Management
- `read_recogida`: View collection data and statistics
- `write_recogida`: Update collection records

### Weight Data Management
- `read_weight`: View weight measurements
- `write_weight`: Create, update, and delete weight records

### User Management
- `manage_users`: Create, edit, and delete user accounts and permissions

## Setup Instructions

### 1. Initialize Users in Firestore

Create a `users` collection in Firestore with documents like:

```json
{
  "email": "admin@yourorg.com",
  "name": "Admin User", 
  "role": "admin",
  "permissions": ["manage_users"],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 2. Default Role Assignment

New users authenticating through Google OAuth will be assigned:
- Role: `viewer`
- Permissions: `[]` (empty - no access until explicitly granted)

### 3. First Admin Setup

To set up your first admin user:

1. Have the user log in through Google OAuth (they will have no access initially)
2. Manually add their email to the Firestore `users` collection with admin role
3. They can then use the Users page to manage other users

## Frontend Usage

### Conditional UI Rendering

Use the `PermissionGuard` component to show/hide UI elements:

```jsx
import { PermissionGuard } from '../components/common/PermissionGuard'

// Show only to users with specific permission
<PermissionGuard permission="write_pdr">
  <Button>Create PDR</Button>
</PermissionGuard>

// Show only to users with specific role
<PermissionGuard role="admin">
  <AdminPanel />
</PermissionGuard>

// Show only to users who can write to specific resource
<PermissionGuard resource="recogida" action="write">
  <EditButton />
</PermissionGuard>
```

### Permission Hooks

Use the `usePermissions` hook to check permissions in components:

```jsx
import { usePermissions } from '../components/common/PermissionGuard'

function MyComponent() {
  const { canWrite, canManageUsers } = usePermissions()
  
  if (canWrite('pdr')) {
    // Show edit functionality
  }
  
  if (canManageUsers()) {
    // Show user management options
  }
}
```

## Backend API Usage

### Protecting Endpoints

Use permission decorators to protect API endpoints:

```python
from dependencies import require_permission, Permissions

@router.get("/protected-endpoint")
async def my_endpoint(
    current_user: Annotated[User, Depends(require_permission(Permissions.READ_PDR))]
):
    # Only users with read_pdr permission can access this
    return data
```

### Role-based Protection

```python
from dependencies import require_role

@router.get("/admin-only")
async def admin_endpoint(
    current_user: Annotated[User, Depends(require_role("admin"))]
):
    # Only admin users can access this
    return admin_data
```

## Migration from Previous System

The new system is backwards compatible:
- Existing users in the `users` Firestore collection will work as before
- Users not yet in the collection will be assigned default viewer role
- All existing functionality continues to work

## Security Notes

- Admin role bypasses all permission checks
- Users cannot delete their own accounts
- All user management actions are logged with timestamps
- Tokens are validated on every request

## Troubleshooting

### User has no access after login
- Check if user exists in Firestore `users` collection
- Verify user has appropriate role and permissions
- Check browser console for authentication errors

### Permission denied errors
- Verify user's role and permissions in Users management page
- Check if the required permission matches the API endpoint requirements
- Ensure user's token is valid and not expired