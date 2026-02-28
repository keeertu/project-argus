# Project Argus - Complete Deployment Guide

AI-Powered Rental Scam Detection for Indian Cities

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   AWS Amplify   │  Frontend (React + Vite)
│   (Frontend)    │  https://xxxxx.amplifyapp.com
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│  AWS App Runner │  Backend (FastAPI)
│   (Backend)     │  https://xxxxx.awsapprunner.com
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    │         │          │
┌───▼───┐ ┌──▼──────┐ ┌─▼────────┐
│DynamoDB│ │ Bedrock │ │   IAM    │
│ Table  │ │ Claude  │ │  Roles   │
└────────┘ └─────────┘ └──────────┘
```

## 📋 Prerequisites

- AWS Account with billing enabled
- GitHub account
- AWS CLI installed and configured
- Python 3.11+
- Node.js 18+

## 🚀 Deployment Steps

### Step 1: Setup AWS Resources

Create DynamoDB table for storing analysis results:

```bash
cd project-argus-backend
pip install boto3 python-dotenv
python setup_aws.py
```

**What this does:**
- Creates `argus-submissions` DynamoDB table
- Partition key: `listing_id` (String)
- Billing mode: PAY_PER_REQUEST (free tier friendly)

**Expected output:**
```
✓ Connected to AWS region: ap-south-1
✓ Table 'argus-submissions' created successfully!
✓ Table 'argus-submissions' is now ACTIVE and ready to use!
```

### Step 2: Enable Amazon Bedrock Access

1. Go to [Amazon Bedrock Console](https://console.aws.amazon.com/bedrock)
2. Navigate to "Model access" in the left sidebar
3. Click "Manage model access"
4. Enable: **Anthropic Claude 3.5 Sonnet v2**
5. Click "Save changes"
6. Wait for status to show "Access granted" (takes 1-2 minutes)

### Step 3: Push Backend to GitHub

```bash
cd project-argus-backend
git init
git add .
git commit -m "Initial commit - Project Argus Backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/project-argus-backend.git
git push -u origin main
```

### Step 4: Deploy Backend to AWS App Runner

1. **Go to AWS App Runner Console**
   - Region: **ap-south-1 (Mumbai)**
   - Click "Create service"

2. **Source Configuration**
   - Repository type: **Source code repository**
   - Provider: **GitHub**
   - Click "Add new" to connect GitHub
   - Authorize AWS Connector for GitHub
   - Select repository: `project-argus-backend`
   - Branch: `main`
   - Deployment trigger: **Automatic**

3. **Build Configuration**
   - Configuration source: **Use a configuration file**
   - Configuration file: `apprunner.yaml`

4. **Service Configuration**
   - Service name: `project-argus-api`
   - Virtual CPU: **0.5 vCPU**
   - Memory: **1 GB**
   - Port: **8080**

5. **Environment Variables**
   Click "Add environment variable" for each:
   ```
   AWS_REGION = ap-south-1
   ```
   
   **Note**: Don't add AWS credentials here. We'll use IAM role instead.

6. **Security - IAM Role**
   - Create new service role
   - Role name: `AppRunnerArgusRole`
   - After creation, we'll add policies

7. **Review and Create**
   - Review all settings
   - Click "Create & deploy"
   - Wait 5-10 minutes for deployment

8. **Configure IAM Permissions**
   
   After service is created:
   
   a. Go to IAM Console → Roles
   b. Find `AppRunnerArgusRole`
   c. Click "Add permissions" → "Create inline policy"
   d. Use JSON editor and paste:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:PutItem",
           "dynamodb:GetItem",
           "dynamodb:Scan",
           "dynamodb:Query"
         ],
         "Resource": "arn:aws:dynamodb:ap-south-1:*:table/argus-submissions"
       },
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel"
         ],
         "Resource": "arn:aws:bedrock:ap-south-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
       }
     ]
   }
   ```
   
   e. Name: `ArgusBackendPolicy`
   f. Click "Create policy"

9. **Get Backend URL**
   - Copy the App Runner service URL
   - Example: `https://abc123.ap-south-1.awsapprunner.com`
   - Test it: Visit `https://YOUR_URL/` (should return `{"status":"ok"}`)
   - Check API docs: `https://YOUR_URL/docs`

### Step 5: Push Frontend to GitHub

```bash
cd project-argus-frontend
git init
git add .
git commit -m "Initial commit - Project Argus Frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/project-argus-frontend.git
git push -u origin main
```

### Step 6: Deploy Frontend to AWS Amplify

1. **Go to AWS Amplify Console**
   - Click "New app" → "Host web app"

