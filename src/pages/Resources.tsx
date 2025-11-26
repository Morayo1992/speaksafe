import { Phone, MapPin, Globe } from 'lucide-react';

const resources = [
  {
    category: 'Domestic Violence Support',
    color: 'bg-red-50',
    borderColor: 'border-red-600',
    services: [
      {
        name: 'National Domestic Violence Hotline',
        phone: '1-800-799-7233',
        hours: '24/7',
        website: 'thehotline.org',
        description: 'Crisis support and safety planning for domestic violence survivors',
      },
      {
        name: 'Local Women\'s Shelter',
        phone: '1-800-273-8255',
        hours: '24/7',
        website: 'womenshelter.org',
        description: 'Emergency housing, counseling, and legal advocacy',
      },
    ],
  },
  {
    category: 'Mental Health & Counseling',
    color: 'bg-blue-50',
    borderColor: 'border-blue-600',
    services: [
      {
        name: 'National Suicide Prevention Lifeline',
        phone: '1-800-273-8255',
        hours: '24/7',
        website: 'suicidepreventionlifeline.org',
        description: 'Confidential support for those experiencing emotional distress',
      },
      {
        name: 'Crisis Text Line',
        phone: 'Text HOME to 741741',
        hours: '24/7',
        website: 'crisistextline.org',
        description: 'Crisis support via text message',
      },
      {
        name: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        hours: '24/7',
        website: 'samhsa.gov',
        description: 'Treatment and support services for substance abuse and mental health',
      },
    ],
  },
  {
    category: 'Legal Aid & Advocacy',
    color: 'bg-green-50',
    borderColor: 'border-green-600',
    services: [
      {
        name: 'Legal Aid Society',
        phone: '1-800-531-5376',
        hours: 'Business Hours',
        website: 'legalaid.org',
        description: 'Free legal assistance for low-income survivors',
      },
      {
        name: 'Rape, Abuse & Incest National Network (RAINN)',
        phone: '1-800-656-4673',
        hours: '24/7',
        website: 'rainn.org',
        description: 'Support and resources for sexual assault survivors',
      },
    ],
  },
  {
    category: 'General Support',
    color: 'bg-purple-50',
    borderColor: 'border-purple-600',
    services: [
      {
        name: '211 Community Resources',
        phone: 'Dial 211',
        hours: '24/7',
        website: '211.org',
        description: 'Comprehensive information on local resources and services',
      },
      {
        name: 'International Hotline Directory',
        phone: 'Call + 1-800-844-4673',
        hours: '24/7',
        website: 'ihotline.org',
        description: 'Global network of crisis support lines',
      },
    ],
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Support Resources</h1>
          <p className="text-slate-600 text-lg">
            Help is available 24/7. You are not alone. All services are confidential and free.
          </p>
        </div>

        <div className="space-y-8">
          {resources.map((category, catIdx) => (
            <div key={catIdx} className={`${category.color} border-l-4 ${category.borderColor} rounded-lg p-8`}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.services.map((service, svcIdx) => (
                  <div
                    key={svcIdx}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{service.name}</h3>
                    <p className="text-slate-600 mb-4 text-sm">{service.description}</p>

                    <div className="space-y-2 border-t border-slate-200 pt-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-slate-500">Phone</p>
                          <p className="font-mono font-bold text-slate-900">{service.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-slate-500">Hours</p>
                          <p className="font-semibold text-slate-900">{service.hours}</p>
                        </div>
                      </div>

                      {service.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <a
                            href={`https://${service.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                          >
                            {service.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tips for Seeking Help</h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              <span>Find a quiet, safe place to make a call if possible</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              <span>Have pen and paper ready to write down important information</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              <span>Take your time explaining your situation - counselors are trained to listen</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              <span>All calls are confidential - you don't have to give your real name</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">•</span>
              <span>Don't worry about being judged - these professionals help people every day</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
