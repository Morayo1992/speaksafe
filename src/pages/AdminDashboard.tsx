import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface ReportData {
  id: string;
  typeOfIncident: string;
  description: string;
  incidentDate: string;
  location: string;
  supportNeeded: string;
  accessCode: string;
  status: string;
  createdAt: string;
  fileCount: number;
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const url = new URL(`${SUPABASE_URL}/functions/v1/admin_reports`);
      if (statusFilter !== 'all') {
        url.searchParams.append('status', statusFilter);
      }
      if (dateFilter) {
        url.searchParams.append('startDate', dateFilter);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin_reports`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setReports(reports.map(r =>
          r.id === reportId ? { ...r, status: newStatus } : r
        ));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredReports = reports.filter(report => {
    if (statusFilter !== 'all' && report.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const stats = {
    total: reports.length,
    new: reports.filter(r => r.status === 'new').length,
    reviewed: reports.filter(r => r.status === 'reviewed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600 mb-8">Manage and review all incident reports</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold">Total Reports</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-slate-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold">New Reports</p>
                <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <Clock className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold">Reviewed</p>
                <p className="text-3xl font-bold text-green-600">{stats.reviewed}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  fetchReports();
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="all">All Reports</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
              <p className="text-blue-700">No reports found matching your filters.</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{report.typeOfIncident}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          report.status === 'new'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {report.status === 'new' ? 'New' : 'Reviewed'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      Access Code: <span className="font-mono font-bold">{report.accessCode}</span>
                    </p>
                    <p className="text-sm text-slate-500">
                      Submitted: {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report.id, e.target.value)}
                    className="px-3 py-1 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="new">Mark as New</option>
                    <option value="reviewed">Mark as Reviewed</option>
                  </select>
                </div>

                <button
                  onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
                >
                  {expandedReport === report.id ? 'Hide Details' : 'View Details'}
                </button>

                {expandedReport === report.id && (
                  <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 font-semibold mb-1">Description</p>
                      <p className="text-slate-700">{report.description}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-500 font-semibold">Incident Date</p>
                        <p className="text-slate-900 font-semibold">{report.incidentDate}</p>
                      </div>
                      {report.location && (
                        <div>
                          <p className="text-sm text-slate-500 font-semibold">Location</p>
                          <p className="text-slate-900 font-semibold">{report.location}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-slate-500 font-semibold">Support Needed</p>
                        <p className="text-slate-900 font-semibold capitalize">{report.supportNeeded}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-semibold">Files</p>
                        <p className="text-slate-900 font-semibold">{report.fileCount}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