2. **Connect Repository**
   - Select **GitHub**
   - Click "Authorize AWS Amplify"
   - Select repository: `project-argus-frontend`
   - Branch: `main`
   - Click "Next"

3. **Build Settings**
   - App name: `project-argus`
   - Amplify will auto-detect `amplify.yml`
   - Verify configuration is correct

4. **Environment Variables**
   - Click "Advanced settings"
   - Add variable:
     ```
     Key: VITE_API_URL
     Value: https://YOUR_APP_RUNNER_URL
     ```
   - **Important**: Replace with your actual App Runner URL (no trailing slash)

5. **Review and Deploy**
   - Click "Save and deploy"
   - Wait 3-5 minutes for build

6. **Get Frontend URL**
   - Copy the Amplify app URL
   - Example: `https://main.d1234abcd.amplifyapp.com`

### Step 7: Test the Application

1. **Open Frontend URL**
   - Visit your Amplify URL

2. **Try Demo Listings**
   - Click "🚨 Try a Scam Listing"
   - Click "Analyze Listing"
   - Wait 5-10 seconds for AI analysis
   - Verify results appear with risk score

3. **Test Custom Listing**
   - Fill in form with your own data
   - Upload an image (optional)
   - Submit and verify analysis

### Step 8: Share Your Demo! 🎉

Your Project Argus is now live!

- **Frontend**: `https://YOUR_AMPLIFY_URL`
- **Backend API**: `https://YOUR_APP_RUNNER_URL`
- **API Docs**: `https://YOUR_APP_RUNNER_URL/docs`

## 📊 Monitoring & Logs

### Backend Logs (App Runner)
1. Go to App Runner Console
2. Select your service
3. Click "Logs" tab
4. View CloudWatch logs

### Frontend Logs (Amplify)
1. Go to Amplify Console
2. Select your app
3. Click "Build history"
4. View build logs

### DynamoDB Data
1. Go to DynamoDB Console
2. Select `argus-submissions` table
3. Click "Explore table items"
4. View stored analyses

## 💰 Cost Estimation

### Free Tier (First 12 months)
- **App Runner**: First 2M requests free
- **DynamoDB**: 25 GB storage + 2.5M requests/month free
- **Amplify**: 1000 build minutes + 15 GB served/month free
- **Bedrock**: Pay-per-use (no free tier)

### Expected Monthly Costs (Low Traffic)
- **App Runner**: $5-10/month
- **DynamoDB**: $0-2/month (within free tier)
- **Amplify**: $0-1/month (within free tier)
- **Bedrock**: $2-5/month (~100 analyses)

**Total**: ~$7-18/month for demo usage

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Health check failing
```bash
# Test backend directly
curl https://YOUR_APP_RUNNER_URL/
```
**Solution**: Check App Runner logs in CloudWatch

**Problem**: Bedrock access denied
**Solution**: 
1. Enable Claude 3.5 Sonnet in Bedrock console
2. Verify IAM role has bedrock:InvokeModel permission

**Problem**: DynamoDB access denied
**Solution**: Verify IAM role has DynamoDB permissions

### Frontend Issues

**Problem**: API calls failing
**Solution**: 
1. Check VITE_API_URL in Amplify environment variables
2. Verify backend is running
3. Check browser console for CORS errors

**Problem**: Build failing
**Solution**:
1. Check Amplify build logs
2. Test locally: `npm run build`
3. Verify all dependencies in package.json

## 🔄 Updating the Application

### Update Backend
```bash
cd project-argus-backend
git add .
git commit -m "Update backend"
git push origin main
```
App Runner will automatically redeploy.

### Update Frontend
```bash
cd project-argus-frontend
git add .
git commit -m "Update frontend"
git push origin main
```
Amplify will automatically rebuild and deploy.

## 🔒 Security Best Practices

1. **Never commit credentials**
   - Use IAM roles instead of access keys
   - Keep `.env` files in `.gitignore`

2. **Enable CloudTrail**
   - Track API calls
   - Monitor for suspicious activity

3. **Use AWS Secrets Manager** (Production)
   - Store sensitive configuration
   - Rotate credentials regularly

4. **Enable WAF** (Optional)
   - Protect against common attacks
   - Rate limiting

## 📚 Additional Resources

- [AWS App Runner Documentation](https://docs.aws.amazon.com/apprunner/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

## 🆘 Support

If you encounter issues:
1. Check CloudWatch logs
2. Verify IAM permissions
3. Test API endpoints directly
4. Review environment variables

## 🎯 Next Steps

- Add custom domain to Amplify
- Set up CloudWatch alarms
- Enable AWS WAF for security
- Add more Indian cities to price benchmarks
- Implement user authentication
- Add analytics dashboard

---

**Congratulations!** 🎉 You've successfully deployed Project Argus!
