import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { 
  TreeDeciduous, 
  Scissors, 
  CircleDot, 
  AlertTriangle, 
  Mountain,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Shield,
  Users,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Icon mapping
const iconMap = {
  TreeDeciduous: TreeDeciduous,
  Scissors: Scissors,
  CircleDot: CircleDot,
  AlertTriangle: AlertTriangle,
  Mountain: Mountain,
};

// Navigation Component
const Navigation = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass-dark py-3' : 'py-6'}`} data-testid="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <TreeDeciduous className="h-8 w-8 text-[#F97316]" />
              <span className="text-2xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                TimberGuard
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('services')} className="nav-link">Services</button>
              <button onClick={() => scrollToSection('gallery')} className="nav-link">Gallery</button>
              <button onClick={() => scrollToSection('testimonials')} className="nav-link">Testimonials</button>
              <button onClick={() => scrollToSection('booking')} className="nav-link">Book Now</button>
              <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button 
                onClick={() => scrollToSection('quote')}
                className="bg-[#F97316] hover:bg-[#ea580c] text-white uppercase tracking-wider font-bold px-6"
                data-testid="nav-quote-btn"
              >
                Get Free Quote
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(true)}
              data-testid="mobile-menu-btn"
            >
              <Menu className="h-8 w-8" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" data-testid="mobile-menu">
          <button 
            className="absolute top-6 right-6 text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          <button onClick={() => scrollToSection('services')}>Services</button>
          <button onClick={() => scrollToSection('gallery')}>Gallery</button>
          <button onClick={() => scrollToSection('testimonials')}>Testimonials</button>
          <button onClick={() => scrollToSection('booking')}>Book Now</button>
          <button onClick={() => scrollToSection('contact')}>Contact</button>
          <Button 
            onClick={() => scrollToSection('quote')}
            className="bg-[#F97316] hover:bg-[#ea580c] text-white uppercase tracking-wider font-bold px-8 py-4 mt-4"
          >
            Get Free Quote
          </Button>
        </div>
      )}
    </>
  );
};

