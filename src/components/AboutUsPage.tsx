import { Language } from '../types';
import { useWebsiteSettings } from '../contexts/WebsiteSettingsContext';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { triText } from '../lib/i18n';

interface AboutUsPageProps {
  language: Language;
}

const AboutUsPage = ({ language }: AboutUsPageProps) => {
  const { settings, loading } = useWebsiteSettings();
  const [hierarchy, setHierarchy] = useState<Array<{
    id: string;
    name: string;
    name_mr?: string;
    name_hi?: string;
    designation: string;
    designation_mr?: string;
    designation_hi?: string;
    department?: string;
    photo_url?: string;
  }>>([]);

  useEffect(() => {
    const fetchHierarchy = async () => {
      const { data, error } = await supabase
        .from('cms_government_hierarchy')
        .select('id,name,name_mr,name_hi,designation,designation_mr,designation_hi,department,photo_url')
        .eq('is_active', true)
        .eq('verification_status', 'verified')
        .order('display_order');
      if (!error) setHierarchy(data || []);
    };
    fetchHierarchy();
  }, []);
  
  const t = (en: string, mr: string, hi?: string) => triText(language, en, mr, hi);
  
  // Helper to get setting value with language
  const getSetting = (
    enKey: keyof typeof settings,
    mrKey?: keyof typeof settings,
    hiKey?: keyof typeof settings
  ) => {
    if (language === 'mr' && mrKey && settings[mrKey]) {
      return settings[mrKey];
    }
    if (language === 'hi' && hiKey && settings[hiKey]) {
      return settings[hiKey];
    }
    return settings[enKey] || '';
  };

  const villageName = getSetting('village_name', 'village_name_mr', 'village_name_hi');
  const district = getSetting('district', 'district_mr', 'district_hi');
  const taluka = getSetting('taluka', 'taluka_mr', 'taluka_hi');
  const state = getSetting('state', 'state_mr', 'state_hi');
  const pincode = settings.pincode;
  const population = settings.population;
  const areaSqKm = settings.area_sqkm;
  const latitude = settings.latitude;
  const longitude = settings.longitude;

  // About Us content
  const history = getSetting('about_history', 'about_history_mr', 'about_history_hi');
  const geography = getSetting('about_geography', 'about_geography_mr', 'about_geography_hi');
  const culture = getSetting('about_culture', 'about_culture_mr', 'about_culture_hi');
  const economy = getSetting('about_economy', 'about_economy_mr', 'about_economy_hi');
  const sarpanchName = getSetting('sarpanch_name', 'sarpanch_name_mr', 'sarpanch_name_hi');
  const sarpanchMessage = getSetting('sarpanch_message', 'sarpanch_message_mr', 'sarpanch_message_hi');
  const sarpanchPhoto = settings.sarpanch_photo_url;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Village Information Section */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          {t(`About Gram Panchayat ${villageName}`, `ग्रामपंचायत ${villageName} बद्दल`)}
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              {t('Village Profile', 'गाव प्रोफाइल')}
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>{t('Village Name:', 'गावाचे नाव:')}</strong> {villageName || t('Not set', 'सेट नाही')}</p>
              <p><strong>{t('District:', 'जिल्हा:')}</strong> {district || t('Not set', 'सेट नाही')}</p>
              <p><strong>{t('Taluka:', 'तालुका:')}</strong> {taluka || t('Not set', 'सेट नाही')}</p>
              <p><strong>{t('State:', 'राज्य:')}</strong> {state || t('Maharashtra', 'महाराष्ट्र')}</p>
              {pincode && <p><strong>{t('PIN Code:', 'पिन कोड:')}</strong> {pincode}</p>}
              {areaSqKm && <p><strong>{t('Total Area:', 'एकूण क्षेत्र:')}</strong> {areaSqKm} {t('sq km', 'चौ.कि.मी.')}</p>}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              {t('Quick Facts', 'महत्त्वाची माहिती')}
            </h2>
            <div className="space-y-3 text-gray-700">
              {population && <p><strong>{t('Total Population:', 'एकूण लोकसंख्या:')}</strong> {population}</p>}
              <p><strong>{t('Contact:', 'संपर्क:')}</strong> {settings.phone_number || t('Not available', 'उपलब्ध नाही')}</p>
              <p><strong>{t('Email:', 'ईमेल:')}</strong> {settings.email || t('Not available', 'उपलब्ध नाही')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sarpanch Message Section */}
      {(sarpanchName || sarpanchMessage) && (
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {t("Sarpanch's Message", 'सरपंचांचा संदेश')}
          </h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {sarpanchPhoto && (
              <div className="flex-shrink-0">
                <img 
                  src={sarpanchPhoto} 
                  alt={String(sarpanchName)}
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
                />
              </div>
            )}

            {hierarchy.length > 0 && (
              <section className="modern-card p-6 md:p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {t('Government & Panchayat Hierarchy', 'सरकारी आणि पंचायत पदानुक्रम', 'सरकारी और पंचायत पदानुक्रम')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {hierarchy.map((person) => (
                    <article key={person.id} className="rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                      {person.photo_url ? (
                        <img src={person.photo_url} alt="" className="mx-auto h-24 w-24 rounded-full object-cover border-4 border-green-100" />
                      ) : (
                        <div className="mx-auto h-24 w-24 rounded-full bg-green-50 border-4 border-green-100" />
                      )}
                      <h3 className="mt-4 text-lg font-bold text-gray-900">
                        {language === 'mr'
                          ? (person.name_mr || person.name)
                          : language === 'hi'
                            ? (person.name_hi || person.name)
                            : person.name}
                      </h3>
                      <p className="mt-1 text-green-700 font-semibold">
                        {language === 'mr'
                          ? (person.designation_mr || person.designation)
                          : language === 'hi'
                            ? (person.designation_hi || person.designation)
                            : person.designation}
                      </p>
                      {person.department && <p className="mt-1 text-sm text-gray-600">{person.department}</p>}
                    </article>
                  ))}
                </div>
              </section>
            )}
            <div>
              {sarpanchName && (
                <h3 className="text-xl font-semibold text-green-700 mb-2">{sarpanchName}</h3>
              )}
              {sarpanchMessage && (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{sarpanchMessage}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* History Section */}
      {history && (
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {t('Village History', 'गावाचा इतिहास')}
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed whitespace-pre-line">{history}</p>
          </div>
        </section>
      )}

      {/* Geography Section */}
      {geography && (
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {t('Geography & Climate', 'भूगोल आणि हवामान')}
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed whitespace-pre-line">{geography}</p>
          </div>
        </section>
      )}

      {/* Culture Section */}
      {culture && (
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {t('Culture & Traditions', 'संस्कृती आणि परंपरा')}
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed whitespace-pre-line">{culture}</p>
          </div>
        </section>
      )}

      {/* Economy Section */}
      {economy && (
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {t('Economy & Livelihood', 'अर्थव्यवस्था आणि उपजीविका')}
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg leading-relaxed whitespace-pre-line">{economy}</p>
          </div>
        </section>
      )}

      {/* Google Maps Section */}
      {latitude && longitude && (
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin className="h-8 w-8 text-red-500" />
            {t('Village Location', 'गावाचे स्थान')}
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${villageName} Location`}
              />
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <p className="text-gray-600">
                <strong>{t('Coordinates:', 'निर्देशांक:')}</strong> {latitude}, {longitude}
              </p>
              <a 
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                {t('Open in Google Maps', 'Google Maps मध्ये पहा')}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {t('Contact Us', 'संपर्क करा')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-blue-700">{t('Office Address', 'कार्यालय पत्ता')}</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {getSetting('office_address', 'office_address_mr') || t('Address not set', 'पत्ता सेट नाही')}
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-blue-700">{t('Contact Details', 'संपर्क माहिती')}</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>{t('Phone:', 'फोन:')}</strong> {settings.phone_number || t('Not available', 'उपलब्ध नाही')}</p>
              <p><strong>{t('Email:', 'ईमेल:')}</strong> {settings.email || t('Not available', 'उपलब्ध नाही')}</p>
              <p><strong>{t('Office Hours:', 'कार्यालयीन वेळ:')}</strong> {getSetting('office_hours', 'office_hours_mr') || t('Mon-Sat: 10 AM - 5 PM', 'सोम-शनि: सकाळी १० ते संध्या ५')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Show placeholder if no content is set */}
      {!history && !geography && !culture && !economy && !sarpanchMessage && (
        <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <p className="text-yellow-800">
            {t(
              'About Us content has not been configured yet. Please update the Website Settings in the admin panel.',
              'आमच्याबद्दल सामग्री अद्याप कॉन्फिगर केलेली नाही. कृपया प्रशासक पॅनेलमध्ये वेबसाइट सेटिंग्ज अपडेट करा.'
            )}
          </p>
        </section>
      )}
    </div>
  );
};

export default AboutUsPage;