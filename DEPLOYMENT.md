# Project Argus — Deployment Guide

AI-Powered Rental Scam Detection for Indian Cities

## Architecture Overview

```
┌─────────────────┐
│   AWS Amplify   │  Frontend (React + Vite + Tailwind)
│   (Frontend)    │  https://xxxxx.amplifyapp.com
└────────┬────────┘
         │ HTTPS
┌────────▼────────┐
│  AWS App Runner │  Backend (FastAPI + Python 3.11)
│   (Backend)     │  https://xxxxx.awsapprunner.com
└────────┬────────┘
    ┌────┴────┬──────────────┐
    │         │              │
┌───▼───┐ ┌──▼──────────┐ ┌─▼──────────┐
│DynamoDB│ │ OpenRouter   │ │  Bedrock   │
│ Table  │ │ (Claude LLM) │ │ (Standby)  │
│us-east │ └─────────────┘ └────────────┘
└────────┘
```

## Prerequisites

- AWS Account with billing enabled
- GitHub account (repo: `keeertu/project-argus`)
- AWS CLI installed and configured
- Python 3.11+
- Node.js 18+

## Environment Variables

Create `backend/.env` (never commit this file):

```env
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
DYNAMODB_TABLE=argus-submissions
BEDROCK_MODEL_ID=us.anthropic.claude-3-5-sonnet-20241022-v2:0
OPENROUTER_API_KEY=<your-openrouter-key>
```

> **Note**: `.env` is in `.gitignore` and must NEVER be committed to GitHub.

---

## Step-by-Step Deployment

### Step 1: Create DynamoDB Table

```bash
cd backend
pip install -r requirements.txt
python setup_aws.py
```

This creates the `argus-submissions` table in `us-east-1` with:
- Partition key: `listing_id` (String)
- Billing: PAY_PER_REQUEST (free tier friendly)

### Step 2: Deploy Backend to AWS App Runner

1. **Go to AWS App Runner Console** (Region: `us-east-1`)
   - Click "Create service"

2. **Source Configuration**
   - Repository type: Source code repository
   - Provider: GitHub
   - Repository: `keeertu/project-argus`
   - Branch: `main`
   - Source directory: `/backend`
   - Deployment trigger: Automatic

3. **Build Configuration**
   - Runtime: Python 3.11
   - Build command: `pip install -r requirements.txt`
   - Start command: `python -m uvicorn main:app --host 0.0.0.0 --port 8080`
   - Port: `8080`

4. **Service Settings**
   - Service name: `project-argus-api`
   - CPU: 0.5 vCPU
   - Memory: 1 GB

5. **Environment Variables** (set in App Runner console):
   ```
   AWS_REGION=us-east-1
   DYNAMODB_TABLE=argus-submissions
   OPENROUTER_API_KEY=<your-key>
   BEDROCK_MODEL_ID=us.anthropic.claude-3-5-sonnet-20241022-v2:0
   ```

6. **IAM Role** — Create `AppRunnerArgusRole` with this inline policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Scan", "dynamodb:Query", "dynamodb:DeleteItem"],
         "Resource": "arn:aws:dynamodb:us-east-1:*:table/argus-submissions"
       },
       {
         "Effect": "Allow",
         "Action": ["bedrock:InvokeModel"],
         "Resource": "arn:aws:bedrock:us-east-1::foundation-model/*"
       }
     ]
   }
   ```

7. Click **Create & deploy** — wait 5-10 minutes.

8. **Verify**: `https://YOUR_URL/docs` should show the Swagger API docs.

### Step 3: Deploy Frontend to AWS Amplify

1. Go to **AWS Amplify Console** → "New app" → "Host web app"
2. Select **GitHub** → authorize → select `keeertu/project-argus`
3. Branch: `main`, source directory: `/frontend`
4. **Environment variables**:
   ```
   VITE_API_URL=https://YOUR_APP_RUNNER_URL
   ```
5. Click **Save and deploy** — wait 3-5 minutes.

### Step 4: Verify Deployment

1. Open the Amplify URL
2. Click "Analyze a Listing"
3. Paste a 99acres URL and submit
4. Confirm risk score and explanation are displayed

---

## AI Provider Configuration

### OpenRouter (Primary — Currently Active)
- Powers LLM explanations via `qwen/qwen3-vl-235b-a22b-thinking`
- Set `OPENROUTER_API_KEY` in `.env`
- 30s timeout + 2 retries with exponential backoff
- Falls back to rule-based explanation if unavailable

### AWS Bedrock (Standby)
- Ready for activation when inference profile is configured
- Model: `us.anthropic.claude-3-5-sonnet-20241022-v2:0`
- Used by `image_engine.py` and `text_engine.py` for Bedrock-powered analysis

---

## Monitoring & Logs

| Service    | Where to check                              |
|------------|---------------------------------------------|
| Backend    | App Runner → Logs → CloudWatch              |
| Frontend   | Amplify → Build history                     |
| DynamoDB   | DynamoDB Console → `argus-submissions` → Explore items |
| AI calls   | Backend stdout/logs                         |

## Cost Estimation (Low Traffic)

| Service     | Monthly Cost        |
|-------------|---------------------|
| App Runner  | $5–10               |
| DynamoDB    | $0–2 (free tier)    |
| Amplify     | $0–1 (free tier)    |
| OpenRouter  | $2–5 (~100 analyses)|
| **Total**   | **~$7–18/month**    |

---

## Troubleshooting

| Problem                    | Solution                                              |
|----------------------------|-------------------------------------------------------|
| Health check failing       | Check App Runner CloudWatch logs                      |
| Bedrock access denied      | Enable model access in Bedrock console + IAM policy   |
| DynamoDB access denied     | Verify IAM role has DynamoDB permissions               |
| Frontend API calls failing | Check `VITE_API_URL` in Amplify env vars + CORS        |
| OpenRouter timeout         | Check API key validity, retry logic handles transient errors |

---

## Updating the Application

```bash
# All changes are in one repo
git add .
git commit -m "your message"
git push origin main
```

App Runner and Amplify both auto-deploy on push to `main`.
