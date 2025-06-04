import React from 'react';

interface MoodInsightProps {
  selectedMood: string;
  insight: string;
  textStyle: string;
  insightTextStyle: string;
}

export const MoodInsight: React.FC<MoodInsightProps> = ({
  selectedMood,
  insight,
  textStyle,
  insightTextStyle,
}) => (
  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
    <p className={`text-sm ${textStyle}`}>
      You selected: <span className="text-2xl ml-2">{selectedMood}</span>
    </p>
    <p className={`text-xs mt-2 ${insightTextStyle}`}>
      AI Insight: {insight}
    </p>
  </div>
);