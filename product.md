# Product Documentation: Project Argus

**AI-Powered Rental Scam Detection for Indian Housing Platforms**

---

## Product Vision

Project Argus is a trust layer for India's digital rental marketplace. We provide instant, AI-powered verification that empowers renters to make informed decisions before engaging with potentially fraudulent listings.

**Mission**: Eliminate rental fraud as a barrier to safe housing in India by making AI-powered scam detection accessible, transparent, and free.

**Vision**: A future where every renter can verify listings in under 10 seconds, rental scams are detected before financial loss occurs, and trust is restored in India's digital housing marketplace.

---

## The Problem

### Rental Scams in Indian Cities

Every year, thousands of students, migrants, and working professionals lose money to rental scams:

**Common Scam Tactics**:
- **Fake Listings**: Scammers post properties using stolen images from legitimate listings
- **Price Manipulation**: Unrealistically low prices lure desperate renters into traps
- **Advance Payment Scams**: Brokers demand deposits before property visits, then disappear
- **Mass Listing Fraud**: Single brokers post hundreds of fake properties across platforms
- **Urgency Tactics**: High-pressure language forces quick decisions without verification

**Impact**:
- Students lose ₹50,000+ in advance payments
- Migrants waste time and money on fake property visits
- Families face housing instability due to scams
- Trust erodes in digital rental platforms

**Why Traditional Verification Fails**:
- Manual verification is slow and ineffective at scale
- Renters lack tools to verify listings before payment
- Platforms have limited fraud detection capabilities
- No standardized verification process exists

---

## Target Users

### 1. Students Relocating for Education

**Demographics**: Age 18-24, moving from tier-2/3 cities to metros, budget ₹8,000-15,000/month

**Pain Points**:
- First time renting independently
- Unfamiliar with local market rates
- Vulnerable to "too good to be true" deals
- Need to find housing remotely before arrival

**Goals**: Find safe, affordable housing near college, avoid advance payment scams, make parents feel confident

**How Argus Helps**: Instant verification of suspicious listings, clear risk indicators, shareable results, educational explanations

### 2. Young Professionals Relocating for Jobs

**Demographics**: Age 24-35, relocating for new job, budget ₹15,000-40,000/month

**Pain Points**:
- Tight timeline (2-4 weeks to find housing)
- Unfamiliar with new city's neighborhoods
- Pressure to make quick decisions
- Limited time for property visits

**Goals**: Quickly identify legitimate listings, avoid wasting time on fakes, verify broker credibility

**How Argus Helps**: Fast verification (10 seconds), broker pattern detection, market price comparison, time-saving

### 3. Families Moving Cities

**Demographics**: Age 30-50, families with children, budget ₹20,000-60,000/month

**Pain Points**:
- High stakes (family safety and stability)
- Larger financial commitment
- Need for verified, trustworthy landlords
- Risk-averse (cannot afford to lose money)

**Goals**: Find safe, family-friendly housing, verify landlord legitimacy, protect savings from fraud

**How Argus Helps**: Comprehensive risk assessment, detailed explanations, safety recommendations, confidence in decisions

---

## User Journey

### Step 1: Discovery
User is browsing rental listings on 99acres, Housing.com, NoBroker, or MagicBricks and finds a listing that seems interesting but has doubts (price too low, urgent language, suspicious broker).

### Step 2: Verification Decision
User searches for "rental scam detection" or finds Argus through referral. Lands on homepage and decides to try verification (no signup required).

### Step 3: Listing Submission
User pastes listing URL into input field, system validates format in real-time, user clicks "Verify Now" button.

### Step 4: Analysis Progress
Full-screen loading animation shows sequential progress through analysis steps (6-10 seconds):
1. Extracting listing data...
2. Running anomaly detection...
3. Cross-checking broker activity...
4. Generating AI explanation...

### Step 5: Results Display
Comprehensive dashboard appears with:
- Risk score gauge (0-100) with color coding
- Classification badge (Low Risk / Suspicious / High Scam Risk)
- Signal breakdown (Price, Image, Language, Broker)
- AI forensic explanation
- Safety recommendations

### Step 6: Decision Making
User reviews results and decides:
- **Low Risk**: Proceed with normal caution
- **Suspicious**: Heightened caution, in-person verification required
- **High Risk**: Avoid listing entirely, report if confirmed scam

