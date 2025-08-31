# Quick GitHub Secrets Setup

## The deploy workflow is failing because GitHub secrets are not configured yet.

### Required Secrets to Add

1. **Go to your GitHub repository**: https://github.com/VTB-MORE-AI-HR-Assistent/frontend
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

| Secret Name | What to Put | Example |
|------------|-------------|---------|
| `SERVER_HOST` | Your server IP or domain | `157.230.45.123` |
| `SERVER_USER` | SSH username | `ubuntu` or `root` |
| `SERVER_SSH_KEY` | Private SSH key (see below) | `-----BEGIN RSA PRIVATE KEY-----...` |
| `SERVER_PATH` | Where to deploy on server | `/var/www/vtb-hr-app` |

### Option 1: If you DON'T have a server yet

The deployment will keep failing until you:
1. Get a server (VPS from DigitalOcean, AWS, etc.)
2. Install Docker on it
3. Add the secrets above

For now, you can:
- **Disable automatic deployment** by removing the push trigger from deploy.yml
- Only use manual deployment when ready

### Option 2: If you HAVE a server

#### Generate SSH Key (if needed):
```bash
# On your local machine:
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_deploy -N ""

# View private key to copy:
cat ~/.ssh/github_deploy

# View public key:
cat ~/.ssh/github_deploy.pub
```

#### Add public key to server:
```bash
# SSH into your server first
ssh your-user@your-server

# Add the public key
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

#### Install Docker on server:
```bash
# On your server:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in for group changes
```

### Option 3: Disable automatic deployment (temporary fix)

If you're not ready to deploy yet, disable the automatic trigger:

Edit `.github/workflows/deploy.yml`:
```yaml
on:
  workflow_dispatch: # Manual trigger only
  # push:
  #   branches: [ main ]
```

This will stop the deployment from running automatically on every push.

## Next Steps

1. **If you want deployment now**: Add the secrets and ensure your server is ready
2. **If deployment can wait**: Comment out the push trigger in deploy.yml
3. **For testing only**: The CI/CD pipeline (ci-cd.yml) will still run and validate your code

The CI/CD build and tests are working fine - only the deployment step needs these secrets.