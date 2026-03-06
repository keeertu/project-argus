from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import AnalysisResult
from services import price_engine, text_engine, image_engine, risk_scorer
import uuid
import boto3
from datetime import datetime
import json
import os

router = APIRouter(prefix="/analyze", tags=["analyze"])

def save_to_dynamodb(listing_id: str, input_data: dict, result: dict):
    """Save analysis result to DynamoDB"""
    try:
        # Skip if no AWS credentials (demo mode)
        if not os.getenv('AWS_ACCESS_KEY_ID') and not os.getenv('AWS_REGION'):
            print("Demo mode: Skipping DynamoDB save")
            return
            
        dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
        table = dynamodb.Table('argus-submissions')
        
        item = {
            'listing_id': listing_id,
            'timestamp': datetime.utcnow().isoformat(),
            'city': input_data.get('city'),
            'locality': input_data.get('locality'),
            'price': input_data.get('price'),
            'property_type': input_data.get('property_type'),
            'final_score': result.get('risk_score'),
            'verdict': result.get('verdict'),
            'title': input_data.get('title'),
            'description': input_data.get('description')
        }
        
        table.put_item(Item=item)
    except Exception as e:
        print(f"Error saving to DynamoDB: {str(e)}")
        # Don't fail the request if DynamoDB save fails

@router.post("/", response_model=AnalysisResult)
async def analyze_listing(
    title: str = Form(...),
    description: str = Form(...),
    price: int = Form(...),
    locality: str = Form(...),
    city: str = Form(...),
    property_type: str = Form(...),
    contact_number: str = Form(None),
    images: list[UploadFile] = File(None)
):
    """
    Analyze a rental listing for scam indicators
    
    Accepts multipart form data with listing details and optional images.
    Returns comprehensive risk analysis with score, verdict, and recommendations.
    """
    try:
        # Generate unique listing ID
        listing_id = str(uuid.uuid4())
        
        # Run price analysis
        try:
            price_result = price_engine.analyze_price(
                price=price,
                city=city,
                locality=locality,
                property_type=property_type
            )
        except Exception as e:
            print(f"Price analysis error: {str(e)}")
            price_result = {
                "score": 50,
                "verdict": "Unable to verify",
                "market_median": None,
                "percentage_below_market": None,
                "reasoning": "Price analysis unavailable"
            }
        
        # Run text analysis
        try:
            text_result = text_engine.analyze_text(
                title=title,
                description=description,
                contact_number=contact_number
            )
        except Exception as e:
            print(f"Text analysis error: {str(e)}")
            text_result = {
                "score": 50,
                "verdict": "Unable to analyze",
                "flags": [],
                "reasoning": "Text analysis unavailable"
            }
        
        # Run image analysis
        try:
            if images and len(images) > 0:
                image_result = await image_engine.analyze_images(images)
            else:
                image_result = {
                    "score": 20,
                    "verdict": "No image provided",
                    "flags": [],
                    "reasoning": "No images were provided for analysis"
                }
        except Exception as e:
            print(f"Image analysis error: {str(e)}")
            image_result = {
                "score": 50,
                "verdict": "Unable to analyze",
                "flags": [],
                "reasoning": "Image analysis unavailable"
            }
        
        # Calculate final risk score
        final_result = risk_scorer.calculate_final_score(
            price_result=price_result,
            text_result=text_result,
            image_result=image_result
        )
        
        # Prepare response
        analysis_result = AnalysisResult(
            risk_score=final_result["final_score"],
            verdict=final_result["verdict"],
            price_analysis=price_result,
            text_analysis=text_result,
            image_analysis=image_result,
            recommendations=final_result["recommendations"],
            listing_id=listing_id
        )
        
        # Save to DynamoDB (non-blocking)
        input_data = {
            "title": title,
            "description": description,
            "price": price,
            "locality": locality,
            "city": city,
            "property_type": property_type
        }
        save_to_dynamodb(listing_id, input_data, analysis_result.dict())
        
        return analysis_result
        
    except Exception as e:
        print(f"Analysis endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/url", response_model=AnalysisResult)
