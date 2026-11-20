import { useState, useEffect } from 'react';
import { Users, TrendingUp, FileCheck, Building } from 'lucide-react';
import { Language } from '../types';
import { useWebsiteSettings } from '../contexts/WebsiteSettingsContext';
import { supabase } from '../lib/supabase';
import { triText } from '../lib/i18n';

interface DashboardStatsProps {
  language: Language;
}

interface StatItem {
  id: string;
  title: string;
  value: string | number | null;
  icon: string;
  change: string;
  description: string;
  color: string;
}

interface ProgressMetric {
  id: string;
  metric_key: string;
  metric_value: number | null;
  metric_unit: string;
  label: string;
  label_mr?: string;
  label_hi?: string;
  display_order: number;
  is_active: boolean;
}

interface Achievement {
  id: string;
  title: string;
  title_mr?: string;
  title_hi?: string;
  description?: string;
  description_mr?: string;
  description_hi?: string;
  year?: string;
  display_order: number;
  is_active: boolean;
}

const DashboardStats = ({ language }: DashboardStatsProps) => {
  const t = (en: string, mr: string, hi?: string) => triText(language, en, mr, hi);
  const { settings } = useWebsiteSettings();
  const [dynamicStats, setDynamicStats] = useState({
    works: null as number | null,
    schemes: null as number | null,
    services: null as number | null
  });
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch active development works count
        const { count: worksCount } = await supabase
          .from('cms_development_works')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'In Progress');

        // Fetch active schemes count
        const { count: schemesCount } = await supabase
          .from('cms_schemes')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        setDynamicStats({
          works: worksCount,
          schemes: schemesCount,
          services: null
        });

        const [metricsResponse, achievementsResponse] = await Promise.all([
          supabase
            .from('cms_village_progress_metrics')
            .select('*')
            .eq('is_active', true)
            .order('display_order'),
          supabase
            .from('cms_village_achievements')
            .select('*')
            .eq('is_active', true)
            .order('display_order')
        ]);

        if (!metricsResponse.error) setProgressMetrics(metricsResponse.data || []);
        if (!achievementsResponse.error) setAchievements(achievementsResponse.data || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Population value from settings, with fallback
  const populationValue = settings.population || t('Not available', 'उपलब्ध नाही', 'उपलब्ध नहीं');

  // Dynamic data
  const stats: StatItem[] = [
    {
      id: '1',
      title: t('Population', 'लोकसंख्या'),
      value: populationValue,
      icon: 'users',
      change: '',
      description: t('Total village population', 'एकूण गावातील लोकसंख्या', 'कुल गांव की जनसंख्या'),
      color: 'blue'
    },
    {
      id: '2',
      title: t('Development Works', 'विकास कामे'),
      value: dynamicStats.works ?? t('Not available', 'उपलब्ध नाही', 'उपलब्ध नहीं'),
      icon: 'building',
      change: '',
      description: t('Active projects', 'सक्रिय प्रकल्प', 'सक्रिय परियोजनाएं'),
      color: 'green'
    },
    {
      id: '3',
      title: t('Services', 'सेवा'),
      value: dynamicStats.services ?? t('Not available', 'उपलब्ध नाही', 'उपलब्ध नहीं'),
      icon: 'file-check',
      change: '',
      description: t('Available services', 'उपलब्ध सेवा', 'उपलब्ध सेवाएं'),
      color: 'purple'
    },
    {
      id: '4',
      title: t('Schemes', 'योजना'),
      value: dynamicStats.schemes ?? t('Not available', 'उपलब्ध नाही', 'उपलब्ध नहीं'),
      icon: 'trending-up',
      change: '',
      description: t('Government schemes', 'सरकारी योजना', 'सरकारी योजनाएं'),
      color: 'orange'
    }
  ];

  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users className="h-8 w-8" />;
      case 'building': return <Building className="h-8 w-8" />;
      case 'file-check': return <FileCheck className="h-8 w-8" />;
      case 'trending-up': return <TrendingUp className="h-8 w-8" />;
      default: return <FileCheck className="h-8 w-8" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'green': return 'bg-green-50 text-green-600 border-green-200';
      case 'purple': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'orange': return 'bg-orange-50 text-orange-600 border-orange-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {t('Village at a Glance', 'गाव एक दृष्टीत')}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 hover:shadow-xl transition-shadow h-full">
            <div className={`inline-flex p-3 rounded-lg mb-4 ${getColorClasses(stat.color)}`}>
              {getStatIcon(stat.icon)}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">{stat.title}</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {progressMetrics.length > 0 && (
        <section className="mt-10" aria-labelledby="village-progress-heading">
          <h2 id="village-progress-heading" className="text-2xl font-bold text-center mb-6 text-gray-800">
            {t('My Village, My Progress', 'माझे गाव, माझी प्रगती', 'मेरा गांव, मेरी प्रगति')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {progressMetrics.map((metric) => {
              const label = language === 'mr'
                ? (metric.label_mr || metric.label)
                : language === 'hi'
                  ? (metric.label_hi || metric.label)
                  : metric.label;
              const value = metric.metric_value;
              const isPercentage = metric.metric_unit === '%' || metric.metric_unit.toLowerCase().includes('percent');
              const percentage = value === null
                ? 0
                : isPercentage
                  ? Math.min(Math.max(value, 0), 100)
                  : 0;

              return (
                <div key={metric.id} className="bg-white rounded-xl shadow p-5 border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
                  <p className="text-3xl font-bold text-green-700">
                    {value === null
                      ? t('Not available', 'उपलब्ध नाही', 'उपलब्ध नहीं')
                      : `${value}${metric.metric_unit}`}
                  </p>
                  {isPercentage && (
                    <div className="mt-4 h-3 bg-green-100 rounded-full overflow-hidden" aria-label={`${percentage}%`}>
                      <div className="h-full bg-green-600" style={{ width: `${percentage}%` }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="mt-10" aria-labelledby="village-achievements-heading">
          <h2 id="village-achievements-heading" className="text-2xl font-bold text-center mb-6 text-gray-800">
            {t('Top Achievements', 'प्रमुख उपलब्धी', 'प्रमुख उपलब्धियां')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const title = language === 'mr'
                ? (achievement.title_mr || achievement.title)
                : language === 'hi'
                  ? (achievement.title_hi || achievement.title)
                  : achievement.title;
              const description = language === 'mr'
                ? (achievement.description_mr || achievement.description)
                : language === 'hi'
                  ? (achievement.description_hi || achievement.description)
                  : achievement.description;
              return (
                <article key={achievement.id} className="bg-white rounded-xl shadow p-5 border-l-4 border-green-600">
                  {achievement.year && (
                    <span className="text-xs font-semibold text-green-700">{achievement.year}</span>
                  )}
                  <h3 className="text-lg font-bold text-gray-800 mt-1">{title}</h3>
                  {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardStats;