# 🛡️ Project Argus

**AI-Powered Rental Scam Detection for Indian Cities**

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![AWS](https://img.shields.io/badge/AWS-DynamoDB%20|%20Bedrock%20|%20AppRunner-FF9900?logo=amazonaws)](https://aws.amazon.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-IsolationForest-F7931E?logo=scikitlearn)](https://scikit-learn.org)

---

## The Problem

Every year, **₹500 Crore** is lost to rental scams across Indian cities. 1 in 4 online rental listings are suspicious. Scammers use urgency tactics, fake images, and below-market pricing to trick renters into paying deposits for properties that don't exist.

## The Solution

Project Argus analyzes rental listings using a **5-stage AI pipeline** that combines machine learning anomaly detection with large language model explanations. Paste a 99acres listing URL and get a risk assessment in under 10 seconds.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     React Frontend                           │
│              (Vite + Tailwind + GSAP Animations)             │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼───────────────────────────────────────┐
│                    FastAPI Backend                           │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐   │
│  │ Stage 1  │→ │ Stage 2  │→ │ Stage 3  │→ │  Stage 4    │   │
│  │ Scraper  │  │ Feature  │  │ ML Model │  │ LLM Explain │   │
│  │Playwright│  │ Engineer │  │ Isolation│  │ OpenRouter  │   │
│  │ + BS4    │  │ Pandas   │  │ Forest   │  │ (Claude)    │   │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘   │
│                                                     │        │
│                                              ┌──────▼──────┐ │
│                                              │  Stage 5    │ │
│                                              │  DynamoDB   │ │
│                                              │  Storage    │ │
│                                              └─────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, GSAP, Lucide Icons |
| Backend | FastAPI, Python 3.11, Uvicorn |
| ML | scikit-learn (Isolation Forest), Pandas, NumPy |
| AI/LLM | OpenRouter (Qwen 235B), AWS Bedrock (Claude Sonnet) |
| Database | AWS DynamoDB |
| Scraping | Playwright, BeautifulSoup4, lxml |
| Deployment | AWS App Runner, AWS Amplify |

---

## How to Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/keeertu/project-argus.git
cd project-argus
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
playwright install chromium
```

### 3. Create environment file
Create `backend/.env`:
```env
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
DYNAMODB_TABLE=argus-submissions
BEDROCK_MODEL_ID=us.anthropic.claude-3-5-sonnet-20241022-v2:0
OPENROUTER_API_KEY=<your-openrouter-key>
```

### 4. Start the backend
```bash
python -m uvicorn main:app --port 8080
```
API docs: http://localhost:8080/docs

### 5. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```
App: http://localhost:3000

---

## AWS Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete step-by-step deployment instructions covering:
- DynamoDB table setup
- App Runner backend deployment
- Amplify frontend deployment
- IAM permissions configuration

---

## Demo

See [HACKATHON_DEMO.md](HACKATHON_DEMO.md) for demo script, expected outputs, and Q&A preparation.

### Test URLs

| URL | Expected Score | Expected Level |
|-----|---------------|----------------|
| [R88345030](https://www.99acres.com/4-bhk-bedroom-independent-house-villa-for-rent-in-dodsworth-layout-bangalore-east-6500-sq-ft-spid-R88345030) | 15 | Likely Genuine |
| [H89314277](https://www.99acres.com/3-bhk-bedroom-apartment-flat-for-rent-in-total-environment-pursuit-of-a-radical-rhapsody-hoodi-bangalore-east-4303-sq-ft-spid-H89314277) | 92 | High Risk |

---

## Project Structure

```
project-argus/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── routers/                 # API endpoints
│   │   ├── analyze.py           # /analyze/url, /analyze/
│   │   └── submissions.py       # /submissions/
│   ├── services/                # Business logic
│   │   ├── argus_service.py     # Pipeline orchestration + score normalization
│   │   ├── text_engine.py       # Bedrock text analysis
│   │   └── image_engine.py      # Bedrock image analysis
│   ├── ai_layer/                # 5-stage ML pipeline
│   │   ├── pipeline.py          # Pipeline orchestrator
│   │   ├── input/               # URL analysis + scraping
│   │   ├── preprocessing/       # Feature engineering
│   │   ├── ml_model/            # Isolation Forest
│   │   ├── predictor/           # Inference
│   │   └── llm_explainer/       # OpenRouter / Bedrock LLM
│   ├── data/                    # Price benchmarks
│   ├── setup_aws.py             # DynamoDB table creation
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main application
│   │   ├── api/argus.js         # API client
│   │   ├── components/          # React components
│   │   └── styles/              # Global CSS + Tailwind
│   └── package.json
├── .gitignore
├── DEPLOYMENT.md
├── HACKATHON_DEMO.md
├── CHECKLIST.md
└── README.md
```

---

## Team

| Name | Role |
|------|------|
| Keertan | Lead Developer |

---

## License

MIT License — See [LICENSE](LICENSE) for details.
