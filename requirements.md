# Project Argus: Requirements Document
## AI-Powered Rental Scam Detection for Indian Cities

### 1. Problem Statement

When my family was relocating from Rajnandgaon to Durg, we found a listing that seemed too good to be true—decent rent, great photos, perfect location. Something felt off, so we decided to verify it ourselves. My dad pulled up Google Maps and started virtually walking through the streets to find the exact house. As he navigated deeper into the area, he suddenly stopped. 'Beta, we're not taking a house there,' he said quietly. That neighborhood had a reputation we didn't know about from just looking at the listing.

Later, we discovered the full extent of the deception: the photos were stolen from another property, the address didn't match the actual location, and the 'broker' had disappeared from multiple platforms. Had we not taken that extra step to verify, we would have lost ₹20,000 in advance payment—money that would have been impossible to recover.

We got lucky. Most people don't. That experience showed us the gap in India's rental ecosystem—there's no automated system to catch these red flags before families make costly mistakes. That's why we're building Project Argus.

**The Scale of the Problem:**

- Over 15 million people relocate to Indian metros annually for education and work
- An estimated ₹500+ crores lost to rental fraud each year across major cities
- 1 in 4 renters report encountering suspicious listings (based on consumer forums and news reports)
- Students and migrants are primary targets—they're unfamiliar with local markets and desperate for housing

**How Scams Work:**

The rental fraud playbook in India is sophisticated:

- Listings priced 30-50% below market rates to attract desperate renters
- Stock photos or images stolen from legitimate listings used repeatedly
- Urgency tactics: "Only 2 days left", "10 people interested", "pay token to hold"
- Fake broker networks operating across multiple platforms
- Advance payments demanded before property visits
- Unverified phone numbers that go dead after payment

**Why This Matters:**

The victims are India's most vulnerable urban population:

- Students spending their family's savings on education
- Migrant workers sending money home while searching for housing
- Women relocating alone who face additional safety concerns
- First-time renters with no knowledge of local market rates

**The Current Gap:**

Rental platforms in India have no trust verification layer. Users rely on:

- Their own judgment (often wrong when desperate)
- Reviews (easily faked or absent for new listings)
- Gut feeling (scammers are professionals)

There's no AI-powered system analyzing listings for fraud patterns before users engage with brokers. By the time someone realizes it's a scam, money is already lost.

**What We're Building:**

Project Argus is an AI scam detector that sits between rental listings and renters, analyzing listings in real-time to warn users before they make contact or payments.

---

### 2. Solution Overview

**What is Project Argus?**

Project Argus is an AI-powered verification system that analyzes rental listings across multiple signals to detect fraud patterns. Users paste a listing URL or details, and within seconds receive a risk assessment with clear explanations.

**How It Works:**

```
User finds listing → Pastes URL into Argus → AI analyzes in <10 seconds → 
Risk score + warnings displayed → User makes informed decision
```

**The AI Analysis:**

Argus runs four parallel detection engines:

1. **Price Anomaly Detection**: Compares listing price against locality benchmarks to flag unrealistic pricing
2. **Image Similarity Analysis**: Detects stolen or reused property photos across the web
3. **Text Pattern Recognition**: NLP analysis identifies scam language patterns and urgency tactics
4. **Behavioral Pattern Detection**: Tracks broker posting patterns and repetitive spam indicators

All signals combine into a single risk score (0-100) with a clear verdict: Likely Genuine, Suspicious, or High Scam Risk.

**Key Differentiator:**

Most fraud detection focuses on one signal. Argus uses multi-signal fusion—scammers might fake one thing (good photos), but they can't fake everything (market-rate pricing + unique images + professional descriptions + verified broker history).

**Why AI?**

Humans can't:

- Compare prices across thousands of listings in seconds
- Remember if they've seen an image before across different platforms
- Detect subtle language patterns that scammers use
- Track broker behavior across time and platforms

AI can do all of this instantly.

**India-Specific Design:**

- Trained on Indian rental market patterns (₹ pricing, locality names, Indian English)
- Understands Hinglish text patterns common in listings
- Knows Indian city geography and neighborhood pricing
- Recognizes India-specific scam tactics (token amount demands, broker spam patterns)

