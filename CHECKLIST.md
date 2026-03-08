# Project Argus — Status Checklist

## What's Built & Working

### Backend (FastAPI + Python 3.11)
- [x] FastAPI server with CORS, OpenAPI docs
- [x] 5-stage AI pipeline (Scrape → Features → ML → LLM → Storage)
- [x] Playwright + BS4 web scraping with fallback
- [x] Feature engineering (price ratio, urgency keywords, image count, phone reuse)
- [x] Isolation Forest anomaly detection model (scikit-learn)
- [x] OpenRouter LLM integration (30s timeout, 2 retries)
- [x] Risk score normalization (0–100 integer scale)
- [x] DynamoDB persistence with Decimal conversion
- [x] URL-based listing analysis endpoint (`/analyze/url`)
- [x] Form-based listing analysis endpoint (`/analyze/`)
- [x] Submissions query endpoints (`/submissions/`)
- [x] Price benchmarks for 6 Indian cities, 40+ localities

### Frontend (React + Vite + Tailwind CSS)
- [x] Landing page with animated hero section
- [x] URL input form for listing analysis
- [x] Animated loading screen with pipeline steps
- [x] Risk gauge with color-coded scoring
- [x] Results page with signals breakdown
- [x] Dark mode / Light mode toggle
- [x] Responsive design (mobile + desktop)
- [x] GSAP animations
- [x] Glassmorphism UI design

### AWS Integration
- [x] DynamoDB table (`argus-submissions`) in `us-east-1`
- [x] Read/write/delete operations working
- [x] All boto3 clients use `os.getenv()` for credentials
- [x] `.env` in `.gitignore` (never committed)
- [x] Bedrock client configured (standby — needs inference profile)
- [x] App Runner deployment config ready
- [x] Amplify deployment config ready

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, GSAP |
| Backend | FastAPI, Python 3.11, Uvicorn |
| ML Model | scikit-learn (Isolation Forest) |
| AI / LLM | OpenRouter (primary), AWS Bedrock (standby) |
| Database | AWS DynamoDB |
| Scraping | Playwright, BeautifulSoup4, lxml |
| Data | Pandas, NumPy, Joblib |
| Hosting | AWS App Runner (backend), AWS Amplify (frontend) |

---

## AWS Services Integrated

| Service | Status | Purpose |
|---------|--------|---------|
| DynamoDB | ✅ Active | Analysis submission storage |
| App Runner | ✅ Ready | Backend hosting (Docker) |
| Amplify | ✅ Ready | Frontend hosting |
| Bedrock | ⚠️ Standby | Claude image/text analysis (needs inference profile) |
| IAM | ✅ Configured | Role-based access |

---

## Known Limitations

- 99acres blocks automated scraping → intelligent URL-based fallback active
- Bedrock Sonnet v2 requires cross-region inference profile in us-east-1
- OpenRouter LLM may time out under heavy load (mitigated with retry logic)

---

**Last Updated:** March 8, 2026
