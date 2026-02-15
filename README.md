# Project Argus

**AI-Powered Rental Scam Detection for Indian Cities**

---

## The Problem

When my family was house-hunting during a relocation, we found what looked like the perfect rental—great photos, reasonable price, ideal location. Something felt off. My dad decided to verify the address on Google Maps, virtually walking through the neighborhood. He stopped mid-search. "Beta, we're not taking a house there," he said. The area had a reputation the listing never mentioned.

We later discovered the listing was fraudulent: stolen photos, fake address, vanished broker. If we hadn't verified, we'd have lost ₹20,000 in advance payment.

We got lucky. **Most people don't.**

Every year, over 15 million Indians relocate to metros for education and work. An estimated **₹500+ crores is lost to rental fraud** across major cities. Students, migrants, and first-time renters—India's most vulnerable urban population—are the primary targets. By the time they realize it's a scam, their money is gone.

**The gap:** India's rental platforms have no AI-powered trust verification layer. Users rely on gut feeling. Scammers are professionals.

---

## Our Solution

**Project Argus** is an AI-powered system that analyzes rental listings in real-time to detect fraud before users make contact or payments.

**How it works:**
```
User finds listing → Pastes URL into Argus → AI analyzes in <10 seconds → 
Risk score + warnings displayed → User makes informed decision
```

### Multi-Signal AI Detection

Argus runs four parallel analysis engines:

1. **Price Anomaly Detection** - Flags listings priced 30-50% below market rates using statistical analysis
2. **Image Similarity Analysis** - Detects stolen or reused property photos using AWS Rekognition
3. **Text Pattern Recognition** - Identifies scam language and urgency tactics using AWS Comprehend
4. **Behavioral Pattern Detection** - Tracks broker spam patterns across platforms

All signals combine into a single risk score (0-100) with clear explanations: **Likely Genuine**, **Suspicious**, or **High Scam Risk**.

### Why Multi-Signal?

Scammers might fake one thing (good photos), but they can't fake everything (market-rate pricing + unique images + professional descriptions + verified broker history). Our innovation is in the fusion.

---

## Built on AWS

Project Argus is cloud-native and serverless, leveraging AWS's AI capabilities:

- **Amazon Rekognition** - Image analysis and similarity detection
- **Amazon Comprehend** - NLP for text pattern analysis
- **AWS Lambda** - Serverless compute for analysis engines
- **Amazon DynamoDB** - Fast NoSQL storage for listings and results
- **Amazon S3 + CloudFront** - Image storage and content delivery
- **Amazon API Gateway** - RESTful API endpoints

**Architecture:** Parallel Lambda functions process each detection engine simultaneously, completing analysis in under 10 seconds. Fully scalable from 10 to 10,000 users without infrastructure changes.

**Cost-effective:** Serverless pay-per-use model keeps MVP costs under $50/month, scaling linearly with usage.

---

## Impact & Scale

**Target Users:**
- 15+ million renters annually in Indian metros
- Primary: Students (5M+), young professionals (7M+), migrants (3M+)

**Potential Impact:**
- Prevent ₹500+ crores in annual fraud losses
- Protect vulnerable populations from exploitation
- Restore trust in digital rental markets

**Scalability:**
- Start: 6 cities (Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai)
- Expand: 20+ tier-1 and tier-2 cities
- B2B: API for rental platforms (99acres, Housing.com, NoBroker)

---

## India-Specific Design

- Trained on Indian rental market patterns (₹ pricing, locality names)
- Understands Hinglish text patterns common in listings
- Recognizes India-specific scam tactics (token amount demands, broker spam)
- Mobile-first UI for smartphone users with limited tech literacy

---

## Roadmap

**Phase 1 (Months 1-3):** MVP with core detection engines, launch in 2 cities  
**Phase 2 (Months 4-6):** Expand to 6 cities, add behavioral detection  
**Phase 3 (Months 7-12):** Browser extension, B2B API, regional language support

**Future Vision:** Mobile apps, real-time platform monitoring, verified broker network, pan-India coverage

---

## Project Documentation

This repository contains our proposal for the **AI for Bharat Hackathon** (AWS sponsored):

- **[requirements.md](requirements.md)** - Detailed problem statement, solution overview, features, and impact analysis
- **[design.md](design.md)** - System architecture, AWS integration, AI methodology, and implementation plan
- **README.md** - This overview document

---

## Why Project Argus?

**Real Indian Problem:** Rental fraud affects millions annually in India's rapidly urbanizing cities where trust infrastructure lags behind digital adoption.

**Practical AI:** We're combining proven techniques (computer vision, NLP, statistical analysis) in a novel multi-signal approach, not reinventing ML algorithms.

**AWS-Native:** Built on AWS services from day one—Rekognition, Comprehend, Lambda, DynamoDB. Scalable, cost-effective, production-ready.

**Clear Impact:** ₹500+ crores in fraud losses prevented. 15M+ potential users. Measurable success: families protected, money saved.

**Execution Ready:** Focused MVP with validated problem, proven tech stack, and clear 12-month roadmap.

---

## Hackathon Context

**Built for:** AI for Bharat Hackathon (AWS sponsored)  
**Category:** Consumer Protection / AI for Social Impact  
**Problem Domain:** Rental fraud detection in Indian cities

**Judging Criteria Alignment:**
- ✓ Technical Excellence - Serverless AWS architecture, multi-signal AI
- ✓ Innovation & Creativity - Novel multi-signal fusion approach for Indian rental market
- ✓ Impact & Relevance - Protects 15M+ vulnerable renters, prevents ₹500+ crores in fraud
- ✓ Completeness & Presentation - Clear documentation, realistic roadmap, validated problem

---


## Team
Keerat Khanuja
Rohit Nema
Utsava Vardhana
Mohammad Ayaan

## License

This project is developed for educational and social impact purposes as part of the AI for Bharat Hackathon.

---

**Project Argus: Protecting India's renters with AI-powered fraud detection.**
