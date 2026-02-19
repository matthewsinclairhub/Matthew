from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', '')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ================ Models ================

class QuoteRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    service: str
    address: str
    message: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class QuoteRequestCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    address: str
    message: Optional[str] = ""

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    service: str
    address: str
    preferred_date: str
    preferred_time: str
    notes: Optional[str] = ""
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    service: str
    address: str
    preferred_date: str
    preferred_time: str
    notes: Optional[str] = ""

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: str
    message: str

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    rating: int
    review: str
    service: str
    date: str

class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image_url: str
    category: str

# ================ Email Helper ================

async def send_notification_email(subject: str, html_content: str):
    """Send notification email using Resend"""
    if not resend.api_key or not NOTIFICATION_EMAIL:
        logger.warning("Email not configured - skipping notification")
        return None
    
    params = {
        "from": SENDER_EMAIL,
        "to": [NOTIFICATION_EMAIL],
        "subject": subject,
        "html": html_content
    }
    
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent successfully: {email.get('id')}")
        return email
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return None

# ================ Routes ================

@api_router.get("/")
async def root():
    return {"message": "Illawarra Tree Removal API"}

# Quote Request Routes
@api_router.post("/quotes", response_model=QuoteRequest)
async def create_quote_request(input: QuoteRequestCreate):
    quote_obj = QuoteRequest(**input.model_dump())
    doc = quote_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.quotes.insert_one(doc)
    
    # Send email notification
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-left: 4px solid #F97316;">
            <h2 style="color: #1A3C34; margin-bottom: 20px;">New Quote Request</h2>
            <p><strong>Name:</strong> {quote_obj.name}</p>
            <p><strong>Email:</strong> {quote_obj.email}</p>
            <p><strong>Phone:</strong> {quote_obj.phone}</p>
            <p><strong>Service:</strong> {quote_obj.service}</p>
            <p><strong>Address:</strong> {quote_obj.address}</p>
            <p><strong>Message:</strong> {quote_obj.message or 'N/A'}</p>
            <hr style="border: none; border-top: 1px solid #e5e5e0; margin: 20px 0;">
            <p style="color: #5A5A55; font-size: 12px;">Illawarra Tree Removal - Lead Notification</p>
        </div>
    </body>
    </html>
    """
    await send_notification_email(f"New Quote Request from {quote_obj.name}", html_content)
    
    return quote_obj

@api_router.get("/quotes", response_model=List[QuoteRequest])
async def get_quotes():
    quotes = await db.quotes.find({}, {"_id": 0}).to_list(1000)
    for q in quotes:
        if isinstance(q.get('created_at'), str):
            q['created_at'] = datetime.fromisoformat(q['created_at'])
    return quotes

# Booking Routes
@api_router.post("/bookings", response_model=Booking)
async def create_booking(input: BookingCreate):
    booking_obj = Booking(**input.model_dump())
    doc = booking_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    
    # Send email notification
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-left: 4px solid #F97316;">
            <h2 style="color: #1A3C34; margin-bottom: 20px;">New Booking Request</h2>
            <p><strong>Name:</strong> {booking_obj.name}</p>
            <p><strong>Email:</strong> {booking_obj.email}</p>
            <p><strong>Phone:</strong> {booking_obj.phone}</p>
            <p><strong>Service:</strong> {booking_obj.service}</p>
            <p><strong>Address:</strong> {booking_obj.address}</p>
            <p><strong>Preferred Date:</strong> {booking_obj.preferred_date}</p>
            <p><strong>Preferred Time:</strong> {booking_obj.preferred_time}</p>
            <p><strong>Notes:</strong> {booking_obj.notes or 'N/A'}</p>
            <hr style="border: none; border-top: 1px solid #e5e5e0; margin: 20px 0;">
            <p style="color: #5A5A55; font-size: 12px;">TimberGuard Tree Services - Booking Notification</p>
        </div>
    </body>
    </html>
    """
    await send_notification_email(f"New Booking from {booking_obj.name}", html_content)
    
    return booking_obj

@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    for b in bookings:
        if isinstance(b.get('created_at'), str):
            b['created_at'] = datetime.fromisoformat(b['created_at'])
    return bookings

