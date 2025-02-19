import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface PartnershipFormProps {
  showPartnershipForm: boolean;
  setShowPartnershipForm: (show: boolean) => void;
  partnershipFormData: {
    name: string;
    email: string;
    companyName: string;
    productUrl: string;
    pricingSet: string;
    videoType: string;
    message: string;
  };
  handlePartnershipChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handlePartnershipSubmit: (e: React.FormEvent) => void;
  partnershipSubmitted: boolean;
  setPartnershipSubmitted: (submitted: boolean) => void;
  isSubmitting: boolean;
}

const PartnershipForm: React.FC<PartnershipFormProps> = ({
  showPartnershipForm,
  setShowPartnershipForm,
  partnershipFormData,
  handlePartnershipChange,
  handlePartnershipSubmit,
  partnershipSubmitted,
  setPartnershipSubmitted,
  isSubmitting
}) => {
  if (!showPartnershipForm) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-2xl w-full my-4">
        <button 
          onClick={() => {
            setShowPartnershipForm(false);
            setPartnershipSubmitted(false);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 w-8 h-8 rounded-full hover:bg-[#2A2A2A] flex items-center justify-center group"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        
        {partnershipSubmitted ? (
          <div className="text-center py-16 bg-[#1A1A1A]/80 rounded-2xl backdrop-blur-md border border-[#2A2A2A] shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]">
            <CheckCircle className="w-20 h-20 text-[#06B6D4] mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4 tracking-tight text-white">Thank You!</h3>
            <p className="text-gray-400 text-lg">We'll get back to you within 24 hours.</p>
            <p className="text-gray-400 text-sm mt-4">Your request has been sent to: thelearnuponline@gmail.com</p>
            <p className="text-gray-400 text-sm mt-2">Please complete sending the email in the opened Gmail tab.</p>
          </div>
        ) : (
          <form onSubmit={handlePartnershipSubmit} className="space-y-8 bg-gradient-to-br from-[#1A1A1A]/95 to-[#2A2A2A]/95 p-10 rounded-3xl backdrop-blur-xl border border-[#2A2A2A] shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_-6px_rgba(6,182,212,0.4)] transition-all duration-500 max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Start Your <span className="text-[#06B6D4]">Partnership</span>
              </h2>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Send your request to: 
                  <span className="text-[#06B6D4] text-base font-medium hover:text-[#0891B2] transition-colors cursor-default ml-2">thelearnuponline@gmail.com</span>
                </p>
                <p className="text-gray-400 text-sm">All fields are required</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name Field */}
              <FormField
                label="Name"
                type="text"
                id="partnership-name"
                name="name"
                value={partnershipFormData.name}
                onChange={handlePartnershipChange}
                placeholder="Your name"
                required
              />

              {/* Email Field */}
              <FormField
                label="Email"
                type="email"
                id="partnership-email"
                name="email"
                value={partnershipFormData.email}
                onChange={handlePartnershipChange}
                placeholder="your@email.com"
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                title="Please enter a valid email address (e.g., name@example.com)"
                required
              />

              {/* Company Name Field */}
              <FormField
                label="Company Name"
                type="text"
                id="partnership-companyName"
                name="companyName"
                value={partnershipFormData.companyName}
                onChange={handlePartnershipChange}
                placeholder="Your company name"
                required
              />

              {/* Product URL Field */}
              <FormField
                label="Product URL"
                type="url"
                id="partnership-productUrl"
                name="productUrl"
                value={partnershipFormData.productUrl}
                onChange={handlePartnershipChange}
                placeholder="https://your-product.com"
                required
              />

              {/* Pricing Set Field */}
              <FormSelect
                label="Pricing Set"
                id="partnership-pricingSet"
                name="pricingSet"
                value={partnershipFormData.pricingSet}
                onChange={handlePartnershipChange}
                required
                options={[
                  { value: "", label: "Select pricing package", disabled: true },
                  { value: "$150 - Dedicated Video", label: "$150 - Dedicated Video" },
                  { value: "$50 - Short Video", label: "$50 - Short Video" }
                ]}
              />

              {/* Video Type Field */}
              <FormSelect
                label="Video Type"
                id="partnership-videoType"
                name="videoType"
                value={partnershipFormData.videoType}
                onChange={handlePartnershipChange}
                required
                options={[
                  { value: "", label: "Select video type", disabled: true },
                  { value: "Short Video", label: "Short Video" },
                  { value: "Dedicated Video", label: "Dedicated Video" }
                ]}
              />

              {/* Message Field */}
              <div className="relative group">
                <label htmlFor="partnership-message" className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-[#06B6D4] transition-colors">
                  Message <span className="text-[#06B6D4]">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="partnership-message"
                    name="message"
                    value={partnershipFormData.message}
                    onChange={handlePartnershipChange}
                    required
                    rows={5}
                    placeholder="Tell us about your partnership goals..."
                    className="w-full px-5 py-4 rounded-xl bg-black/40 border-2 border-[#2A2A2A] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 transition-all duration-300 text-white placeholder-gray-500 text-base resize-none invalid:border-red-500"
                  ></textarea>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#06B6D4]/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:from-[#0891B2] hover:to-[#06B6D4] text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/50 hover:scale-[1.02] text-base relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative">{isSubmitting ? 'Sending...' : 'Submit Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  pattern?: string;
  title?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  pattern,
  title
}) => (
  <div className="relative group">
    <label htmlFor={id} className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-[#06B6D4] transition-colors">
      {label} <span className="text-[#06B6D4]">*</span>
    </label>
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        title={title}
        className="w-full px-5 py-4 rounded-xl bg-black/40 border-2 border-[#2A2A2A] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 transition-all duration-300 text-white placeholder-gray-500 text-base invalid:border-red-500"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#06B6D4]/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  </div>
);

interface FormSelectProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  required,
  options
}) => (
  <div className="relative group">
    <label htmlFor={id} className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-[#06B6D4] transition-colors">
      {label} <span className="text-[#06B6D4]">*</span>
    </label>
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-5 py-4 rounded-xl bg-black/40 border-2 border-[#2A2A2A] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 transition-all duration-300 text-white placeholder-gray-500 text-base appearance-none cursor-pointer invalid:border-red-500 [&>option]:bg-[#1A1A1A] [&>option]:text-white"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={option.disabled ? "text-gray-500 bg-[#1A1A1A]" : "text-white bg-[#1A1A1A]"}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#06B6D4]/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  </div>
);

export default PartnershipForm; 