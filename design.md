# Design Document
## AI-Powered Fake Rental Listing & Broker Scam Detection Platform

### 1. System Architecture Overview

The system follows a modular, three-tier architecture:

**Presentation Layer** → **Application Layer** → **Data Layer**

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Web UI)                     │
│              React/Vue.js + TailwindCSS                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   API Gateway / Router                   │
│                    FastAPI / Flask                       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  AI Analysis Engine                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Price        │  │ Image        │  │ Text         │  │
│  │ Analyzer     │  │ Analyzer     │  │ Analyzer     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────────────────────┐    │
│  │ Pattern      │  │ Risk Scoring Engine          │    │
│  │ Detector     │  │                              │    │
│  └──────────────┘  └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PostgreSQL   │  │ Redis Cache  │  │ Vector DB    │  │
│  │ (Metadata)   │  │              │  │ (Images)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2. Component Breakdown

#### 2.1 Frontend Components

**User Interface:**
- Landing page with input form
- Listing URL input field
- Manual data entry form (fallback)
- Image upload interface
- Results dashboard with risk visualization
- Detailed explanation panel
- Safety recommendations display

**Key Features:**
- Responsive design for mobile and desktop
- Real-time validation of inputs
- Progress indicators during analysis
- Color-coded risk levels (Green/Yellow/Red)
- Shareable results links

**Technology Stack:**
- React.js or Vue.js for component-based UI
- TailwindCSS for styling
- Axios for API communication
- Chart.js for risk score visualization

#### 2.2 Backend Components

**API Layer:**
- RESTful API endpoints
- Request validation and sanitization
- Rate limiting and security middleware
- Response formatting and error handling

**Core Endpoints:**
```
POST /api/analyze/url          - Analyze listing from URL
POST /api/analyze/manual       - Analyze manually entered data
POST /api/analyze/images       - Upload and analyze images
GET  /api/results/{id}         - Retrieve analysis results
POST /api/feedback             - Submit user feedback
GET  /api/stats                - Get platform statistics
```

**Technology Stack:**
- FastAPI (Python) for high-performance async API
- Pydantic for data validation
- Celery for background task processing
- Redis for caching and task queue

#### 2.3 AI Analysis Engine

**A. Price Anomaly Detector**

*Purpose:* Identify unrealistic pricing compared to market rates

*Approach:*
- Maintain locality-wise price database (synthetic data for MVP)
- Calculate statistical benchmarks (mean, median, percentiles)
- Detect outliers using Z-score or IQR methods
- Consider property type, size, amenities

*Implementation:*
```python
class PriceAnalyzer:
    - load_price_benchmarks(locality, property_type)
    - calculate_anomaly_score(listing_price, benchmarks)
    - detect_too_good_to_be_true(price, threshold)
    - generate_price_explanation()
```

*Output:* Price risk score (0-100), comparison metrics

**B. Image Similarity Detector**

*Purpose:* Identify reused or stolen property images

*Approach:*
- Extract image features using pre-trained CNN (ResNet, EfficientNet)
- Generate perceptual hashes for quick comparison
- Use vector similarity search for duplicate detection
- Reverse image search simulation

*Implementation:*
```python
class ImageAnalyzer:
    - extract_features(image) → feature_vector
    - compute_perceptual_hash(image)
    - find_similar_images(feature_vector, threshold)
    - detect_stock_photos()
    - count_reuse_instances()
```

*Technology:*
- PyTorch or TensorFlow for feature extraction
- FAISS or Annoy for vector similarity search
- PIL/OpenCV for image processing

*Output:* Image risk score, number of duplicates found

**C. Text Pattern Analyzer (NLP)**

*Purpose:* Detect suspicious language patterns in descriptions

*Approach:*
- Tokenization and preprocessing
- Keyword extraction for scam indicators
- Sentiment and urgency analysis
- Spam pattern detection
- Grammar and coherence checking

*Scam Indicators:*
- Urgency phrases: "limited time", "hurry", "only today"
- Payment demands: "advance payment", "token amount"
- Vague descriptions: excessive use of "good", "nice", "best"
- Contact pressure: "call immediately", "WhatsApp only"
- Too-good-to-be-true claims: "luxury at budget price"

