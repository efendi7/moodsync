// src/app/about/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react'; // Ensure useRef is imported
import Image from 'next/image';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import TeamMemberCard from '@/components/About/TeamMemberCard';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { teamMembers, ourValues } from '@/lib/aboutData';
import { Brain, Heart, Shield, Zap } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext'; // Ensure this import is correct

const AboutUsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // Use the global theme state
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // --- RE-ADD THESE REF AND INTERSECTION OBSERVER DECLARATIONS ---
  const heroRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);

  const [setHeroNode, heroEntry] = useIntersectionObserver({ threshold: 0.1 });
  const [setMissionNode, missionEntry] = useIntersectionObserver({
    threshold: 0.1,
  });
  const [setTeamNode, teamEntry] = useIntersectionObserver({ threshold: 0.1 });
  const [setValuesNode, valuesEntry] = useIntersectionObserver({
    threshold: 0.1,
  });
  // --- END OF RE-ADDED DECLARATIONS ---

  useEffect(() => {
    if (heroRef.current) setHeroNode(heroRef.current);
    if (missionRef.current) setMissionNode(missionRef.current);
    if (teamRef.current) setTeamNode(teamRef.current);
    if (valuesRef.current) setValuesNode(valuesRef.current);
  }, [setHeroNode, setMissionNode, setTeamNode, setValuesNode]);

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
      <Header
        isScrolled={isScrolled}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Hero Section for About Page */}
      <section
        ref={heroRef}
        className={`pt-32 pb-20 px-6 ${getAnimationClasses(heroEntry)}`}
      >
        <div className="container mx-auto text-center max-w-4xl">
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 ${
              isDarkMode
                ? 'bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-gray-900 via-purple-600 to-pink-600 bg-clip-text text-transparent'
            }`}
          >
            About MoodSync
          </h1>
          <p
            className={`text-xl mb-8 max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Empowering individuals to nurture mental well-being with
            intelligent, personalized insights.
          </p>
        </div>
      </section>

      {/* Our Story / Mission Section */}
      <section
        ref={missionRef}
        className={`px-6 py-20 ${getAnimationClasses(missionEntry)}`}
      >
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Story & Mission
            </h2>
            <p
              className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 leading-relaxed`}
            >
              MoodSync lahir dari semangat pribadi untuk menggabungkan teknologi
              dan kesehatan mental. Sebagai pengembang tunggal, saya memulai
              proyek ini dengan keyakinan kuat bahwa kecerdasan buatan dapat
              menjadi alat yang kuat untuk membantu individu memahami dan
              mengelola kesejahteraan emosional mereka.
            </p>
            <p
              className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}
            >
              Misi saya adalah untuk menyediakan platform yang intuitif dan
              mendalam, memberikan wawasan yang dipersonalisasi dan dukungan
              yang relevan. Saya berkomitmen untuk terus mengembangkan MoodSync
              menjadi pendamping tepercaya dalam perjalanan kesehatan mental
              Anda.
            </p>
          </div>
          <Image
            src="/img/hero.png"
            alt="The vision behind MoodSync"
            width={400}
            height={400}
            className="mx-auto"
            priority
          />
        </div>
      </section>

      {/* Our Values Section */}
      <section
        ref={valuesRef}
        className={`px-6 py-20 ${getAnimationClasses(valuesEntry)}`}
      >
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Nilai-Nilai Inti Kami
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {ourValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className={`${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-white/70'
                  } rounded-2xl border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="mb-4">
                    <IconComponent className={`w-8 h-8 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet The Creator Section */}
      <section
        ref={teamRef}
        className={`px-6 py-20 ${getAnimationClasses(teamEntry)}`}
      >
        <div className="container mx-auto max-w-md text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Meet The Creator
          </h2>
          {teamMembers.length > 0 && (
            <TeamMemberCard member={teamMembers[0]} isDarkMode={isDarkMode} />
          )}
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default AboutUsPage;