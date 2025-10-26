# Cookie-based Authentication Implementation

## Overview

This document describes the implementation of secure cookie-based authentication for ReciclApp, replacing the previous localStorage-based token storage with HTTP-only cookies for enhanced security.

## Security Benefits

### Before (localStorage)
- Tokens stored in browser localStorage
- Vulnerable to XSS attacks
- Manual token management required
- Accessible to JavaScript

### After (Cookies)
- HTTP-only cookies prevent XSS access to tokens
- Automatic inclusion in requests
- Server-controlled expiration
- Secure and SameSite attributes for CSRF protection

## Implementation Details

### Backend Changes (FastAPI)

#### Authentication Endpoints
- `/auth` - Sets authentication cookies after successful OAuth
- `/refresh-token` - Refreshes tokens using cookie-based refresh token
- `/logout` - Clears all authentication cookies
- `/get-current-user` - Reads authentication from cookies

#### Cookie Configuration
```python
# Development (HTTP)
secure=False, samesite="lax"

# Production (HTTPS) 
secure=True, samesite="strict"
```

#### Cookie Types
- `access_token` - Short-lived (1 hour) for API access
- `id_token` - User identity token (1 hour)
- `refresh_token` - Long-lived (30 days) for token renewal

### Frontend Changes (Next.js)

#### API Calls
All fetch requests now include:
```javascript
fetch(url, {
  credentials: 'include', // Include cookies
  // ... other options
})
```

#### Authentication Flow
1. User clicks login button
2. Google OAuth flow completes
3. Backend sets HTTP-only cookies
4. Frontend redirects to authenticated area
5. All subsequent requests automatically include cookies

#### Logout Flow
1. User clicks logout
2. Frontend calls `/logout` endpoint
3. Backend clears all cookies
4. Frontend redirects to login page

## Environment Configuration

Set `ENV=production` environment variable for production deployments to enable secure cookie settings.

## Migration Strategy

The implementation maintains backward compatibility:
- Backend accepts both cookie and header authentication
- Gradual transition possible
- Existing localStorage tokens still work during transition

## Security Considerations

1. **HTTPS Required in Production**: Secure cookies only work over HTTPS
2. **SameSite Protection**: Prevents CSRF attacks
3. **HttpOnly Flag**: Prevents JavaScript access to tokens
4. **Proper Expiration**: Short-lived access tokens with long-lived refresh tokens

## Testing

To test the implementation:
1. Start the development server
2. Navigate to the application
3. Complete the login flow
4. Verify cookies are set in browser developer tools
5. Verify API calls work without manual token management
6. Test logout functionality

## Files Modified

### Backend
- `fast_api/main.py` - Authentication endpoints
- `fast_api/dependencies.py` - Cookie-based user validation

### Frontend
- `components/landing/LandingPage.js` - Login flow
- `components/gcloud/SignInButton.js` - Logout functionality
- `hooks/queries.js` - API data fetching
- Multiple component files for API calls

## Configuration Files
- `components/gcloud/google.js` - Google API configuration