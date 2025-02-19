import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Youtube, Mail, Menu, X, TrendingUp, Users, PlayCircle, CheckCircle, ArrowRight } from 'lucide-react';
import emailjs from '@emailjs/browser';

// Lazy load components
const PartnershipForm = lazy(() => import('./components/PartnershipForm'));
const QuestionForm = lazy(() => import('./components/QuestionForm'));

// Initialize EmailJS with your public key
emailjs.init("7LzLR7oEY6V_XeL6q");

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [partnershipFormData, setPartnershipFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    productUrl: '',
    pricingSet: '',
    videoType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [partnershipSubmitted, setPartnershipSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPartnershipForm, setShowPartnershipForm] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await emailjs.send(
        'service_1efn9a8',
        'template_cndsoer',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: 'The Learn Up Team',
          to_email: 'thelearnuponline@gmail.com',
          reply_to: formData.email
        },
        '7LzLR7oEY6V_XeL6q'
      );

      if (result.status === 200) {
    setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePartnershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if already submitting
    if (isSubmitting) return;
    
    // Check if all fields are filled
    const formFields = [
      { name: 'name', value: partnershipFormData.name },
      { name: 'email', value: partnershipFormData.email },
      { name: 'companyName', value: partnershipFormData.companyName },
      { name: 'productUrl', value: partnershipFormData.productUrl },
      { name: 'pricingSet', value: partnershipFormData.pricingSet },
      { name: 'videoType', value: partnershipFormData.videoType },
      { name: 'message', value: partnershipFormData.message }
    ];

    // Check if any field is empty
    const emptyFields = formFields.filter(field => !field.value.trim());
    
    if (emptyFields.length > 0) {
      alert('Please fill in all required fields before submitting.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(partnershipFormData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Validate URL format
    try {
      new URL(partnershipFormData.productUrl);
    } catch (e) {
      alert('Please enter a valid product URL.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting email submission...');
      
      const templateParams = {
        from_name: partnershipFormData.name,
        from_email: partnershipFormData.email,
        subject: `Partnership Request from ${partnershipFormData.companyName}`,
        message: `
Company Name: ${partnershipFormData.companyName}
Product URL: ${partnershipFormData.productUrl}
Pricing Set: ${partnershipFormData.pricingSet}
Video Type: ${partnershipFormData.videoType}

Message:
${partnershipFormData.message}
        `,
        to_name: 'The Learn Up Team',
        to_email: 'thelearnuponline@gmail.com',
        reply_to: partnershipFormData.email
      };

      console.log('Sending email with params:', JSON.stringify(templateParams, null, 2));

      const result = await emailjs.send(
        'service_1efn9a8',
        'template_cndsoer',
        templateParams,
        '7LzLR7oEY6V_XeL6q'
      );

      console.log('EmailJS Response:', JSON.stringify(result, null, 2));

      if (result.status === 200) {
        console.log('Email sent successfully');
        setPartnershipSubmitted(true);
        setPartnershipFormData({ 
          name: '', 
          email: '', 
          companyName: '', 
          productUrl: '', 
          pricingSet: '', 
          videoType: '', 
          message: '' 
        });
        
        // Close the form after delay
        setTimeout(() => {
          setShowPartnershipForm(false);
          setPartnershipSubmitted(false);
        }, 3000);
      } else {
        throw new Error(`EmailJS returned status ${result.status}`);
      }
    } catch (error: any) {
      console.error('Failed to send partnership request. Full error:', error);
      console.error('Error details:', {
        message: error?.message,
        text: error?.text,
        stack: error?.stack
      });
      
      const errorMessage = error?.message || error?.text || 'Please try again.';
      alert(`Failed to send partnership request: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePartnershipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'videoType') {
      const pricing = value === 'Dedicated Video' ? '$150 - Dedicated Video' : 
                     value === 'Short Video' ? '$50 - Short Video' : '';
      setPartnershipFormData(prev => ({
        ...prev,
        [name]: value,
        pricingSet: pricing
      }));
    } else if (name === 'pricingSet') {
      const videoType = value === '$150 - Dedicated Video' ? 'Dedicated Video' : 
                       value === '$50 - Short Video' ? 'Short Video' : '';
      setPartnershipFormData(prev => ({
        ...prev,
        [name]: value,
        videoType: videoType
      }));
    } else {
      setPartnershipFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handlePricingClick = (price: string, videoType: string) => {
    setPartnershipFormData(prev => ({
      ...prev,
      pricingSet: price,
      videoType: videoType
    }));
    setShowPartnershipForm(true);
  };

  return (
    <div 
      className="min-h-screen bg-[#000000] text-gray-100 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Main Liquid Effect */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div 
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#06B6D4]/10 to-transparent rounded-full animate-liquid-1"
            style={{
              transform: `translate(${mousePosition.x/8}px, ${mousePosition.y/8}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          />
        </div>

        {/* Simplified Wave Effect */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-30">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#06B6D4]/50 to-transparent animate-wave-1" />
        </div>

        {/* Main Background Element */}
        <div 
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#06B6D4]/20 rounded-full blur-3xl animate-float-slow"
          style={{
            transform: `translate(${mousePosition.x/10}px, ${mousePosition.y/10}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] opacity-50" />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
      {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#1A1A1A]/90 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]' : 'bg-transparent'}`}>
          <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-3">
                <a href="#home" className="flex items-center space-x-3 group">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/sponsorship/images/sponsors/The-Learn-Up-Logo.png" 
                      alt="The Learn Up Logo" 
                      className="h-10 w-auto rounded-full"
                    />
                  </div>
                  <span className="text-white text-xl font-bold">The Learn Up</span>
                </a>
              </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
                <a href="#home" className="text-gray-400 hover:text-[#06B6D4] transition-all duration-300 text-sm font-medium hover:scale-105">Home</a>
                <a href="#performance" className="text-gray-400 hover:text-[#06B6D4] transition-all duration-300 text-sm font-medium hover:scale-105">Performance</a>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPartnershipForm(true);
                  }}
                  className="text-gray-400 hover:text-[#06B6D4] transition-all duration-300 text-sm font-medium hover:scale-105"
                >
                  Contact
                </a>
              <a 
                href="https://www.youtube.com/@theLearnUp"
                target="_blank"
                rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:from-[#0891B2] hover:to-[#06B6D4] rounded-xl transition-all duration-300 text-sm font-extrabold flex items-center gap-2 text-white shadow-lg shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/50 hover:scale-105"
              >
                  <Youtube className="w-4 h-4" />
                Visit Channel
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="md:hidden bg-[#000000]/95 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="flex justify-center mb-6">
                <img 
                  src="/sponsorship/images/sponsors/The-Learn-Up-Logo.png" 
                  alt="The Learn Up Logo" 
                  className="h-10 w-auto rounded-full"
                />
              </div>
              <a href="#home" className="block text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#performance" className="block text-gray-300 hover:text-white transition-colors">Performance</a>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPartnershipForm(true);
                    setIsMenuOpen(false);
                  }}
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
              <a 
                href="https://www.youtube.com/@theLearnUp"
                target="_blank"
                rel="noopener noreferrer"
                  className="block px-6 py-2 bg-[#06B6D4] hover:bg-[#0891B2] rounded-full transition-all duration-300 text-center font-extrabold shadow-lg shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/50 hover:scale-105"
              >
                Visit Channel
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#06B6D4]/20 via-[#000000]/10 to-transparent blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,_var(--tw-gradient-stops))] from-[#000000] via-transparent to-[#000000]"></div>
        </div>
        <div className="container mx-auto px-4 pt-20 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight leading-tight">
                Elevate Your Brand with <span className="text-[#06B6D4]">The Learn Up</span>
            </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              Partner with a premier tech education channel reaching millions of developers and tech enthusiasts worldwide.
            </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => setShowPartnershipForm(true)}
                  className="group px-6 py-3 bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:from-[#0891B2] hover:to-[#06B6D4] rounded-full font-extrabold transition-all duration-300 flex items-center text-sm shadow-lg shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/50 hover:scale-105"
                >
                Start Partnership
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              <a 
                href="https://www.youtube.com/@theLearnUp"
                target="_blank"
                rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-[#0E2A38] to-[#0E3347] hover:from-[#0E3347] hover:to-[#0E2A38] rounded-full font-extrabold transition-all duration-300 flex items-center text-sm shadow-lg shadow-[#0E2A38]/20 hover:shadow-[#0E2A38]/50 hover:scale-105"
              >
                  <Youtube className="w-4 h-4 mr-2" />
                Visit Channel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Channel Performance */}
      <section id="performance" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#06B6D4]/10 via-[#000000]/5 to-transparent blur-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-transparent to-[#000000]"></div>
          </div>
        <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white tracking-tight">
              Channel <span className="text-[#06B6D4]">Performance</span>
          </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Monthly Views Card */}
              <div className="bg-[#1A1A1A]/90 p-6 rounded-2xl backdrop-blur-md border border-[#2A2A2A]">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">Monthly Views</h3>
                    <div className="w-8 h-8 rounded-full bg-[#2A1B47] flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#06B6D4]" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-white">100K</p>
                    <span className="text-green-500 font-medium">↑ 25%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">vs last month</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Average Watch Time</span>
                      <span className="text-white">8:45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Click-Through Rate</span>
                      <span className="text-white">12.5%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscribers Card */}
              <div className="bg-[#1A1A1A]/90 p-6 rounded-2xl backdrop-blur-md border border-[#2A2A2A]">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">Subscribers</h3>
                    <div className="w-8 h-8 rounded-full bg-[#2A1B47] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#22C55E]" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-white">18K</p>
                    <span className="text-green-500 font-medium">↑ 15%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">vs last month</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Daily New Subscribers</span>
                      <span className="text-[#22C55E]">+250</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subscriber Retention</span>
                      <span className="text-white">98.5%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Card */}
              <div className="bg-[#1A1A1A]/90 p-6 rounded-2xl backdrop-blur-md border border-[#2A2A2A]">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">Engagement Rate</h3>
                    <div className="w-8 h-8 rounded-full bg-[#2A1B47] flex items-center justify-center">
                      <PlayCircle className="w-5 h-5 text-[#06B6D4]" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-white">91%</p>
                    <span className="text-green-500 font-medium">↑ 5%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">vs last month</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Average Likes</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#06B6D4] font-medium">15K</span>
                        <span className="text-gray-400">per video</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Comment Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full w-[8.5%] bg-[#06B6D4] rounded-full"></div>
                        </div>
                        <span className="text-white">8.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Audience Demographics */}
              <div className="group relative bg-gradient-to-br from-[#1A1A1A]/90 to-[#2A2A2A]/90 p-6 rounded-2xl backdrop-blur-md border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300 shadow-xl shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/40 hover:scale-[1.02]">
                <h3 className="text-xl font-bold text-white mb-6">Audience Demographics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Tech Professionals</span>
                      <span className="text-white">45%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full w-[45%] bg-[#06B6D4] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Students</span>
                      <span className="text-white">30%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full w-[30%] bg-[#06B6D4] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Business Owners</span>
                      <span className="text-white">15%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full w-[15%] bg-[#06B6D4] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Others</span>
                      <span className="text-white">10%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full w-[10%] bg-[#06B6D4] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Performance */}
              <div className="group relative bg-gradient-to-br from-[#1A1A1A]/90 to-[#2A2A2A]/90 p-6 rounded-2xl backdrop-blur-md border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300 shadow-xl shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/40 hover:scale-[1.02]">
                <h3 className="text-xl font-bold text-white mb-6">Content Performance</h3>
                <div className="space-y-4">
                  <a 
                    href="https://youtu.be/IhVOdnUTtCg"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="block group/video hover:bg-[#2A2A2A] transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#2A1B47] flex items-center justify-center group-hover/video:bg-[#06B6D4]/20 transition-colors duration-300">
                          <PlayCircle className="w-6 h-6 text-[#06B6D4] group-hover/video:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover/video:text-[#06B6D4] transition-colors">Create Your Own Talking Avatar Using Free Canva AI</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-400">466.4K views</p>
                            <span className="text-sm text-gray-400">•</span>
                            <p className="text-sm text-gray-400">Canva's HeyGen Tutorial</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-green-500">↑ 32%</span>
                        <span className="text-sm text-gray-400">Trending</span>
                      </div>
                    </div>
                  </a>

                  <a 
                    href="https://youtu.be/CRf89MNwvWA"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="block group/video hover:bg-[#2A2A2A] transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#2A1B47] flex items-center justify-center group-hover/video:bg-[#06B6D4]/20 transition-colors duration-300">
                          <PlayCircle className="w-6 h-6 text-[#06B6D4] group-hover/video:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover/video:text-[#06B6D4] transition-colors">How to Create Professional Logo with Free AI Logo Maker</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-400">247.3K views</p>
                            <span className="text-sm text-gray-400">•</span>
                            <p className="text-sm text-gray-400">Text to Image</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-green-500">↑ 28%</span>
                        <span className="text-sm text-gray-400">Popular</span>
                      </div>
                    </div>
                  </a>

                  <a 
                    href="https://youtu.be/2ajvtaIISS8"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="block group/video hover:bg-[#2A2A2A] transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#2A1B47] flex items-center justify-center group-hover/video:bg-[#06B6D4]/20 transition-colors duration-300">
                          <PlayCircle className="w-6 h-6 text-[#06B6D4] group-hover/video:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover/video:text-[#06B6D4] transition-colors">Create 3D Animation Video Using Free AI Tool</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-400">8K views</p>
                            <span className="text-sm text-gray-400">•</span>
                            <p className="text-sm text-gray-400">Transform Image to Animation</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-green-500">↑ 20%</span>
                        <span className="text-sm text-gray-400">Growing</span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#06B6D4]/10 via-[#000000]/5 to-transparent blur-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-transparent to-[#000000]"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white tracking-tight">
              Promotion <span className="text-[#06B6D4]">Pricing</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Dedicated Video Card */}
              <div className="group relative bg-gradient-to-br from-[#1A1A1A]/90 to-[#2A2A2A]/90 p-8 rounded-2xl backdrop-blur-md border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300 shadow-xl shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/40 hover:scale-[1.02]">
                <div className="relative space-y-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2A1B47] group-hover:bg-[#06B6D4]/20 transition-colors duration-300 mb-4">
                    <PlayCircle className="w-7 h-7 text-[#06B6D4] m-2.5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Dedicated Video For <span className="text-[#06B6D4]">YouTube</span></h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white group-hover:text-[#06B6D4] transition-colors duration-300">$150</span>
                  </div>
                  <p className="text-gray-400">5-10 minute in-depth video promotion of your product or service</p>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#06B6D4]" />
                      <span>Full product showcase</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#06B6D4]" />
                      <span>Detailed feature walkthrough</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#06B6D4]" />
                      <span>Live demonstration</span>
                    </li>
                  </ul>
                  <a 
                    href="#contact"
                    className="mt-6 block text-center px-6 py-3 bg-[#06B6D4] rounded-xl font-extrabold hover:bg-[#0891B2] transition-all duration-300 text-white shadow-lg shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/50 hover:scale-105"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePricingClick('$150 - Dedicated Video', 'Dedicated Video');
                    }}
                  >
                    Get Started
                  </a>
                </div>
              </div>

              {/* Short Video Card */}
              <div className="group relative bg-gradient-to-br from-[#1A1A1A]/90 to-[#2A2A2A]/90 p-8 rounded-2xl backdrop-blur-md border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300 shadow-xl shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/40 hover:scale-[1.02]">
                <div className="relative space-y-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#2A1B47] group-hover:bg-[#06B6D4]/20 transition-colors duration-300 mb-4">
                    <Youtube className="w-7 h-7 text-[#06B6D4] m-2.5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Short Video For <span className="text-[#06B6D4]">YouTube</span></h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white group-hover:text-[#06B6D4] transition-colors duration-300">$50</span>
                  </div>
                  <p className="text-gray-400">60-second engaging short-form video promotion</p>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#06B6D4]" />
                      <span>Quick product highlight</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#06B6D4]" />
                      <span>Key features spotlight</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#06B6D4]" />
                      <span>Call-to-action focus</span>
                    </li>
                  </ul>
                  <a 
                    href="#contact"
                    className="mt-6 block text-center px-6 py-3 bg-[#06B6D4] rounded-xl font-extrabold hover:bg-[#0891B2] transition-all duration-300 text-white shadow-lg shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/50 hover:scale-105"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePricingClick('$50 - Short Video', 'Short Video');
                    }}
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Companies */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#06B6D4]/10 via-[#000000]/5 to-transparent blur-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-transparent to-[#000000]"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-white tracking-tight">
              Trusted by <span className="text-[#06B6D4]">Industry Leaders</span>
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-3xl mx-auto text-lg">
              Seamlessly integrate with your existing tools and platforms. Our promotional services are trusted by leading technology providers and services.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Company logos */}
              <div className="bg-[#1A1A1A]/80 p-6 rounded-xl backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center min-h-[100px]">
                <img 
                  src="/sponsorship/images/sponsors/Fliki-AI-Logo-removebg.png" 
                  alt="Fliki AI" 
                  className="w-44 h-12 object-contain opacity-70"
                />
              </div>
              <div className="bg-[#1A1A1A]/80 p-6 rounded-xl backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center min-h-[100px]">
                <img 
                  src="/sponsorship/images/sponsors/Vidnoz-Logo.png" 
                  alt="Vidnoz" 
                  className="w-36 h-10 object-contain opacity-70"
                />
              </div>
              <div className="bg-[#1A1A1A]/80 p-6 rounded-xl backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center min-h-[100px]">
                <img 
                  src="/sponsorship/images/sponsors/HitPaw-Logo.webp" 
                  alt="HitPaw" 
                  className="w-36 h-10 object-contain opacity-70 brightness-0 invert"
                />
              </div>
              <div className="bg-[#1A1A1A]/80 p-6 rounded-xl backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center min-h-[100px]">
                <img 
                  src="/sponsorship/images/sponsors/Fotor-Logo.webp" 
                  alt="Fotor" 
                  className="w-36 h-10 object-contain opacity-70"
                />
              </div>
              <div className="bg-[#1A1A1A]/80 p-6 rounded-xl backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center min-h-[100px]">
                <img 
                  src="/sponsorship/images/sponsors/Stylar-AI.png" 
                  alt="Stylar AI" 
                  className="w-36 h-10 object-contain opacity-70"
                />
              </div>
              <div className="bg-[#1A1A1A]/80 p-6 rounded-xl backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center min-h-[100px]">
                <img 
                  src="/sponsorship/images/sponsors/Innaio-logo.png" 
                  alt="Innaio" 
                  className="w-36 h-10 object-contain opacity-70"
                />
              </div>
              <div className="bg-[#1A1A1A]/80 p-6 rounded-xl backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center min-h-[100px]">
                <img 
                  src="/sponsorship/images/sponsors/Wps-Office.png" 
                  alt="WPS Office" 
                  className="w-36 h-10 object-contain opacity-70"
                />
              </div>
              <div className="bg-[#1A1A1A]/80 p-6 rounded-xl backdrop-blur-md border border-[#2A2A2A] flex items-center justify-center min-h-[100px]">
                <img 
                  src="/sponsorship/images/sponsors/Hocos-logo.png" 
                  alt="Hocos" 
                  className="w-44 h-12 object-contain opacity-70"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-24 relative">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#06B6D4]/10 via-[#000000]/5 to-transparent blur-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-transparent to-[#000000]"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
              <QuestionForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                submitted={submitted}
                isSubmitting={isSubmitting}
              />
            </Suspense>
          </div>
        </section>

        {/* Partnership Form Popup */}
        {showPartnershipForm && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="text-white">Loading...</div>
            </div>
          }>
            <PartnershipForm
              showPartnershipForm={showPartnershipForm}
              setShowPartnershipForm={setShowPartnershipForm}
              partnershipFormData={partnershipFormData}
              handlePartnershipChange={handlePartnershipChange}
              handlePartnershipSubmit={handlePartnershipSubmit}
              partnershipSubmitted={partnershipSubmitted}
              setPartnershipSubmitted={setPartnershipSubmitted}
              isSubmitting={isSubmitting}
            />
          </Suspense>
        )}

        {/* Footer */}
        <footer className="py-16 bg-[#1A1A1A]/80 backdrop-blur-xl border-t border-[#2A2A2A] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06B6D4]/5 to-transparent"></div>
          <div className="container mx-auto px-6 relative">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div className="flex items-center mb-8 md:mb-0">
                <a href="#home" className="flex items-center space-x-3 group">
                  <img 
                    src="/sponsorship/images/sponsors/The-Learn-Up-Logo.png" 
                    alt="The Learn Up Logo" 
                    className="h-10 w-auto rounded-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="text-white text-xl font-bold">The Learn Up</span>
                </a>
              </div>
              <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12">
                <a 
                  href="mailto:thelearnuponline@gmail.com" 
                  className="flex items-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 group"
                >
                  <Mail className="w-5 h-5 mr-2 group-hover:text-[#06B6D4] transition-colors" />
                  <span>thelearnuponline@gmail.com</span>
                </a>
                <a 
                  href="https://www.youtube.com/@theLearnUp" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 group"
                >
                  <Youtube className="w-5 h-5 mr-2 group-hover:text-[#06B6D4] transition-colors" />
                  <span>YouTube Channel</span>
                </a>
              </div>
            </div>
            <div className="pt-8 border-t border-[#2A2A2A] text-center">
              <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} The Learn Up. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;