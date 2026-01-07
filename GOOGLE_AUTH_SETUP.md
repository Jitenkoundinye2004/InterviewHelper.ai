# Google OAuth Setup Guide

## Overview
Google authentication has been added to both Login and SignUp pages. Users can now sign in or create an account using their Google credentials.

## Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Enable the "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5173` (local development)
   - `http://localhost:5175` (local development)
   - `https://yourdomain.com` (production)
7. Copy your **Client ID**

### 2. Configure Frontend (.env)

Update `frontend/.env`:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Configure Backend (.env)

Update `backend/.env`:
```
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Implementation Details

#### Frontend Changes:
- **App.jsx**: Wrapped with `<GoogleOAuthProvider>`
- **Login.jsx**: Added Google Sign-In button with `<GoogleLogin />`
- **SignUp.jsx**: Added Google Sign-Up button with `<GoogleLogin />`

#### Backend Changes:
- **authController.js**: Added Google token verification
- Both `registerUser` and `loginUser` now support `googleToken` parameter
- Google users are automatically created if they don't exist
- OAuth users get a random password for security

### 5. How It Works

**Frontend Flow:**
1. User clicks "Sign in with Google" button
2. Google OAuth popup appears
3. User authenticates with Google
4. `credentialResponse.credential` (ID token) is sent to backend
5. On success, user is redirected to dashboard

**Backend Flow:**
1. Backend receives Google ID token
2. Verifies token using `google-auth-library`
3. Extracts user data (email, name, picture)
4. Creates or updates user in MongoDB
5. Returns JWT token for session management

### 6. Troubleshooting

**Issue: "Invalid Google token"**
- Check if `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` match
- Ensure Google+ API is enabled
- Verify redirect URIs in Google Console

**Issue: CORS errors**
- Check backend CORS configuration in `server.js`
- Ensure localhost:5175 is in allowedOrigins

**Issue: User data not syncing**
- Verify Google Client ID is correct
- Check backend logs for token verification errors
- Ensure MongoDB connection is working

### 7. Testing

1. Start frontend: `npm run dev`
2. Start backend: `npm start`
3. Go to login/signup page
4. Click "Continue with Google"
5. Authenticate with Google account
6. You should be logged in and redirected to dashboard

### 8. Production Deployment

1. Add production domain to Google Console redirect URIs
2. Update environment variables on Render for both frontend and backend
3. Test on production URL

### 9. Security Notes

- OAuth users get random passwords to prevent password login
- All Google tokens are verified server-side
- JWT tokens are still used for session management
- Never expose `GOOGLE_CLIENT_ID` or `JWT_SECRET`

## Packages Installed

- **Frontend**: `@react-oauth/google` - Google OAuth React component
- **Backend**: `google-auth-library` - Google token verification

## References

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Docs](https://www.npmjs.com/package/@react-oauth/google)
- [google-auth-library Docs](https://www.npmjs.com/package/google-auth-library)
