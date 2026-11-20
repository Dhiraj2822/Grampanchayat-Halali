import { Language } from '../types';

export const triText = (
  language: Language,
  english: string,
  marathi: string,
  hindi: string
) => {
  if (language === 'mr') return marathi || english;
  if (language === 'hi') return hindi || english;
  return english;
};

export const hindiTranslations: Record<string, string> = {
  'English': 'अंग्रेज़ी',
  'Search': 'खोज',
  'Search website': 'वेबसाइट खोजें',
  'Search by keyword': 'कीवर्ड से खोजें',
  'Search by keyword...': 'कीवर्ड से खोजें...',
  'Searching...': 'खोज जारी है...',
  'No matching information found.': 'कोई संबंधित जानकारी नहीं मिली.',
  'Welcome': 'स्वागत है',
  'Home': 'मुख्यपृष्ठ',
  'About Us': 'हमारे बारे में',
  'Administration': 'प्रशासन',
  'Elected Body': 'निर्वाचित सदस्य',
  'Gram Sevak & Staff': 'ग्रामसेवक और कर्मचारी',
  'Committees': 'समितियां',
  'Citizen Services': 'नागरिक सेवाएं',
  'Apply for Certificates': 'प्रमाणपत्र के लिए आवेदन',
  'Download Forms': 'फॉर्म डाउनलोड करें',
  'Development': 'विकास',
  'Works List': 'कार्य सूची',
  'GPDP': 'जीपीडीपी',
  'Tenders': 'निविदाएं',
  'Schemes': 'योजनाएं',
  'Central Schemes': 'केंद्र सरकार की योजनाएं',
  'State Schemes': 'राज्य सरकार की योजनाएं',
  'Beneficiaries': 'लाभार्थी सूची',
  'Transparency': 'पारदर्शिता',
  'RTI': 'सूचना का अधिकार',
  'Gram Sabha': 'ग्रामसभा',
  'BPL List': 'बीपीएल सूची',
  'Budget & Audit': 'बजट और लेखापरीक्षण',
  'Gallery': 'गैलरी',
  'Photo Gallery': 'फोटो गैलरी',
  'Video Gallery': 'वीडियो गैलरी',
  'Contact Us': 'संपर्क करें',
  'Login': 'लॉगिन',
  'Logout': 'लॉगआउट',
  'My Dashboard': 'मेरा डैशबोर्ड',
  'Admin Dashboard': 'प्रशासन डैशबोर्ड',
  'Super Admin Dashboard': 'सुपर एडमिन डैशबोर्ड',
  'User': 'उपयोगकर्ता',
  'Quick Links': 'त्वरित लिंक',
  'Important Services': 'महत्वपूर्ण सेवाएं',
  'External Links': 'बाहरी लिंक',
  'Social media links not set': 'सोशल मीडिया लिंक सेट नहीं हैं',
  'Back': 'वापस',
  'Back to Home': 'मुख्यपृष्ठ पर वापस',
  'Loading...': 'लोड हो रहा है...',
  'Loading': 'लोड हो रहा है',
  'No data available': 'कोई डेटा उपलब्ध नहीं है',
  'No staff information available.': 'कर्मचारी जानकारी उपलब्ध नहीं है.',
  'No downloadable forms available yet.': 'अभी डाउनलोड करने योग्य फॉर्म उपलब्ध नहीं हैं.',
  'No tenders found': 'कोई निविदा नहीं मिली',
  'No meetings found': 'कोई ग्रामसभा बैठक नहीं मिली',
  'No documents found': 'कोई दस्तावेज़ नहीं मिला',
  'No projects found': 'कोई परियोजना नहीं मिली',
  'No development works found.': 'कोई विकास कार्य नहीं मिला.',
  'No schemes found for selected filter': 'चयनित फ़िल्टर के लिए कोई योजना नहीं मिली',
  'All': 'सभी',
  'All Years': 'सभी वर्ष',
  'All Works': 'सभी कार्य',
  'All Documents': 'सभी दस्तावेज़',
  'All Schemes': 'सभी योजनाएं',
  'All Categories': 'सभी श्रेणियां',
  'Completed': 'पूर्ण',
  'Ongoing': 'चल रही',
  'Proposed': 'प्रस्तावित',
  'Open': 'खुली',
  'Closed': 'बंद',
  'Pending': 'लंबित',
  'Filter by Status': 'स्थिति से फ़िल्टर करें',
  'Status': 'स्थिति',
  'Budget': 'बजट',
  'Audit Reports': 'लेखापरीक्षण रिपोर्ट',
  'Annual Reports': 'वार्षिक रिपोर्ट',
  'Budget & Audit Reports': 'बजट और लेखापरीक्षण रिपोर्ट',
  'Financial transparency and accountability documents': 'वित्तीय पारदर्शिता और जवाबदेही दस्तावेज़',
  'Income': 'आय',
  'Expenditure': 'व्यय',
  'Surplus/Deficit': 'अधिशेष/घाटा',
  'Total Income': 'कुल आय',
  'Total Expenditure': 'कुल व्यय',
  'Uploaded on:': 'अपलोड तिथि:',
  'Download': 'डाउनलोड',
  'No Document': 'दस्तावेज़ नहीं',
  'Submit Grievance': 'शिकायत दर्ज करें',
  'Track Grievance Status': 'शिकायत स्थिति जांचें',
  'Enter ticket number, for example GRV1234567890': 'टिकट नंबर दर्ज करें, उदाहरण GRV1234567890',
  'Checking...': 'जांच जारी है...',
  'Track': 'जांचें',
  'No grievance was found for this ticket number.': 'इस टिकट नंबर के लिए कोई शिकायत नहीं मिली.',
  'Unable to track this ticket. Please try again.': 'यह टिकट जांचा नहीं जा सका. कृपया पुनः प्रयास करें.',
  'Full Name': 'पूरा नाम',
  'Mobile Number': 'मोबाइल नंबर',
  'Email Address': 'ईमेल पता',
  'Category': 'श्रेणी',
  'Location / Address': 'स्थान / पता',
  'Subject': 'विषय',
  'Description': 'विवरण',
  'Submit': 'जमा करें',
  'Submitting...': 'जमा किया जा रहा है...',
  'Submit Another Grievance': 'दूसरी शिकायत दर्ज करें',
  'Grievance Submitted Successfully!': 'शिकायत सफलतापूर्वक दर्ज हुई!',
  'Your Ticket Number:': 'आपका टिकट नंबर:',
  'Keep your ticket number safe for tracking': 'ट्रैकिंग के लिए अपना टिकट नंबर सुरक्षित रखें',
  'Water Supply': 'जलापूर्ति',
  'Sanitation': 'स्वच्छता',
  'Street Lights': 'सड़क की रोशनी',
  'Roads': 'सड़कें',
  'Drainage': 'जल निकासी',
  'Garbage Collection': 'कचरा संग्रह',
  'Other': 'अन्य',
  'Population': 'जनसंख्या',
  'Services': 'सेवाएं',
  'Village at a Glance': 'एक नजर में गांव',
  'My Village, My Progress': 'मेरा गांव, मेरी प्रगति',
  'Top Achievements': 'प्रमुख उपलब्धियां',
  'Not available': 'उपलब्ध नहीं',
  'Village History': 'गांव का इतिहास',
  'Geography & Climate': 'भूगोल और जलवायु',
  'Culture & Traditions': 'संस्कृति और परंपराएं',
  'Economy & Livelihood': 'अर्थव्यवस्था और आजीविका',
  'Village Profile': 'गांव की जानकारी',
  'Quick Facts': 'महत्वपूर्ण जानकारी',
  'Village Name:': 'गांव का नाम:',
  'District:': 'जिला:',
  'Taluka:': 'तहसील:',
  'State:': 'राज्य:',
  'PIN Code:': 'पिन कोड:',
  'Total Area:': 'कुल क्षेत्रफल:',
  'Total Population:': 'कुल जनसंख्या:',
  'Contact:': 'संपर्क:',
  'Email:': 'ईमेल:',
  'Office Address': 'कार्यालय का पता',
  'Contact Details': 'संपर्क विवरण',
  'Phone:': 'फोन:',
  'Office Hours:': 'कार्यालय समय:',
  'Village Location': 'गांव का स्थान',
  'Open in Google Maps': 'Google Maps में देखें',
  'Our Location': 'हमारा स्थान',
  'Send Us a Message': 'हमें संदेश भेजें',
  'Your Name': 'आपका नाम',
  'Email': 'ईमेल',
  'Send Message': 'संदेश भेजें',
  'Sending...': 'भेजा जा रहा है...',
  'About the Gram Panchayat': 'ग्राम पंचायत के बारे में',
  'Gram Panchayat Staff': 'ग्राम पंचायत कर्मचारी',
  'Elected Body Members': 'निर्वाचित सदस्य',
  'Government Tenders': 'सरकारी निविदाएं',
  'Government Schemes': 'सरकारी योजनाएं',
  'Central': 'केंद्र',
  'State': 'राज्य',
  'Local': 'स्थानीय',
  'View Details': 'विवरण देखें',
  'Eligibility:': 'पात्रता:',
  'Benefits:': 'लाभ:',
  'Application Process:': 'आवेदन प्रक्रिया:',
  'Contact Information:': 'संपर्क जानकारी:',
  'Helpline:': 'हेल्पलाइन:',
  'Active Scheme': 'सक्रिय योजना',
  'Photo Gallery & Videos': 'फोटो गैलरी और वीडियो',
  'Photos': 'फोटो',
  'Videos': 'वीडियो',
  'Gram Sabha Meetings': 'ग्रामसभा बैठकें',
  'Meeting Agenda': 'बैठक की कार्यसूची',
  'Decisions Taken:': 'लिए गए निर्णय:',
  'Agenda:': 'कार्यसूची:',
  'Venue:': 'स्थान:',
  'Minutes': 'कार्यवृत्त',
  'Development Projects': 'विकास परियोजनाएं',
  'Development Works': 'विकास कार्य',
  'Track infrastructure and development projects in our village': 'अपने गांव की बुनियादी सुविधाओं और विकास परियोजनाओं की जानकारी देखें',
  'Sanctioned Cost': 'स्वीकृत लागत',
  'Actual Cost': 'वास्तविक लागत',
  'Progress': 'प्रगति',
  'Contractor:': 'ठेकेदार:',
  'Funding:': 'निधि:',
  'Started:': 'आरंभ:',
  'Completed:': 'पूर्ण:',
  'Search the Website': 'वेबसाइट खोजें',
};

