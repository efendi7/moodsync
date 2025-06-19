// src/components/About/TeamMemberCard.tsx (No major change needed, it works for single or multiple members)
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Twitter, Github } from 'lucide-react';
import { TeamMember } from '@/types';

interface TeamMemberCardProps {
  member: TeamMember;
  isDarkMode: boolean;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, isDarkMode }) => {
  const cardClasses = isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-gray-200';
  const textClasses = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const socialIconClasses = isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900';

  return (
    <div className={`rounded-xl border p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl ${cardClasses}`}>
      <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-purple-500">
        <Image
          src={member.image}
          alt={member.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
      <p className="text-purple-400 font-medium mb-3">{member.role}</p>
      <p className={`text-sm mb-4 ${textClasses}`}>{member.bio}</p>
      {member.socials && (
        <div className="flex justify-center space-x-4">
          {member.socials.linkedin && (
            <Link href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`} className={socialIconClasses}>
              <Linkedin className="w-5 h-5" />
            </Link>
          )}
          {member.socials.twitter && (
            <Link href={member.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Twitter`} className={socialIconClasses}>
              <Twitter className="w-5 h-5" />
            </Link>
          )}
          {member.socials.github && (
            <Link href={member.socials.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s GitHub`} className={socialIconClasses}>
              <Github className="w-5 h-5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;