# TimberGuard Tree Services - PRD

## Original Problem Statement
Build a tree removal website - a business/service website to showcase services and get leads.

## User Choices
1. **Website Type**: Showcase service to get leads
2. **Features**: All features (service showcase, quote request form, online booking, testimonials/gallery)
3. **Integrations**: Email notifications using Resend for lead notifications
4. **Design**: Natural/Earthy green theme

## User Personas
- **Homeowners**: Need tree removal, trimming, or stump grinding for residential properties
- **Property Managers**: Managing multiple properties requiring regular tree maintenance
- **Commercial Property Owners**: Need land clearing or emergency tree services

## Core Requirements (Static)
- Professional tree services showcase
- Lead generation through quote request forms
- Online booking system with calendar
- Customer testimonials display
- Project gallery
- Contact form
- Email notifications for new leads
- Mobile-responsive design
- Natural/Earthy green color theme

## What's Been Implemented (December 2024)

### Backend (FastAPI + MongoDB)
- ✅ Quote request API (`POST /api/quotes`) - stores leads, sends email notification
- ✅ Booking API (`POST /api/bookings`) - stores appointments with date/time
- ✅ Contact API (`POST /api/contact`) - stores contact messages
- ✅ Services API (`GET /api/services`) - returns 5 seeded services
- ✅ Testimonials API (`GET /api/testimonials`) - returns 5 seeded reviews
- ✅ Gallery API (`GET /api/gallery`) - returns 4 gallery items
- ✅ Resend email integration configured (requires API key)

### Frontend (React + Tailwind + Shadcn/UI)
- ✅ Hero Section - Full-screen background, glassmorphism quote form
- ✅ Navigation - Fixed header with smooth scroll, mobile menu
- ✅ Services Section - Bento-style card grid with icons
- ✅ Testimonials Section - Horizontal scroll carousel
- ✅ Gallery Section - Masonry layout with hover effects
- ✅ Booking Section - Calendar picker, time slot selection
- ✅ Contact Section - Business info + contact form
- ✅ Footer - Links, contact info, branding

### Design System
- **Colors**: Deep Forest Green (#1A3C34), Earthy Clay (#8D6E63), Safety Orange (#F97316)
- **Fonts**: Barlow Condensed (headings), Manrope (body)
- **Background**: Warm Sand (#F5F5F0)

## Prioritized Backlog

### P0 (Critical) - COMPLETED
- ✅ Lead capture forms
- ✅ Services showcase
- ✅ Contact information

### P1 (High Priority)
- Add Resend API key for email notifications to work
- Add service detail pages
- Add admin dashboard for managing leads/bookings

### P2 (Medium Priority)
- Add customer reviews submission
- Add before/after project photos
- Add service area map
- Add pricing calculator

### P3 (Low Priority)
- Add blog section for SEO
- Add FAQ section
- Add social media integration
- Add live chat widget

## Next Tasks
1. Configure Resend API key for email notifications
2. Add admin dashboard for lead management
3. Add service detail pages with more info
4. Add SEO optimization (meta tags, structured data)