*Implementation:*
```python
class TextAnalyzer:
    - preprocess_text(description)
    - extract_scam_keywords()
    - analyze_urgency_signals()
    - detect_spam_patterns()
    - check_description_quality()
    - calculate_text_risk_score()
```

*Technology:*
- spaCy or NLTK for NLP processing
- Transformers (BERT) for advanced text understanding
- Custom regex patterns for Indian rental context

*Output:* Text risk score, flagged phrases, explanation

**D. Pattern Detector**

*Purpose:* Identify broker/listing behavioral patterns

*Approach:*
- Track phone numbers across listings
- Detect repetitive posting patterns
- Identify template-based descriptions
- Analyze posting frequency anomalies

*Implementation:*
```python
class PatternDetector:
    - extract_contact_info(listing)
    - check_broker_history(phone_number)
    - detect_template_usage(description)
    - analyze_posting_frequency()
    - calculate_behavior_risk_score()
```

*Output:* Behavior risk score, pattern flags

**E. Risk Scoring Engine**

*Purpose:* Combine all signals into final risk assessment

*Approach:*
- Weighted aggregation of component scores
- Rule-based thresholds for classification
- Confidence calculation based on available data
- Explanation generation

*Scoring Formula:*
```
Final Risk Score = (
    w1 × Price_Score +
    w2 × Image_Score +
    w3 × Text_Score +
    w4 × Pattern_Score
) / (w1 + w2 + w3 + w4)

Where weights (w) are adjusted based on signal availability
```

*Classification:*
- 0-30: Likely Genuine (Green)
- 31-65: Suspicious (Yellow)
- 66-100: High Scam Risk (Red)

*Implementation:*
```python
class RiskScoringEngine:
    - aggregate_scores(component_scores)
    - apply_weights(scores, weights)
    - classify_risk_level(final_score)
    - calculate_confidence()
    - generate_explanation(component_results)
```

*Output:* Final risk score, classification, detailed explanation

### 3. Data Flow

**Analysis Pipeline:**

```
1. User Input
   ↓
2. Input Validation & Preprocessing
   ↓
3. Data Extraction (if URL provided)
   ↓
4. Parallel Analysis
   ├→ Price Analysis
   ├→ Image Analysis
   ├→ Text Analysis
   └→ Pattern Analysis
   ↓
5. Score Aggregation
   ↓
6. Risk Classification
   ↓
7. Explanation Generation
   ↓
8. Result Storage & Caching
   ↓
9. Response to User
```

**Detailed Flow:**

1. **Input Reception:**
   - User submits listing URL or manual data
   - Frontend validates input format
   - API receives and sanitizes request

2. **Data Extraction:**
   - If URL: Web scraper extracts listing details
   - Parse price, location, description, images
   - Handle extraction failures gracefully

3. **Parallel Processing:**
   - Spawn async tasks for each analyzer
   - Each component processes independently
   - Results collected in task queue

4. **Score Computation:**
   - Risk scoring engine receives component scores
   - Applies weighted aggregation
   - Generates classification and confidence

5. **Result Delivery:**
   - Format response with all details
   - Cache results for quick retrieval
   - Return to frontend for display

### 4. Database Schema

**Listings Table:**
```sql
CREATE TABLE listings (
    id UUID PRIMARY KEY,
    url TEXT,
    title TEXT,
    description TEXT,
    price DECIMAL,
    locality VARCHAR(255),
    city VARCHAR(100),
    property_type VARCHAR(50),
    phone_number VARCHAR(20),
    analyzed_at TIMESTAMP,
    risk_score DECIMAL,
    classification VARCHAR(20)
);
```

**Analysis Results Table:**
```sql
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY,
    listing_id UUID REFERENCES listings(id),
    price_score DECIMAL,
    image_score DECIMAL,
    text_score DECIMAL,
    pattern_score DECIMAL,
    final_score DECIMAL,
    confidence DECIMAL,
    explanation JSONB,
    created_at TIMESTAMP
);
```

