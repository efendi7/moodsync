import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => (
  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
    <Sparkles className="w-6 h-6 text-purple-400" />
    Daily Check-in
  </h2>
);