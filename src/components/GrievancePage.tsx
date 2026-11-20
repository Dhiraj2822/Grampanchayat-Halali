import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Language } from '../types';
import { triText } from '../lib/i18n';

interface GrievancePageProps {
  language: Language;
}

const GrievancePage = ({ language }: GrievancePageProps) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [trackingTicket, setTrackingTicket] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<{
    complaint_number: string;
    subject: string;
    status: string;
    resolution_note: string | null;
    created_at: string;
    updated_at: string;
  } | null>(null);
  const [trackingError, setTrackingError] = useState('');
  const [resolutionReport, setResolutionReport] = useState<{
    total_grievances: number;
    resolved_grievances: number;
    open_grievances: number;
    resolution_percent: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    complainant_name: '',
    mobile: '',
    email: '',
    category: '',
    subject: '',
    description: '',
    location: '',
  });

  const t = (en: string, mr: string, hi?: string) => triText(language, en, mr, hi);
  useEffect(() => {
    const fetchResolutionReport = async () => {
      const { data, error } = await supabase.rpc('grievance_resolution_report');
      if (!error && data && data.length > 0) setResolutionReport(data[0]);
    };
    fetchResolutionReport();
  }, []);

  const categories = [
    { en: 'Water Supply', mr: 'पाणीपुरवठा' },
    { en: 'Sanitation', mr: 'स्वच्छता' },
    { en: 'Street Lights', mr: 'रस्त्यावरील दिवे' },
    { en: 'Roads', mr: 'रस्ते' },
    { en: 'Drainage', mr: 'गटारव्यवस्था' },
    { en: 'Garbage Collection', mr: 'कचरा संकलन' },
    { en: 'Other', mr: 'इतर' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate ticket number
      const timestamp = Date.now();
      const generatedTicket = `GRV${timestamp}`;

      const { error } = await supabase.from('cit_complaints').insert({
        complaint_number: generatedTicket,
        complainant_name: formData.complainant_name,
        mobile: formData.mobile,
        email: formData.email || null,
        category: formData.category,
        location: formData.location || null,
        subject: formData.subject,
        description: formData.description,
        status: 'Submitted',
        user_id: null,
      });

      if (error) throw error;

      setTicketNumber(generatedTicket);
      setSubmitted(true);
      
      // Reset form
      setFormData({
        complainant_name: '',
        mobile: '',
        email: '',
        category: '',
        subject: '',
        description: '',
        location: '',
      });
    } catch (error) {
      console.error('Error submitting grievance:', error);
      alert(t('Failed to submit grievance. Please try again.', 'तक्रार सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.'));
    } finally {
      setLoading(false);
    }
  };

  const handleTracking = async (event: React.FormEvent) => {
    event.preventDefault();
    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);

    const { data, error } = await supabase.rpc('lookup_grievance_status', {
      lookup_ticket: trackingTicket.trim(),
    });

    if (error) {
      console.error('Error tracking grievance:', error);
      setTrackingError(t('Unable to track this ticket. Please try again.', 'हा तिकीट ट्रॅक करता आला नाही. कृपया पुन्हा प्रयत्न करा.'));
    } else if (!data || data.length === 0) {
      setTrackingError(t('No grievance was found for this ticket number.', 'या तिकीट नंबरसाठी कोणतीही तक्रार सापडली नाही.'));
    } else {
      setTrackingResult(data[0]);
    }
    setTrackingLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('Grievance Submitted Successfully!', 'तक्रार यशस्वीरित्या सबमिट झाली!')}
          </h2>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
            <p className="text-gray-700 mb-2">
              {t('Your Ticket Number:', 'तुमचा तिकीट नंबर:')}
            </p>
            <p className="text-3xl font-mono font-bold text-green-600">{ticketNumber}</p>
          </div>
          <p className="text-gray-600 mb-6">
            {t(
              'Please save this ticket number for future reference. You can track the status of your grievance using this number.',
              'कृपया भविष्यातील संदर्भासाठी हा तिकीट नंबर सेव्ह करा. तुम्ही या नंबरचा वापर करून तुमच्या तक्रारीची स्थिती ट्रॅक करू शकता.'
            )}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            {t('Submit Another Grievance', 'आणखी एक तक्रार सबमिट करा')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          {t('Submit Grievance', 'तक्रार नोंदवा')}
        </h1>
        <p className="text-gray-600 text-lg">
          {t(
            'Register your complaint and we will address it promptly',
            'तुमची तक्रार नोंदवा आणि आम्ही लवकरच त्याचे निवारण करू'
          )}
        </p>
      </div>

      {resolutionReport && (
        <section className="modern-card p-6 mb-6" aria-labelledby="grievance-report-heading">
          <h2 id="grievance-report-heading" className="text-xl font-bold text-gray-900 mb-4">
            {t('Monthly Grievance Report', 'तक्रार मासिक अहवाल', 'शिकायत मासिक रिपोर्ट')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              [t('Total', 'एकूण', 'कुल'), resolutionReport.total_grievances],
              [t('Resolved', 'निराकरण झाले', 'निराकृत'), resolutionReport.resolved_grievances],
              [t('Open', 'प्रलंबित', 'खुली'), resolutionReport.open_grievances],
              [t('Resolution', 'निराकरण', 'निराकरण'), `${resolutionReport.resolution_percent}%`],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl bg-green-50 p-4 text-center border border-green-100">
                <p className="text-2xl font-bold text-green-700">{value}</p>
                <p className="text-sm text-gray-600 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Info Alert */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-blue-800 font-semibold mb-1">
              {t('Important Information', 'महत्त्वाची माहिती')}
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• {t('You will receive a unique ticket number after submission', 'सबमिशननंतर तुम्हाला एक अद्वितीय तिकीट नंबर मिळेल')}</li>
              <li>• {t('Keep your ticket number safe for tracking', 'ट्रॅकिंगसाठी तुमचा तिकीट नंबर सुरक्षित ठेवा')}</li>
              <li>• {t('We aim to resolve grievances within 7-15 days', 'आम्ही 7-15 दिवसांत तक्रारींचे निराकरण करण्याचे लक्ष्य ठेवतो')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Public ticket tracking */}
      <div className="bg-white border border-green-200 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {t('Track Grievance Status', 'तक्रार स्थिती तपासा')}
        </h2>
        <form onSubmit={handleTracking} className="flex flex-col sm:flex-row gap-3">
          <input
            value={trackingTicket}
            onChange={(event) => setTrackingTicket(event.target.value)}
            required
            placeholder={t('Enter ticket number, for example GRV1234567890', 'तिकीट नंबर टाका, उदाहरण GRV1234567890')}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={trackingLoading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {trackingLoading ? t('Checking...', 'तपासत आहे...') : t('Track', 'तपासा')}
          </button>
        </form>
        {trackingError && (
          <p className="mt-4 text-red-700" role="alert">{trackingError}</p>
        )}
        {trackingResult && (
          <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p><strong>{t('Ticket:', 'तिकीट:')}</strong> {trackingResult.complaint_number}</p>
              <p><strong>{t('Status:', 'स्थिती:')}</strong> {trackingResult.status}</p>
              <p className="md:col-span-2"><strong>{t('Subject:', 'विषय:')}</strong> {trackingResult.subject}</p>
              {trackingResult.resolution_note && (
                <p className="md:col-span-2"><strong>{t('Resolution:', 'निराकरण:')}</strong> {trackingResult.resolution_note}</p>
              )}
              <p><strong>{t('Submitted:', 'नोंदवले:')}</strong> {new Date(trackingResult.created_at).toLocaleDateString('en-IN')}</p>
              <p><strong>{t('Updated:', 'अपडेट:')}</strong> {new Date(trackingResult.updated_at).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Grievance Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t('Full Name', 'पूर्ण नाव')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="complainant_name"
              value={formData.complainant_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t('Enter your full name', 'तुमचे पूर्ण नाव टाका')}
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t('Mobile Number', 'मोबाईल नंबर')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="9876543210"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t('Email Address', 'ईमेल पत्ता')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t('Category', 'श्रेणी')} <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">{t('Select Category', 'श्रेणी निवडा')}</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.en}>
                  {language === 'mr' ? cat.mr : cat.en}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('Location / Address', 'स्थान / पत्ता')}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t('Ward / Area / Landmark', 'प्रभाग / क्षेत्र / खूण')}
            />
          </div>

          {/* Subject */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('Subject', 'विषय')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t('Brief summary of your complaint', 'तुमच्या तक्रारीचा संक्षिप्त सारांश')}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('Description', 'तपशील')} <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={t('Describe your complaint in detail...', 'तुमची तक्रार तपशीलवार वर्णन करा...')}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-12 py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t('Submitting...', 'सबमिट करत आहे...')}
              </>
            ) : (
              <>
                {t('Submit Grievance', 'तक्रार सबमिट करा')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrievancePage;
