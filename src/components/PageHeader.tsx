import React from 'react';
import { Language } from '../types';

interface PageHeaderProps {
  language: Language;
  title: string;
  marathiTitle: string;
  hindiTitle: string;
  description?: string;
  marathiDescription?: string;
  hindiDescription?: string;
  icon?: React.ReactNode;
  onBack: () => void;
  BackButton: React.ComponentType<{ language: Language; onBack: () => void }>;
  tone?: 'green' | 'blue' | 'indigo' | 'purple' | 'emerald';
}

const toneClasses = {
  green: 'from-green-700 via-green-600 to-emerald-700',
  blue: 'from-blue-700 via-blue-600 to-cyan-700',
  indigo: 'from-indigo-700 via-indigo-600 to-blue-700',
  purple: 'from-purple-700 via-purple-600 to-indigo-700',
  emerald: 'from-emerald-700 via-teal-600 to-cyan-700',
};

const PageHeader = ({
  language,
  title,
  marathiTitle,
  hindiTitle,
  description,
  marathiDescription,
  hindiDescription,
  icon,
  onBack,
  BackButton,
  tone = 'green',
}: PageHeaderProps) => {
  const titleText = language === 'mr' ? marathiTitle : language === 'hi' ? hindiTitle : title;
  const descriptionText = language === 'mr'
    ? marathiDescription
    : language === 'hi'
      ? hindiDescription
      : description;

  return (
    <section className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${toneClasses[tone]} px-5 py-7 text-white shadow-lg md:px-8 md:py-9`}>
      <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/5" />
      <div className="relative">
        <BackButton language={language} onBack={onBack} />
        <div className="mt-5 flex items-start gap-4">
          {icon && <div className="hidden rounded-xl bg-white/15 p-3 sm:block">{icon}</div>}
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{titleText}</h1>
            {descriptionText && <p className="mt-2 max-w-3xl text-white/85">{descriptionText}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
