import React from 'react';
import { CheckCircle } from 'lucide-react';

interface QuestionFormProps {
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  submitted: boolean;
  isSubmitting: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  submitted,
  isSubmitting
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white tracking-tight leading-tight">
        Ask a <span className="text-[#06B6D4]">Question</span>
      </h2>
      
      {submitted ? (
        <div className="text-center py-16 bg-[#1A1A1A]/80 rounded-2xl backdrop-blur-md border border-[#2A2A2A] shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]">
          <CheckCircle className="w-20 h-20 text-[#06B6D4] mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4 tracking-tight text-white">Thank You!</h3>
          <p className="text-gray-400 text-lg">We'll respond to your question within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 bg-gradient-to-br from-[#1A1A1A]/95 to-[#2A2A2A]/95 p-10 rounded-3xl backdrop-blur-xl border border-[#2A2A2A] shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_-6px_rgba(6,182,212,0.4)] transition-all duration-500">
          <div className="space-y-6">
            <FormField
              label="Name"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
            
            <FormField
              label="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />

            <FormField
              label="Subject"
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's your question about?"
              required
            />

            <div className="relative group">
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-[#06B6D4] transition-colors">Your Question</label>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Type your question here..."
                  className="w-full px-5 py-4 rounded-xl bg-black/40 border-2 border-[#2A2A2A] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 transition-all duration-300 text-white placeholder-gray-500 text-base resize-none"
                ></textarea>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#06B6D4]/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:from-[#0891B2] hover:to-[#06B6D4] text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-[#06B6D4]/20 hover:shadow-[#06B6D4]/50 hover:scale-[1.02] text-base relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative">{isSubmitting ? 'Sending...' : 'Send Question'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

interface FormFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  required
}) => (
  <div className="relative group">
    <label htmlFor={id} className="block text-sm font-medium mb-2 text-gray-300 group-focus-within:text-[#06B6D4] transition-colors">{label}</label>
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-5 py-4 rounded-xl bg-black/40 border-2 border-[#2A2A2A] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20 transition-all duration-300 text-white placeholder-gray-500 text-base"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#06B6D4]/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  </div>
);

export default QuestionForm; 