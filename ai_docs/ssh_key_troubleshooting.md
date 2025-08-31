# SSH Key Troubleshooting Guide

## Current Error
```
ssh.ParsePrivateKey: ssh: no key found
ssh: handshake failed: ssh: unable to authenticate
```

This means the SSH key format is incorrect or the key isn't being recognized.

## Common Issues and Solutions

### 1. SSH Key Format Issue (Most Likely)

The SSH key must include the FULL key with proper line breaks. When adding the secret:

**❌ WRONG:**
```
-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEA...all on one line...-----END RSA PRIVATE KEY-----
```

**✅ CORRECT:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(multiple lines of key content)
...
-----END RSA PRIVATE KEY-----
```

### 2. Generate a New SSH Key Pair

On your local machine:

```bash
# Generate new key without passphrase
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_actions -N ""

# Display the private key (copy ALL of this)
cat ~/.ssh/github_actions
```

### 3. Add Public Key to Your Server

```bash
# Copy the public key
cat ~/.ssh/github_actions.pub

# SSH into your server
ssh your-user@your-server

# Add to authorized_keys
echo "paste-public-key-here" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 4. Update GitHub Secret

1. Go to: https://github.com/VTB-MORE-AI-HR-Assistent/frontend/settings/secrets/actions
2. Click on `SERVER_SSH_KEY` → Edit (trash icon to delete, then recreate)
3. Paste the ENTIRE private key including:
   - `-----BEGIN RSA PRIVATE KEY-----`
   - All the key content (multiple lines)
   - `-----END RSA PRIVATE KEY-----`

### 5. Test SSH Connection Manually

From your local machine:
```bash
# Test with the key
ssh -i ~/.ssh/github_actions your-user@your-server -p your-port

# If this works, the key is correct
```

### Alternative: Use ED25519 Key (Recommended)

ED25519 keys are shorter and more secure:

```bash
# Generate ED25519 key
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_ed25519 -N ""

# View private key
cat ~/.ssh/github_actions_ed25519

# View public key
cat ~/.ssh/github_actions_ed25519.pub
```

The ED25519 private key will look like:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtz
...
-----END OPENSSH PRIVATE KEY-----
```

### 6. Verify Other Secrets

Make sure these are correct:
- `SERVER_HOST`: Just the IP or domain (no http://, no port)
  - ✅ `157.230.45.123` or `example.com`
  - ❌ `http://157.230.45.123:22`
  
- `SERVER_USER`: The SSH username
  - ✅ `ubuntu`, `root`, `deploy`
  - ❌ `ubuntu@server`

- `SERVER_PORT`: Just the number
  - ✅ `22` or `2222`
  - ❌ `port:22`

- `SERVER_PATH`: Absolute path on server
  - ✅ `/var/www/vtb-hr-app`
  - ❌ `~/vtb-hr-app` or `vtb-hr-app`

### 7. Debug SSH Connection

To see more details, you can temporarily add debug output:

1. Fork the ssh-action repository
2. Add debug flags to the SSH command
3. Or use a simpler test workflow:

```yaml
name: Test SSH
on: workflow_dispatch

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Test SSH Connection
        run: |
          # Create key file
          echo "${{ secrets.SERVER_SSH_KEY }}" > key.pem
          chmod 600 key.pem
          
          # Test connection
          ssh -o StrictHostKeyChecking=no \
              -i key.pem \
              -p ${{ secrets.SERVER_PORT || 22 }} \
              ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} \
              "echo 'SSH connection successful!'"
```

## Quick Checklist

- [ ] SSH key includes full headers and footers
- [ ] SSH key has proper line breaks (not all on one line)
- [ ] Public key is added to server's `~/.ssh/authorized_keys`
- [ ] Server allows SSH key authentication (not disabled in sshd_config)
- [ ] SERVER_HOST is just IP/domain (no protocol or port)
- [ ] SERVER_USER is just username (no @server)
- [ ] SERVER_PATH is absolute path starting with /
- [ ] No firewall blocking SSH port
- [ ] SSH service is running on server

## Most Common Fix

90% of the time, the issue is the SSH key format. Delete and re-add the `SERVER_SSH_KEY` secret, making sure to paste the ENTIRE private key with all line breaks preserved.