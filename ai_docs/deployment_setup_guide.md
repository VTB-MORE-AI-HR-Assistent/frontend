# Deployment Setup Guide - GitHub Secrets Configuration

## Overview
This guide explains how to configure GitHub repository secrets for the CI/CD deployment pipeline.

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### 1. Server Connection Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `SERVER_HOST` | Your server's IP address or domain | `192.168.1.100` or `myserver.com` |
| `SERVER_USER` | SSH username for server access | `ubuntu` or `root` |
| `SERVER_SSH_KEY` | Private SSH key for authentication | `-----BEGIN RSA PRIVATE KEY-----...` |
| `SERVER_PORT` | SSH port (optional, defaults to 22) | `22` or `2222` |
| `SERVER_PATH` | Directory path on server for deployment | `/var/www/vtb-hr-app` |

## Step-by-Step Instructions

### 1. Navigate to Repository Settings
1. Go to your GitHub repository: `https://github.com/[your-username]/[your-repo]`
2. Click on **Settings** tab
3. In the left sidebar, expand **Secrets and variables**
4. Click on **Actions**

### 2. Add Server Host
1. Click **New repository secret**
2. Name: `SERVER_HOST`
3. Value: Your server's IP address (e.g., `157.230.45.123`) or domain (e.g., `vtb-hr.example.com`)
4. Click **Add secret**

### 3. Add Server Username
1. Click **New repository secret**
2. Name: `SERVER_USER`
3. Value: Your SSH username (e.g., `ubuntu`, `debian`, `root`)
4. Click **Add secret**

### 4. Add SSH Private Key
1. First, generate an SSH key pair on your local machine (if you don't have one):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions@vtb-hr"
   # Save it as: ~/.ssh/github_actions_deploy
   ```

2. Copy the **private key** content:
   ```bash
   cat ~/.ssh/github_actions_deploy
   ```

3. In GitHub:
   - Click **New repository secret**
   - Name: `SERVER_SSH_KEY`
   - Value: Paste the entire private key including:
     ```
     -----BEGIN RSA PRIVATE KEY-----
     [Your key content here]
     -----END RSA PRIVATE KEY-----
     ```
   - Click **Add secret**

4. Add the **public key** to your server:
   ```bash
   # On your local machine, copy the public key:
   cat ~/.ssh/github_actions_deploy.pub
   
   # SSH into your server:
   ssh your-user@your-server
   
   # Add the public key to authorized_keys:
   echo "paste-public-key-here" >> ~/.ssh/authorized_keys
   
   # Set proper permissions:
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

### 5. Add Server Port (Optional)
Only needed if your SSH port is not the default 22:
1. Click **New repository secret**
2. Name: `SERVER_PORT`
3. Value: Your SSH port (e.g., `2222`)
4. Click **Add secret**

### 6. Add Server Path
1. Click **New repository secret**
2. Name: `SERVER_PATH`
3. Value: The directory where the app will be deployed (e.g., `/var/www/vtb-hr-app` or `/home/ubuntu/apps/vtb-hr`)
4. Click **Add secret**

## Server Preparation

Before running the deployment, ensure your server has:

### 1. Docker Installed
```bash
# Install Docker on Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
```

### 2. Create Deployment Directory
```bash
# Create the directory specified in SERVER_PATH
sudo mkdir -p /var/www/vtb-hr-app
sudo chown $USER:$USER /var/www/vtb-hr-app
```

### 3. Configure Firewall
```bash
# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Allow application port
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable
```

## Triggering Deployment

The deployment workflow can be triggered in three ways:

### 1. Manual Deployment
1. Go to your repository on GitHub
2. Click on **Actions** tab
3. Select **Deploy to Server** workflow
4. Click **Run workflow**
5. Select the branch (usually `main`)
6. Click **Run workflow** button

### 2. Automatic on Push to Main
Every push to the `main` branch will automatically trigger deployment.

### 3. After Successful PR Merge
When a PR is merged to `main`, deployment will run automatically.

## Deployment Workflow Options

The `deploy.yml` file includes three deployment strategies:

### Option 1: SSH Deployment with Docker (Default - Active)
- Builds Docker image locally
- Transfers to server via SSH
- Runs container with Docker

### Option 2: Docker Compose Deployment (Disabled)
To enable:
1. Edit `.github/workflows/deploy.yml`
2. Change line 126: `if: false` to `if: true`
3. Change line 52: `if: github.ref == 'refs/heads/main'` to `if: false`

### Option 3: Direct Node.js Deployment (Disabled)
To enable:
1. Edit `.github/workflows/deploy.yml`
2. Change line 180: `if: false` to `if: true`
3. Change line 52: `if: github.ref == 'refs/heads/main'` to `if: false`
4. Ensure Node.js and PM2 are installed on your server

## Monitoring Deployment

### Check Deployment Status
1. Go to **Actions** tab in your repository
2. Click on the running/completed workflow
3. View logs for each step

### Verify on Server
```bash
# SSH into your server
ssh user@your-server

# Check if container is running
docker ps

# View container logs
docker logs vtb-hr-app

# Check application
curl http://localhost:3000
```

## Troubleshooting

### Common Issues

#### 1. SSH Connection Failed
- Verify SERVER_HOST is correct
- Check SERVER_PORT if using non-standard port
- Ensure public key is in server's authorized_keys

#### 2. Docker Not Found
- Install Docker on server
- Ensure user has docker permissions

#### 3. Permission Denied
- Check SERVER_PATH permissions
- Ensure user owns the deployment directory

#### 4. Container Won't Start
- Check Docker logs: `docker logs vtb-hr-app`
- Verify port 3000 is not already in use
- Check available disk space

### Debug Commands
```bash
# On server - check deployment directory
ls -la /var/www/vtb-hr-app/

# Check Docker images
docker images

# Check running containers
docker ps -a

# View deployment logs
docker logs vtb-hr-app --tail 100

# Check system resources
df -h  # Disk space
free -m  # Memory
```

## Security Best Practices

1. **Use a dedicated deployment user** (not root)
2. **Restrict SSH key** to specific commands if possible
3. **Keep secrets secure** - Never commit them to repository
4. **Rotate keys regularly** - Update SSH keys periodically
5. **Use firewall rules** - Only open necessary ports
6. **Enable GitHub branch protection** - Require PR reviews before deployment

## Next Steps

1. Add the required secrets to your GitHub repository
2. Prepare your server with Docker and proper permissions
3. Test deployment with manual workflow trigger
4. Monitor the Actions tab for deployment status
5. Verify application is running on your server

## Support

If you encounter issues:
1. Check the GitHub Actions logs for detailed error messages
2. Review server logs with `docker logs vtb-hr-app`
3. Ensure all secrets are correctly configured
4. Verify server meets all prerequisites