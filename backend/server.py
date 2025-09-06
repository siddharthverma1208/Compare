from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from enum import Enum
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Comparify API", description="Price comparison app backend")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
class ComparisonType(str, Enum):
    ride = "ride"
    grocery = "grocery"
    pharmacy = "pharmacy"
    food = "food"

class RideVehicleType(str, Enum):
    auto = "auto"
    bike = "bike"
    car = "car"
    cab = "cab"

# Data Models
class RideComparison(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    pickup_location: str
    drop_location: str
    distance_km: float
    estimated_duration_mins: int
    providers: List[Dict[str, Any]]  # Provider-specific data
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    best_price_provider: str
    best_time_provider: str

class RideComparisonCreate(BaseModel):
    pickup_location: str
    drop_location: str
    distance_km: float
    estimated_duration_mins: int
    user_id: Optional[str] = None

class GroceryComparison(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    product_name: str
    brand: Optional[str] = None
    category: str
    search_query: str
    providers: List[Dict[str, Any]]  # Provider-specific data with normalized prices
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    best_price_provider: str
    best_delivery_provider: str

class GroceryComparisonCreate(BaseModel):
    product_name: str
    brand: Optional[str] = None
    category: str
    search_query: str
    user_id: Optional[str] = None

class UserPreferences(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    preferred_providers: Dict[str, List[str]]  # {ride: [uber, ola], grocery: [blinkit]}
    budget_limits: Dict[str, float]  # {ride: 200, grocery: 500}
    notification_settings: Dict[str, bool]
    location_preferences: Dict[str, str]  # Default pickup/delivery addresses
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserPreferencesCreate(BaseModel):
    user_id: str
    preferred_providers: Optional[Dict[str, List[str]]] = {}
    budget_limits: Optional[Dict[str, float]] = {}
    notification_settings: Optional[Dict[str, bool]] = {}
    location_preferences: Optional[Dict[str, str]] = {}

class SavingsRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    comparison_type: ComparisonType
    comparison_id: str
    original_price: float
    chosen_price: float
    savings_amount: float
    provider_chosen: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PriceAlert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    comparison_type: ComparisonType
    product_name: Optional[str] = None  # For groceries
    route: Optional[str] = None  # For rides (pickup-drop)
    target_price: float
    current_price: float
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_checked: datetime = Field(default_factory=datetime.utcnow)

class PriceAlertCreate(BaseModel):
    user_id: str
    comparison_type: ComparisonType
    product_name: Optional[str] = None
    route: Optional[str] = None
    target_price: float

# Mock data generators for development
def generate_mock_ride_providers(pickup: str, drop: str, distance: float):
    return [
        {
            "provider": "Uber",
            "vehicle_type": "UberGo",
            "estimated_fare": 120,
            "estimated_time": "8-12 mins",
            "surge_multiplier": 1.0,
            "coupon_discount": 20,
            "wallet_balance": 0,
            "features": ["AC Car", "GPS Tracking", "24/7 Support"]
        },
        {
            "provider": "Ola",
            "vehicle_type": "Mini",
            "estimated_fare": 110,
            "estimated_time": "10-15 mins",
            "surge_multiplier": 1.2,
            "coupon_discount": 0,
            "wallet_balance": 50,
            "features": ["AC Car", "Safety Features", "Easy Cancellation"]
        },
        {
            "provider": "Rapido",
            "vehicle_type": "Bike",
            "estimated_fare": 35,
            "estimated_time": "12-18 mins",
            "surge_multiplier": 1.0,
            "coupon_discount": 0,
            "wallet_balance": 0,
            "features": ["Fastest Route", "Helmet Provided", "Eco-Friendly"]
        },
        {
            "provider": "Namma Yatri",
            "vehicle_type": "Auto",
            "estimated_fare": 65,
            "estimated_time": "15-20 mins",
            "surge_multiplier": 1.0,
            "coupon_discount": 0,
            "wallet_balance": 0,
            "features": ["Fixed Fare", "No Commission", "Local Drivers"]
        }
    ]

def generate_mock_grocery_providers(product_name: str):
    return [
        {
            "provider": "Blinkit",
            "product_name": product_name,
            "brand": "India Gate",
            "size": "5 kg",
            "price": 520,
            "mrp": 550,
            "price_per_unit": 104,
            "unit": "kg",
            "delivery_fee": 0,
            "delivery_time": "10-15 mins",
            "discount": 30,
            "rating": 4.4,
            "review_count": 2100,
            "in_stock": True,
            "offers": ["First Order 10% Off", "Free Delivery"]
        },
        {
            "provider": "Instamart", 
            "product_name": product_name,
            "brand": "India Gate",
            "size": "5 kg",
            "price": 540,
            "mrp": 580,
            "price_per_unit": 108,
            "unit": "kg",
            "delivery_fee": 25,
            "delivery_time": "15-25 mins",
            "discount": 40,
            "rating": 4.3,
            "review_count": 750,
            "in_stock": True,
            "offers": ["Weekend Special", "Bulk Order Discount"]
        },
        {
            "provider": "Zepto",
            "product_name": product_name,
            "brand": "India Gate", 
            "size": "5 kg",
            "price": 535,
            "mrp": 550,
            "price_per_unit": 107,
            "unit": "kg",
            "delivery_fee": 0,
            "delivery_time": "8-12 mins",
            "discount": 15,
            "rating": 4.5,
            "review_count": 890,
            "in_stock": True,
            "offers": ["Free Delivery", "Express Delivery"]
        },
        {
            "provider": "BigBasket",
            "product_name": product_name,
            "brand": "India Gate",
            "size": "5 kg", 
            "price": 510,
            "mrp": 600,
            "price_per_unit": 102,
            "unit": "kg",
            "delivery_fee": 40,
            "delivery_time": "2-4 hours",
            "discount": 90,
            "rating": 4.2,
            "review_count": 1580,
            "in_stock": True,
            "offers": ["Buy 2 Get 5% Off", "Free Delivery above ₹200"]
        }
    ]

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Comparify API - Save money on rides & groceries"}

# Ride comparison endpoints
@api_router.post("/rides/compare", response_model=RideComparison)
async def compare_rides(comparison_data: RideComparisonCreate):
    """Compare ride prices across multiple providers"""
    providers = generate_mock_ride_providers(
        comparison_data.pickup_location, 
        comparison_data.drop_location,
        comparison_data.distance_km
    )
    
    # Find best options
    best_price = min(providers, key=lambda x: x["estimated_fare"] - x["coupon_discount"] - x["wallet_balance"])
    best_time = min(providers, key=lambda x: int(x["estimated_time"].split("-")[0]))
    
    comparison = RideComparison(
        **comparison_data.dict(),
        providers=providers,
        best_price_provider=best_price["provider"],
        best_time_provider=best_time["provider"]
    )
    
    # Save to database
    await db.ride_comparisons.insert_one(comparison.dict())
    return comparison

@api_router.get("/rides/history", response_model=List[RideComparison])
async def get_ride_history(user_id: Optional[str] = None, limit: int = 20):
    """Get ride comparison history"""
    query = {"user_id": user_id} if user_id else {}
    comparisons = await db.ride_comparisons.find(query).limit(limit).sort("timestamp", -1).to_list(limit)
    return [RideComparison(**comp) for comp in comparisons]

# Grocery comparison endpoints
@api_router.post("/groceries/compare", response_model=GroceryComparison)
async def compare_groceries(comparison_data: GroceryComparisonCreate):
    """Compare grocery prices across multiple providers"""
    providers = generate_mock_grocery_providers(comparison_data.product_name)
    
    # Find best options
    best_price = min(providers, key=lambda x: x["price"] + x["delivery_fee"])
    best_delivery = min(providers, key=lambda x: int(x["delivery_time"].split("-")[0]))
    
    comparison = GroceryComparison(
        **comparison_data.dict(),
        providers=providers,
        best_price_provider=best_price["provider"],
        best_delivery_provider=best_delivery["provider"]
    )
    
    # Save to database
    await db.grocery_comparisons.insert_one(comparison.dict())
    return comparison

@api_router.get("/groceries/history", response_model=List[GroceryComparison])
async def get_grocery_history(user_id: Optional[str] = None, limit: int = 20):
    """Get grocery comparison history"""
    query = {"user_id": user_id} if user_id else {}
    comparisons = await db.grocery_comparisons.find(query).limit(limit).sort("timestamp", -1).to_list(limit)
    return [GroceryComparison(**comp) for comp in comparisons]

# User preferences endpoints
@api_router.post("/user/preferences", response_model=UserPreferences)
async def create_user_preferences(preferences: UserPreferencesCreate):
    """Create or update user preferences"""
    existing = await db.user_preferences.find_one({"user_id": preferences.user_id})
    
    if existing:
        # Update existing preferences
        update_data = preferences.dict()
        update_data["updated_at"] = datetime.utcnow()
        await db.user_preferences.update_one(
            {"user_id": preferences.user_id},
            {"$set": update_data}
        )
        updated = await db.user_preferences.find_one({"user_id": preferences.user_id})
        return UserPreferences(**updated)
    else:
        # Create new preferences
        new_preferences = UserPreferences(**preferences.dict())
        await db.user_preferences.insert_one(new_preferences.dict())
        return new_preferences

@api_router.get("/user/preferences/{user_id}", response_model=UserPreferences)
async def get_user_preferences(user_id: str):
    """Get user preferences"""
    preferences = await db.user_preferences.find_one({"user_id": user_id})
    if not preferences:
        raise HTTPException(status_code=404, detail="User preferences not found")
    return UserPreferences(**preferences)

# Savings tracking endpoints
@api_router.post("/savings/record", response_model=SavingsRecord)
async def record_savings(
    user_id: str,
    comparison_type: ComparisonType,
    comparison_id: str,
    original_price: float,
    chosen_price: float,
    provider_chosen: str
):
    """Record a savings transaction"""
    savings_amount = original_price - chosen_price
    
    savings_record = SavingsRecord(
        user_id=user_id,
        comparison_type=comparison_type,
        comparison_id=comparison_id,
        original_price=original_price,
        chosen_price=chosen_price,
        savings_amount=savings_amount,
        provider_chosen=provider_chosen
    )
    
    await db.savings_records.insert_one(savings_record.dict())
    return savings_record

@api_router.get("/savings/user/{user_id}", response_model=List[SavingsRecord])
async def get_user_savings(user_id: str, limit: int = 50):
    """Get user's savings history"""
    savings = await db.savings_records.find({"user_id": user_id}).limit(limit).sort("timestamp", -1).to_list(limit)
    return [SavingsRecord(**record) for record in savings]

@api_router.get("/savings/summary/{user_id}")
async def get_savings_summary(user_id: str):
    """Get user's savings summary statistics"""
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$group": {
            "_id": None,
            "total_savings": {"$sum": "$savings_amount"},
            "total_transactions": {"$sum": 1},
            "avg_savings": {"$avg": "$savings_amount"},
            "ride_savings": {"$sum": {"$cond": [{"$eq": ["$comparison_type", "ride"]}, "$savings_amount", 0]}},
            "grocery_savings": {"$sum": {"$cond": [{"$eq": ["$comparison_type", "grocery"]}, "$savings_amount", 0]}}
        }}
    ]
    
    result = await db.savings_records.aggregate(pipeline).to_list(1)
    if not result:
        return {
            "total_savings": 0,
            "total_transactions": 0,
            "avg_savings": 0,
            "ride_savings": 0,
            "grocery_savings": 0
        }
    
    return result[0]

