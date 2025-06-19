import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { MoodData } from '@/types'; // Import MoodData type from types/index.ts

interface UseCasesSectionProps {
  isDarkMode: boolean;
  activeUseCase: string;
  setActiveUseCase: (useCase: string) => void;
  useCases: string[];
  moodData: MoodData[];
  animationClasses: string;
}

const UseCasesSection = React.forwardRef<HTMLElement, UseCasesSectionProps>(
  ({ isDarkMode, activeUseCase, setActiveUseCase, useCases, moodData, animationClasses }, ref) => {
    return (
      <section ref={ref} className={`px-6 py-20 ${animationClasses}`}>
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Perfect for Every Wellness Journey
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {useCases.map((useCase, index) => (
                <div key={index} className="group">
                  <button
                    onClick={() => setActiveUseCase(useCase)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                      activeUseCase === useCase
                        ? isDarkMode
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-purple-400 bg-purple-50'
                        : isDarkMode
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{useCase}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        activeUseCase === useCase ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeUseCase === useCase && (
                    <div
                      className={`mt-4 p-4 rounded-lg border ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700'
                          : 'bg-white/70 border-gray-200'
                      }`}
                    >
                      <h4 className="font-semibold mb-2">
                        AI-Powered Personal Wellness
                      </h4>
                      <p
                        className={`text-sm mb-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Track your daily moods, build healthy habits, and
                        receive personalized insights to optimize your mental
                        health and productivity.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <Check className="w-4 h-4" />
                        Improve wellness by 60% in first month
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              className={`${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
              } rounded-2xl border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              } p-6`}
            >
              <div className="space-y-4">
                {moodData.slice(0, 5).map((row, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 ${
                      isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                    } rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{row.mood}</span>
                      <div>
                        <div className="font-medium">{row.date}</div>
                        <div
                          className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {row.activity}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{row.score}/10</div>
                      <div
                        className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {row.energy} Energy
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

UseCasesSection.displayName = 'UseCasesSection';
export default UseCasesSection;