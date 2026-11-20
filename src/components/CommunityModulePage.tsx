import { useEffect, useState } from 'react';
import { BookOpen, Briefcase, Leaf, Users, HeartHandshake } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Language } from '../types';
import { triText } from '../lib/i18n';
import PageHeader from './PageHeader';

interface CommunityModulePageProps {
  language: Language;
  section: 'culture' | 'employment' | 'education' | 'environment' | 'volunteer';
}

interface CommunityEntry {
  id: string;
  section: string;
  title: string;
  title_mr?: string;
  title_hi?: string;
  description?: string;
  description_mr?: string;
  description_hi?: string;
  category?: string;
  address?: string;
  phone?: string;
  external_url?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
}

const sectionConfig = {
  culture: {
    icon: Users,
    english: 'Culture & Heritage',
    marathi: 'संस्कृती आणि वारसा',
    hindi: 'संस्कृति और विरासत',
  },
  employment: {
    icon: Briefcase,
    english: 'Employment & Skills',
    marathi: 'रोजगार आणि कौशल्य',
    hindi: 'रोजगार और कौशल',
  },
  education: {
    icon: BookOpen,
    english: 'Education & Youth',
    marathi: 'शिक्षण आणि युवक',
    hindi: 'शिक्षा और युवा',
  },
  environment: {
    icon: Leaf,
    english: 'Environment & Sustainability',
    marathi: 'पर्यावरण आणि शाश्वतता',
    hindi: 'पर्यावरण और स्थिरता',
  },
  volunteer: {
    icon: HeartHandshake,
    english: 'Volunteer & Collaboration',
    marathi: 'स्वयंसेवा आणि सहकार्य',
    hindi: 'स्वयंसेवा और सहयोग',
  },
};

const CommunityModulePage = ({ language, section }: CommunityModulePageProps) => {
  const [entries, setEntries] = useState<CommunityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const t = (en: string, mr: string, hi?: string) => triText(language, en, mr, hi);
  const config = sectionConfig[section];
  const Icon = config.icon;

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_community_entries')
        .select('*')
        .eq('section', section)
        .eq('is_active', true)
        .order('display_order');

      if (!error) setEntries(data || []);
      setLoading(false);
    };

    fetchEntries();
  }, [section]);

  const localize = (english?: string, marathi?: string, hindi?: string) =>
    language === 'mr'
      ? (marathi || english)
      : language === 'hi'
        ? (hindi || english)
        : english;

  return (
    <main className="page-container">
      <PageHeader
        language={language}
        title={config.english}
        marathiTitle={config.marathi}
        hindiTitle={config.hindi}
        icon={<Icon size={28} />}
        tone="emerald"
      />

      <div className="mt-8">
        {loading ? (
          <div className="text-center py-12 text-gray-600">
            {t('Loading...', 'लोड होत आहे...', 'लोड हो रहा है...')}
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
            {t(
              'No information available yet.',
              'या विभागाची माहिती अद्याप उपलब्ध नाही.',
              'इस विभाग की जानकारी अभी उपलब्ध नहीं है.'
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <article key={entry.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {entry.image_url && (
                  <img
                    src={entry.image_url}
                    alt={localize(entry.title, entry.title_mr, entry.title_hi)}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  {entry.category && (
                    <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1 mb-3">
                      {entry.category}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {localize(entry.title, entry.title_mr, entry.title_hi)}
                  </h2>
                  {entry.description && (
                    <p className="text-gray-600">
                      {localize(entry.description, entry.description_mr, entry.description_hi)}
                    </p>
                  )}
                  {entry.address && (
                    <p className="text-sm text-gray-600 mt-3">{entry.address}</p>
                  )}
                  {entry.phone && (
                    <a href={`tel:${entry.phone}`} className="block text-emerald-700 mt-3">
                      {entry.phone}
                    </a>
                  )}
                  {entry.external_url && (
                    <a
                      href={entry.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-emerald-700 font-semibold hover:underline"
                    >
                      {t('Learn more', 'अधिक जाणून घ्या', 'और जानें')}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CommunityModulePage;
