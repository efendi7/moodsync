import React from 'react';
import { Feature } from '@/types'; // Import Feature type from types/index.ts

interface FeaturesSectionProps {
  isDarkMode: boolean;
  features: Feature[];
  animationClasses: string;
}

const FeaturesSection = React.forwardRef<HTMLElement, FeaturesSectionProps>(
  ({ isDarkMode, features, animationClasses }, ref) => {
    return (
      <section id="features" ref={ref} className={`px-6 py-20 ${animationClasses}`}>
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Mental Health
            <br />
            Companion That Learns
          </h2>
          <p
            className={`text-xl mb-16 max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Powered by advanced AI to provide personalized insights and support
            for your wellness journey
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group">
                  <div
                    className={`${
                      isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
                    } rounded-2xl border ${
                      isDarkMode
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    } p-8 h-full transition-all duration-300 hover:shadow-lg`}
                  >
                    <div
                      className={`bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
);

FeaturesSection.displayName = 'FeaturesSection';
export default FeaturesSection;