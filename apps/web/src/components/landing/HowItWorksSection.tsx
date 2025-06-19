import React from 'react';
import { Heart, Brain, Zap, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  isDarkMode: boolean;
  animationClasses: string;
}

const HowItWorksSection = React.forwardRef<HTMLElement, HowItWorksSectionProps>(
  ({ isDarkMode, animationClasses }, ref) => {
    const howItWorksSteps = [
      {
        step: '01',
        title: 'Track Your Mood',
        desc: 'Quick daily check-ins with our intuitive mood wheel and context tagging',
        icon: <Heart className="w-8 h-8" />,
      },
      {
        step: '02',
        title: 'AI Analyzes Patterns',
        desc: 'Our AI identifies triggers, trends, and correlations in your wellness data',
        icon: <Brain className="w-8 h-8" />,
      },
      {
        step: '03',
        title: 'Get Personalized Insights',
        desc: 'Receive actionable recommendations to improve your mental wellness',
        icon: <Zap className="w-8 h-8" />,
      },
    ];

    return (
      <section ref={ref} className={`px-6 py-20 ${animationClasses}`}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            How MoodSync Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((item, index) => (
              <div key={index} className="relative group">
                <div
                  className={`${
                    isDarkMode
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                      : 'bg-gradient-to-br from-white to-gray-50'
                  } rounded-2xl border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } p-8 h-full transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]`}
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <div
                    className={`text-3xl font-bold mb-4 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {item.desc}
                  </p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <ArrowRight
                    className={`hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

HowItWorksSection.displayName = 'HowItWorksSection';
export default HowItWorksSection;