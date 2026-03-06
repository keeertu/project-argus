# Project Argus Backend - Deployment Guide

AI-Powered Rental Scam Detection System for Indian Cities

## Architecture

- **Backend**: FastAPI on AWS App Runner
- **Database**: DynamoDB (Pay-per-request)
- **AI**: Amazon Bedrock (Claude 3.5 Sonnet)
- **Region**: ap-south-1 (Mumbai)

## Prerequisites

1. AWS Account with access to:
   - AWS App Runner
   - Amazon Bedrock (Claude 3.5 Sonnet enabled)
   - DynamoDB
   - IAM

2. AWS CLI configured:
   ```bash
   aws configure
   ```

3. GitHub account

## Deployment Steps

### Step 1: Setup AWS Resources

Run the setup script to create DynamoDB table:

```bash
cd project-argus-backend
pip install boto3 python-dotenv
python setup_aws.py
```

This creates the `argus-submissions` table with:
- Partition key: `listing_id` (String)
- Billing mode: PAY_PER_REQUEST (free tier friendly)

### Step 2: Push Backend to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Project Argus Backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/project-argus-backend.git
git push -u origin main
```

### Step 3: Create AWS App Runner Service

1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner)
2. Click "Create service"
3. **Source**:
   - Repository type: Source code repository
   - Connect to GitHub
   - Select your repository: `project-argus-backend`
   - Branch: `main`
   - Deployment trigger: Automatic

4. **Build settings**:
   - Configuration file: Use configuration file (apprunner.yaml)
   
5. **Service settings**:
   - Service name: `project-argus-api`
   - CPU: 0.5 vCPU
   - Memory: 1 GB
   - Port: 8080

6. **Environment variables** (Add these):
   ```
   AWS_REGION=ap-south-1
   AWS_ACCESS_KEY_ID=<your-access-key>
   AWS_SECRET_ACCESS_KEY=<your-secret-key>
   ```

7. **IAM Role**: Create new role with:
   - DynamoDB access (PutItem, GetItem, Scan)
   - Bedrock access (InvokeModel)

8. Click "Create & deploy"

### Step 4: Get App Runner URL

After deployment completes (5-10 minutes):
1. Copy the App Runner service URL (e.g., `https://xxxxx.ap-south-1.awsapprunner.com`)
2. Test the health endpoint: `https://YOUR_URL/`
3. Check API docs: `https://YOUR_URL/docs`

### Step 5: Configure IAM Permissions

Ensure the App Runner IAM role has these policies:

**DynamoDB Policy**:
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
    }
  ]
}
```

**Bedrock Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
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

## Testing the API

### Health Check
```bash
curl https://YOUR_APP_RUNNER_URL/
```

Expected response:
```json
{
  "status": "ok",
  "service": "Project Argus"
}
```

### Analyze Listing
```bash
curl -X POST "https://YOUR_APP_RUNNER_URL/analyze" \
  -F "title=2BHK in Koramangala" \
  -F "description=Nice flat available" \
  -F "price=25000" \
  -F "locality=Koramangala" \
  -F "city=Bangalore" \
  -F "property_type=2BHK"
```

## Monitoring

- **App Runner Logs**: CloudWatch Logs
- **DynamoDB Metrics**: CloudWatch Metrics
- **Bedrock Usage**: AWS Cost Explorer

## Cost Estimation (Free Tier)

- **App Runner**: $0.007/vCPU-hour + $0.0008/GB-hour
  - ~$5-10/month for low traffic
- **DynamoDB**: Pay-per-request
  - First 25 GB storage free
  - First 2.5M reads/writes free per month
- **Bedrock**: Pay-per-token
  - ~$0.003 per 1K input tokens
  - ~$0.015 per 1K output tokens

## Troubleshooting

### Issue: Bedrock Access Denied
**Solution**: Enable Claude 3.5 Sonnet in Bedrock console (Model access)

### Issue: DynamoDB Access Denied
**Solution**: Add DynamoDB permissions to App Runner IAM role

### Issue: CORS Errors
**Solution**: CORS is configured for all origins in main.py

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| AWS_REGION | AWS region | ap-south-1 |
| AWS_ACCESS_KEY_ID | AWS access key | AKIA... |
| AWS_SECRET_ACCESS_KEY | AWS secret key | ... |

## Support

For issues or questions:
- Check CloudWatch logs in App Runner console
- Review DynamoDB table in AWS console
- Verify Bedrock model access

## Security Notes

- Never commit AWS credentials to Git
- Use IAM roles instead of access keys when possible
- Enable CloudTrail for audit logging
- Use AWS Secrets Manager for production deployments