// Hero Section
const HeroSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    address: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API}/quotes`, formData);
      toast.success("Quote request submitted! We'll contact you shortly.");
      setFormData({ name: '', email: '', phone: '', service: '', address: '', message: '' });
    } catch (error) {
      toast.error("Failed to submit quote request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="quote"
      className="hero-section relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1765064520245-2baac5e82689?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxhcmJvcmlzdCUyMHRyZWUlMjBjbGltYmVyJTIwc2FmZXR5JTIwZ2VhcnxlbnwwfHx8fDE3NzE0ODI5OTR8MA&ixlib=rb-4.1.0&q=85')`
      }}
      data-testid="hero-section"
    >
      <div className="hero-overlay"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 w-full py-32">
          {/* Left Content */}
          <div className="flex flex-col justify-center animate-slide-in-left">
            <p className="text-[#F97316] font-semibold uppercase tracking-widest text-sm mb-4">Professional Tree Services</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tight leading-none mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Expert Tree Care<br />
              <span className="text-[#F97316]">You Can Trust</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              From tree removal to emergency storm cleanup, our certified arborists deliver safe, professional service every time.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="h-5 w-5 text-[#F97316]" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Users className="h-5 w-5 text-[#F97316]" />
                <span>25+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Award className="h-5 w-5 text-[#F97316]" />
                <span>ISA Certified</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-[#F97316]" />
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>(555) 123-TREE</span>
            </div>
          </div>

          {/* Quote Form */}
          <div className="quote-form-container p-8 shadow-2xl animate-slide-in-right animation-delay-200" data-testid="quote-form">
            <h3 className="text-2xl font-bold text-[#1A3C34] uppercase tracking-wide mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Get Your Free Quote
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Full Name *</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input"
                  placeholder="John Smith"
                  data-testid="quote-name-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input"
                    placeholder="john@email.com"
                    data-testid="quote-email-input"
                  />
                </div>
                <div>
                  <label className="form-label">Phone *</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="form-input"
                    placeholder="(555) 123-4567"
                    data-testid="quote-phone-input"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Service Needed *</label>
                <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                  <SelectTrigger className="form-input" data-testid="quote-service-select">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tree-removal">Tree Removal</SelectItem>
                    <SelectItem value="tree-trimming">Tree Trimming</SelectItem>
                    <SelectItem value="stump-grinding">Stump Grinding</SelectItem>
                    <SelectItem value="emergency">Emergency Services</SelectItem>
                    <SelectItem value="land-clearing">Land Clearing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="form-label">Property Address *</label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="form-input"
                  placeholder="123 Main St, Portland, OR"
                  data-testid="quote-address-input"
                />
              </div>
              <div>
                <label className="form-label">Additional Details</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="form-input min-h-[80px]"
                  placeholder="Tell us about your project..."
                  data-testid="quote-message-input"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white uppercase tracking-wider font-bold py-4 text-lg"
                data-testid="quote-submit-btn"
              >
                {loading ? 'Submitting...' : 'Request Free Quote'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Services Section
const ServicesSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API}/services`);
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-20 md:py-32 bg-[#F5F5F0] grain-overlay" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-header">
          <p className="section-caption">What We Do</p>
          <h2 className="section-title">Our Services</h2>
        </div>

        <div className="bento-grid">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || TreeDeciduous;
            return (
              <div 
                key={service.id}
                className={`service-card p-6 md:p-8 flex flex-col justify-between animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`service-card-${service.id}`}
              >
                <div>
                  <div className="w-12 h-12 bg-[#1A3C34] flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-[#F97316]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1A3C34] uppercase tracking-wide mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {service.title}
                  </h3>
                  <p className="text-[#5A5A55] leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[#F97316] font-semibold cursor-pointer group">
                  <span className="uppercase text-sm tracking-wide">Learn More</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${API}/testimonials`);
        setTestimonials(response.data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-[#1A3C34]" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-header">
          <p className="text-[#F97316] font-semibold uppercase tracking-widest text-sm mb-2">What Our Clients Say</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            Customer Reviews
          </h2>
        </div>

        <div className="horizontal-scroll pb-4 -mx-4 px-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="testimonial-card animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`testimonial-card-${testimonial.id}`}
            >
              <div className="star-rating mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5" />
                ))}
              </div>
              <p className="text-[#5A5A55] text-lg leading-relaxed mb-6 italic">
                "{testimonial.review}"
              </p>
              <div className="border-t border-[#E5E5E0] pt-4">
                <p className="font-bold text-[#1A3C34]">{testimonial.name}</p>
                <p className="text-sm text-[#8D6E63]">{testimonial.location}</p>
                <p className="text-xs text-[#5A5A55] mt-1">{testimonial.service} • {testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Gallery Section
const GallerySection = () => {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${API}/gallery`);
        setGallery(response.data);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="py-20 md:py-32 bg-[#E5E5E0]" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-header">
          <p className="section-caption">Our Work</p>
          <h2 className="section-title">Project Gallery</h2>
        </div>

        <div className="masonry-grid">
          {gallery.map((item, index) => (
            <div 
              key={item.id}
              className="masonry-item gallery-image animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`gallery-item-${item.id}`}
            >
              <img 
                src={item.image_url} 
                alt={item.title}
                className="w-full h-auto object-cover"
              />
              <div className="overlay">
                <span className="text-xs uppercase tracking-widest text-[#F97316] mb-1">{item.category}</span>
                <h4 className="text-lg font-bold" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{item.title}</h4>
                <p className="text-sm text-white/80">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Booking Section
const BookingSection = () => {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    address: '',
    preferred_time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.address || !selectedDate || !formData.preferred_time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/bookings`, {
        ...formData,
        preferred_date: selectedDate.toISOString().split('T')[0]
      });
      toast.success("Booking request submitted! We'll confirm your appointment shortly.");
      setFormData({ name: '', email: '', phone: '', service: '', address: '', preferred_time: '', notes: '' });
      setSelectedDate(undefined);
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-20 md:py-32 bg-[#F5F5F0] grain-overlay" data-testid="booking-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-header text-center">
          <p className="section-caption">Schedule Service</p>
          <h2 className="section-title">Book an Appointment</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl p-6 md:p-10">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <label className="form-label mb-4 block">Select Preferred Date *</label>
                  <div className="flex justify-center bg-[#F5F5F0] p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-none"
                      data-testid="booking-calendar"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="form-input"
                      placeholder="John Smith"
                      data-testid="booking-name-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="form-input"
                        placeholder="john@email.com"
                        data-testid="booking-email-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Phone *</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="form-input"
                        placeholder="(555) 123-4567"
                        data-testid="booking-phone-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Service *</label>
                    <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                      <SelectTrigger className="form-input" data-testid="booking-service-select">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tree-removal">Tree Removal</SelectItem>
                        <SelectItem value="tree-trimming">Tree Trimming</SelectItem>
                        <SelectItem value="stump-grinding">Stump Grinding</SelectItem>
                        <SelectItem value="emergency">Emergency Services</SelectItem>
                        <SelectItem value="land-clearing">Land Clearing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="form-label">Preferred Time *</label>
                    <Select value={formData.preferred_time} onValueChange={(value) => setFormData({...formData, preferred_time: value})}>
                      <SelectTrigger className="form-input" data-testid="booking-time-select">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="form-label">Property Address *</label>
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="form-input"
                      placeholder="123 Main St, Portland, OR"
                      data-testid="booking-address-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Additional Notes</label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="form-input min-h-[80px]"
                      placeholder="Any special instructions..."
                      data-testid="booking-notes-input"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#F97316] hover:bg-[#ea580c] text-white uppercase tracking-wider font-bold px-12 py-4 text-lg"
                  data-testid="booking-submit-btn"
                >
                  {loading ? 'Submitting...' : 'Book Appointment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-[#8D6E63]" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="text-white">
            <p className="text-white/70 font-semibold uppercase tracking-widest text-sm mb-2">Get In Touch</p>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Contact Us
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-md">
              Have questions or need a consultation? Our team is ready to help with all your tree service needs.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <p className="font-bold text-lg">(555) 123-TREE</p>
                  <p className="text-white/70 text-sm">24/7 Emergency Line Available</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <p className="font-bold text-lg">info@timberguard.com</p>
                  <p className="text-white/70 text-sm">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <p className="font-bold text-lg">123 Forest Lane</p>
                  <p className="text-white/70 text-sm">Portland, OR 97201</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-[#F97316]" />
                </div>
                <div>
                  <p className="font-bold text-lg">Mon - Sat: 7AM - 7PM</p>
                  <p className="text-white/70 text-sm">Sunday: Emergency Only</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 shadow-xl" data-testid="contact-form">
            <h3 className="text-2xl font-bold text-[#1A3C34] uppercase tracking-wide mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name *</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="form-input"
                    placeholder="Your name"
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input"
                    placeholder="Your email"
                    data-testid="contact-email-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="form-input"
                    placeholder="(555) 123-4567"
                    data-testid="contact-phone-input"
                  />
                </div>
                <div>
                  <label className="form-label">Subject *</label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="form-input"
                    placeholder="How can we help?"
                    data-testid="contact-subject-input"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Message *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="form-input min-h-[120px]"
                  placeholder="Tell us about your project..."
                  data-testid="contact-message-input"
                />
              </div>
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A3C34] hover:bg-[#0f251f] text-white uppercase tracking-wider font-bold py-4"
                data-testid="contact-submit-btn"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="footer py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <TreeDeciduous className="h-10 w-10 text-[#F97316]" />
              <span className="text-3xl font-bold uppercase tracking-wider" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                TimberGuard
              </span>
            </div>
            <p className="text-white/70 max-w-sm mb-6">
              Professional tree services you can trust. Over 25 years of experience serving the Pacific Northwest.
            </p>
            <div className="flex items-center gap-4">
              <Shield className="h-5 w-5 text-[#F97316]" />
              <span className="text-sm text-white/70">Fully Licensed & Insured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wide mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Services
            </h4>
            <ul className="space-y-3">
              <li><a href="#services" className="hover:text-[#F97316]">Tree Removal</a></li>
              <li><a href="#services" className="hover:text-[#F97316]">Tree Trimming</a></li>
              <li><a href="#services" className="hover:text-[#F97316]">Stump Grinding</a></li>
              <li><a href="#services" className="hover:text-[#F97316]">Emergency Services</a></li>
              <li><a href="#services" className="hover:text-[#F97316]">Land Clearing</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold uppercase tracking-wide mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Contact
            </h4>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#F97316]" />
                (555) 123-TREE
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F97316]" />
                info@timberguard.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#F97316]" />
                Portland, OR 97201
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2024 TimberGuard Tree Services. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-[#F97316]">Privacy Policy</a>
            <a href="#" className="hover:text-[#F97316]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Home Page
const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" data-testid="home-page">
      <Navigation scrolled={scrolled} />
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <GallerySection />
      <BookingSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
