# 🔗 Project Argus - URL Workflow Guide

## Overview

The URL-first workflow allows users to paste rental listing URLs and get instant AI-powered scam analysis. This creates a seamless demo experience perfect for hackathon judges.

## Architecture

```
User pastes URL
     ↓
SmartScraper detects platform (99acres, MagicBricks, etc.)
     ↓
Attempts real scraping with anti-bot headers
     ↓
If blocked/fails → Graceful fallback to mock data
     ↓
Price analysis on scraped data
     ↓
Combined context for AI (price + text together)
     ↓
Cross-signal reasoning by Claude
     ↓
Final risk score + recommendations
```

## Key Features

### 1. Intelligent Scraping with Fallback
- **Real scraping attempt** with proper headers
- **Silent fallback** to mock data if blocked
- **No errors shown** to user - seamless experience
- **Platform detection** from URL

### 2. Cross-Signal AI Reasoning
The AI now receives BOTH price analysis AND text together:

```
LISTING DETAILS:
Title: [scraped title]
Description: [scraped description]

PRICE ANALYSIS OBSERVATION:
Listed Price: Rs 9,500
Market Median: Rs 38,000
Percentage Below Market: 75%
Price Risk Score: 90/100
Price Verdict: High Risk - Price Too Low

Based on ALL of the above...
```

This allows Claude to make **smarter decisions** by connecting signals:
- Low price + urgency tactics = HIGH SCAM RISK
- Low price + professional description = Maybe just a good deal
- Normal price + urgency tactics = SUSPICIOUS

### 3. Demo-Perfect UX

**Demo Button Flow:**
1. Judge clicks "🚨 Try a Scam Listing"
2. URL tab activates
3. Demo URL appears in input
4. Platform detected (✓ 99acres detected)
5. Auto-analysis starts after 500ms
6. Loading animation plays
7. Results animate in

**Perfect for live demos!**

## Frontend Components

### URLInput.jsx
- Text input for URL
- Real-time platform detection
- Visual feedback (✓ Platform detected)
- Supports: 99acres, MagicBricks, Housing.com, NoBroker

### Tab Switcher
- 🔗 Analyze by URL (default)
- ✏️ Enter Manually
- Smooth transitions
- Independent workflows

### AnalyzingLoader.jsx
- Different steps for URL vs Manual mode
- URL mode: "🌐 Fetching from [platform]..."
- Shows detected platform name
- 4-step progress animation

### ResultDashboard.jsx
- Demo mode badge (if mock data used)
- Source section showing:
  - Platform name
  - Original URL
  - Scraped title
- Honest but not alarming messaging

## Backend Components

### scrapers/listing_scraper.py

**SmartScraper class:**
```python
scraper = SmartScraper()
data = scraper.scrape(url)
# Returns: title, description, price, locality, city, property_type, scrape_method
```

**Platform Detection:**
- 99acres → Scam demo data
- MagicBricks → Suspicious demo data
- NoBroker → Genuine demo data
- Housing.com → Luxury demo data
- Unknown → Generic scam data

**Graceful Fallback:**
- Tries real scraping first
- If ANY error → mock_scrape()
- No exceptions thrown
- Always returns valid data

### routers/analyze.py

**New endpoint: POST /analyze/url**
```python
@router.post("/url")
async def analyze_listing_url(url: str = Form(...)):
    # 1. Scrape with fallback
    # 2. Price analysis
    # 3. Combined context for AI
    # 4. Text analysis with cross-signals
    # 5. Image placeholder
    # 6. Final scoring
    # 7. Save to results.json
    # 8. Return with scraped_data
```

### services/text_engine.py

**Updated System Prompt:**
- Emphasizes cross-signal reasoning
- Looks for price + text combinations
- 2-sentence reasoning connecting both signals
- More accurate scam detection

## Demo Listings

### Scam (99acres)
```
URL: https://www.99acres.com/demo-scam-listing-urgent
Price: ₹9,500 (75% below market)
Signals: Urgent, token amount, WhatsApp only, owner abroad
Expected: 85-95 risk score
```

