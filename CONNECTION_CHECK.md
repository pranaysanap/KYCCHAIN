# Frontend-Backend Connection Verification

## Configuration Check
I have examined the codebase and confirmed that the frontend and backend are configured to connect properly.

### Frontend Configuration
- **File**: `src/services/api.ts`
- **Base URL**: `http://localhost:5000/api`
- **API Calls**: The frontend makes requests to endpoints like `/auth/login`, `/auth/register`, `/profile/profile`, etc.

### Backend Configuration
- **File**: `Backend/server.js`
- **Port**: 5000 (default)
- **CORS**: Enabled (`app.use(cors())`)
- **Routes**:
  - `/api/auth` -> `authRoutes`
  - `/api/profile` -> `profileRoutes`
  - `/api/verify` -> `verifyRoutes`
  - `/api/upload` -> `uploadRoutes`
  - `/api/documents` -> `documentRoutes`
  - `/api/consent` -> `consentRoutes`

### Route Matching
The routes defined in the backend match the API calls made by the frontend. For example:
- Frontend calls `POST /auth/login` -> Backend handles `POST /api/auth/login`
- Frontend calls `GET /profile/profile` -> Backend handles `GET /api/profile/profile`

## How to Verify
To verify the connection yourself, follow these steps:

1. **Start the Backend**:
   Open a terminal, navigate to the `Backend` directory, and run:
   ```bash
   cd Backend
   npm install
   node server.js
   ```
   You should see: `🚀 Server running on http://localhost:5000`

2. **Start the Frontend**:
   Open another terminal, navigate to the `KYCCHAIN-main` directory, and run:
   ```bash
   npm install
   npm run dev
   ```
   Open the URL shown (usually `http://localhost:5173`).

3. **Test the Connection**:
   - Open the browser's developer tools (F12).
   - Go to the **Network** tab.
   - Try to log in or register in the application.
   - You should see requests to `http://localhost:5000/api/...` with status `200 OK` (if successful) or `4xx/5xx` (if there's an error).
   - If you see `Connection Refused` or network errors, ensure the backend is running.

## Common Issues
- **Backend not running**: Ensure the backend terminal is open and showing "Server running".
- **Port conflicts**: If port 5000 is in use, the backend might fail to start. Check the console output.
- **MongoDB connection**: Ensure your MongoDB URI in `Backend/.env` is correct. The backend needs a database connection to work.
