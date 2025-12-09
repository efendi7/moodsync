'use client';
import React from 'react';
import { DashboardProvider } from '../contexts/DashboardContext';
import { MoodTrackerContent } from './MoodTrackerContent';

const MoodTrackerPage = () => {
  return (
    <DashboardProvider>
      <MoodTrackerContent />
    </DashboardProvider>
  );
};

export default MoodTrackerPage;