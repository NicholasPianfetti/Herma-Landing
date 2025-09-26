import React, { useState, useRef, useEffect } from 'react';
import ReactGA from 'react-ga4';
import emailjs from '@emailjs/browser';
import { trackConversion } from '../utils/analytics';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Create a reference to the form
  const form = useRef();
  
  // Validation and submission states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  
  // Check if user is from app on component mount
  const [isAppUser, setIsAppUser] = useState(false);

  // Scroll animation hooks
  const headerAnimation = useScrollAnimation();
  const { containerRef, itemsVisible } = useStaggeredAnimation(4, 300);

  useEffect(() => {
    // Check if user came from app or is marked as an app user
    const urlParams = new URLSearchParams(window.location.search);
    const fromApp = urlParams.get('utm_source') === 'herma_app';
    const storedAppUser = localStorage.getItem('appUser') === 'true';
    
    setIsAppUser(fromApp || storedAppUser);
  }, []);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset submission states
    setSubmitSuccess(false);
    setSubmitError(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Track submission attempt in analytics
    ReactGA.event({
      category: 'Contact',
      action: 'FormSubmission',
      label: 'General Inquiry'
    });
    
    try {
      // Send email using EmailJS
      const result = await emailjs.sendForm(
        'service_eqqo6n9',
        'template_09owcap',
        form.current,
        'fdlfNIrca3C4488jB'
      );
      
      console.log('Email successfully sent!', result.text);
      
      // Track conversion with app user distinction
      trackConversion('Contact Form Submission');
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      
      setSubmitSuccess(true);
      
      // Track successful submission
      ReactGA.event({
        category: 'Contact',
        action: 'FormSubmitSuccess',
        label: 'General Inquiry',
        // Add additional dimension to track app users
        appUser: isAppUser ? 'true' : 'false'
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(true);
      
      // Track submission error
      ReactGA.event({
        category: 'Contact',
        action: 'FormSubmitError',
        label: 'General Inquiry'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white via-blue-25 to-blue-50" id="contact">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-8 ${headerAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Contact Us</h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Ready to secure your sensitive data? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <div
          ref={containerRef}
          className={`max-w-2xl mx-auto ${itemsVisible.includes(0) ? 'animate-fadeInUp' : 'opacity-0'}`}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-blue-100">
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Message Sent!</h3>
                <p className="text-blue-600 mb-8">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="px-8 py-3 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form ref={form} onSubmit={handleSubmit} className="space-y-8">
                {/* Name and Email Row */}
                <div className={`grid md:grid-cols-2 gap-6 ${itemsVisible.includes(1) ? 'animate-fadeInUp' : 'opacity-0'}`}>
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-blue-900 mb-3">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-2xl border ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-blue-200'
                      } focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)] focus:border-transparent transition-all duration-200 text-blue-900 placeholder-blue-400`}
                      placeholder="Your Name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-2xl border ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-blue-200'
                      } focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)] focus:border-transparent transition-all duration-200 text-blue-900 placeholder-blue-400`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className={`${itemsVisible.includes(2) ? 'animate-fadeInUp' : 'opacity-0'}`}>
                  <label htmlFor="message" className="block text-sm font-semibold text-blue-900 mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className={`w-full px-6 py-4 rounded-2xl border ${
                      errors.message ? 'border-red-500 bg-red-50' : 'border-blue-200'
                    } focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)] focus:border-transparent transition-all duration-200 text-blue-900 placeholder-blue-400 resize-none`}
                    placeholder="Tell us about your current documentation challenges and how we can help..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Submit Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
                    <span>
                      There was an issue sending your message. Please try again or contact us directly
                      at <a href="mailto:hermalocal@gmail.com" className="underline font-medium">hermalocal@gmail.com</a>.
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <div className={`text-center ${itemsVisible.includes(3) ? 'animate-fadeInUp' : 'opacity-0'}`}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-12 py-4 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300
                      ${isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-xl transform hover:-translate-y-1'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 2L2 8.66667L11.5833 12.4167M22 2L15.3333 22L11.5833 12.4167M22 2L11.5833 12.4167" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Contact;