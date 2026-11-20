import { FormEvent, useEffect, useState } from 'react';
import { Search, FileText, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Language } from '../types';

interface SearchPageProps {
  language: Language;
  initialQuery?: string;
  onNavigate: (page: string) => void;
}

interface SearchResult {
  title: string;
  description: string;
  page: string;
  type: string;
}

const staticPages: SearchResult[] = [
  { title: 'About the Gram Panchayat', description: 'Village history, geography, culture, economy, and office information.', page: 'about', type: 'Page' },
  { title: 'Development Works', description: 'Completed, ongoing, and proposed village development projects.', page: 'development-works', type: 'Page' },
  { title: 'Government Schemes', description: 'Central, state, and local government schemes and application details.', page: 'schemes', type: 'Page' },
  { title: 'Citizen Services', description: 'Certificates, forms, tax services, and grievances.', page: 'forms', type: 'Page' },
  { title: 'Contact Us', description: 'Office address, contact numbers, timings, and location.', page: 'contact', type: 'Page' },
  { title: 'Photo Gallery and Videos', description: 'Village events, development works, photos, and videos.', page: 'gallery', type: 'Page' },
  { title: 'Gram Sabha Meetings', description: 'Meeting agendas, decisions, attendance, and minutes.', page: 'gram-sabha', type: 'Page' },
  { title: 'Budget and Audit Reports', description: 'Financial transparency documents and reports.', page: 'budget', type: 'Page' },
  { title: 'Right to Information', description: 'Submit an RTI application online.', page: 'rti', type: 'Page' },
];

const SearchPage = ({ language, initialQuery = '', onNavigate }: SearchPageProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const t = (en: string, mr: string) => language === 'mr' ? mr : en;

  useEffect(() => {
    setQuery(initialQuery);
    void search(initialQuery);
  }, [initialQuery]);

  const search = async (term: string) => {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) {
      setResults(staticPages);
      return;
    }

    setLoading(true);
    const matchingPages = staticPages.filter((page) =>
      `${page.title} ${page.description}`.toLowerCase().includes(normalizedTerm)
    );
    const dynamicResults: SearchResult[] = [];

    const sources = [
      { table: 'cms_flash_news', page: 'home', type: 'Announcement', fields: ['title', 'content'] },
      { table: 'cms_development_works', page: 'development-works', type: 'Development', fields: ['work_name', 'description'] },
      { table: 'cms_schemes', page: 'schemes', type: 'Scheme', fields: ['scheme_name', 'description', 'benefits'] },
      { table: 'cms_tenders', page: 'tenders', type: 'Tender', fields: ['title', 'description'] },
      { table: 'cms_downloads', page: 'forms', type: 'Download', fields: ['title', 'description'] },
    ];

    const responses = await Promise.all(
      sources.map(async (source) => {
        const response = await supabase.from(source.table).select('*').limit(100);
        return { source, response };
      })
    );

    responses.forEach(({ source, response }) => {
      if (response.error || !response.data) return;
      response.data.forEach((item) => {
        const searchableText = source.fields
          .map((field) => String(item[field] || ''))
          .join(' ');
        if (searchableText.toLowerCase().includes(normalizedTerm)) {
          dynamicResults.push({
            title: String(item[source.fields[0]] || source.type),
            description: String(item.description || item.content || item.benefits || ''),
            page: source.page,
            type: source.type,
          });
        }
      });
    });

    setResults([...matchingPages, ...dynamicResults].slice(0, 50));
    setLoading(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void search(query);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          {t('Search the Website', 'वेबसाइट शोधा')}
        </h1>
        <p className="text-gray-600">
          {t('Find services, announcements, schemes, and village information.', 'सेवा, घोषणा, योजना आणि गावाची माहिती शोधा.')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder={t('Search by keyword...', 'कीवर्डद्वारे शोधा...')}
            aria-label={t('Search by keyword', 'कीवर्डद्वारे शोधा')}
          />
        </div>
        <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
          {t('Search', 'शोधा')}
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-600">{t('Searching...', 'शोधत आहे...')}</p>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t('No matching information found.', 'जुळणारी माहिती सापडली नाही.')}
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.title}-${index}`}
              onClick={() => onNavigate(result.page)}
              className="w-full text-left bg-white rounded-lg shadow p-5 hover:shadow-md border border-gray-100 transition"
            >
              <div className="flex items-start gap-4">
                <FileText className="text-green-600 mt-1 flex-shrink-0" size={22} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-800">{result.title}</h2>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">{result.type}</span>
                  </div>
                  <p className="text-gray-600">{result.description || t('Open this section for more information.', 'अधिक माहितीसाठी हा विभाग उघडा.')}</p>
                </div>
                <ArrowRight className="text-gray-400" size={20} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