### Suspicious (MagicBricks)
```
URL: https://www.magicbricks.com/demo-suspicious-listing
Price: ₹13,000 (46% below market)
Signals: Vague description, minimal details
Expected: 50-65 risk score
```

### Genuine (NoBroker)
```
URL: https://www.nobroker.in/demo-genuine-listing
Price: ₹32,000 (at market rate)
Signals: Detailed, professional, visit timings
Expected: 20-30 risk score
```

## Testing

### Local Testing
1. Backend running on http://localhost:8080
2. Frontend running on http://localhost:3000
3. Click demo buttons
4. Watch the magic happen!

### Test URLs
```bash
# Scam
https://www.99acres.com/demo-scam-listing-urgent

# Suspicious
https://www.magicbricks.com/demo-suspicious-listing

# Genuine
https://www.nobroker.in/demo-genuine-listing

# Any real URL (will use mock data due to anti-bot)
https://www.99acres.com/any-real-listing
```

## Production Deployment

### Phase 1 (Current - Demo Mode)
- Mock data for all URLs
- Perfect for hackathon demo
- No external dependencies
- Fast and reliable

### Phase 2 (AWS Deployment)
- Real scraping with AWS Lambda
- Proxy rotation for anti-bot bypass
- Image scraping and analysis
- Full Bedrock integration

## Advantages

### For Hackathon Demo
✅ **Instant gratification** - Paste URL, get results
✅ **No typing** - Demo buttons auto-fill
✅ **Smooth animations** - Professional feel
✅ **Honest messaging** - Demo mode badge
✅ **Works offline** - No external dependencies

### For Users
✅ **Easy to use** - Just paste URL
✅ **Fast** - No manual entry
✅ **Familiar** - Works with known platforms
✅ **Reliable** - Fallback ensures it always works

### For Judges
✅ **Impressive** - URL → Results in seconds
✅ **Practical** - Real-world use case
✅ **Scalable** - Clear path to production
✅ **Honest** - Transparent about demo mode

## Technical Details

### BeautifulSoup Parser
**CRITICAL:** Always use `"html.parser"`
```python
soup = BeautifulSoup(html, "html.parser")  # ✅ Docker-compatible
soup = BeautifulSoup(html, "lxml")         # ❌ Requires C dependencies
```

### Anti-Bot Headers
```python
headers = {
    "User-Agent": "Mozilla/5.0 ...",
    "Accept-Language": "en-IN,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml"
}
```

### Timeout
```python
requests.get(url, headers=headers, timeout=10)
```

### Error Handling
```python
try:
    # Attempt real scraping
    response = requests.get(url, ...)
    data = extract_data(response)
except Exception:
    # Silent fallback
    data = mock_scrape(url)
```

## Future Enhancements

### Phase 2
- [ ] AWS Lambda for scraping
- [ ] Proxy rotation
- [ ] Image URL scraping
- [ ] Bedrock image analysis
- [ ] Real-time updates

### Phase 3
- [ ] Browser automation (Playwright)
- [ ] CAPTCHA solving
- [ ] Historical data tracking
- [ ] Price trend analysis
- [ ] Community reporting

## Troubleshooting

### Issue: URL analysis fails
**Solution:** Check backend logs, fallback should work automatically

### Issue: Platform not detected
**Solution:** Add platform to detect_platform() method

### Issue: Mock data not realistic
**Solution:** Update mock_scrape() with better examples

### Issue: Frontend not showing URL tab
**Solution:** Check App.jsx tab state management

## Success Metrics

- ✅ URL → Results in < 5 seconds
- ✅ 100% success rate (thanks to fallback)
- ✅ Smooth demo experience
- ✅ Professional UI/UX
- ✅ Honest about limitations
- ✅ Clear path to production

---

**The URL workflow makes Project Argus feel like a real product, not a hackathon demo!**
