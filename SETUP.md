# Setup & Improvements Guide

## 🎯 Recent Improvements

### Security Enhancements
- ✅ **HTTP-Only Cookies**: Tokens now stored in secure HTTP-only cookies instead of localStorage (prevents XSS attacks)
- ✅ **Strong JWT Secret**: Generated cryptographically secure random secret
- ✅ **Password Validation**: Enforced strong passwords (8+ chars, uppercase, lowercase, number, special character)
- ✅ **Email Validation**: Implemented regex-based email format validation
- ✅ **Input Sanitization**: HTML escape function added for note content and tags
- ✅ **CORS Restricted**: Limited to frontend domain only (not open to all origins)
- ✅ **Token Refresh**: Sliding session implemented - tokens auto-refresh when expiring soon

### Code Quality & Maintainability
- ✅ **Centralized API Service**: Created `/frontend/src/services/api.js` for all API calls
- ✅ **Naming Conventions Fixed**: 
  - `setinput` → `setInput`
  - `setnotes` → `setNotes`
  - `addnote` → `addNote`
  - `deletenotes` → `deleteNote`
- ✅ **Removed Duplicate Dependencies**: Removed `bcrypt` (kept only `bcryptjs`)
- ✅ **Removed Unused Package**: Removed `dom` package from frontend

### Features Added
- ✅ **Edit Functionality**: Users can now edit existing notes
- ✅ **Tags Support**: Add and filter notes by tags
- ✅ **Search**: Full-text search across notes
- ✅ **Tag Filtering**: Filter notes by selected tag
- ✅ **Password Strength Indicator**: Visual feedback during signup
- ✅ **Timestamps**: Notes display creation/modification time
- ✅ **Confirm Dialog**: Confirmation required before deleting notes
- ✅ **Error Display**: User-friendly error messages throughout the app
- ✅ **Loading States**: Visual feedback during async operations
- ✅ **Logout Endpoint**: Proper logout functionality with backend call

---

## 📋 Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` with your values:
     ```env
     MONGO_URL=your_mongodb_connection_string
     FRONTEND_URL=http://localhost:5173
     JWT_SECRET=bd6a9b9d3833f5561cdd674a8ffc89bf5d85080e2aec2436259e06568b6f2664
     NODE_ENV=development
     PORT=3000
     ```
   - **Important**: The JWT_SECRET provided is just an example. For production, generate a new one:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

3. **Start Backend**
   ```bash
   npm start
   # or for development with auto-reload
   npm install -g nodemon
   nodemon server.js
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment (Optional)**
   - Create `.env.local`:
     ```
     VITE_API_URL=http://localhost:3000
     ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

---

## 🔐 API Service Usage

The centralized API service (`/frontend/src/services/api.js`) provides clean, error-handled API calls:

### Authentication
```javascript
import { authAPI } from '../services/api';

// Register
await authAPI.register(email, password);

// Login
await authAPI.login(email, password);

// Logout
await authAPI.logout();
```

### Notes
```javascript
import { notesAPI } from '../services/api';

// Get all notes
const notes = await notesAPI.getAll();

// Create note
const note = await notesAPI.create(text, tags);

// Update note
const updated = await notesAPI.update(id, text, tags);

// Delete note
await notesAPI.delete(id);
```

All API calls:
- ✅ Include error handling
- ✅ Send credentials (cookies) automatically
- ✅ Throw descriptive error messages
- ✅ Handle JSON response parsing

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a new random value
- [ ] Set `NODE_ENV=production`
- [ ] Set `FRONTEND_URL` to your actual frontend domain
- [ ] Use HTTPS for all connections
- [ ] Set secure cookie flags for HTTPS
- [ ] Enable HSTS headers
- [ ] Set up rate limiting on login/register endpoints
- [ ] Add CSRF protection
- [ ] Use environment-specific configuration
- [ ] Enable CORS only for your domain

---

## 📝 Password Requirements

Passwords must meet these criteria:
- At least 8 characters long
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&)

Example: `MyPassword123!`

---

## 🐛 Troubleshooting

### Cookies Not Working
- Ensure `NODE_ENV=development` in `.env`
- Check that `FRONTEND_URL` matches where frontend is running
- Verify `withCredentials: true` is set (already in api.js)

### CORS Errors
- Check that `FRONTEND_URL` in backend matches frontend URL
- Ensure frontend is calling backend with correct BASE_URL
- Verify `credentials: true` in CORS config

### Auth Issues
- Check that cookies are being set (DevTools → Application → Cookies)
- Verify JWT_SECRET is consistent between sessions
- Check token expiration (1 hour default)

### Password Validation Failed
- Ensure password meets all criteria (see requirements above)
- Frontend shows password strength indicator in real-time

---

## 📊 Project Structure

```
Notes App/
├── backend/
│   ├── .env (keep private!)
│   ├── .env.example (share with team)
│   ├── server.js
│   ├── middleware/
│   │   └── auth.js (JWT verification + token refresh)
│   ├── models/
│   │   ├── notes.js (with tags support)
│   │   └── users.js
│   └── routes/
│       ├── notes.js (CRUD + sanitization)
│       └── users.js (auth: register/login/logout)
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   └── api.js (centralized API calls)
    │   ├── components/
    │   │   ├── home.jsx (notes CRUD + search + tags)
    │   │   ├── login.jsx (with validation)
    │   │   └── signup.jsx (with password strength)
    │   ├── App.jsx (routing)
    │   └── main.jsx
    └── vite.config.js
```

---

## ✨ What's Next?

Consider these enhancements:
- [ ] Add note categories
- [ ] Implement note sharing
- [ ] Add rich text editor
- [ ] Offline support with Service Workers
- [ ] Add dark mode
- [ ] Implement note archiving
- [ ] Add markdown rendering
- [ ] Create note templates
- [ ] Add export/import functionality
- [ ] Implement undo/redo

---

## 📞 Support

For issues, check:
1. Browser console for errors
2. Backend console for API errors
3. Network tab in DevTools
4. `.env` file configuration
5. Database connection status