**Image Vectors Table:**
```sql
CREATE TABLE image_vectors (
    id UUID PRIMARY KEY,
    listing_id UUID REFERENCES listings(id),
    image_url TEXT,
    feature_vector VECTOR(512),
    perceptual_hash VARCHAR(64),
    created_at TIMESTAMP
);
```

**User Feedback Table:**
```sql
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY,
    listing_id UUID REFERENCES listings(id),
    feedback_type VARCHAR(50),
    is_scam BOOLEAN,
    comments TEXT,
    submitted_at TIMESTAMP
);
```

### 5. Technology Stack Summary

**Frontend:**
- React.js / Vue.js
- TailwindCSS
- Axios
- Chart.js

**Backend:**
- Python 3.9+
- FastAPI
- Celery
- Redis

**AI/ML:**
- PyTorch / TensorFlow
- spaCy / Transformers
- scikit-learn
- OpenCV / PIL
- FAISS

**Database:**
- PostgreSQL (primary data)
- Redis (caching, queues)
- pgvector (vector similarity)

**Deployment:**
- Docker containers
- Docker Compose for local dev
- Cloud-ready (AWS/GCP/Azure)

### 6. Scalability Considerations

**Horizontal Scaling:**
- Stateless API design allows multiple instances
- Load balancer distributes requests
- Celery workers can scale independently
- Database read replicas for query load

**Performance Optimization:**
- Redis caching for repeated analyses
- Lazy loading of ML models
- Batch processing for image analysis
- CDN for static assets

**Data Management:**
- Partitioning listings by city/date
- Archival strategy for old data
- Vector index optimization
- Database query optimization

**Cost Optimization:**
- Use pre-trained models (no training costs)
- Efficient image storage (compression)
- Caching to reduce compute
- Serverless options for variable load

### 7. Security Considerations

- Input sanitization to prevent injection attacks
- Rate limiting to prevent abuse
- HTTPS for all communications
- No storage of user personal data
- Secure image upload handling
- API authentication for future integrations
- CORS configuration
- Environment-based secrets management

### 8. Monitoring & Logging

- Request/response logging
- Error tracking and alerting
- Performance metrics (latency, throughput)
- Model prediction monitoring
- User feedback tracking
- System health dashboards

### 9. Development Workflow

**Phase 1: MVP Core (Week 1-2)**
- Basic UI with input forms
- API skeleton with endpoints
- Price analyzer implementation
- Simple text pattern detection
- Basic risk scoring

**Phase 2: AI Enhancement (Week 2-3)**
- Image similarity detector
- Advanced NLP analysis
- Pattern detection
- Improved risk scoring

**Phase 3: Polish & Demo (Week 3-4)**
- UI/UX refinement
- Result visualization
- Demo data preparation
- Documentation
- Testing and bug fixes

### 10. Future Improvements

**Technical Enhancements:**
- Real-time listing monitoring
- Advanced deep learning models
- Graph-based broker network analysis
- Federated learning for privacy
- Mobile app development

**Feature Additions:**
- Browser extension
- WhatsApp/Telegram bot integration
- Community reporting system
- Verified broker marketplace
- Property verification partnerships
- Multi-language support
- Voice input support

**Business Scaling:**
- B2B API for rental platforms
- Premium features for power users
- Data analytics dashboard
- Scam trend reports
- Partnership with consumer protection agencies

### 11. Testing Strategy

**Unit Tests:**
- Individual analyzer components
- Risk scoring logic
- Data validation functions

**Integration Tests:**
- API endpoint testing
- Database operations
- ML pipeline integration

**End-to-End Tests:**
- Complete analysis workflow
- UI interaction flows
- Error handling scenarios

**Test Data:**
- Synthetic scam listings
- Known genuine listings
- Edge cases and anomalies
- Performance benchmarks

### 12. Deployment Architecture

**Development Environment:**
- Local Docker Compose setup
- Hot reload for development
- Mock data services

**Production Environment:**
- Container orchestration (Kubernetes/ECS)
- Auto-scaling groups
- Load balancing
- Database backups
- Monitoring and alerting
- CI/CD pipeline

This design provides a solid foundation for the MVP while maintaining flexibility for future enhancements and scale.
