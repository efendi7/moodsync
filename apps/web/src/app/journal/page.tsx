// apps/web/src/app/(dashboard)/journal/page.tsx
'use client';

import React from 'react';
import { DashboardProvider } from '../contexts/DashboardContext';
import { JournalContent } from './JournalContent';

const JournalPage = () => {
  return (
    <DashboardProvider>
      <JournalContent />
    </DashboardProvider>
  );
};

export default JournalPage;