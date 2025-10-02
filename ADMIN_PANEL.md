# Admin Panel Documentation

## Overview
The Admin Panel provides a centralized interface for administrators to manage users, view town configurations, and monitor global statistics.

## Access
- **URL:** `/admin`
- **Required Role:** `admin`
- **Navigation:** Click "Panel Admin" in the sidebar (visible only to admins)

## Features

### 1. User Management Tab
Manage user accounts and permissions.

**Capabilities:**
- View all users in a searchable, sortable data grid
- Add new users with email, name, and role assignment
- Edit user details inline (double-click to edit)
- Delete users with confirmation prompt
- See role-based color coding for quick identification

**User Roles:**
- **Lectura (Read):** Can view data but not modify
- **Escritura (Write):** Can create and edit collection data
- **Administrador (Admin):** Full access including user management

### 2. Towns & Neighborhoods Configuration Tab
View the current geographic configuration.

**Information Displayed:**
- All configured towns
- Map center coordinates for each town
- Communities and their neighborhoods
- Color-coded neighborhood chips
- Available categories per town

**Note:** This is a read-only view. To modify town configurations, edit the `configuration.js` file directly.

### 3. Global Statistics Dashboard
Monitor key metrics across the entire system.

**Overview Cards:**
- **Total de Puntos:** Total collection points (with active count)
- **Pueblos:** Number of configured towns
- **Barrios:** Total neighborhoods across all towns
- **Peso Total:** Total weight collected (in pounds)

**Per-Town Breakdown:**
Detailed view of each town showing:
- Number of collection points
- Number of neighborhoods
- Number of communities (when applicable)

## Technical Details

### Components
- `pages/admin.js` - Main admin page with tab navigation
- `components/admin/UserManagement.js` - User management functionality
- `components/admin/TownManagement.js` - Town configuration viewer
- `components/admin/GlobalStatistics.js` - Statistics dashboard

### Permissions
All admin panel features require the `admin` role. Non-admin users will see an "Acceso Denegado" (Access Denied) message.

### Data Sources
- User data: `/users` API endpoint
- Collection data: `/pdr/get_all` API endpoint
- Weight data: `/recogida/weight/get` API endpoint
- Town configuration: `configuration.js` file

## Best Practices

### User Management
1. Always assign the minimum required role for each user
2. Regularly review user list and remove inactive accounts
3. Use descriptive names for easy identification

### Monitoring
1. Check global statistics regularly to track progress
2. Compare per-town metrics to identify areas needing attention
3. Monitor active vs total points to ensure data quality

## Troubleshooting

**Issue:** "Acceso Denegado" message appears
- **Solution:** Ensure you're logged in with an admin account

**Issue:** No data appears in statistics
- **Solution:** Check that the backend API is running and accessible

**Issue:** Cannot edit user inline
- **Solution:** Double-click on the cell you want to edit

## Future Enhancements
Potential improvements for future versions:
- Editable town configuration through UI
- User activity logs
- Advanced filtering and search
- Export functionality for reports
- Real-time statistics updates
