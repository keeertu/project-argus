# 🛡️ Project Argus

**AI-Powered Rental Scam Detection for Indian Housing Platforms**

> Protecting renters from fraud through multi-signal AI verification in under 10 seconds.

---

## The Problem

Every year, thousands of students, migrants, and working professionals in Indian cities lose money to rental scams. Fraudsters post fake listings with stolen images and unrealistic prices, demand advance payments, and disappear. Traditional verification is manual, slow, and ineffective at scale.

**The Impact:**
- Students lose ₹50,000+ in advance payments to fake brokers
- Migrants waste time and money on non-existent properties
- Families face housing instability due to scams
- Trust erodes in digital rental platforms

Renters lack tools to verify listings before making financial commitments, leaving them vulnerable to sophisticated fraud schemes.

---

## Our Solution

Project Argus is an AI-powered fraud detection platform that analyzes rental listings in real-time, providing renters with actionable risk assessments before they engage with potentially fraudulent properties.

**How It Works:**
1. User submits rental listing URL from 99acres, Housing.com, NoBroker, or MagicBricks
2. System extracts listing data (price, images, description, contact info)
3. Four AI detection engines analyze fraud indicators in parallel
4. Machine learning model generates comprehensive risk score (0-100)
5. AI provides detailed explanations of detected fraud signals
6. User receives clear recommendations on how to proceed safely

---

## Example Scam Detection

**Listing Details:**
- **Price**: ₹12,000/month
- **Market Median**: ₹25,000/month
- **Location**: Koramangala, Bangalore

**Detected Signals:**
- ⚠️ Price anomaly (-52% below market)
- ⚠️ Urgency language detected ("urgent", "token required")
- ⚠️ Image reused across 3 other listings
- ⚠️ Broker posted 47 listings with same phone number

**Final Risk Score: 85 / 100 (High Scam Risk)**

**Recommendation:**
> Do not send any advance payment. Verify property exists in person before any payment. Video call the landlord and ask them to show the property live. Report this listing if confirmed scam.

---

## Key Features

### 🔍 Price Anomaly Detection
Compares listing prices against regional market benchmarks using IsolationForest ML. Detects unrealistically low prices that indicate scam bait tactics.

### 🖼️ Image Similarity Detection
Identifies reused or stolen images across multiple listings using computer vision. Scammers often copy images from legitimate properties.

### 📝 Scam Language Detection
Analyzes descriptions for high-pressure urgency tactics and suspicious keywords using AWS Bedrock (Claude 3.5).

### 📞 Broker Behavior Pattern Detection
Tracks phone number reuse across listings to identify mass-listing fraud operations.

### 🎯 Explainable AI Risk Scoring
Multi-signal fraud scoring combines all detection engines into a single, normalized risk score with clear classification and human-readable explanations.

### ⚡ Real-Time Verification
Complete analysis in under 10 seconds through parallel AI engine execution and serverless infrastructure.

---

## System Architecture

```
User → React Frontend → FastAPI Backend → AI Detection Engines → Risk Scoring → Dashboard
                                              ├─ Price Anomaly (IsolationForest)
                                              ├─ Image Similarity (AWS Bedrock)
                                              ├─ Scam Language (NLP + Claude)
                                              └─ Broker Patterns (Historical DB)
```

**Architecture Highlights:**
- Serverless AWS Lambda for auto-scaling compute
- Parallel processing: All detection engines run simultaneously
- Explainable AI: OpenRouter LLM generates forensic explanations
- Fast: Sub-10-second analysis through optimized pipeline

---

## Technology Stack

**Frontend:**
- React + Vite + Tailwind CSS
- GSAP + Framer Motion (animations)

**Backend:**
- Python 3.11 + FastAPI
- Uvicorn (ASGI server)

**AI/ML:**
- IsolationForest (anomaly detection)
- NLP analysis (scam language detection)
- AWS Bedrock (Claude 3.5 for text/image analysis)
- OpenRouter (Claude 3.5 Haiku for explanations)

**Cloud:**
- AWS Lambda (serverless compute)
- DynamoDB (NoSQL database)
- S3 (image storage)
- CloudFront (CDN)

---

## Demo

🎥 **Live Prototype**: https://main.d1js1gkkukvmm8.amplifyapp.com/

📹 **Demo Video**: https://drive.google.com/file/d/1n6av-PQ1e98rJhaIsJ-TnesNo-RkW7ff/view

💻 **GitHub**: https://github.com/keeertu/project-argus

**Try These Test Cases:**
- High Risk Listing: Price 52% below market + urgency language + broker has 47 listings
- Suspicious Listing: Moderate price deviation + some urgency keywords
- Low Risk Listing: Market-rate pricing + professional description

---

## Personal Story

Project Argus was created after observing how frequently renters in Indian cities fall victim to fake listings demanding advance payments. Students and migrants moving to new cities are especially vulnerable—they're unfamiliar with local market rates, under time pressure, and often make decisions remotely.

I witnessed friends lose ₹50,000+ to scammers who disappeared after receiving "token amounts." The goal of Argus is to provide a fast AI verification layer that helps renters identify scams before financial loss occurs. By making AI-powered scam detection accessible, transparent, and free, we can level the playing field and restore trust in India's digital housing marketplace.

— Keerat Khanuja

---

## Future Vision

### Phase 1: Enhanced Detection
- Custom deep learning models for image analysis
- Advanced NLP using transformer models
- Historical fraud pattern database
- Broker reputation scoring system

### Phase 2: Platform Expansion
- Browser extension for one-click verification
- Mobile apps (iOS & Android)
- WhatsApp bot integration
- Support for additional rental platforms

### Phase 3: Community Features
- User-reported scam database
- Community verification system
- Broker reviews and ratings
- Verified landlord badges

### Phase 4: Enterprise Integration
- API for rental platforms to integrate Argus
- White-label solutions for property portals
- Real-time fraud monitoring dashboards

---

## Documentation

- [Architecture](docs/architecture.md) - Technical architecture and AI pipeline
- [Product](docs/product.md) - Product design and requirements

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+

### Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to use the application.

---

## Repository Structure

```
project-argus/
├── backend/                 # FastAPI service
│   ├── ai_layer/           # 5-stage ML pipeline
│   ├── services/           # Detection engines
│   └── routers/            # API endpoints
├── frontend/               # React dashboard
│   └── src/components/     # UI components
├── docs/                   # Documentation
│   ├── architecture.md     # Technical architecture
│   └── product.md          # Product design
└── README.md              # This file
```

---

## Impact

**Target Metrics (Year 1):**
- Protect 100,000+ renters
- Prevent ₹50 crore in fraud losses
- Cover 10+ major Indian cities
- Partner with 2+ rental platforms

---

## Team

**Keerat Khanuja**

**Mohammad Ayaan**

**Utsav Vardhana**

**Rohit Nema**


---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Built for AI for Bharat Hackathon | Inspired by real stories of rental fraud victims | Powered by open-source AI/ML technologies

---

<div align="center">

**🛡️ Protecting India's Renters Through AI**

[Live Demo](https://main.d1js1gkkukvmm8.amplifyapp.com/) • [Documentation](docs/architecture.md) • [Report Issue](https://github.com/keeertu/project-argus/issues)

</div>
