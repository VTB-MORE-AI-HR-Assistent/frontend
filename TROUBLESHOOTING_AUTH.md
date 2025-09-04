# Authentication Troubleshooting Guide

## Problem: Registration button doesn't send requests to backend

### Quick Diagnosis Steps

1. **Check Browser Console**
   - Open browser DevTools (F12)
   - Look for JavaScript errors in Console tab
   - Check Network tab while clicking the button

2. **Test API Connectivity from Browser**
   
   Open browser console and run:
   ```javascript
   // Replace YOUR_SERVER_IP with your actual server IP
   fetch('http://YOUR_SERVER_IP:8081/actuator/health')
     .then(r => r.text())
     .then(console.log)
     .catch(console.error)
   ```

3. **Check Current API Configuration**
   
   In browser console:
   ```javascript
   // This will show what API URL the frontend is using
   console.log(window.location.href)
   // Check if there's an API_URL in the page
   ```

### Root Cause

The issue is that `http://api-gateway:8081` only works inside Docker network. Browsers cannot resolve `api-gateway` as a hostname.

### Solution

#### Option 1: Use Server IP (Quickest)

1. SSH into your server and update the running container:
   ```bash
   # Stop current container
   docker stop vtb-hr-app
   docker rm vtb-hr-app
   
   # Run with correct API URL (replace YOUR_SERVER_IP)
   docker run -d \
     --name vtb-hr-app \
     --network app-network \
     --restart unless-stopped \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:8081 \
     vtb-hr-app:latest
   ```

2. Verify port 8081 is accessible:
   ```bash
   # Check if API Gateway is exposing port 8081
   docker ps | grep api-gateway
   # Should see: 0.0.0.0:8081->8081/tcp
   
   # Check firewall
   sudo ufw status  # Ubuntu
   sudo firewall-cmd --list-ports  # CentOS
   ```

#### Option 2: Use a Reverse Proxy (Better for Production)

Set up Nginx to proxy both frontend and backend:

1. Install Nginx:
   ```bash
   sudo apt install nginx  # Ubuntu
   sudo yum install nginx  # CentOS
   ```

2. Configure Nginx (`/etc/nginx/sites-available/vtbaihr`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Backend API
       location /api/ {
           proxy_pass http://localhost:8081/api/;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Then update frontend to use relative URLs:
   ```bash
   docker run -d \
     --name vtb-hr-app \
     --network app-network \
     --restart unless-stopped \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e NEXT_PUBLIC_API_URL= \
     vtb-hr-app:latest
   ```

### Debugging Commands

```bash
# Check container logs
docker logs vtb-hr-app -f

# Check if containers can communicate
docker exec vtb-hr-app curl http://api-gateway:8081/actuator/health

# Check network configuration
docker network inspect app-network

# Test API from server (not container)
curl http://localhost:8081/actuator/health

# Check what environment variables the container has
docker exec vtb-hr-app env | grep API
```

### Common Issues and Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| API Gateway not exposed | `curl localhost:8081` fails | Check backend docker-compose has `ports: - "8081:8081"` |
| Firewall blocking | External access fails | Open port 8081: `sudo ufw allow 8081` |
| Wrong API URL | Browser can't resolve api-gateway | Use server IP in NEXT_PUBLIC_API_URL |
| CORS errors | Browser blocks requests | Backend needs to allow frontend origin |
| Network isolation | Containers can't communicate | Ensure both use same network: `app-network` |

### Testing the Fix

After applying the solution:

1. Clear browser cache (Ctrl+Shift+R)
2. Open Network tab in DevTools
3. Try registration again
4. You should see POST request to `/api/v1/auth/register`

### Need More Help?

Check these locations for more clues:
- Frontend logs: `docker logs vtb-hr-app`
- Backend logs: `docker logs api-gateway`
- Browser Console for JavaScript errors
- Network tab for failed requests