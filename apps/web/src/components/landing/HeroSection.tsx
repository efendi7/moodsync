import React from 'react';
import { Play } from 'lucide-react';

interface HeroSectionProps {
  isDarkMode: boolean;
  animationClasses: string;
}

const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  ({ isDarkMode, animationClasses }, ref) => {
    return (
      <section ref={ref} className={`pt-32 pb-20 px-6 ${animationClasses}`}>
        <div className="container mx-auto text-center max-w-4xl">
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 ${
              isDarkMode
                ? 'bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-gray-900 via-purple-600 to-pink-600 bg-clip-text text-transparent'
            }`}
          >
            Your AI-Powered
            <br />
            Mental Wellness Journey
          </h1>
          <p
            className={`text-xl mb-8 max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Track your mood, build healthy habits, and get personalized insights
            powered by AI to optimize your mental wellness and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
            <button
              className={`border px-8 py-4 rounded-lg font-semibold transition-colors ${
                isDarkMode
                  ? 'border-gray-600 hover:border-gray-400 text-white'
                  : 'border-gray-300 hover:border-gray-500 text-gray-900'
              }`}
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';
export default HeroSection;