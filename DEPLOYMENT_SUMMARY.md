# Anime Character Website - Deployment Summary

## ✅ Deployment Complete!

The anime character website has been successfully deployed to your ECS server.

## 📋 Server Information

- **Public IP Address**: http://8.221.139.18:3000
- **Server Status**: Running
- **Process ID**: Check with `ps aux | grep "node server.js"`
- **Log File**: `/var/log/anime-character-site.log`

## 🚀 Quick Commands

### Check if server is running:
```bash
ps aux | grep "node server.js"
```

### View logs:
```bash
cat /var/log/anime-character-site.log
```

### Restart the server:
```bash
cd /root/anime-character-site
pkill -f "node server.js"
nohup node server.js > /var/log/anime-character-site.log 2>&1 &
```

### Check port status:
```bash
netstat -tlnp | grep :3000
```

## ⚙️ Configuration

### Application Directory:
`/root/anime-character-site`

### Environment Variables (.env file):
Located at: `/root/anime-character-site/.env`

**IMPORTANT**: You need to configure Alibaba Cloud OSS credentials for avatar upload functionality:

1. Edit the .env file:
   ```bash
   nano /root/anime-character-site/.env
   ```

2. Update these values with your actual Alibaba Cloud OSS credentials:
   - `OSS_ACCESS_KEY_ID` - Your OSS access key ID
   - `OSS_ACCESS_KEY_SECRET` - Your OSS access key secret
   - `OSS_BUCKET` - Your OSS bucket name
   - `OSS_ENDPOINT` - OSS endpoint (default: oss-cn-hangzhou.aliyuncs.com)

## 🔧 Security Group Configuration

**IMPORTANT**: Make sure to configure your Alibaba Cloud ECS security group to allow inbound traffic on port 3000:

1. Go to ECS Console → Security Groups
2. Select your security group
3. Add inbound rule:
   - Protocol: TCP
   - Port: 3000
   - Authorization Object: 0.0.0.0/0 (or restrict to specific IPs)

## 📁 Project Structure

```
/root/anime-character-site/
├── server.js          # Main server file
├── .env              # Environment configuration
├── .env.example      # Example environment file
├── data.db           # SQLite database
├── package.json      # Node.js dependencies
├── views/            # EJS templates
│   ├── index.ejs
│   └── create.ejs
├── public/           # Static files
└── uploads/          # Temporary upload directory
```

## 🎯 Features

- ✅ Create anime character cards with avatar upload
- ✅ Store metadata in SQLite database
- ✅ Upload avatars to Alibaba Cloud OSS (requires OSS credentials)
- ✅ Display character collection on front page
- ✅ RESTful API endpoint: GET /api/characters

## 🐛 Troubleshooting

### Server not accessible from external network:
1. Check ECS security group rules (add port 3000)
2. Verify server is running: `ps aux | grep "node server.js"`
3. Check port binding: `netstat -tlnp | grep :3000`

### Avatar upload not working:
1. Configure OSS credentials in .env file
2. Check OSS bucket permissions
3. Verify the uploads directory exists and is writable

### Database errors:
```bash
# Rebuild better-sqlite3 if needed
cd /root/anime-character-site
npm rebuild better-sqlite3
```

## 📝 Notes

- The server is currently running with `nohup` in the background
- For production use, consider using PM2 or creating a proper systemd service
- Remember to set up OSS credentials for full functionality
- Regular backups of `data.db` are recommended

---

Deployment Date: March 16, 2026
Server: Alibaba Cloud ECS
