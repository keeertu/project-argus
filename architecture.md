# System Architecture: Project Argus

**Technical Architecture for AI-Powered Rental Scam Detection**

---

## System Overview

Project Argus is a production-grade AI system that detects rental scams on Indian housing platforms (99acres, Housing.com, NoBroker, MagicBricks). The system analyzes listings through a multi-signal AI pipeline combining price anomaly detection, text analysis, image verification, and broker behavior pattern recognition to generate explainable risk assessments in under 10 seconds.

**Core Principles:**
- **Multi-Signal Detection**: Aggregates signals from price, text, images, and broker patterns
- **Explainability**: Every risk score includes human-readable forensic reasoning via LLM
- **Production Reliability**: Graceful degradation ensures operation even when individual engines fail

---

## Architecture Flow

```
User → React Frontend → FastAPI Backend → AI Detection Engines → Risk Scoring → Dashboard
```

**Pipeline:**

1. User pastes rental listing URL into React frontend
2. FastAPI backend receives request and initiates analysis
3. Intelligent scraper extracts listing data (price, description, images, contact)
4. Four detection engines run in parallel:
   - Price Anomaly Engine (statistical analysis + IsolationForest)
   - Text Analysis Engine (NLP + AWS Bedrock Claude)
   - Image Verification Engine (computer vision + AWS Bedrock)
   - Broker Pattern Analyzer (historical database queries)
5. Weighted scoring engine combines signals into unified risk score (0-100)
6. OpenRouter API generates human-readable forensic explanation
7. Frontend dashboard displays risk score, signal breakdown, and recommendations

---

## Backend Architecture

### Service Structure

```
backend/
├── main.py                    # FastAPI application
├── routers/                   # API endpoints
│   ├── analyze.py            # POST /analyze, POST /analyze/url
│   └── submissions.py        # GET /submissions
├── services/                  # Business logic
│   ├── argus_service.py      # Pipeline orchestrator
│   ├── price_engine.py       # Price anomaly detection
│   ├── text_engine.py        # NLP scam detection
│   ├── image_engine.py       # Image verification
│   └── risk_scorer.py        # Multi-signal aggregation
└── ai_layer/                  # ML pipeline
    ├── pipeline.py           # ArgusAIPipeline
    ├── scraper/              # Listing extraction
    ├── preprocessing/        # Feature engineering
    ├── ml_model/             # IsolationForest
    ├── predictor/            # Inference engine
    └── llm_explainer/        # LLM explanations
```

### API Endpoints

**POST /analyze**
- Accepts: Multipart form data (title, description, price, locality, city, property_type, images)
- Returns: Risk analysis with score, verdict, recommendations

**POST /analyze/url**
- Accepts: Rental listing URL
- Scrapes and extracts listing data
- Falls back to synthetic data if blocked
- Returns: Same risk analysis

**GET /submissions**
- Returns: Historical analysis results from DynamoDB

---

## AI Detection Engines

### 1. Price Anomaly Detection

**Technology**: Statistical analysis + IsolationForest ML

**Process**:
1. Compares listing price against regional market benchmarks
2. Normalizes to price-per-square-foot when available
3. Calculates Z-score: `(price - median) / std_dev`
4. Flags anomalies where Z-score < -1.5

**Data**: Curated benchmark database covering 10+ Indian cities, 100+ localities

**Thresholds**:
- Z-score < -1.5: High Risk (85-100)
- Z-score < -0.5: Suspicious (50-70)
- Z-score ≤ 0.5: Likely Genuine (10-30)

---

### 2. Text Analysis (NLP)

**Technology**: AWS Bedrock (Claude 3.5 Haiku) + rule-based fallback

**Detection Patterns**:
- Urgency tactics: "urgent", "hurry", "limited time"
- Payment pressure: "advance", "token", "booking amount"
- Suspicious contact: "WhatsApp only"
- Hinglish patterns: "jaldi karo", "sirf aaj"

**Cross-Signal Reasoning**: LLM receives both text and price analysis for compound fraud detection.

---

### 3. Image Verification

**Technology**: AWS Bedrock (Claude 3.5 Sonnet) with vision

**Detection**:
- Stock photo identification
- Watermark detection
- Non-Indian interior design
- Inconsistent lighting
- Generic lifestyle photos

---

### 4. Broker Behavior Pattern Analysis

**Technology**: Historical database queries + pattern matching

**Detection**:
- Phone number reuse across listings
- Mass-listing fraud (>50 listings per contact)
- Template usage (identical descriptions)
- User-reported scam database cross-reference

---

## Risk Scoring Engine

### Weighted Aggregation

```python
weights = {
    'price_anomaly': 0.40,
    'text_analysis': 0.40,
    'image_verification': 0.20
}

final_score = (
    weights['price_anomaly'] * price_score +
    weights['text_analysis'] * text_score +
    weights['image_verification'] * image_score
)
```

