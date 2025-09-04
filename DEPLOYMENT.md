# Deployment Guide for VTB AI HR Frontend

## Overview

This guide explains how to deploy the VTB AI HR frontend application to a server environment where it will communicate with the backend API Gateway at `http://api-gateway:8081`.

## Prerequisites

- Docker and Docker Compose installed on the server
- Backend services running with API Gateway accessible at `api-gateway:8081`
- Network connectivity between frontend and backend containers

## Environment Configuration

The application uses different environment files for different deployment scenarios:

### Development (Local)
- **File**: `.env.development` or `.env.local`
- **API URL**: `http://localhost:8081`
- **Usage**: Local development on your machine

### Production (Server)
- **File**: `.env.production`
- **API URL**: `http://api-gateway:8081`
- **Usage**: Server deployment within Docker network

## Deployment Methods

### Method 1: Using Docker Compose (Recommended)

1. **Ensure the backend network exists:**
   ```bash
   docker network create app-network
   ```

2. **Build and run the frontend:**
   ```bash
   # Build the Docker image
   docker-compose build

   # Start the container
   docker-compose up -d
   ```

3. **Verify deployment:**
   ```bash
   # Check container status
   docker-compose ps

   # Check logs
   docker-compose logs -f vtb-frontend
   ```

### Method 2: Using Docker Directly

1. **Build the Docker image:**
   ```bash
   docker build -t vtb-frontend:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name vtb-frontend \
     --network app-network \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e NEXT_PUBLIC_API_URL=http://api-gateway:8081 \
     -e NEXT_PUBLIC_APP_URL=http://your-domain.com \
     --restart unless-stopped \
     vtb-frontend:latest
   ```

### Method 3: Using npm (Without Docker)

1. **Set environment variables:**
   ```bash
   export NODE_ENV=production
   export NEXT_PUBLIC_API_URL=http://api-gateway:8081
   export NEXT_PUBLIC_APP_URL=http://your-domain.com
   ```

2. **Build and start:**
   ```bash
   # Install dependencies
   npm install

   # Build the application
   npm run build

   # Start the production server
   npm start
   ```

## Important Configuration Details

### API Gateway Connection

The frontend connects to the backend through the API Gateway. In a Docker environment:

- **Service Name**: `api-gateway` (Docker internal DNS)
- **Port**: `8081`
- **Full URL**: `http://api-gateway:8081`

This configuration assumes:
1. Both frontend and backend are in the same Docker network
2. The API Gateway service is named `api-gateway` in the backend docker-compose
3. The gateway is exposed on port 8081

### Network Configuration

Ensure the frontend and backend containers are on the same Docker network:

```yaml
networks:
  app-network:
    external: true  # Backend should create this network
```

### Environment Variables

Key environment variables for production:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Enables production optimizations |
| `NEXT_PUBLIC_API_URL` | `http://api-gateway:8081` | Backend API Gateway URL |
| `NEXT_PUBLIC_APP_URL` | `http://your-domain.com` | Frontend public URL |
| `NEXT_PUBLIC_ENV` | `production` | Application environment |

## Troubleshooting

### 1. Cannot Connect to API Gateway

**Error**: Network requests failing with connection refused

**Solution**:
```bash
# Verify both containers are on the same network
docker network inspect app-network

# Check if api-gateway is accessible from frontend container
docker exec vtb-frontend ping api-gateway

# Test API connection
docker exec vtb-frontend curl http://api-gateway:8081/health
```

### 2. CORS Issues

**Error**: CORS policy blocking requests

**Solution**: Ensure the API Gateway is configured to allow requests from the frontend origin:
- Add frontend URL to CORS allowed origins in backend configuration
- Or use proxy configuration in Next.js

### 3. Environment Variables Not Loading

**Error**: API URL showing as undefined

**Solution**:
```bash
# Rebuild the Docker image after environment changes
docker-compose build --no-cache
docker-compose up -d

# Verify environment inside container
docker exec vtb-frontend env | grep NEXT_PUBLIC
```

### 4. Port Already in Use

**Error**: Port 3000 already in use

**Solution**:
```bash
# Change the port mapping in docker-compose.yml
ports:
  - "3001:3000"  # Map to different host port
```

## Health Checks

The application includes health checks to ensure it's running properly:

```bash
# Manual health check
curl http://localhost:3000

# Docker health status
docker inspect vtb-frontend --format='{{.State.Health.Status}}'
```

## Logs and Monitoring

### View Logs
```bash
# Docker Compose logs
docker-compose logs -f vtb-frontend

# Docker logs
docker logs -f vtb-frontend

# Last 100 lines
docker logs --tail 100 vtb-frontend
```

### Monitor Resources
```bash
# Container stats
docker stats vtb-frontend

# Detailed inspection
docker inspect vtb-frontend
```

## Updating the Application

1. **Pull latest code:**
   ```bash
   git pull origin main
   ```

2. **Rebuild and redeploy:**
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Verify update:**
   ```bash
   docker-compose logs -f vtb-frontend
   ```

## Security Considerations

1. **Use HTTPS in Production**: Configure SSL/TLS certificates
2. **Environment Variables**: Never commit sensitive data to git
3. **Network Security**: Ensure Docker network is properly isolated
4. **Update Dependencies**: Regularly update Node.js and npm packages
5. **Non-root User**: Container runs as non-root user `nextjs`

## Rollback Procedure

If deployment fails:

1. **Stop the new container:**
   ```bash
   docker-compose down
   ```

2. **Restore previous version:**
   ```bash
   docker run -d [previous-image-tag]
   ```

3. **Verify rollback:**
   ```bash
   docker logs -f vtb-frontend
   ```

## Support

For issues or questions:
1. Check application logs: `docker-compose logs vtb-frontend`
2. Verify network connectivity: `docker exec vtb-frontend ping api-gateway`
3. Test API endpoint: `curl http://api-gateway:8081/health`
4. Review environment variables: `docker exec vtb-frontend env`