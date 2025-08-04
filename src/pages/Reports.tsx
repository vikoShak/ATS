import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, FileText, Calendar, Download, Filter, Eye, Edit, Mail, Phone, MapPin, Clock, AlertTriangle, UploadCloud } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import { Database } from '../lib/supabase';

type ApplicantRow = Database['public']['Tables']['applicants']['Row'] & {
  requirement?: string;
  customer?: string;
  recruiter?: string;
  aging_days?: number;
  submissionRate?: number;
  margin?: number;
  l1_interview_date?: string;
  l2_interview_date?: string;
  l3_interview_date?: string;
  confirmed_date?: string;
  joined_date?: string;
};

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [selectedReport, setSelectedReport] = useState('Overview');
  const [bulkUploadFiles, setBulkUploadFiles] = useState<FileList | null>(null);
  const [uploadedApplicants, setUploadedApplicants] = useState<ApplicantRow[]>([]);
  const [candidateData, setCandidateData] = useState<ApplicantRow[]>([]); // Use state for candidateData
  const { getApplicants, bulkCreateApplicants, loading, error } = useSupabase();

  useEffect(() => {
    const fetchCandidates = async () => {
      const applicants = await getApplicants();
      if (applicants) {
        if (applicants.length > 0) {
          // Map applicants to the desired structure for the table
          const mappedApplicants: ApplicantRow[] = applicants.map(app => ({
            id: app.id,
            full_name: app.full_name,
            email: app.email,
            phone: app.phone,
            location: app.location,
            visa_status: app.visa_status,
            skills: app.skills,
            status: app.status,
            source: app.source,
            taxTerm: app.taxTerm,
            payRate: app.payRate,
            submissionRate: app.submissionRate,
            // Simulate margin and aging days for mock data
            margin: app.payRate && app.submissionRate ? app.submissionRate - app.payRate : 0,
            requirement: app.applications?.[0]?.requirements?.title || 'N/A',
            customer: app.applications?.[0]?.requirements?.customer_name || 'N/A',
            l1_interview_date: '2024-01-15', // Mock
            l2_interview_date: '2024-01-18', // Mock
            l3_interview_date: '', // Mock
            confirmed_date: '', // Mock
            joined_date: '', // Mock
            submitted_date: app.applied_date || 'N/A',
            aging_days: Math.floor(Math.random() * 30) + 1, // Random aging days for demo
            recruiter: 'Vivek Sharma' // Mock
          }));
          setCandidateData(mappedApplicants);
        } else {
          setCandidateData([]);
        }
      }
    };
    fetchCandidates();
  }, []);

  const reportTypes = [
    'Overview',
    'Candidate Pipeline',
    'Interview Analytics',
    'Source Analysis',
    'Aging Alerts'
  ];

  // Interview lineup data (mock, could be derived from candidateData)
  const interviewLineup = [
    { customer: 'TechCorp Inc', requirement: 'REQ-2024-001', interviews: 3, upcoming: 2 },
    { customer: 'DataCorp', requirement: 'REQ-2024-002', interviews: 2, upcoming: 1 },
    { customer: 'DesignStudio Pro', requirement: 'REQ-2024-003', interviews: 1, upcoming: 0 },
    { customer: 'Analytics Inc', requirement: 'REQ-2024-004', interviews: 1, upcoming: 1 }
  ];

  // Source distribution data (mock, could be derived from candidateData)
  const sourceDistribution = candidateData.length > 0 ? [
    { source: 'LinkedIn', count: candidateData.filter(c => c.source === 'LinkedIn').length, percentage: Math.round((candidateData.filter(c => c.source === 'LinkedIn').length / candidateData.length) * 100) },
    { source: 'Monster', count: candidateData.filter(c => c.source === 'Monster').length, percentage: Math.round((candidateData.filter(c => c.source === 'Monster').length / candidateData.length) * 100) },
    { source: 'Dice', count: candidateData.filter(c => c.source === 'Dice').length, percentage: Math.round((candidateData.filter(c => c.source === 'Dice').length / candidateData.length) * 100) },
    { source: 'Tech Fetch', count: candidateData.filter(c => c.source === 'Tech Fetch').length, percentage: Math.round((candidateData.filter(c => c.source === 'Tech Fetch').length / candidateData.length) * 100) },
    { source: 'Bulk Upload', count: candidateData.filter(c => c.source === 'Bulk Upload').length, percentage: Math.round((candidateData.filter(c => c.source === 'Bulk Upload').length / candidateData.length) * 100) }
  ].filter(item => item.count > 0) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'L1 Interview':
        return 'bg-blue-100 text-blue-800';
      case 'L2 Interview':
        return 'bg-yellow-100 text-yellow-800';
      case 'L3 Interview':
        return 'bg-purple-100 text-purple-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Joined':
        return 'bg-emerald-100 text-emerald-800';
      case 'Applied':
        return 'bg-gray-100 text-gray-800';
      case 'Screening':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgingColor = (days: number) => {
    if (days > 7) return 'text-red-600';
    if (days > 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const agingAlerts = candidateData.filter(candidate => (candidate.aging_days || 0) > 7);

  const handleSendAlert = (candidate: ApplicantRow) => {
    const emailRecipient = 'vivekk@therecruitiq.com';
    const emailSubject = `Aging Alert: ${candidate.full_name} - ${candidate.aging_days} days`;
    const emailBody = `Dear Recruiter,\n\nThis is an automated aging alert for candidate:\n\nName: ${candidate.full_name}\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\nLocation: ${candidate.location}\nVisa Status: ${candidate.visa_status}\nSkills: ${candidate.skills}\nRequirement: ${candidate.requirement}\nCustomer: ${candidate.customer}\nRecruiter: ${candidate.recruiter}\nAging Days: ${candidate.aging_days}\n\nPlease follow up with this candidate as soon as possible.\n\nBest regards,\nRecruitIQ System`;
    
    const mailtoLink = `mailto:${emailRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink);
    alert(`Alert email prepared for ${candidate.full_name}. Your email client should open with the pre-filled message to ${emailRecipient}`);
  };

  const handleViewCandidate = (candidate: ApplicantRow) => {
    alert(`Viewing details for candidate: ${candidate.full_name}\n\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\nLocation: ${candidate.location}\nVisa Status: ${candidate.visa_status}\nSkills: ${candidate.skills}\nStatus: ${candidate.status}\nRequirement: ${candidate.requirement}\nCustomer: ${candidate.customer}\n\n(This would navigate to a detailed candidate profile page)`);
  };

  const handleEditCandidate = (candidate: ApplicantRow) => {
    alert(`Editing candidate: ${candidate.full_name}\n\n(This would open an edit form for the candidate)`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBulkUploadFiles(event.target.files);
  };

  const handleBulkResumeUpload = async () => {
    if (!bulkUploadFiles || bulkUploadFiles.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    if (loading) return;

    const filesArray = Array.from(bulkUploadFiles);
    const newApplicants = await bulkCreateApplicants(filesArray);

    if (newApplicants) {
      setUploadedApplicants(prev => [...prev, ...newApplicants.map(app => ({
        id: app.id,
        full_name: app.full_name,
        email: app.email,
        phone: app.phone,
        location: app.location, // Mock or derive if possible
        visa_status: 'N/A', // Mock
        skills: 'N/A', // Mock
        status: 'Applied', // Default for new uploads
        source: 'Bulk Upload',
        taxTerm: 'N/A',
        payRate: 0,
        submissionRate: 0,
        margin: 0,
        requirement: 'N/A',
        customer: 'N/A',
        l1_interview_date: '',
        l2_interview_date: '',
        l3_interview_date: '',
        confirmed_date: '',
        joined_date: '',
        submitted_date: new Date().toISOString().split('T')[0],
        aging_days: 0,
        recruiter: 'System'
      }))]);
      setCandidateData(prev => [...prev, ...newApplicants.map(app => ({
        id: app.id,
        full_name: app.full_name,
        email: app.email,
        phone: app.phone,
        location: app.location, // Mock or derive if possible
        visa_status: 'N/A', // Mock
        skills: 'N/A', // Mock
        status: 'Applied', // Default for new uploads
        source: 'Bulk Upload',
        taxTerm: 'N/A',
        payRate: 0,
        submissionRate: 0,
        margin: 0,
        requirement: 'N/A',
        customer: 'N/A',
        l1_interview_date: '',
        l2_interview_date: '',
        l3_interview_date: '',
        confirmed_date: '',
        joined_date: '',
        submitted_date: new Date().toISOString().split('T')[0],
        aging_days: 0,
        recruiter: 'System'
      }))]);
      alert(`${newApplicants.length} resumes uploaded successfully!`);
      setBulkUploadFiles(null); // Clear selected files
    } else if (error) {
      alert(`Error uploading resumes: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reporting Data</h1>
          <p className="mt-2 text-gray-600">Analytics and insights for recruitment performance</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Resume Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <UploadCloud className="w-6 h-6 mr-2 text-blue-600" /> Bulk Resume Upload
        </h2>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <label htmlFor="resume-upload" className="flex-1 block text-sm font-medium text-gray-700 sr-only">
            Upload Resumes
          </label>
          <input
            id="resume-upload"
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="flex-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleBulkResumeUpload}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !bulkUploadFiles || bulkUploadFiles.length === 0}
          >
            {loading ? 'Uploading...' : 'Upload Resumes'}
          </button>
        </div>
        {bulkUploadFiles && bulkUploadFiles.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Selected {bulkUploadFiles.length} file(s): {Array.from(bulkUploadFiles).map(file => file.name).join(', ')}
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
      </div>

      {/* Bulk Uploaded Candidates Table */}
      {uploadedApplicants.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recently Bulk Uploaded Candidates</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploadedApplicants.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{candidate.full_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{candidate.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{candidate.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewCandidate(candidate)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                        title="View Candidate Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aging Alerts */}
      {agingAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-900">Aging Alerts ({agingAlerts.length})</h2>
          </div>
          <div className="space-y-2">
            {agingAlerts.map(candidate => (
              <div key={candidate.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{candidate.full_name}</span>
                  <span className="text-sm text-gray-600 ml-2">({candidate.requirement})</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Recruiter: {candidate.recruiter}</span>
                  <span className="text-sm font-medium text-red-600">{candidate.aging_days} days</span>
                  <button
                    onClick={() => handleSendAlert(candidate)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    title="Send Aging Alert Email"
                  >
                    Send Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interviews Lined Up */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Interviews Lined Up</h2>
          <div className="space-y-4">
            {interviewLineup.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{item.customer}</div>
                  <div className="text-sm text-gray-600">{item.requirement}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">{item.interviews}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">{item.upcoming}</div>
                  <div className="text-xs text-gray-500">Upcoming</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Source Distribution</h2>
          {sourceDistribution.length > 0 ? (
            <div className="space-y-4">
              {sourceDistribution.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                    <span className="text-sm text-gray-600">{source.count} ({source.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No source data available</p>
              <p className="text-sm text-gray-400 mt-2">Add candidates to see source distribution</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Candidate Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">All Submitted Candidates</h2>
        {candidateData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interview Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rates & Terms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requirement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aging
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidateData.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {candidate.full_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate.full_name}</div>
                          <div className="text-sm text-gray-500">{candidate.visa_status}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {candidate.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {candidate.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {candidate.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                        <div className="text-xs text-gray-500">
                          {candidate.l1_interview_date && <div>L1: {new Date(candidate.l1_interview_date).toLocaleDateString()}</div>}
                          {candidate.l2_interview_date && <div>L2: {new Date(candidate.l2_interview_date).toLocaleDateString()}</div>}
                          {candidate.l3_interview_date && <div>L3: {new Date(candidate.l3_interview_date).toLocaleDateString()}</div>}
                          {candidate.confirmed_date && <div>Confirmed: {new Date(candidate.confirmed_date).toLocaleDateString()}</div>}
                          {candidate.joined_date && <div>Joined: {new Date(candidate.joined_date).toLocaleDateString()}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">Pay: ${candidate.payRate}/hr</div>
                        <div className="text-sm text-gray-600">Sub: ${candidate.submissionRate}/hr</div>
                        <div className="text-sm font-medium text-green-600">Margin: ${candidate.margin}/hr</div>
                        <div className="text-xs text-gray-500">{candidate.taxTerm}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">{candidate.requirement}</div>
                        <div className="text-sm text-gray-600">{candidate.customer}</div>
                        <div className="text-xs text-gray-500">Source: {candidate.source}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        <span className={`text-sm font-medium ${getAgingColor(candidate.aging_days || 0)}`}>
                          {candidate.aging_days} days
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Recruiter: {candidate.recruiter}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCandidate(candidate)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                          title="View Candidate Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCandidate(candidate)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                          title="Edit Candidate"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {(candidate.aging_days || 0) > 7 && (
                          <button
                            onClick={() => handleSendAlert(candidate)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                            title="Send Aging Alert Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Candidates Yet</h3>
            <p className="text-gray-500 mb-4">Start by adding candidates to your ATS system</p>
            <button
              onClick={() => window.location.href = '/applicants/add'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add First Candidate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
