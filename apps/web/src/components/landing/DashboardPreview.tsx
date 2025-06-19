'use client';

import React from 'react';
import Image from 'next/image';

interface DashboardPreviewProps {
  isDarkMode: boolean;
  animationClasses: string;
}

const DashboardPreview = React.forwardRef<HTMLElement, DashboardPreviewProps>(
  ({ isDarkMode, animationClasses }, ref) => {
    const dashboardImageSrc = isDarkMode
      ? '/img/dark-dashboard.png'
      : '/img/light-dashboard.png';

    const dashboardImageAlt = isDarkMode
      ? 'MoodSync Dark Mode Dashboard Preview'
      : 'MoodSync Light Mode Dashboard Preview';

    return (
      <section ref={ref} className={`px-6 pb-20 ${animationClasses}`}>
        <div className="container mx-auto max-w-6xl">
          <Image
            src={dashboardImageSrc}
            alt={dashboardImageAlt}
            width={1200}
            height={750}
            priority
            className="w-full h-auto rounded-2xl shadow-2xl transition-opacity duration-300 ease-in-out"
          />
        </div>
      </section>
    );
  }
);

DashboardPreview.displayName = 'DashboardPreview';
export default DashboardPreview;
