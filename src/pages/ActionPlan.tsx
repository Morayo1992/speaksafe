import { useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Phone, FileText } from 'lucide-react';

export default function ActionPlan() {
  const { accessCode } = useParams();

  const actionPlanSteps = [
    {
      title: 'Immediate Safety',
      icon: AlertCircle,
      items: [
        'Move to a safe location if you feel threatened',
        'Tell someone you trust about the incident',
        'Keep your phone charged and accessible',
        'Document any injuries or damage with photos',
        'Consider staying with friends or family temporarily',
      ],
    },
    {
      title: 'Evidence Preservation',
      icon: FileText,
      items: [
        'Do not shower or clean up if this relates to physical abuse',
        'Preserve all communications (messages, emails) as screenshots',
        'Keep receipts and records of expenses related to the incident',
        'Write down details while they are fresh in your memory',
        'Store evidence in a safe location or with trusted person',
      ],
    },
    {
      title: 'Legal Options',
      icon: CheckCircle,
      items: [
        'Contact local police to file an official report if safe to do so',
        'Consult with a legal aid attorney about your options',
        'Gather witness contact information',
        'Request protective/restraining orders if needed',
        'Keep copies of all legal documents',
      ],
    },
    {
      title: 'Support Services',
      icon: Phone,
      items: [
        'Call the National Hotline for counselling support',
        'Schedule sessions with a mental health professional',
        'Join survivor support groups for peer support',
        'Consider crisis counselling for immediate emotional support',
        'Explore workplace accommodations with HR if applicable',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Your Action Plan</h1>
          <p className="text-slate-600 text-lg">
            Here's what you can do next to stay safe and move forward
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Access Code: <span className="font-mono font-bold text-blue-600">{accessCode}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {actionPlanSteps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>
                </div>
                <ul className="space-y-3">
                  {step.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-3 text-slate-700">
                      <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Remember</h3>
          <ul className="space-y-2 text-slate-700">
            <li>• You are not alone. Many others have experienced similar situations.</li>
            <li>• It is not your fault. The responsibility lies with the person who committed the act.</li>
            <li>• Your safety and well-being come first. Make decisions that feel right for you.</li>
            <li>• Professional help is available and can make a real difference.</li>
            <li>• You can reach out to resources at any time, day or night.</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/resources"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-center transition transform hover:scale-105"
          >
            View Support Resources
          </Link>
          <Link
            to="/retrieve"
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-lg text-center transition transform hover:scale-105"
          >
            Retrieve Your Evidence
          </Link>
        </div>
      </div>
    </div>
  );
}