let translatorObserver: MutationObserver | null = null;
const originalTextNodes = new WeakMap<Node, string>();
const originalPlaceholders = new WeakMap<HTMLElement, string>();

const translateNode = (node: Node) => {
  if (node.nodeType !== Node.TEXT_NODE) return;
  const currentText = node.textContent || '';
  const exact = currentText.trim();
  if (!exact) return;
  if (hindiTranslations[exact]) {
    if (!originalTextNodes.has(node)) {
      originalTextNodes.set(node, currentText);
    }
    node.textContent = currentText.replace(exact, hindiTranslations[exact]);
  }
};

const translatePlaceholders = (root: ParentNode) => {
  root.querySelectorAll<HTMLElement>('[placeholder]').forEach((element) => {
    const input = element as HTMLInputElement | HTMLTextAreaElement;
    const placeholder = input.placeholder;
    if (placeholder && hindiTranslations[placeholder]) {
      if (!originalPlaceholders.has(input)) {
        originalPlaceholders.set(input, placeholder);
      }
      input.placeholder = hindiTranslations[placeholder];
    }
  });
};

export const applyHindiText = () => {
  if (typeof document === 'undefined') return;
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walk.nextNode();
  while (node) {
    translateNode(node);
    node = walk.nextNode();
  }
  translatePlaceholders(document);
};

export const installHindiRenderer = () => {
  if (typeof window === 'undefined') return () => {};
  applyHindiText();

  translatorObserver?.disconnect();
  translatorObserver = new MutationObserver(() => applyHindiText());
  translatorObserver.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  return () => translatorObserver?.disconnect();
};

export const restoreEnglishOrMarathiText = () => {
  translatorObserver?.disconnect();
  translatorObserver = null;

  if (typeof document === 'undefined') return;
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walk.nextNode();
  while (node) {
    if (originalTextNodes.has(node)) {
      node.textContent = originalTextNodes.get(node) || node.textContent;
    }
    node = walk.nextNode();
  }

  document.querySelectorAll<HTMLElement>('[placeholder]').forEach((element) => {
    if (originalPlaceholders.has(element)) {
      (element as HTMLInputElement | HTMLTextAreaElement).placeholder =
        originalPlaceholders.get(element) || '';
    }
  });
};
