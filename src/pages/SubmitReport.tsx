import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function SubmitReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    typeOfIncident: '',
    description: '',
    incidentDate: '',
    location: '',
    supportNeeded: 'counselling',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('typeOfIncident', formData.typeOfIncident);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('incidentDate', formData.incidentDate);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('supportNeeded', formData.supportNeeded);

      files.forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await fetch(`${SUPABASE_URL}/functions/v1/submit_report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      const data = await response.json();

      if (data.success) {
        setAccessCode(data.accessCode);
        setSuccess(true);
        setFormData({
          typeOfIncident: '',
          description: '',
          incidentDate: '',
          location: '',
          supportNeeded: 'counselling',
        });
        setFiles([]);
      } else {
        setError(data.error || 'Failed to submit report');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-12 max-w-md w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Report Submitted</h2>
          <p className="text-slate-600 mb-6">Your report has been received safely and anonymously.</p>

          <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 mb-8">
            <p className="text-sm text-slate-600 mb-2">Your Access Code</p>
            <p className="text-4xl font-bold text-blue-600 font-mono">{accessCode}</p>
            <p className="text-xs text-slate-500 mt-2">Save this code to retrieve your report and evidence</p>
          </div>

          <button
            onClick={() => navigate(`/action-plan/${accessCode}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full mb-4 transition"
          >
            View Your Action Plan
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-3 px-6 rounded-lg w-full transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 text-center">Submit Incident Report</h1>
        <p className="text-slate-600 text-center mb-8">
          Your report will be completely anonymous. All information is encrypted and securely stored.
        </p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Type of Incident *
            </label>
            <input
              type="text"
              name="typeOfIncident"
              value={formData.typeOfIncident}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="e.g., Harassment, Abuse, Discrimination"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Describe what happened in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Date of Incident *
              </label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="e.g., City, Workplace"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Type of Support Needed *
            </label>
            <select
              name="supportNeeded"
              value={formData.supportNeeded}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="counselling">Counselling</option>
              <option value="legal">Legal Help</option>
              <option value="emergency">Emergency Assistance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Upload Evidence (Images, Screenshots, Documents)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-600 transition">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                accept="image/*,.pdf,.txt"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-900">Click to upload files</p>
                <p className="text-xs text-slate-500">PNG, JPG, PDF, TXT up to 50MB each</p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-slate-900">{files.length} file(s) selected:</p>
                {files.map((file, idx) => (
                  <p key={idx} className="text-sm text-slate-600">
                    • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