# Price alerts endpoints
@api_router.post("/alerts", response_model=PriceAlert)
async def create_price_alert(alert_data: PriceAlertCreate):
    """Create a price alert"""
    # Get current price based on comparison type
    current_price = 0.0  # Would be fetched from real providers
    
    alert = PriceAlert(
        **alert_data.dict(),
        current_price=current_price
    )
    
    await db.price_alerts.insert_one(alert.dict())
    return alert

@api_router.get("/alerts/user/{user_id}", response_model=List[PriceAlert])
async def get_user_alerts(user_id: str, active_only: bool = True):
    """Get user's price alerts"""
    query = {"user_id": user_id}
    if active_only:
        query["is_active"] = True
        
    alerts = await db.price_alerts.find(query).sort("created_at", -1).to_list(100)
    return [PriceAlert(**alert) for alert in alerts]

@api_router.delete("/alerts/{alert_id}")
async def delete_price_alert(alert_id: str):
    """Delete a price alert"""
    result = await db.price_alerts.delete_one({"id": alert_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted successfully"}

# Analytics endpoints
@api_router.get("/analytics/popular-routes")
async def get_popular_routes(limit: int = 10):
    """Get most popular ride routes"""
    pipeline = [
        {"$group": {
            "_id": {"pickup": "$pickup_location", "drop": "$drop_location"},
            "count": {"$sum": 1},
            "avg_distance": {"$avg": "$distance_km"},
            "most_chosen_provider": {"$first": "$best_price_provider"}
        }},
        {"$sort": {"count": -1}},
        {"$limit": limit}
    ]
    
    results = await db.ride_comparisons.aggregate(pipeline).to_list(limit)
    return results

@api_router.get("/analytics/popular-products")
async def get_popular_products(limit: int = 10):
    """Get most compared grocery products"""
    pipeline = [
        {"$group": {
            "_id": "$product_name",
            "count": {"$sum": 1},
            "avg_savings": {"$avg": {"$subtract": [
                {"$arrayElemAt": [{"$map": {"input": "$providers", "as": "p", "in": "$$p.price"}}, 0]},
                {"$min": {"$map": {"input": "$providers", "as": "p", "in": "$$p.price"}}}
            ]}},
            "most_chosen_provider": {"$first": "$best_price_provider"}
        }},
        {"$sort": {"count": -1}},
        {"$limit": limit}
    ]
    
    results = await db.grocery_comparisons.aggregate(pipeline).to_list(limit)
    return results

# Health check and utility endpoints
@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await db.list_collection_names()
        return {"status": "healthy", "timestamp": datetime.utcnow()}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")

@api_router.get("/providers")
async def get_supported_providers():
    """Get list of supported providers"""
    return {
        "ride_providers": ["Uber", "Ola", "Rapido", "Namma Yatri"],
        "grocery_providers": ["Blinkit", "Instamart", "Zepto", "BigBasket"],
        "coming_soon": {
            "pharmacy": ["1mg", "Netmeds", "Apollo"],
            "food": ["Swiggy", "Zomato", "Uber Eats"]
        }
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Comparify API starting up...")
    logger.info("Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
