'use client';

import { Shield, CheckCircle, Database, Share2, GraduationCap, Award } from 'lucide-react';
import { BentoGrid, BentoCard } from '@/components/BentoGrid';

export default function FeatureSection() {
  return (
    <BentoGrid className="mb-12">
      <BentoCard
        name="Secure Credential Storage"
        Icon={Shield}
        description="Store your educational, professional, and certification credentials securely using cutting-edge blockchain technology."
        href="/register"
        cta="Get Started"
        background={
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-50"></div>
        }
      />
      
      <BentoCard
        name="Institutional Verification"
        Icon={CheckCircle}
        description="Get your credentials verified by registered issuing organizations to enhance their credibility and trustworthiness."
        href="/credentials"
        cta="Add Credentials"
        background={
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-50"></div>
        }
      />
      
      <BentoCard
        name="Immutable Records"
        Icon={Database}
        description="All credentials are stored on blockchain, creating tamper-proof, permanent records that cannot be altered or deleted."
        href="/login"
        cta="Access Your Records"
        background={
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-purple-50 opacity-50"></div>
        }
      />
      
      <BentoCard
        name="Seamless Sharing"
        Icon={Share2}
        description="Share your verified credentials securely with employers, institutions, and organizations with just a few clicks."
        href="/dashboard"
        cta="View Dashboard"
        background={
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-50"></div>
        }
      />
      
      <BentoCard
        name="Academic Achievements"
        Icon={GraduationCap}
        description="From diplomas to transcripts, store all your educational achievements in one secure, easily accessible location."
        href="/credentials"
        cta="Add Education"
        background={
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50 opacity-50"></div>
        }
      />
      
      <BentoCard
        name="Professional Certifications"
        Icon={Award}
        description="Make your professional certifications and licenses instantly verifiable by potential employers and clients."
        href="/credentials"
        cta="Add Certification"
        background={
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-rose-50 opacity-50"></div>
        }
      />
    </BentoGrid>
  );
} 