**Target Impact:**

If we can prevent even 10% of rental fraud in major cities, that's ₹50+ crores saved annually and thousands of families protected from financial distress.

---

### 3. Core Features

#### 3.1 Price Anomaly Detection

**What it does:**
Compares the listing price against real market data for that locality, property type, and amenities. Flags listings priced significantly below market rates.

**How it works:**
- Maintains a benchmark database of rental prices across Indian cities (scraped from legitimate platforms)
- Uses statistical analysis (Z-scores, percentile rankings) to identify outliers
- Considers factors: locality, property type (1BHK/2BHK/PG), furnishing, amenities
- Flags listings >30% below market median as high risk

**Why it matters:**
"Too good to be true" pricing is the #1 scam indicator. Scammers use low prices to attract desperate renters who ignore other red flags.

**Example:**
A 2BHK in Koramangala, Bangalore typically rents for ₹25,000-30,000. A listing at ₹15,000 gets flagged immediately.

---

#### 3.2 Image Similarity Analysis

**What it does:**
Detects if property images have been stolen from other listings or reused across multiple fake postings.

**How it works:**
- Extracts visual features from uploaded images using computer vision (AWS Rekognition)
- Performs reverse image search against a database of known listings
- Calculates similarity scores to find duplicates or near-duplicates
- Flags stock photos commonly used in scams

**Why it matters:**
Scammers rarely have access to real properties, so they steal photos. If the same "luxury apartment" appears in 10 different listings across cities, it's fake.

**Example:**
User uploads listing images. Argus finds the same photos used in 5 other listings in different cities—instant red flag.

---

#### 3.3 Text Pattern Recognition (NLP)

**What it does:**
Analyzes listing descriptions for suspicious language patterns, urgency tactics, and scam indicators using natural language processing.

**How it works:**
- Tokenizes and processes text using NLP (AWS Comprehend + custom models)
- Detects scam keywords: "urgent", "advance payment", "limited time", "token amount"
- Analyzes sentiment and urgency levels
- Checks for vague descriptions (excessive "good", "nice", "best" without specifics)
- Identifies grammar patterns typical of spam

**Why it matters:**
Scammers use psychological pressure tactics. Legitimate landlords provide detailed, calm descriptions. Scammers create urgency and demand immediate action.

**Example:**
Description says "URGENT! Only today offer! Pay token now or miss this luxury flat!" → High risk score.

---

#### 3.4 Risk Scoring & Explanation

**What it does:**
Combines all detection signals into a single, interpretable risk score with detailed explanations of what was found.

**How it works:**
- Weighted aggregation of all analyzer scores
- Classification: 0-30 (Likely Genuine), 31-65 (Suspicious), 66-100 (High Scam Risk)
- Generates human-readable explanations for each flag
- Provides confidence level based on available data
- Offers actionable safety recommendations

**Why it matters:**
Users need clear, actionable guidance—not just a number. Argus explains exactly why a listing is risky and what to do next.

**Example Output:**
```
Risk Score: 78/100 - High Scam Risk

⚠️ Price 45% below market average for this area
⚠️ Images found in 3 other listings
⚠️ Description contains urgency tactics
✓ Broker phone number has no spam history

Recommendation: Do not pay any advance. Verify property exists before contact.
```

---

#### 3.5 User Interface

**What it does:**
Clean, mobile-responsive web app that makes verification effortless for non-technical users.

**How it works:**
- Simple input: paste listing URL or enter details manually
- Real-time analysis with progress indicators
- Color-coded risk display (green/yellow/red)
- Detailed breakdown of findings
- Shareable results for warning friends/family

**Why it matters:**
Our users are students and migrants, often on mobile devices, with limited tech literacy. The UI must be dead simple.

---

### 4. Technical Approach

**AWS Services Integration:**