### Step 7: Post-Analysis
User bookmarks results, shares with family/friends, provides feedback, or analyzes another listing.

---

## UX Principles

### 1. Transparency
Build confidence through complete transparency in methodology and results.

**Implementation**:
- Explain detection methodology on homepage
- Show individual signal breakdowns (not just final score)
- AI explanations in human-readable language
- Cite data sources (market benchmarks)
- No hidden algorithms

**Example**: Instead of "High Risk", show "Price 52% below market + Image reused + Urgency language + Broker has 47 listings"

### 2. Explainable AI
Make AI decisions understandable through natural language explanations.

**Implementation**:
- LLM-generated forensic explanations
- Visual signal breakdowns
- Context for each detection
- Examples of scam tactics
- Educational content

**Example**: "The price is 52% below market average for Koramangala. This is a common bait tactic used in advance payment scams."

### 3. Speed (<10 seconds)
Respect user time with instant results and clear progress indicators.

**Implementation**:
- Sub-10-second analysis (95th percentile)
- Real-time URL validation
- Progress indicators during loading
- Parallel AI engine execution
- Cached benchmark data

**Why It Matters**: Users are impatient. Fast feedback keeps users engaged and builds trust.

### 4. Simplicity
Minimize cognitive load and clicks to value.

**Implementation**:
- Single input field (just paste URL)
- No account creation required
- One-click verification
- Clear visual hierarchy
- Plain language (no jargon)

**Example**: User goes from landing page to results in 3 clicks and 10 seconds.

### 5. Mobile-First
Optimize for smartphone users (60%+ of traffic in India).

**Implementation**:
- Responsive layouts
- Large touch targets (min 44px)
- Readable font sizes (min 16px)
- Fast mobile loading (<3 seconds)
- Optimized images

### 6. Accessibility
Ensure usability for all users, including those with disabilities.

**Implementation**:
- WCAG 2.1 AA compliance
- Color contrast ratios >4.5:1
- Keyboard navigation support
- Screen reader compatibility
- Risk levels indicated by color AND text

---

## Explainable AI Design

### Why Explainability Matters

Traditional fraud detection outputs a single score without explanation. This creates:
1. **Lack of Trust**: Users don't understand why a listing was flagged
2. **No Learning**: Users can't identify scam patterns independently
3. **No Actionability**: Users don't know what specific actions to take

### Project Argus's Explainability Approach

**Layer 1: Signal Breakdown**
- Show individual scores for each engine
- Display specific metrics (e.g., "52% below market median")
- Provide comparison data

**Layer 2: AI Forensic Explanation**
- LLM-generated narrative connecting signals
- Plain language explanation of fraud indicators
- Context about scam tactics

**Layer 3: Actionable Recommendations**
- Risk-appropriate guidance on next steps
- Specific actions to take (verify in person, check broker ID)
- Links to additional resources

### Educational Value

Users learn to identify scam patterns:
- Pattern recognition (urgency language, low prices)
- Market knowledge (typical rates for areas)
- Risk assessment (evaluating listings independently)
- Empowerment (confident decision-making)

**Long-Term Impact**: Users become less vulnerable over time, even without using Argus.

---

## Functional Requirements

### URL Submission & Data Extraction

**FR-1**: System accepts rental listing URLs from supported platforms (99acres, Housing.com, NoBroker, MagicBricks)

**FR-2**: System validates URL format with real-time feedback

**FR-3**: System extracts structured data:
- Price, location, property type, square footage
- Description text, images, contact information
- Posting date, broker/landlord name

**FR-4**: System handles dynamic content rendering and missing data gracefully

**FR-5**: System generates synthetic listing data when scraping fails

### AI Signal Analysis

**FR-6: Price Anomaly Detection**
- Compare listing price against regional market benchmarks
- Calculate statistical deviation (Z-score)
- Flag listings >30% below market median
- Generate price anomaly score (0-100)

**FR-7: Text Analysis (NLP)**
- Analyze description for fraud indicators
- Detect urgency keywords (English, Hindi, Hinglish)
- Detect payment pressure and vague language
- Use AWS Bedrock (Claude 3.5 Haiku) with rule-based fallback
- Generate text analysis score (0-100)

**FR-8: Image Verification**
- Detect stock photos, watermarks, stolen images
- Identify non-Indian interior design patterns
- Use AWS Bedrock (Claude 3.5 Sonnet) for analysis
- Generate image verification score (0-100)

