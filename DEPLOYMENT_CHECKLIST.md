# Deployment Checklist

## Prerequisites (Backend Team Responsibility)
- [x] Backend services deployed and running on server
- [x] API Gateway container named `api-gateway` 
- [x] API Gateway exposing port 8081 to host (`0.0.0.0:8081->8081`)
- [x] All backend services on `app-network` Docker network

## GitHub Secrets Required
- [ ] `SERVER_HOST` - Your server's public IP or domain (e.g., `192.168.1.100` or `api.yourdomain.com`)
- [ ] `SERVER_USER` - SSH username for deployment
- [ ] `SERVER_SSH_KEY` - SSH private key for authentication
- [ ] `SERVER_PATH` - Directory path for deployment (e.g., `/home/user/vtb-frontend`)
- [ ] `SERVER_PORT` - SSH port (optional, defaults to 22)

## Deployment Process

### Step 1: Verify Backend is Running
SSH to your server and check:
```bash
# Check if backend services are running
docker ps | grep api-gateway

# Check if port 8081 is exposed
docker ps | grep api-gateway | grep "0.0.0.0:8081"

# Check network exists
docker network ls | grep app-network
```

### Step 2: Set GitHub Secrets
In your GitHub repository:
1. Go to Settings → Secrets and variables → Actions
2. Add the required secrets listed above
3. Make sure `SERVER_HOST` is your server's public IP (not `localhost` or `api-gateway`)

### Step 3: Run Deployment
1. Go to Actions tab in GitHub
2. Select "Deploy to Server" workflow
3. Click "Run workflow" → "Run workflow"

### Step 4: Verify Deployment
After deployment completes:
1. Access frontend: `http://YOUR_SERVER_IP:3000`
2. Open browser DevTools → Network tab
3. Try registration/login
4. Verify API requests go to `http://YOUR_SERVER_IP:8081`

## Troubleshooting

### If Registration/Login Doesn't Work

1. **Run the Fix API Connection workflow**:
   - Go to Actions → "Fix API Connection"
   - Click "Run workflow"
   - This will restart frontend with correct configuration

2. **Check browser console for errors**:
   - Press F12 → Console tab
   - Look for network errors or CORS issues

3. **Verify API is accessible**:
   ```javascript
   // Run in browser console
   fetch('http://YOUR_SERVER_IP:8081/actuator/health')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```

4. **Common issues**:
   - **Firewall blocking port 8081**: Open the port in firewall
   - **Backend not exposing port**: Backend team needs to add port mapping
   - **CORS not configured**: Backend needs to allow frontend origin

## Architecture Summary

```
User's Browser
      ↓
http://YOUR_SERVER_IP:3000 (Frontend)
      ↓
http://YOUR_SERVER_IP:8081 (API calls from browser)
      ↓
API Gateway Container (port 8081 exposed)
      ↓
Backend Services (internal Docker network)
```

## Key Points
- Frontend container uses `api-gateway` hostname internally (SSR)
- Browser uses `YOUR_SERVER_IP:8081` for API calls
- Both frontend and backend must be on same Docker network (`app-network`)
- Port 8081 must be exposed by backend and accessible from internet