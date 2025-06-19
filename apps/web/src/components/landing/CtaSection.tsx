import React from 'react';
import { Smartphone, Shield, Calendar } from 'lucide-react';

interface CtaSectionProps {
  isDarkMode: boolean;
  animationClasses: string;
}

const CtaSection = React.forwardRef<HTMLElement, CtaSectionProps>(
  ({ isDarkMode, animationClasses }, ref) => {
    return (
      <section ref={ref} className={`px-6 py-20 ${animationClasses}`}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform
            <br />
            Your Mental Wellness?
          </h2>
          <p
            className={`text-xl mb-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Join thousands who've improved their mental health with AI-powered
            insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5" />
              Start Free Trial
            </button>
            <button
              className={`border px-8 py-4 rounded-lg font-semibold transition-colors ${
                isDarkMode
                  ? 'border-gray-600 hover:border-gray-400'
                  : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              Schedule Demo
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              HIPAA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              14-day Free Trial
            </div>
          </div>
        </div>
      </section>
    );
  }
);

CtaSection.displayName = 'CtaSection';
export default CtaSection;