import { Link } from 'react-router-dom';
import { Shield, FileText, Briefcase, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">SafeSpeak</h1>
          <p className="text-xl text-slate-600 mb-8">
            Anonymous Survivor Reporting & Support Platform
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            A safe, confidential space to report incidents and access support resources. Your privacy and safety are our priority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
            <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Anonymous Reports</h3>
            <p className="text-slate-600">Submit detailed incident reports with complete anonymity</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
            <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Evidence Management</h3>
            <p className="text-slate-600">Securely upload and retrieve evidence files</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Support Resources</h3>
            <p className="text-slate-600">Access hotlines and support services</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Action Plans</h3>
            <p className="text-slate-600">Get guidance on next steps after reporting</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Submit Your Report</h3>
              <p className="text-slate-600">
                Share incident details anonymously. You'll receive a unique access code to retrieve your report.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Get Your Action Plan</h3>
              <p className="text-slate-600">
                Receive personalized guidance on safety steps, evidence preservation, and support options.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Access Support</h3>
              <p className="text-slate-600">
                Connect with resources, retrieve evidence, and explore your options with complete privacy.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-center text-lg transition transform hover:scale-105"
          >
            Submit an Incident Report
          </Link>
          <Link
            to="/retrieve"
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-lg text-center text-lg transition transform hover:scale-105"
          >
            Retrieve Your Report
          </Link>
        </div>
      </div>
    </div>
  );
}
