import { useEffect, useState } from 'react';
import { Building2, Droplets, MapPin, Phone, ShieldAlert, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Language } from '../types';
import { triText } from '../lib/i18n';
import PageHeader from './PageHeader';

interface InfrastructureProps {
  language: Language;
}

interface Facility {
  id: string;
  facility_name: string;
  facility_name_mr?: string;
  facility_name_hi?: string;
  category: string;
  category_mr?: string;
  category_hi?: string;
  description?: string;
  description_mr?: string;
  description_hi?: string;
  address?: string;
  address_mr?: string;
  address_hi?: string;
  phone?: string;
  status?: string;
  status_mr?: string;
  status_hi?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  display_order: number;
}

const categoryIcons: Record<string, typeof Building2> = {
  water: Droplets,
  electricity: Zap,
  roads: MapPin,
  health: Phone,
  education: Building2,
  safety: ShieldAlert,
};

const InfrastructurePage = ({ language }: InfrastructureProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<Array<{
    id: string;
    label: string;
    label_mr?: string;
    label_hi?: string;
    contact_person?: string;
    contact_person_hi?: string;
    phone?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const t = (en: string, mr: string, hi?: string) => triText(language, en, mr, hi);

  useEffect(() => {
    const fetchInfrastructure = async () => {
      const [facilityResponse, contactResponse] = await Promise.all([
        supabase
          .from('cms_infrastructure_facilities')
          .select('*')
          .eq('is_active', true)
          .order('display_order'),
        supabase
          .from('cms_contact_info')
          .select('id, label, label_mr, label_hi, contact_person, contact_person_hi, phone')
          .eq('is_active', true)
          .eq('contact_type', 'emergency')
          .order('order_index'),
      ]);

      if (!facilityResponse.error) setFacilities(facilityResponse.data || []);
      if (!contactResponse.error) setEmergencyContacts(contactResponse.data || []);
      setLoading(false);
    };

    fetchInfrastructure();
  }, []);

  const categories = [
    'all',
    ...Array.from(new Set(facilities.map((facility) => facility.category))).filter(Boolean),
  ];

  const filteredFacilities = selectedCategory === 'all'
    ? facilities
    : facilities.filter((facility) => facility.category === selectedCategory);

  const localized = (english?: string, marathi?: string, hindi?: string) =>
    language === 'mr'
      ? (marathi || english)
      : language === 'hi'
        ? (hindi || english)
        : english;

  return (
    <main className="page-container">
      <PageHeader
        language={language}
        title="Village Infrastructure & Facilities"
        marathiTitle="गावातील पायाभूत सुविधा"
        hindiTitle="गांव की बुनियादी सुविधाएं"
        description="Water, roads, health, education, safety, and public facilities"
        marathiDescription="पाणी, रस्ते, आरोग्य, शिक्षण, सुरक्षा आणि सार्वजनिक सुविधा"
        hindiDescription="जल, सड़क, स्वास्थ्य, शिक्षा, सुरक्षा और सार्वजनिक सुविधाएं"
        icon={<Building2 size={28} />}
        tone="blue"
      />

      <div className="mt-8">
        {emergencyContacts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('Emergency Contacts', 'तातडीचे संपर्क', 'आपातकालीन संपर्क')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="bg-red-50 border border-red-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="text-red-600 mt-1" size={22} />
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {localized(contact.label, contact.label_mr, contact.label_hi)}
                      </h3>
                      {contact.contact_person && (
                        <p className="text-sm text-gray-600 mt-1">
                          {localized(contact.contact_person, undefined, contact.contact_person_hi)}
                        </p>
                      )}
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="text-red-700 font-semibold mt-2 inline-block">
                          {contact.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-600">
            {t('Loading facilities...', 'सुविधा लोड होत आहेत...', 'सुविधाएं लोड हो रही हैं...')}
          </div>
        ) : (
          <>
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedCategory === category
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    {category === 'all'
                      ? t('All', 'सर्व', 'सभी')
                      : t(category, category, category)}
                  </button>
                ))}
              </div>
            )}

            {filteredFacilities.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
                {t('No infrastructure information available.', 'पायाभूत सुविधा माहिती उपलब्ध नाही.', 'बुनियादी सुविधा की जानकारी उपलब्ध नहीं है.')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFacilities.map((facility) => {
                  const Icon = categoryIcons[facility.category.toLowerCase()] || Building2;
                  return (
                    <article key={facility.id} className="bg-white rounded-xl shadow-md border overflow-hidden">
                      <div className="p-5 border-b bg-blue-50">
                        <div className="flex items-center gap-3">
                          <Icon className="text-blue-700" size={28} />
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {localized(facility.facility_name, facility.facility_name_mr, facility.facility_name_hi)}
                            </h3>
                            <p className="text-sm text-blue-700">
                              {localized(facility.category, facility.category_mr, facility.category_hi)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 space-y-3 text-sm text-gray-700">
                        {facility.description && (
                          <p>
                            {localized(facility.description, facility.description_mr, facility.description_hi)}
                          </p>
                        )}
                        {facility.address && (
                          <p className="flex items-start gap-2">
                            <MapPin size={16} className="text-gray-500 mt-0.5 shrink-0" />
                            {localized(facility.address, facility.address_mr, facility.address_hi)}
                          </p>
                        )}
                        {facility.phone && (
                          <a href={`tel:${facility.phone}`} className="flex items-center gap-2 text-blue-700">
                            <Phone size={16} />
                            {facility.phone}
                          </a>
                        )}
                        {facility.status && (
                          <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                            {localized(facility.status, facility.status_mr, facility.status_hi)}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default InfrastructurePage;
