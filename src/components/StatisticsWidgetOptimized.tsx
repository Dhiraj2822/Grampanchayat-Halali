import { Users, Home, User, UserCheck } from 'lucide-react';
import { Language } from '../types';
import { useWebsiteSettings } from '../contexts/WebsiteSettingsContext';
import { triText } from '../lib/i18n';

interface Statistic {
  stat_key: string;
  stat_value: string;
  stat_label: string;
  stat_label_mr?: string;
  stat_label_hi?: string;
  icon_name?: string;
  display_order: number;
}

interface StatisticsWidgetProps {
  language: Language;
}

const StatisticsWidgetOptimized = ({ language }: StatisticsWidgetProps) => {
  const { settings } = useWebsiteSettings();
  
  // Use settings for dynamic values
  // Fallback to calculation if specific fields are missing but total population exists
  const totalPopStr = settings.population?.replace(/,/g, '') || '2500';
  const totalPop = parseInt(totalPopStr);
  
  const families = settings.total_families 
    ? settings.total_families 
    : Math.round(totalPop / 4).toString();
    
  const malePop = settings.male_population
    ? settings.male_population
    : Math.round(totalPop * 0.52).toString();
    
  const femalePop = settings.female_population
    ? settings.female_population
    : (totalPop - parseInt(malePop)).toString();

  const stats: Statistic[] = [
    {
      stat_key: 'total_population',
      stat_value: totalPop.toString(),
      stat_label: 'Total Population',
      stat_label_mr: 'एकूण लोकसंख्या',
      stat_label_hi: 'कुल जनसंख्या',
      display_order: 1
    },
    {
      stat_key: 'total_families',
      stat_value: families,
      stat_label: 'Total Families',
      stat_label_mr: 'एकूण कुटुंबे',
      stat_label_hi: 'कुल परिवार',
      display_order: 2
    },
    {
      stat_key: 'male_population',
      stat_value: malePop,
      stat_label: 'Male Population',
      stat_label_mr: 'पुरुष लोकसंख्या',
      stat_label_hi: 'पुरुष जनसंख्या',
      display_order: 3
    },
    {
      stat_key: 'female_population',
      stat_value: femalePop,
      stat_label: 'Female Population',
      stat_label_mr: 'महिला लोकसंख्या',
      stat_label_hi: 'महिला जनसंख्या',
      display_order: 4
    }
  ];


  const getIcon = (statKey: string) => {
    switch (statKey) {
      case 'total_population':
        return <Users className="text-orange-600" size={32} />;
      case 'total_families':
      case 'total_households':
        return <Home className="text-green-600" size={32} />;
      case 'male_population':
        return <User className="text-blue-600" size={32} />;
      case 'female_population':
        return <UserCheck className="text-pink-600" size={32} />;
      default:
        return <Users className="text-gray-600" size={32} />;
    }
  };

  const getGradient = (statKey: string) => {
    switch (statKey) {
      case 'total_population':
        return 'from-orange-500 to-orange-600';
      case 'total_families':
      case 'total_households':
        return 'from-green-500 to-green-600';
      case 'male_population':
        return 'from-blue-500 to-blue-600';
      case 'female_population':
        return 'from-pink-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };
  const t = (en: string, mr?: string, hi?: string) => triText(language, en, mr || en, hi);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.stat_key}
          className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full"
        >
          {/* Gradient Header */}
          <div className={`bg-gradient-to-r ${getGradient(stat.stat_key)} p-4 flex items-center justify-between min-h-[110px]`}>
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm shrink-0">
              {getIcon(stat.stat_key)}
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                {parseInt(stat.stat_value).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Label */}
          <div className="p-4 min-h-[76px] flex items-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
            {language === 'hi'
              ? (stat.stat_label_hi || triText(language, stat.stat_label, stat.stat_label_mr || stat.stat_label))
              : t(stat.stat_label, stat.stat_label_mr)}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsWidgetOptimized;