'use client';

import React from 'react';
import { DashboardProvider } from '../contexts/DashboardContext';
import { HabitsContent } from './HabitsContent';

const HabitsPage = () => {
  return (
    <DashboardProvider>
      <HabitsContent />
    </DashboardProvider>
  );
};

export default HabitsPage;