- **Amazon Rekognition**: Image analysis and similarity detection
- **Amazon Comprehend**: NLP for text pattern analysis and sentiment detection
- **AWS Lambda**: Serverless compute for running analysis engines
- **Amazon API Gateway**: RESTful API endpoints for frontend communication
- **Amazon DynamoDB**: Fast NoSQL storage for listing metadata and results
- **Amazon S3**: Image storage and caching
- **Amazon CloudFront**: Content delivery for fast global access
- **Amazon SageMaker** (future): Custom ML model training and deployment

**AI/ML Models:**

- Statistical anomaly detection for pricing (scikit-learn)
- Pre-trained computer vision models for image feature extraction (ResNet/EfficientNet)
- NLP transformers for text analysis (BERT-based models)
- Custom pattern matching algorithms for behavioral detection
- Ensemble scoring for risk aggregation

**Architecture:**

Three-tier design:

1. **Frontend**: React web app (mobile-responsive)
2. **API Layer**: AWS Lambda functions + API Gateway
3. **AI Engines**: Parallel analysis pipelines feeding into risk scorer

Data flows through AWS services, keeping infrastructure scalable and cost-effective.

---

### 5. Impact & Scale

**Target Users:**

- 15+ million renters annually in Indian metros (Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai)
- Primary: Students (5M+), young professionals (7M+), migrants (3M+)
- Secondary: Families, housing advocacy groups, rental platforms

**Potential Impact:**

- **Financial**: Prevent ₹500+ crores in annual fraud losses
- **Social**: Protect vulnerable populations from exploitation
- **Trust**: Restore confidence in digital rental markets
- **Scalability**: Start with 6 cities, expand to 20+ tier-1 and tier-2 cities

**B2B Opportunity:**

Rental platforms (99acres, Housing.com, NoBroker) could integrate Argus as a trust badge, reducing fraud on their platforms and increasing user confidence.

**Network Effects:**

As more users verify listings, Argus builds a larger database of scam patterns, improving accuracy for everyone. Community reporting creates a crowdsourced fraud detection network.

---

### 6. Success Metrics

**Accuracy Targets:**

- 85%+ precision in scam detection (minimize false positives)
- 80%+ recall (catch most actual scams)
- <10 second analysis time per listing
- 95%+ uptime for API services

**User Adoption:**

- 10,000+ listings analyzed in first 3 months
- 70%+ user satisfaction score
- 50%+ return user rate
- 1,000+ community scam reports submitted

**Business Metrics:**

- 2+ rental platform partnership discussions initiated
- Media coverage in tech/consumer protection outlets
- Positive feedback from hackathon judges and demo users

---

### 7. Roadmap

**Phase 1: MVP (Months 1-3)**
- Core detection engines (price, image, text)
- Basic web interface
- AWS infrastructure setup
- Launch in 2 cities (Bangalore, Delhi)
- 1,000+ test listings analyzed

**Phase 2: Scale (Months 4-6)**
- Mobile-responsive optimization
- Expand to 6 cities
- Add behavioral pattern detection
- User feedback system
- 10,000+ listings analyzed

**Phase 3: Platform (Months 7-12)**
- Browser extension for seamless integration
- B2B API for rental platforms
- Community reporting features
- Regional language support (Hindi, Tamil, Telugu)
- 100,000+ listings analyzed

**Future Vision:**
- Mobile apps (iOS/Android)
- Real-time monitoring of rental platforms
- Verified broker network
- Integration with consumer protection agencies
- Pan-India coverage (50+ cities)

---

### 8. Team & Execution

**What We Need:**

- **AI/ML Engineer**: Build detection engines, integrate AWS AI services
- **Backend Developer**: API infrastructure, AWS Lambda functions
- **Frontend Developer**: React web app, user experience
- **Domain Expert**: Indian rental market knowledge, scam pattern research

**Timeline:**

- Week 1: Core infrastructure + price analyzer
- Week 2: Image and text analyzers
- Week 3: Risk scoring + UI polish
- Week 4: Testing + demo preparation

**Why We'll Succeed:**

We're building a focused MVP that demonstrates clear value. Every feature directly addresses a real scam tactic. Every AWS service has a specific purpose. Every design decision prioritizes user impact. The problem is validated, the technology is proven, and the path to execution is clear.
