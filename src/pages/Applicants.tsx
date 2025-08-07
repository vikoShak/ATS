import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Edit, Trash2, Download, Mail, Phone, Tag, DollarSign } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';
import ApplicantModal from '../components/ApplicantModal';

const Applicants: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [showTagRequirements, setShowTagRequirements] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [requirementSearchTerm, setRequirementSearchTerm] = useState('');
  
  const { 
    getApplicants, 
    updateApplicant, 
    deleteApplicant,
    getRequirements,
    loading, 
    error 
  } = useSupabase();

  // Load applicants and requirements on component mount
  React.useEffect(() => {
    loadApplicants();
    loadRequirements();
  }, []);

  const loadApplicants = async () => {
    const data = await getApplicants();
    if (data) {
      setApplicants(data);
    }
  };

  const loadRequirements = async () => {
    const data = await getRequirements();
    if (data) {
      setRequirements(data.filter((req: any) => req.status === 'Open' || req.status === 'Active'));
    }
  };

  // Show success message if navigated from add form
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  React.useEffect(() => {
    if (location.state?.message) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Screening':
        return 'bg-yellow-100 text-yellow-800';
      case 'Interview':
        return 'bg-purple-100 text-purple-800';
      case 'Hired':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Joined':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRequirements = requirements.filter(req => {
    if (!requirementSearchTerm) return true;
    const searchLower = requirementSearchTerm.toLowerCase();
    return req.title.toLowerCase().includes(searchLower) ||
           req.requirement_number?.toLowerCase().includes(searchLower) ||
           req.customer_name?.toLowerCase().includes(searchLower);
  });

  const handleAddApplicant = () => {
    navigate('/applicants/add');
  };

  const handleViewApplicant = (applicant: any) => {
    setSelectedApplicant(applicant);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditApplicant = (applicant: any) => {
    setSelectedApplicant(applicant);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleUpdateApplicant = async (id: string, updates: any) => {
    const result = await updateApplicant(id, updates);
    if (result) {
      await loadApplicants();
      setIsModalOpen(false);
    }
  };

  const handleDeleteApplicant = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this applicant?')) {
      const result = await deleteApplicant(id);
      if (result) {
        await loadApplicants();
      }
    }
  };

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    const result = await updateApplicant(applicantId, { status: newStatus });
    if (result) {
      await loadApplicants();
      setEditingStatus(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleTagRequirement = (applicantId: string, requirement: any) => {
    // Update applicant with tagged requirement
    const updatedApplicants = applicants.map(applicant => {
      if (applicant.id === applicantId) {
        const taggedRequirements = applicant.taggedRequirements || [];
        const isAlreadyTagged = taggedRequirements.find((req: any) => req.id === requirement.id);
        
        if (isAlreadyTagged) {
          return {
            ...applicant,
            taggedRequirements: taggedRequirements.filter((req: any) => req.id !== requirement.id)
          };
        } else {
          return {
            ...applicant,
            taggedRequirements: [...taggedRequirements, requirement]
          };
        }
      }
      return applicant;
    });
    
    setApplicants(updatedApplicants);
  };

  const calculateMargin = (submissionRate: number, payRate: number) => {
    return submissionRate - payRate;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicant Data</h1>
          <p className="mt-2 text-gray-600">Manage and track all job applicants</p>
        </div>
        <button 
          onClick={handleAddApplicant}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Applicant</span>
        </button>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{location.state?.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
                <option value="Joined">Joined</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto min-w-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Source & Terms
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Rates & Margin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {applicant.full_name.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{applicant.full_name}</div>
                        <div className="text-xs text-gray-500">
                          Tagged: {applicant.taggedRequirements?.length || 0} jobs
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-1" />
                        {applicant.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        {applicant.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Source: {applicant.source || 'LinkedIn'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Tax: {applicant.taxTerm || 'Corp-to-Corp'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Pay: ${applicant.payRate || 0}/hr
                      </div>
                      <div className="text-sm text-gray-600">
                        Sub: ${applicant.submissionRate || 0}/hr
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Margin: ${calculateMargin(applicant.submissionRate || 0, applicant.payRate || 0)}/hr
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {editingStatus === applicant.id ? (
                      <select
                        value={applicant.status}
                        onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                        onBlur={() => setEditingStatus(null)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        autoFocus
                      >
                        <option value="Applied">Applied</option>
                        <option value="Screening">Screening</option>
                        <option value="Interview">Interview</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Joined">Joined</option>
                        <option value="Project Completed">Project Completed</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    ) : (
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(applicant.status)}`}
                        onClick={() => setEditingStatus(applicant.id)}
                        title="Click to edit status"
                      >
                        {applicant.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewApplicant(applicant)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditApplicant(applicant)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                        title="Edit Applicant"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowTagRequirements(showTagRequirements === applicant.id ? null : applicant.id)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors duration-200"
                        title="Tag Requirements"
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteApplicant(applicant.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                        title="Delete Applicant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Tag Requirements Dropdown */}
                    {showTagRequirements === applicant.id && (
                      <div className="absolute z-10 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Tag Requirements</h3>
                        <div className="mb-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search requirements..."
                              value={requirementSearchTerm}
                              onChange={(e) => setRequirementSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {filteredRequirements.map(requirement => {
                            const isTagged = applicant.taggedRequirements?.find((req: any) => req.id === requirement.id);
                            return (
                              <div
                                key={requirement.id}
                                onClick={() => handleTagRequirement(applicant.id, requirement)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                  isTagged 
                                    ? 'bg-orange-100 border-orange-300 border' 
                                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                }`}
                              >
                                <div className="text-sm font-medium text-gray-900">{requirement.title}</div>
                                <div className="text-xs text-gray-600">
                                  {requirement.requirement_number} • {requirement.customer_name}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Modal */}
      <ApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateApplicant}
        mode={modalMode}
      />

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-900">Loading...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Applicants;
