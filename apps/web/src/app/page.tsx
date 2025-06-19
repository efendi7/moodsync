// src/app/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react'; // Ensure useRef is imported
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import DashboardPreview from '@/components/landing/DashboardPreview';
import UseCasesSection from '@/components/landing/UseCasesSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PricingSection from '@/components/landing/PricingSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useCases, features, moodData, plans } from '@/lib/data';
import { useTheme } from '@/app/contexts/ThemeContext'; // Ensure this import is correct

const MoodSyncLandingPage = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // Use the global theme state
  const [activeUseCase, setActiveUseCase] = useState<string>('Personal Wellness');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // --- RE-ADD THESE REF AND INTERSECTION OBSERVER DECLARATIONS ---
  const heroRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLElement>(null);
  const useCasesRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const [setHeroNode, heroEntry] = useIntersectionObserver({ threshold: 0.1 });
  const [setDashboardNode, dashboardEntry] = useIntersectionObserver({ threshold: 0.1 });
  const [setUseCasesNode, useCasesEntry] = useIntersectionObserver({ threshold: 0.1 });
  const [setFeaturesNode, featuresEntry] = useIntersectionObserver({ threshold: 0.1 });
  const [setHowItWorksNode, howItWorksEntry] = useIntersectionObserver({ threshold: 0.1 });
  const [setPricingNode, pricingEntry] = useIntersectionObserver({ threshold: 0.1 });
  const [setCtaNode, ctaEntry] = useIntersectionObserver({ threshold: 0.1 });
  // --- END OF RE-ADDED DECLARATIONS ---

  useEffect(() => {
    if (heroRef.current) setHeroNode(heroRef.current);
    if (dashboardRef.current) setDashboardNode(dashboardRef.current);
    if (useCasesRef.current) setUseCasesNode(useCasesRef.current);
    if (featuresRef.current) setFeaturesNode(featuresRef.current);
    if (howItWorksRef.current) setHowItWorksNode(howItWorksRef.current);
    if (pricingRef.current) setPricingNode(pricingRef.current);
    if (ctaRef.current) setCtaNode(ctaRef.current);
  }, [setHeroNode, setDashboardNode, setUseCasesNode, setFeaturesNode, setHowItWorksNode, setPricingNode, setCtaNode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const themeClasses: string = isDarkMode
    ? 'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white'
    : 'min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900';

  const getAnimationClasses = (entry: IntersectionObserverEntry | null) => {
    return `transition-all duration-700 ease-out ${entry?.isIntersecting ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`;
  };

  return (
    <div className={themeClasses}>
      <Header isScrolled={isScrolled} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <HeroSection ref={heroRef} isDarkMode={isDarkMode} animationClasses={getAnimationClasses(heroEntry)} />
      <DashboardPreview ref={dashboardRef} isDarkMode={isDarkMode} animationClasses={getAnimationClasses(dashboardEntry)} />
      <UseCasesSection
        ref={useCasesRef}
        isDarkMode={isDarkMode}
        activeUseCase={activeUseCase}
        setActiveUseCase={setActiveUseCase}
        useCases={useCases}
        moodData={moodData}
        animationClasses={getAnimationClasses(useCasesEntry)}
      />
      <FeaturesSection ref={featuresRef} isDarkMode={isDarkMode} features={features} animationClasses={getAnimationClasses(featuresEntry)} />
      <HowItWorksSection ref={howItWorksRef} isDarkMode={isDarkMode} animationClasses={getAnimationClasses(howItWorksEntry)} />
      <PricingSection ref={pricingRef} isDarkMode={isDarkMode} plans={plans} animationClasses={getAnimationClasses(pricingEntry)} />
      <CtaSection ref={ctaRef} isDarkMode={isDarkMode} animationClasses={getAnimationClasses(ctaEntry)} />
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default MoodSyncLandingPage;