async def analyze_listing_url(url: str = Form(...)):
    """
    Analyze a rental listing from URL with intelligent scraping and fallback
    
    Accepts URL from supported platforms (99acres, MagicBricks, Housing.com, NoBroker)
    Returns comprehensive risk analysis with scraped data
    """
    try:
        from scrapers.listing_scraper import SmartScraper
        
        # Generate unique listing ID
        listing_id = str(uuid.uuid4())
        
        # Scrape listing data (with intelligent fallback)
        scraper = SmartScraper()
        scraped = scraper.scrape(url)
        
        # Run price analysis
        try:
            price_result = price_engine.analyze_price(
                price=scraped['price'],
                city=scraped['city'],
                locality=scraped['locality'],
                property_type=scraped['property_type']
            )
        except Exception as e:
            print(f"Price analysis error: {str(e)}")
            price_result = {
                "score": 50,
                "verdict": "Unable to verify",
                "market_median": None,
                "percentage_below_market": None,
                "reasoning": "Price analysis unavailable"
            }
        
        # Build combined context for AI cross-signal reasoning
        combined_context = f"""LISTING DETAILS:
Title: {scraped['title']}
Description: {scraped['description']}

PRICE ANALYSIS OBSERVATION:
Listed Price: Rs {scraped['price']:,}
Market Median: Rs {price_result.get('market_median', 'N/A')}
Percentage Below Market: {price_result.get('percentage_below_market', 'N/A')}%
Price Risk Score: {price_result['score']}/100
Price Verdict: {price_result['verdict']}

Based on ALL of the above information together, analyze this rental listing for Indian rental scam patterns. Consider both the price anomaly AND the description language together when forming your verdict. Cross-reference these signals to give a more accurate combined assessment."""
        
        # Run text analysis with combined context
        try:
            text_result = text_engine.analyze_text(
                title=scraped['title'],
                description=combined_context,  # Pass combined context
                contact_number=None
            )
        except Exception as e:
            print(f"Text analysis error: {str(e)}")
            text_result = {
                "score": 50,
                "verdict": "Unable to analyze",
                "flags": [],
                "reasoning": "Text analysis unavailable"
            }
        
        # Run image analysis (placeholder for now)
        image_result = {
            "score": 20,
            "verdict": "No images analyzed",
            "flags": [],
            "reasoning": "Image analysis from URLs coming in Phase 2"
        }
        
        # Calculate final risk score
        final_result = risk_scorer.calculate_final_score(
            price_result=price_result,
            text_result=text_result,
            image_result=image_result
        )
        
        # Prepare response with scraped data
        analysis_result = AnalysisResult(
            risk_score=final_result["final_score"],
            verdict=final_result["verdict"],
            price_analysis=price_result,
            text_analysis=text_result,
            image_analysis=image_result,
            recommendations=final_result["recommendations"],
            listing_id=listing_id
        )
        
        # Save to local JSON storage (simple file-based storage for demo)
        try:
            import json
            from pathlib import Path
            
            results_file = Path("results.json")
            results = []
            
            if results_file.exists():
                with open(results_file, 'r') as f:
                    results = json.load(f)
            
            results.append({
                "listing_id": listing_id,
                "timestamp": datetime.utcnow().isoformat(),
                "source_url": url,
                "scraped_data": scraped,
                "analysis": analysis_result.dict()
            })
            
            # Keep only last 100 results
            results = results[-100:]
            
            with open(results_file, 'w') as f:
                json.dump(results, f, indent=2)
        except Exception as e:
            print(f"Error saving to results.json: {str(e)}")
        
        # Add scraped data to response
        response_dict = analysis_result.dict()
        response_dict["scraped_data"] = {
            "title": scraped['title'],
            "description": scraped['description'],
            "price": scraped['price'],
            "locality": scraped['locality'],
            "platform": scraped['platform'],
            "source_url": url
        }
        response_dict["scrape_method"] = scraped['scrape_method']
        response_dict["source_url"] = url
        
        return response_dict
        
    except Exception as e:
        print(f"URL analysis endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
