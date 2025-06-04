import React from 'react';
import { Camera, Mic } from 'lucide-react';

interface ActionButtonsProps {
  onComplete: () => void;
  onCamera?: () => void;
  onVoice?: () => void;
  iconButtonStyle: string;
  isCompleteDisabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onComplete,
  onCamera,
  onVoice,
  iconButtonStyle,
  isCompleteDisabled = false,
}) => (
  <div className="flex gap-3">
    <button 
      onClick={onComplete}
      disabled={isCompleteDisabled}
      className={`flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all ${
        isCompleteDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      Complete Check-in
    </button>
    {onCamera && (
      <button 
        onClick={onCamera}
        className={iconButtonStyle}
        aria-label="Take photo"
      >
        <Camera className="w-5 h-5" />
      </button>
    )}
    {onVoice && (
      <button 
        onClick={onVoice}
        className={iconButtonStyle}
        aria-label="Record voice note"
      >
        <Mic className="w-5 h-5" />
      </button>
    )}
  </div>
);
