import React from 'react';
import { Check } from 'lucide-react';
import { Plan } from '@/types'; // Import Plan type from types/index.ts

interface PricingSectionProps {
  isDarkMode: boolean;
  plans: Plan[];
  animationClasses: string;
}

const PricingSection = React.forwardRef<HTMLElement, PricingSectionProps>(
  ({ isDarkMode, plans, animationClasses }, ref) => {
    return (
      <section id="pricing" ref={ref} className={`px-6 py-20 ${animationClasses}`}>
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Wellness Plan
          </h2>
          <p
            className={`text-xl mb-16 max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Start free and upgrade as your wellness journey grows
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
                } rounded-2xl border ${
                  index === 1
                    ? 'border-purple-500 relative'
                    : isDarkMode
                    ? 'border-gray-700'
                    : 'border-gray-200'
                } p-8 transition-all duration-300 ${index === 1 ? 'scale-105 shadow-xl' : 'hover:scale-[1.02] hover:shadow-lg'}`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  {plan.price}
                  <span
                    className={`text-lg font-normal ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span
                        className={
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    index === 1
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : isDarkMode
                      ? 'border border-gray-600 hover:border-gray-400'
                      : 'border border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {index === 0 ? 'Start Free' : 'Start Trial'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

PricingSection.displayName = 'PricingSection';
export default PricingSection;