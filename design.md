    # Project Argus: Design Document
    ## System Architecture & Implementation Plan

    ### 1. System Overview

    Project Argus is built as a serverless, cloud-native application on AWS infrastructure. The architecture prioritizes scalability, cost-efficiency, and rapid analysis.

    **High-Level Flow:**

    ```
    User (Web Browser)
        ↓
    React Frontend (S3 + CloudFront)
        ↓
    API Gateway (REST endpoints)
        ↓
    Lambda Functions (orchestration)
        ↓
    AI Analysis Engines (parallel execution)
        ├→ Price Analyzer (Lambda + DynamoDB)
        ├→ Image Analyzer (Lambda + Rekognition + S3)
        ├→ Text Analyzer (Lambda + Comprehend)
        └→ Pattern Detector (Lambda + DynamoDB)
        ↓
    Risk Scoring Engine (Lambda)
        ↓
    Results Storage (DynamoDB)
        ↓
    Response to User
    ```

    **Why This Architecture:**

    - **Serverless**: No server management, auto-scaling, pay-per-use
    - **Fast**: Parallel analysis engines complete in <10 seconds
    - **Scalable**: Handles 10 requests or 10,000 requests without code changes
    - **Cost-effective**: Only pay for actual compute time during analysis
    - **AWS-native**: Leverages managed AI services (Rekognition, Comprehend)

    ---

    ### 2. Architecture Components

    #### 2.1 Frontend Layer

    **Technology:** React.js + TailwindCSS

    **Hosting:** Amazon S3 (static hosting) + CloudFront (CDN)

    **Key Components:**

    - **Landing Page**: Simple input form for listing URL or manual entry
    - **Analysis Dashboard**: Real-time progress indicators during analysis
    - **Results Display**: Color-coded risk score with detailed breakdown
    - **Explanation Panel**: Human-readable findings for each detection signal

    **User Flow:**

    1. User lands on homepage
    2. Pastes listing URL or enters details manually
    3. Clicks "Analyze Listing"
    4. Sees progress bar while AI processes (5-10 seconds)
    5. Views risk score with color coding (green/yellow/red)
    6. Expands sections to see detailed findings
    7. Gets actionable recommendations

    **Design Principles:**

    - Mobile-first (60%+ users on smartphones)
    - Minimal clicks to results
    - Clear visual hierarchy
    - No technical jargon
    - Shareable results via URL

    ---

    #### 2.2 API Layer

    **Technology:** AWS API Gateway + Lambda Functions

    **Endpoints:**

    ```
    POST /api/analyze
    - Input: { url?, price?, location?, description?, images? }
    - Output: { analysisId, status }
    
    GET /api/results/{analysisId}
    - Output: { riskScore, classification, findings, recommendations }

    POST /api/feedback
    - Input: { analysisId, isScam, comments }
    - Output: { success }
    ```

    **Lambda Functions:**

    - **Orchestrator Lambda**: Receives request, triggers parallel analysis
    - **Price Analyzer Lambda**: Statistical price comparison
    - **Image Analyzer Lambda**: Calls Rekognition, similarity search
    - **Text Analyzer Lambda**: Calls Comprehend, pattern matching
    - **Pattern Detector Lambda**: Behavioral analysis
    - **Risk Scorer Lambda**: Aggregates results, generates explanation

    **Why Lambda:**

    - Auto-scales from 0 to thousands of concurrent executions
    - Pay only for compute time (milliseconds)
    - No server management
    - Built-in monitoring via CloudWatch

    ---

    #### 2.3 AI Analysis Engines

    **A. Price Anomaly Detector**

    **Purpose:** Flag listings priced significantly below market rates

    **AWS Services:** Lambda + DynamoDB

    **How It Works:**

    1. Extract price, locality, property type from listing
    2. Query DynamoDB for benchmark data (median, percentiles for that locality)
    3. Calculate Z-score: `z = (listing_price - median) / std_dev`
    4. Flag if z < -2 (more than 2 standard deviations below median)
    5. Generate explanation: "Price is 45% below market average for 2BHK in Koramangala"

    **Data Source:**

    - Scraped benchmark data from legitimate platforms (99acres, Housing.com)
    - Stored in DynamoDB: `{ locality, propertyType, medianPrice, stdDev }`
    - Updated monthly

    **Output:** Price risk score (0-100), comparison metrics

    ---

    **B. Image Similarity Analyzer**

    **Purpose:** Detect stolen or reused property images

    **AWS Services:** Lambda + Rekognition + S3

    **How It Works:**

    1. User uploads images or Lambda downloads from listing URL
    2. Store images in S3 bucket
    3. Call Rekognition `DetectLabels` to extract features
    4. Call Rekognition `SearchFacesByImage` for similarity (if faces present)
    5. Generate perceptual hash for quick duplicate detection
    6. Query DynamoDB for similar image hashes
    7. If matches found, flag as reused

    **Perceptual Hashing:**

    - Convert image to grayscale, resize to 8x8
    - Calculate average pixel value
    - Generate 64-bit hash
    - Compare hashes using Hamming distance
    - Distance <5 = likely duplicate

    **Output:** Image risk score, number of duplicates found, URLs of similar listings

    ---

    **C. Text Pattern Analyzer**

    **Purpose:** Detect scam language patterns and urgency tactics

    **AWS Services:** Lambda + Comprehend

    **How It Works:**

    1. Extract listing description text
    2. Call Comprehend `DetectSentiment` for sentiment analysis
    3. Call Comprehend `DetectKeyPhrases` to extract key phrases
    4. Run custom regex patterns for scam keywords:
    - Urgency: "urgent", "hurry", "limited time", "only today"
    - Payment: "advance", "token", "booking amount"
    - Vague: excessive "good", "nice", "best" without specifics
    5. Calculate urgency score based on keyword density
    6. Check description length (too short = vague, too long = spam)
    7. Analyze grammar quality (poor grammar = potential scam)

    **Scam Indicators:**

    ```python
    URGENCY_KEYWORDS = ["urgent", "hurry", "limited", "only today", "last chance"]
    PAYMENT_KEYWORDS = ["advance", "token", "booking amount", "pay now"]
    VAGUE_KEYWORDS = ["good", "nice", "best", "excellent"] (without specifics)
    ```

    **Scoring:**

    - High urgency + payment demands = high risk
    - Vague description + poor grammar = medium risk
    - Professional tone + detailed description = low risk

    **Output:** Text risk score, flagged phrases, sentiment analysis

    ---

    **D. Pattern Detector**

    **Purpose:** Identify broker spam and repetitive posting patterns

    **AWS Services:** Lambda + DynamoDB

    **How It Works:**

    1. Extract phone number, email, broker name from listing
    2. Query DynamoDB for historical postings by this contact
    3. Check posting frequency (>10 listings/day = spam)
    4. Detect template usage (similar descriptions across listings)
    5. Check if contact appears in user-reported scam database

    **Pattern Indicators:**

    - Same phone number in 50+ listings = spam broker
    - Identical description templates = automated posting
    - Contact in scam reports = high risk

    **Output:** Behavior risk score, pattern flags

    ---

    **E. Risk Scoring Engine**

    **Purpose:** Combine all signals into final risk assessment

    **AWS Services:** Lambda

    **Scoring Formula:**

    ```python
    weights = {
        'price': 0.35,    # Price is strongest signal
        'image': 0.30,    # Image reuse is very suspicious
        'text': 0.20,     # Text patterns matter but less definitive
        'pattern': 0.15   # Behavioral patterns are supporting evidence
    }

    final_score = (
        weights['price'] * price_score +
        weights['image'] * image_score +
        weights['text'] * text_score +
        weights['pattern'] * pattern_score
    )

    # Adjust weights if data missing
    if no_images:
        redistribute weight to price and text
    ```

    **Classification:**

    - 0-30: **Likely Genuine** (Green) - No major red flags
    - 31-65: **Suspicious** (Yellow) - Some concerns, proceed with caution
    - 66-100: **High Scam Risk** (Red) - Multiple red flags, avoid

    **Explanation Generation:**

    ```python
    explanation = {
        'summary': 'High Scam Risk - Multiple red flags detected',
        'findings': [
            '⚠️ Price 45% below market average',
            '⚠️ Images found in 3 other listings',
            '⚠️ Description uses urgency tactics',
            '✓ Broker phone number has no spam history'
        ],
        'recommendation': 'Do not pay any advance. Verify property exists before contact.'
    }
    ```

    **Output:** Final risk score (0-100), classification, detailed explanation, recommendations

    ---

    ### 3. AWS Services Integration

    **Why AWS:**

    AWS provides managed AI services that would take months to build from scratch. We leverage AWS's scale and expertise to focus on our unique value: multi-signal fraud detection for Indian rentals.

    **Service Breakdown:**

    | AWS Service | Purpose | Why We Need It |
    |------------|---------|----------------|
    | **Lambda** | Serverless compute for all analysis functions | Auto-scaling, pay-per-use, no server management |
    | **API Gateway** | REST API endpoints | Handles routing, authentication, rate limiting |
    | **Rekognition** | Image analysis and similarity detection | Pre-trained computer vision, no model training needed |
    | **Comprehend** | NLP for text analysis | Sentiment analysis, key phrase extraction |
    | **DynamoDB** | NoSQL database for listings, benchmarks, results | Fast queries, auto-scaling, serverless |
    | **S3** | Image storage | Cheap, durable storage for uploaded images |
    | **CloudFront** | CDN for frontend | Fast global delivery, HTTPS by default |
    | **CloudWatch** | Monitoring and logging | Track performance, errors, usage metrics |
    | **IAM** | Access control | Secure service-to-service communication |

    **Cost Estimate (MVP):**

    - Lambda: ~$5/month (1M requests at 3s avg execution)
    - Rekognition: ~$10/month (10K images analyzed)
    - Comprehend: ~$5/month (10K text analyses)
    - DynamoDB: ~$5/month (on-demand pricing)
    - S3: ~$2/month (10GB storage)
    - CloudFront: ~$3/month (10GB transfer)

    **Total: ~$30/month for MVP** (scales with usage)

    ---

    ### 4. AI/ML Methodology

    **Philosophy:** Use proven techniques, not bleeding-edge research. Focus on reliability and explainability.

    **Price Detection:**

    - **Technique**: Statistical anomaly detection (Z-scores, IQR)
    - **Why**: Simple, fast, interpretable. No training needed.
    - **Data**: Scraped benchmark prices from legitimate platforms
    - **Threshold**: Flag if >30% below median or Z-score < -2

    **Image Detection:**

    - **Technique**: Perceptual hashing + AWS Rekognition feature extraction
    - **Why**: Perceptual hashing is fast for exact duplicates. Rekognition handles variations.
    - **Models**: Pre-trained ResNet/EfficientNet (via Rekognition)
    - **Similarity**: Hamming distance for hashes, cosine similarity for features

    **Text Detection:**

    - **Technique**: Keyword matching + AWS Comprehend NLP
    - **Why**: Scam patterns are predictable. Comprehend adds sentiment analysis.
    - **Models**: Comprehend's pre-trained models for sentiment, key phrases
    - **Custom**: Regex patterns for India-specific scam keywords

    **Pattern Detection:**

    - **Technique**: Rule-based heuristics + frequency analysis
    - **Why**: Spam patterns are obvious (high posting frequency, templates)
    - **Data**: Historical listing database, user reports

    **Risk Scoring:**

    - **Technique**: Weighted ensemble
    - **Why**: Combines multiple weak signals into strong signal
    - **Weights**: Tuned based on scam case studies and testing

    **No Custom Model Training:**

    For MVP, we use pre-trained models and statistical methods. This saves time and works well for our use case. Future versions can add custom models trained on Indian rental data.

    ---

    ### 5. Data Architecture

    **DynamoDB Tables:**

    **Listings Table:**
    ```
    {
    listingId: UUID (partition key),
    url: string,
    price: number,
    locality: string,
    city: string,
    propertyType: string,
    description: string,
    phoneNumber: string,
    analyzedAt: timestamp,
    riskScore: number,
    classification: string
    }
    ```

    **Benchmarks Table:**
    ```
    {
    locationKey: "bangalore_koramangala_2bhk" (partition key),
    medianPrice: number,
    stdDev: number,
    sampleSize: number,
    lastUpdated: timestamp
    }
    ```

    **Image Hashes Table:**
    ```
    {
    imageHash: string (partition key),
    listingIds: [UUID],  // All listings using this image
    s3Key: string,
    uploadedAt: timestamp
    }
    ```

    **Analysis Results Table:**
    ```
    {
    analysisId: UUID (partition key),
    listingId: UUID,
    priceScore: number,
    imageScore: number,
    textScore: number,
    patternScore: number,
    finalScore: number,
    findings: JSON,
    createdAt: timestamp
    }
    ```

    **Why DynamoDB:**

    - Serverless (no database management)
    - Auto-scaling
    - Fast key-value lookups
    - Pay-per-request pricing
    - Integrates seamlessly with Lambda

    ---

    ### 6. Scalability & Performance

    **Horizontal Scaling:**

    - Lambda auto-scales to 1000+ concurrent executions
    - DynamoDB auto-scales read/write capacity
    - CloudFront caches frontend globally
    - S3 handles unlimited storage

    **Performance Optimizations:**

    - **Parallel Execution**: All analyzers run simultaneously (not sequential)
    - **Caching**: DynamoDB caches benchmark data in Lambda memory
    - **Image Optimization**: Resize images before analysis (max 1MB)
    - **Lazy Loading**: Only load ML models when needed

    **Bottlenecks & Solutions:**

    - **Rekognition API limits**: Batch image processing, implement retry logic
    - **DynamoDB throttling**: Use on-demand pricing, implement exponential backoff
    - **Lambda cold starts**: Keep functions warm with scheduled pings

    **Target Performance:**

    - Analysis completion: <10 seconds (95th percentile)
    - API response time: <500ms (excluding analysis)
    - Concurrent users: 1000+ without degradation

    ---

    ### 7. Security & Privacy

    **Data Protection:**

    - No storage of user personal information
    - Images deleted after 24 hours (S3 lifecycle policy)
    - HTTPS everywhere (CloudFront, API Gateway)
    - API rate limiting to prevent abuse

    **AWS Security:**

    - IAM roles with least-privilege access
    - Lambda functions in VPC (if needed)
    - Encryption at rest (S3, DynamoDB)
    - Encryption in transit (TLS 1.2+)

    **Privacy Considerations:**

    - Users can analyze listings anonymously
    - No tracking cookies or analytics (MVP)
    - Clear data retention policy
    - Option to delete analysis results

    ---

    ### 8. Development Roadmap

    **Week 1: Foundation**
    - Set up AWS account and services
    - Deploy frontend skeleton to S3 + CloudFront
    - Create API Gateway + Lambda orchestrator
    - Build price analyzer with DynamoDB benchmarks

    **Week 2: AI Engines**
    - Integrate Rekognition for image analysis
    - Integrate Comprehend for text analysis
    - Build pattern detector
    - Create risk scoring engine

    **Week 3: Integration & Polish**
    - Connect all components end-to-end
    - Build results display UI
    - Add error handling and logging
    - Create demo dataset (synthetic listings)

    **Week 4: Testing & Demo**
    - Test with 100+ synthetic listings
    - Fix bugs and edge cases
    - Optimize performance
    - Prepare hackathon presentation
    - Record demo video

    ---

    ### 9. Future Enhancements

    **Technical:**

    - **SageMaker Integration**: Train custom models on Indian rental data
    - **Real-time Monitoring**: Lambda scheduled functions to scan platforms
    - **Graph Database**: Neo4j for broker network analysis
    - **ML Pipeline**: Automated retraining with user feedback

    **Features:**

    - **Browser Extension**: Analyze listings without leaving rental sites
    - **Mobile App**: Native iOS/Android apps
    - **WhatsApp Bot**: Send listing URL, get risk score
    - **B2B API**: Rental platforms integrate Argus verification

    **Scale:**

    - **Multi-region**: Deploy in Mumbai, Singapore regions for low latency
    - **CDN Optimization**: Edge computing with Lambda@Edge
    - **Database Sharding**: Partition data by city for performance
    - **Microservices**: Split monolithic Lambda into specialized services

    ---

    ### 10. Why This Design Wins

    **AWS-Native ✓**
    Every component uses AWS services. We're not just deploying on AWS—we're building with AWS as the foundation.

    **Scalable ✓**
    Serverless architecture scales from 10 to 10,000 users without code changes. No capacity planning needed.

    **Cost-Effective ✓**
    Pay-per-use pricing means MVP costs <$50/month. Scales linearly with usage.

    **Fast ✓**
    Parallel analysis completes in <10 seconds. Users get instant feedback.

    **Maintainable ✓**
    Modular design. Each analyzer is independent. Easy to update or replace components.

    **Production-Ready ✓**
    Not a prototype. This architecture can handle real users from day one.

    ---

    **Project Argus provides a scalable, AWS-native solution for rental fraud detection in India.**