### Dynamic Weight Adjustment

- Images unavailable → Redistribute to price and text
- Location missing → Reduce price weight
- Contact unavailable → Zero out broker pattern

### Classification

- **Low Risk (0-30)**: Green
- **Suspicious (31-65)**: Yellow
- **High Scam Risk (66-100)**: Red

---

## Data Processing Pipeline

### Stage 1: Intelligent Scraping
- Detects platform from URL
- Uses Playwright for dynamic content
- Extracts: price, location, description, images, contact
- Falls back to synthetic data if blocked

### Stage 2: Feature Engineering
- Transforms raw listings into ML-ready features
- Computes: `price_vs_city_median`, `urgency_keyword_count`, `phone_reuse_count`
- Cleans data (removes price=0, empty descriptions)

### Stage 3: ML Model Training
- IsolationForest with 200 estimators
- Trained on 200+ legitimate listings
- Contamination rate: 10%
- Adaptive thresholds from score percentiles

### Stage 4: Inference
- Loads trained IsolationForest model
- Applies StandardScaler normalization
- Generates anomaly score
- Classifies risk level

### Stage 5: LLM Explanation
- Generates human-readable forensic explanations
- Supports: OpenRouter (primary), AWS Bedrock, OpenAI, Mock (fallback)
- Keeps explanation under 120 words

---

## AWS Architecture

### Compute
- **AWS Lambda**: Serverless compute, auto-scales 0-1000+ executions, ~$30/month MVP
- **API Gateway**: REST API management, rate limiting (100 req/min per IP)

### AI Services
- **AWS Bedrock**: Claude 3.5 Haiku (text), Claude 3.5 Sonnet (image)
- **OpenRouter**: Claude 3.5 Haiku for forensic explanations

### Storage
- **DynamoDB**: NoSQL database, on-demand pricing, <10ms latency
- **S3**: Temporary image storage, auto-delete after 24 hours

### Distribution
- **CloudFront**: CDN for frontend, global edge caching, HTTPS

---

## Scalability and Performance

### Performance Targets
- Analysis Time: <10 seconds (95th percentile)
- API Response: <200ms (excluding analysis)
- Database Queries: <10ms
- LLM Explanation: 2-4 seconds

### Scalability
- Concurrent Analyses: 1000+ simultaneous
- Daily Capacity: 100,000+ listings
- Auto-Scaling: Serverless architecture
- Cost: Linear scaling with usage

### Optimization
- Parallel Execution: All engines run simultaneously (4x faster)
- Lazy Loading: ML models cached after first use
- Benchmark Caching: Price data in memory
- Async/Await: Non-blocking I/O

---

## Security & Privacy

### Data Protection
- No PII storage (only listing metadata)
- Stateless analysis (each request independent)
- Image deletion after 24 hours
- HTTPS everywhere (TLS 1.2+)

### API Security
- CORS configuration (restricts origins)
- Rate limiting (prevents abuse)
- Input validation (Pydantic schemas)
- Graceful error handling

### AWS Security
- IAM roles (least-privilege access)
- Secrets Manager (API keys)
- Encryption at rest and in transit

---

## Failure Modes & Resilience

### Graceful Degradation
If any engine fails, system continues with remaining engines:
- Price fails → Use text + image
- Text fails → Use price + image
- Image fails → Use price + text

### Fallback Strategies
- Scraping blocked → Generate synthetic data
- LLM unavailable → Rule-based explanation
- AWS down → Demo mode with mock analysis
- Database unavailable → Skip storage, return results

---

## Technology Stack

**Frontend**: React 18, Vite, Tailwind CSS, GSAP, Framer Motion

**Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic

**AI/ML**: scikit-learn (IsolationForest), pandas, AWS Bedrock, OpenRouter

**Infrastructure**: AWS Lambda, API Gateway, DynamoDB, S3, CloudFront

---

## Deployment

### Frontend (AWS Amplify)
```bash
cd frontend
npm install && npm run build
# Deploy via GitHub integration
```

### Backend (AWS Lambda)
```bash
cd backend
pip install -r requirements.txt
# Deploy via AWS SAM or Serverless Framework
```

### Environment Variables
```bash
AWS_REGION=ap-south-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-haiku-20241022
OPENROUTER_API_KEY=<your-key>
DYNAMODB_TABLE=argus-submissions
```

---

## Monitoring

**CloudWatch**: API metrics, Lambda duration, DynamoDB performance

**Logging**: Structured JSON logs, error tracking, performance profiling

---

## Conclusion

Project Argus's architecture delivers production-grade performance, scalability, and reliability. The multi-signal AI pipeline provides robust fraud detection, while the explainability layer ensures user trust. The serverless infrastructure enables automatic scaling and cost efficiency, making the system viable from MVP to millions of users.