# Contact Routes
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(input: ContactMessageCreate):
    contact_obj = ContactMessage(**input.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contacts.insert_one(doc)
    
    # Send email notification
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-left: 4px solid #F97316;">
            <h2 style="color: #1A3C34; margin-bottom: 20px;">New Contact Message</h2>
            <p><strong>Name:</strong> {contact_obj.name}</p>
            <p><strong>Email:</strong> {contact_obj.email}</p>
            <p><strong>Phone:</strong> {contact_obj.phone or 'N/A'}</p>
            <p><strong>Subject:</strong> {contact_obj.subject}</p>
            <p><strong>Message:</strong> {contact_obj.message}</p>
            <hr style="border: none; border-top: 1px solid #e5e5e0; margin: 20px 0;">
            <p style="color: #5A5A55; font-size: 12px;">TimberGuard Tree Services - Contact Notification</p>
        </div>
    </body>
    </html>
    """
    await send_notification_email(f"Contact: {contact_obj.subject}", html_content)
    
    return contact_obj

# Testimonials Routes
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    # Return seeded testimonials
    testimonials = [
        Testimonial(
            id="1",
            name="Sarah Mitchell",
            location="Portland, OR",
            rating=5,
            review="TimberGuard removed a massive oak that was threatening our home. Their crew was professional, efficient, and left our yard spotless. Highly recommend!",
            service="Tree Removal",
            date="December 2024"
        ),
        Testimonial(
            id="2",
            name="James Rodriguez",
            location="Seattle, WA",
            rating=5,
            review="After the storm damaged several trees on our property, TimberGuard was there within hours. Their emergency response team saved us from further damage.",
            service="Emergency Services",
            date="November 2024"
        ),
        Testimonial(
            id="3",
            name="Emily Chen",
            location="Vancouver, WA",
            rating=5,
            review="Professional stump grinding service! They removed five old stumps and now our backyard looks incredible. Fair pricing and excellent work.",
            service="Stump Grinding",
            date="October 2024"
        ),
        Testimonial(
            id="4",
            name="Michael Thompson",
            location="Eugene, OR",
            rating=5,
            review="Regular tree trimming from TimberGuard keeps our property looking pristine. Their arborists really know their craft.",
            service="Tree Trimming",
            date="September 2024"
        ),
        Testimonial(
            id="5",
            name="Lisa Anderson",
            location="Tacoma, WA",
            rating=5,
            review="They cleared 2 acres for our new construction project. Professional, on-time, and within budget. Will use again!",
            service="Land Clearing",
            date="August 2024"
        )
    ]
    return testimonials

# Gallery Routes
@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery():
    gallery = [
        GalleryItem(
            id="1",
            title="Oak Tree Removal",
            description="Safe removal of a 60-foot oak near residential property",
            image_url="https://images.unsplash.com/photo-1663697317598-319f0b5ef8b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBtYW5pY3VyZWQlMjBiYWNreWFyZCUyMGdhcmRlbiUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzE0ODMwMDB8MA&ixlib=rb-4.1.0&q=85",
            category="Tree Removal"
        ),
        GalleryItem(
            id="2",
            title="Commercial Land Clearing",
            description="5-acre commercial site preparation",
            image_url="https://images.unsplash.com/photo-1634316888962-75074307f81c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxiZWF1dGlmdWwlMjBtYW5pY3VyZWQlMjBiYWNreWFyZCUyMGdhcmRlbiUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzE0ODMwMDB8MA&ixlib=rb-4.1.0&q=85",
            category="Land Clearing"
        ),
        GalleryItem(
            id="3",
            title="Storm Damage Cleanup",
            description="Emergency response after major windstorm",
            image_url="https://images.unsplash.com/photo-1596481768453-8befafc2d7ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxiZWF1dGlmdWwlMjBtYW5pY3VyZWQlMjBiYWNreWFyZCUyMGdhcmRlbiUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzE0ODMwMDB8MA&ixlib=rb-4.1.0&q=85",
            category="Emergency Services"
        ),
        GalleryItem(
            id="4",
            title="Heritage Tree Pruning",
            description="Expert pruning of 100-year-old maple",
            image_url="https://images.unsplash.com/photo-1721217721953-14f4a916e018?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxiZWF1dGlmdWwlMjBtYW5pY3VyZWQlMjBiYWNreWFyZCUyMGdhcmRlbiUyMGxhbmRzY2FwZXxlbnwwfHx8fDE3NzE0ODMwMDB8MA&ixlib=rb-4.1.0&q=85",
            category="Tree Trimming"
        )
    ]
    return gallery

# Services data endpoint
@api_router.get("/services")
async def get_services():
    services = [
        {
            "id": "1",
            "title": "Tree Removal",
            "description": "Safe and efficient removal of trees of any size. We handle dangerous trees, diseased trees, and trees that need to go for construction or landscaping projects.",
            "icon": "TreeDeciduous",
            "image": "https://images.unsplash.com/photo-1669065054992-3151b15aab08?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwzfHxhcmJvcmlzdCUyMHRyZWUlMjBjbGltYmVyJTIwc2FmZXR5JTIwZ2VhcnxlbnwwfHx8fDE3NzE0ODI5OTR8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "2",
            "title": "Tree Trimming",
            "description": "Expert pruning and trimming to maintain tree health, improve appearance, and prevent hazards. Regular maintenance keeps your trees beautiful and safe.",
            "icon": "Scissors",
            "image": "https://images.unsplash.com/photo-1765064519883-651c506ec70d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHw0fHxhcmJvcmlzdCUyMHRyZWUlMjBjbGltYmVyJTIwc2FmZXR5JTIwZ2VhcnxlbnwwfHx8fDE3NzE0ODI5OTR8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "3",
            "title": "Stump Grinding",
            "description": "Complete stump removal using professional grinding equipment. Reclaim your yard space and eliminate tripping hazards and pest habitats.",
            "icon": "CircleDot",
            "image": "https://images.unsplash.com/photo-1617143520628-86934f404d06?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwyfHx0cmVlJTIwc3R1bXAlMjBncmluZGluZyUyMG1hY2hpbmUlMjBhY3Rpb258ZW58MHx8fHwxNzcxNDgyOTk4fDA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "4",
            "title": "Emergency Services",
            "description": "24/7 emergency response for storm damage, fallen trees, and hazardous situations. We're here when you need us most.",
            "icon": "AlertTriangle",
            "image": "https://images.unsplash.com/photo-1765064520245-2baac5e82689?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxhcmJvcmlzdCUyMHRyZWUlMjBjbGltYmVyJTIwc2FmZXR5JTIwZ2VhcnxlbnwwfHx8fDE3NzE0ODI5OTR8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "5",
            "title": "Land Clearing",
            "description": "Complete site preparation for construction, landscaping, or agricultural use. We handle projects of any scale with professional equipment.",
            "icon": "Mountain",
            "image": "https://images.unsplash.com/photo-1642005581880-3536a680febf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwzfHx0cmVlJTIwc3R1bXAlMjBncmluZGluZyUyMG1hY2hpbmUlMjBhY3Rpb258ZW58MHx8fHwxNzcxNDgyOTk4fDA&ixlib=rb-4.1.0&q=85"
        }
    ]
    return services

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
