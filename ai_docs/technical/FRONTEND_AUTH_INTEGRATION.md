# Frontend Authentication Integration Guide

## 🌐 API Gateway Base URL

```
Production: http://api-gateway:8081
Development: http://localhost:8081
```

## 🔐 Authentication Flow

### 1. User Registration

Create a new user account and receive JWT tokens immediately.

**Endpoint:** `POST /api/v1/auth/register`

**Request:**

```javascript
const response = await fetch("http://api-gateway:8081/api/v1/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "SecurePass123", // Min 6 characters (per user-service spec)
    firstName: "John",
    lastName: "Doe",
  }),
});
```

**Success Response (201):**

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMi...",
  "refreshToken": "eyJhbGciOiJIUzUxMi...",
  "tokenType": "Bearer",
  "expiresIn": 86400000, // milliseconds (24 hours)
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses:**

- `400` - Invalid input (validation failed)
- `409` - Email already exists

---

### 2. User Login

Authenticate existing user and receive JWT tokens.

**Endpoint:** `POST /api/v1/auth/login`

**Request:**

```javascript
const response = await fetch("http://api-gateway:8081/api/v1/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "SecurePass123",
  }),
});
```

**Success Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMi...",
  "refreshToken": "eyJhbGciOiJIUzUxMi...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Response:**

- `401` - Invalid credentials (wrong email or password)

---

### 3. Refresh Access Token

Get a new access token when the current one expires.

**Endpoint:** `POST /api/v1/auth/refresh`

**Request:**

```javascript
const response = await fetch("http://api-gateway:8081/api/v1/auth/refresh", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    refreshToken: "eyJhbGciOiJIUzUxMi...", // Your saved refresh token
  }),
});
```

**Success Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzUxMi...", // New access token
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

**Error Response:**

- `401` - Invalid or expired refresh token

---

## 🔑 Using JWT Token for Protected Endpoints

After login/register, save the tokens and include the access token in all protected API calls:

### Token Storage (Example)

```javascript
// After successful login/register
localStorage.setItem("accessToken", response.accessToken);
localStorage.setItem("refreshToken", response.refreshToken);
localStorage.setItem("user", JSON.stringify(response.user));
```

### Making Authenticated Requests

```javascript
const accessToken = localStorage.getItem("accessToken");

const response = await fetch("http://api-gateway:8081/api/v1/users/me", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});
```

---

## 🔄 Token Management Best Practices

### 1. Automatic Token Refresh

```javascript
// Helper function to make authenticated requests
async function authenticatedFetch(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  // Add auth header
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let response = await fetch(url, authOptions);

  // If token expired, try to refresh
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    const refreshResponse = await fetch(
      "http://api-gateway:8081/api/v1/auth/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("accessToken", data.accessToken);

      // Retry original request with new token
      authOptions.headers["Authorization"] = `Bearer ${data.accessToken}`;
      response = await fetch(url, authOptions);
    } else {
      // Refresh failed, redirect to login
      window.location.href = "/login";
    }
  }

  return response;
}
```

### 2. Token Expiration Check

```javascript
// Decode JWT to check expiration
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch {
    return true;
  }
}

// Check before making requests
async function makeRequest(url, options) {
  let accessToken = localStorage.getItem("accessToken");

  if (isTokenExpired(accessToken)) {
    // Refresh token before making request
    await refreshAccessToken();
    accessToken = localStorage.getItem("accessToken");
  }

  return authenticatedFetch(url, options);
}
```

### 3. Logout

```javascript
function logout() {
  // Clear all auth data
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Redirect to login page
  window.location.href = "/login";
}
```

---

## ⚠️ Error Handling

### Common Error Responses

| Status  | Meaning                              | Action                             |
| ------- | ------------------------------------ | ---------------------------------- |
| 401     | Unauthorized (invalid/expired token) | Refresh token or redirect to login |
| 403     | Forbidden (insufficient permissions) | Show error message                 |
| 404     | Resource not found                   | Show "not found" message           |
| 409     | Conflict (e.g., email exists)        | Show validation error              |
| 422     | Validation error                     | Show field-specific errors         |
| 502/503 | Service unavailable                  | Retry or show maintenance message  |

### Error Handling Example

```javascript
try {
  const response = await fetch("http://api-gateway:8081/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();

    switch (response.status) {
      case 401:
        showError("Invalid email or password");
        break;
      case 409:
        showError("Email already exists");
        break;
      case 422:
        // Show validation errors
        error.errors?.forEach((fieldError) => {
          showFieldError(fieldError.field, fieldError.message);
        });
        break;
      default:
        showError("Something went wrong. Please try again.");
    }
    return;
  }

  const data = await response.json();
  // Success - save tokens and redirect
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  window.location.href = "/dashboard";
} catch (error) {
  showError("Network error. Please check your connection.");
}
```

---

## 🚀 Quick Start Example (React)

```jsx
// AuthService.js
class AuthService {
  baseURL = "http://api-gateway:8081";

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    this.saveTokens(data);
    return data;
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error("Registration failed");

    const data = await response.json();
    this.saveTokens(data);
    return data;
  }

  saveTokens(data) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  isAuthenticated() {
    const token = this.getAccessToken();
    return token && !this.isTokenExpired(token);
  }

  logout() {
    localStorage.clear();
    window.location.href = "/login";
  }
}

export default new AuthService();
```

```jsx
// LoginComponent.jsx
import { useState } from "react";
import AuthService from "./AuthService";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 📝 Important Notes

1. **Token Expiration**: Access tokens expire in ~24 hours. Implement automatic refresh.
2. **CORS**: The API Gateway is configured to allow all origins (`*`). In production, restrict this.
3. **HTTPS**: Use HTTPS in production for security.
4. **Password Requirements**: Minimum 6 characters (based on user-service validation).
5. **Status Mapping**: The gateway maps some error codes (e.g., 403→409 for duplicate registration).

## 🔗 Related Endpoints

After authentication, you can access:

- **Vacancies**: `/api/v1/vacancies/*` (requires auth)
- **Job Applications**: `/api/v1/jobs/*` (requires auth)
- **User Management**: `/api/v1/users/*` (requires auth)

All protected endpoints require the `Authorization: Bearer <token>` header.
