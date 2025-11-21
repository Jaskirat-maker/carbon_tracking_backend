# Deploy to Vercel - Step by Step Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- MongoDB Atlas account (for cloud database)

---

## Step 1: Setup MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new cluster (free tier is fine)
4. Click "Connect" → "Connect your application"
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/waste-carbon-tracker?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Save this connection string - you'll need it!

---

## Step 2: Push Code to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy to Vercel

### Option A: Using Vercel Website (Easiest)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

6. Add Environment Variables:
   - Click "Environment Variables"
   - Add:
     - Name: `MONGODB_URI`
     - Value: Your MongoDB Atlas connection string
   - Add:
     - Name: `PORT`
     - Value: `3000`

7. Click "Deploy"
8. Wait 2-3 minutes for deployment

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - Project name? (press enter for default)
   - Directory? **./  (press enter)**

5. Add environment variables:
   ```bash
   vercel env add MONGODB_URI
   ```
   Paste your MongoDB connection string

6. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## Step 4: Seed the Database

After deployment, seed your database with waste centers:

1. Update `src/scripts/insertCenters.js` to use environment variable:
   ```javascript
   await mongoose.connect(process.env.MONGODB_URI);
   ```

2. Run locally with production database:
   ```bash
   MONGODB_URI="your-atlas-connection-string" node src/scripts/insertCenters.js
   ```

Or create a temporary API endpoint to seed (remove after use):
```javascript
// Add to server.js temporarily
app.get('/api/seed', async (req, res) => {
  const Center = require('./src/models/Center');
  await Center.deleteMany({});
  await Center.insertMany([
    { name: 'Near Hostel A', latitude: 31.2266, longitude: 75.6411, city: 'Ludhiana', country: 'India' },
    { name: 'Near TAN', latitude: 31.2141, longitude: 75.6590, city: 'Ludhiana', country: 'India' },
    { name: 'Near The COS', latitude: 31.2459, longitude: 75.6350, city: 'Ludhiana', country: 'India' },
    { name: 'Near The Hostel PG', latitude: 31.2015, longitude: 75.6180, city: 'Ludhiana', country: 'India' },
    { name: 'Near The Main Gate Parking', latitude: 31.2893, longitude: 75.6275, city: 'Ludhiana', country: 'India' }
  ]);
  res.json({ success: true, message: 'Centers seeded' });
});
```

Visit: `https://your-app.vercel.app/api/seed` once, then remove the endpoint.

---

## Step 5: Get Your Production URL

After deployment, Vercel will give you a URL like:
```
https://your-project-name.vercel.app
```

This is your production API base URL!

---

## Step 6: Test Your Deployed API

Replace `localhost:3000` with your Vercel URL:

```bash
# Health check
curl https://your-project-name.vercel.app/health

# Record scan
curl -X POST https://your-project-name.vercel.app/api/carbon/scan \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","category":"plastic","quantity":1}'

# Get summary
curl https://your-project-name.vercel.app/api/carbon/summary/user123

# Find nearest centers
curl -X POST https://your-project-name.vercel.app/api/location/nearest \
  -H "Content-Type: application/json" \
  -d '{"latitude":31.24,"longitude":75.64,"limit":5}'
```

---

## Step 7: Share with Frontend Developer

Give your frontend developer:

**Production API Base URL:**
```
https://your-project-name.vercel.app
```

**Endpoints:**
- `POST /api/carbon/scan`
- `GET /api/carbon/summary/:userId`
- `POST /api/location/nearest`
- `GET /health`

---

## Troubleshooting

### Issue: 500 Internal Server Error
- Check Vercel logs: Go to your project → "Deployments" → Click latest → "Functions" tab
- Verify MongoDB connection string is correct
- Make sure environment variables are set

### Issue: Cannot connect to database
- Check MongoDB Atlas IP whitelist: Add `0.0.0.0/0` to allow all IPs
- Verify connection string has correct password
- Check database user has read/write permissions

### Issue: 404 Not Found
- Check `vercel.json` is in root directory
- Verify all routes are defined correctly
- Redeploy: `vercel --prod`

---

## Update Deployment

When you make changes:

```bash
git add .
git commit -m "Update message"
git push origin main
```

Vercel will automatically redeploy!

Or manually:
```bash
vercel --prod
```

---

## Environment Variables Management

View environment variables:
```bash
vercel env ls
```

Add new variable:
```bash
vercel env add VARIABLE_NAME
```

Remove variable:
```bash
vercel env rm VARIABLE_NAME
```

---

## Custom Domain (Optional)

1. Go to Vercel dashboard → Your project → "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## Cost

- Vercel: **FREE** for hobby projects
- MongoDB Atlas: **FREE** tier (512MB storage)
- Total: **$0/month** 🎉

---

## Important Notes

1. **CORS**: Already configured with `cors()` middleware
2. **Environment Variables**: Never commit `.env` to GitHub
3. **Database**: Use MongoDB Atlas, not local MongoDB
4. **Logs**: Check Vercel dashboard for error logs
5. **Cold Starts**: First request may be slow (serverless)

---

## Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Database seeded with centers
- [ ] All endpoints tested
- [ ] Production URL shared with frontend team

---

🎉 Your API is now live and accessible worldwide!
