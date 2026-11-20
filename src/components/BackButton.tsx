import { ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface BackButtonProps {
  language: Language;
  onBack: () => void;
  className?: string;
}

const BackButton = ({ language, onBack, className = '' }: BackButtonProps) => {
  const t = (en: string, mr: string, hi: string) =>
    language === 'mr' ? mr : language === 'hi' ? hi : en;

  return (
    <button
      type="button"
      onClick={onBack}
      className={`inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-300 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
      aria-label={t('Back', 'मागे', 'वापस')}
    >
      <ArrowLeft size={18} />
      {t('Back', 'मागे', 'वापस')}
    </button>
  );
};

export default BackButton;
