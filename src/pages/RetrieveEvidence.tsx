import { useState } from 'react';
import { Download, File } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface Evidence {
  id: string;
  fileName: string;
  filePath: string;
  downloadUrl: string;
}

interface Report {
  id: string;
  typeOfIncident: string;
  description: string;
  incidentDate: string;
  location: string;
  supportNeeded: string;
  createdAt: string;
}

export default function RetrieveEvidence() {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [files, setFiles] = useState<Evidence[]>([]);
  const [retrieved, setRetrieved] = useState(false);

  const handleRetrieve = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReport(null);
    setFiles([]);

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/get_report?accessCode=${encodeURIComponent(accessCode)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Report not found');
      }

      const data = await response.json();

      if (data.success) {
        setReport(data.report);
        setFiles(data.files);
        setRetrieved(true);
      } else {
        setError(data.error || 'Failed to retrieve report');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Retrieve Your Evidence</h1>
          <p className="text-slate-600">
            Enter your access code to view and download your submitted evidence
          </p>
        </div>

        {!retrieved ? (
          <form onSubmit={handleRetrieve} className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Enter Your 6-Digit Access Code *
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
                maxLength={6}
                placeholder="E.g., 123456"
                className="w-full px-4 py-3 text-center text-xl font-mono border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent uppercase"
              />
              <p className="text-xs text-slate-500 mt-2">
                You received this code when you submitted your report
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || accessCode.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {loading ? 'Retrieving...' : 'Retrieve Report'}
            </button>
          </form>
        ) : report ? (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Report Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Type of Incident</p>
                  <p className="text-slate-900 font-semibold mt-1">{report.typeOfIncident}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Support Needed</p>
                  <p className="text-slate-900 font-semibold mt-1 capitalize">{report.supportNeeded}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Date of Incident</p>
                  <p className="text-slate-900 font-semibold mt-1">{report.incidentDate}</p>
                </div>
                {report.location && (
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">Location</p>
                    <p className="text-slate-900 font-semibold mt-1">{report.location}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-slate-500 font-semibold mb-2">Description</p>
                <p className="text-slate-700 leading-relaxed">{report.description}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500">
                Submitted: {new Date(report.createdAt).toLocaleString()}
              </div>
            </div>

            {files.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Evidence Files ({files.length})</h2>
                <div className="space-y-3">
                  {files.map((file) => (
                    <a
                      key={file.id}
                      href={file.downloadUrl}
                      download={file.fileName}
                      className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-4 transition"
                    >
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-slate-900 font-semibold">{file.fileName}</span>
                      </div>
                      <Download className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {files.length === 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
                <p className="text-blue-700">
                  No evidence files have been uploaded for this report yet.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setRetrieved(false);
                setAccessCode('');
                setReport(null);
                setFiles([]);
              }}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Search Another Report
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