**FR-9: Broker Behavior Pattern Detection**
- Extract and query contact information
- Calculate posting frequency and volume
- Detect template usage and mass-listing patterns
- Generate broker pattern score (0-100)

### Risk Scoring & Results

**FR-10**: System uses IsolationForest algorithm for unsupervised anomaly detection

**FR-11**: System aggregates scores using weighted formula:
- Price anomaly: 40%
- Text analysis: 40%
- Image verification: 20%

**FR-12**: System classifies listings into three categories:
- Low Risk (0-30): Likely genuine
- Suspicious (31-65): Proceed with caution
- High Scam Risk (66-100): Multiple red flags

**FR-13**: System displays comprehensive risk assessment with:
- Overall risk score with animated gauge
- Risk classification badge
- Individual signal scores with breakdowns
- AI-generated forensic explanation
- Actionable safety recommendations

**FR-14**: System generates unique URL for each analysis and preserves results for 30 days

---

## Non-Functional Requirements

### Performance

**NFR-1**: Analysis completion time <10 seconds (95th percentile)

**NFR-2**: API response time <200ms (excluding analysis)

**NFR-3**: Initial page load <3 seconds

**NFR-4**: Async/await patterns for non-blocking I/O

### Scalability

**NFR-5**: Serverless auto-scaling with AWS Lambda

**NFR-6**: Support 1,000+ concurrent analyses

**NFR-7**: Scale from 10 to 100,000 daily analyses without code changes

**NFR-8**: DynamoDB on-demand pricing for auto-scaling

### Reliability

**NFR-9**: System uptime >99.5%

**NFR-10**: Health checks for all services

**NFR-11**: Comprehensive error logging

**NFR-12**: Retry logic with exponential backoff

**NFR-13**: Circuit breaker pattern for failing services

### Security

**NFR-14**: No storage of user personal information

**NFR-15**: Image deletion after 24 hours

**NFR-16**: HTTPS for all communications

**NFR-17**: Rate limiting (100 requests/minute per IP)

**NFR-18**: Input validation and sanitization

**NFR-19**: IAM roles with least-privilege access

**NFR-20**: Encryption at rest (DynamoDB, S3) and in transit (TLS 1.2+)

**NFR-21**: API keys stored in AWS Secrets Manager

### Cost Efficiency

**NFR-22**: MVP costs <$50/month

**NFR-23**: Linear cost scaling with usage

**NFR-24**: Pay-per-use pricing optimization

**NFR-25**: Caching to reduce API calls

**NFR-26**: Image compression before storage

---

## Future Roadmap

### Phase 1: Enhanced Detection
- Train custom deep learning models for image analysis
- Use transformer models for advanced NLP
- Maintain historical fraud pattern database
- Calculate broker reputation scores

### Phase 2: Platform Expansion
- Browser extension for one-click verification
- Native mobile apps (iOS, Android)
- WhatsApp bot for verification
- Support additional rental platforms

### Phase 3: Community Features
- Community scam reporting
- User reviews for brokers
- Verified landlord badges

### Phase 4: Enterprise Integration
- Enterprise API for rental platforms
- Bulk verification support
- White-label solutions
- Fraud reports for regulators
- Real-time platform monitoring

---

## Success Metrics

### Technical Metrics
- Analysis completion time: <10 seconds (95th percentile)
- System uptime: >99.5%
- API error rate: <1%
- Detection accuracy: >85% across all engines
- False positive rate: <10%

### User Metrics
- User satisfaction: >4.5/5 rating
- Verification completion rate: >90%
- Return user rate: >40%
- Results sharing rate: >20%
- NPS score: >50

### Business Metrics
- Monthly active users: 10,000+ (Year 1)
- Listings analyzed: 100,000+ (Year 1)
- Estimated fraud prevented: ₹50 crore (Year 1)
- Platform partnerships: 2+ (Year 1)
- Cost per analysis: <₹5

---

## Conclusion

Project Argus's product design prioritizes user trust, speed, and transparency. By focusing on clear visual communication, explainable AI, and mobile-first accessibility, we create a tool that empowers renters to make informed decisions and protect themselves from fraud.

Every design decision is guided by our core mission: protecting India's renters through accessible, intelligent, and transparent rental verification.
