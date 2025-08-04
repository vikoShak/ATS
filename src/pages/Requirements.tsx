import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Edit, Trash2, MapPin, Calendar, Briefcase, User, DollarSign } from 'lucide-react';
import { Requirement } from '../types';

const Requirements: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateRequirement = () => {
    // In a real app, this would call an API to update the requirement
    console.log('Updating requirement:', editFormData);
    alert(`Requirement "${editFormData.title}" has been updated.`);
    setIsEditModalOpen(false);
  };

  const mockRequirements: Requirement[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      requirement_number: 'REQ-2024-001',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      terms: 'Hybrid',
      status: 'Open',
      customer_name: 'TechCorp Inc',
      poc_name: 'John Smith',
      open_date: '2024-01-10',
      tat_date: '2024-02-10',
      number_of_submissions: 5,
      key_skills: 'React, Node.js, TypeScript, AWS',
      postedDate: '2024-01-10',
      deadline: '2024-02-10',
      description: 'We are looking for a senior software engineer to join our team...',
      submitted_by: 'Vivek Sharma',
      open_rates: 85000,
      visa_requested: 'USC'
    },
    {
      id: '2',
      title: 'Product Manager',
      requirement_number: 'REQ-2024-002',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      terms: 'Remote',
      status: 'Open',
      customer_name: 'InnovateLabs',
      poc_name: 'Sarah Johnson',
      open_date: '2024-01-12',
      tat_date: '2024-02-15',
      number_of_submissions: 3,
      key_skills: 'Product Strategy, Analytics, Agile, Leadership',
      postedDate: '2024-01-12',
      deadline: '2024-02-15',
      description: 'Seeking an experienced product manager to lead our product initiatives...',
      submitted_by: 'Meenakshi Sharma',
      open_rates: 95000,
      visa_requested: 'Green Card'
    },
    {
      id: '3',
      title: 'UX Designer',
      requirement_number: 'REQ-2024-003',
      department: 'Design',
      location: 'Remote',
      type: 'Contract',
      terms: 'Remote',
      status: 'Closed',
      customer_name: 'DesignStudio Pro',
      poc_name: 'Mike Davis',
      open_date: '2024-01-05',
      tat_date: '2024-01-25',
      number_of_submissions: 8,
      key_skills: 'Figma, Adobe Creative Suite, User Research, Prototyping',
      postedDate: '2024-01-05',
      deadline: '2024-01-25',
      description: 'Looking for a creative UX designer to enhance user experience...',
      submitted_by: 'Other',
      open_rates: 75000,
      visa_requested: 'H1B'
    },
    {
      id: '4',
      title: 'Data Analyst',
      requirement_number: 'REQ-2024-004',
      department: 'Analytics',
      location: 'Chicago, IL',
      type: 'Full-time',
      terms: 'On-Site',
      status: 'On Hold',
      customer_name: 'DataDriven Corp',
      poc_name: 'Emma Wilson',
      open_date: '2024-01-08',
      tat_date: '2024-02-08',
      number_of_submissions: 2,
      key_skills: 'Python, SQL, Tableau, Statistics, Machine Learning',
      postedDate: '2024-01-08',
      deadline: '2024-02-08',
      description: 'We need a data analyst to help us make data-driven decisions...',
      submitted_by: 'Recruiter',
      open_rates: 70000,
      visa_requested: 'OPT/CPT'
    },
    {
      id: '5',
      title: 'Marketing Specialist',
      requirement_number: 'REQ-2024-005',
      department: 'Marketing',
      location: 'Los Angeles, CA',
      type: 'Part-time',
      terms: 'Hybrid',
      status: 'Open',
      customer_name: 'BrandBoost Agency',
      poc_name: 'David Chen',
      open_date: '2024-01-14',
      tat_date: '2024-02-20',
      number_of_submissions: 4,
      key_skills: 'Digital Marketing, SEO, Content Creation, Social Media',
      postedDate: '2024-01-14',
      deadline: '2024-02-20',
      description: 'Join our marketing team to drive brand awareness and growth...',
      submitted_by: 'Vivek Sharma',
      open_rates: 55000,
      visa_requested: 'USC'
    },
  ];

  // Show success message if navigated from post job form
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
      case 'Open':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-red-100 text-red-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-blue-100 text-blue-800';
      case 'Part-time':
        return 'bg-purple-100 text-purple-800';
      case 'Contract':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTermsColor = (terms: string) => {
    switch (terms) {
      case 'Remote':
        return 'bg-green-100 text-green-800';
      case 'Hybrid':
        return 'bg-blue-100 text-blue-800';
      case 'On-Site':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequirements = mockRequirements.filter(requirement => {
    const matchesSearch = requirement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         requirement.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         requirement.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         requirement.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         requirement.requirement_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || requirement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePostNewJob = () => {
    navigate('/requirements/post');
  };

  const handleViewRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setIsViewModalOpen(true);
  };

  const handleEditRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setEditFormData(requirement);
    setIsEditModalOpen(true);
  };

  const handleDeleteRequirement = (requirement: Requirement) => {
    if (window.confirm(`Are you sure you want to delete "${requirement.title}"?`)) {
      // In a real app, this would call an API to delete the requirement
      alert(`Requirement "${requirement.title}" has been deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Requirement Data</h1>
          <p className="mt-2 text-gray-600">Manage job postings and requirements</p>
        </div>
        <button 
          onClick={handlePostNewJob}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
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
                placeholder="Search requirements..."
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
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequirements.map((requirement) => (
          <div key={requirement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{requirement.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(requirement.status)}`}>
                    {requirement.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{requirement.requirement_number}</p>
                <p className="text-sm text-gray-600">{requirement.department}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {requirement.location}
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTermsColor(requirement.terms || '')}`}>
                  {requirement.terms}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(requirement.type)}`}>
                    {requirement.type}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  ${requirement.open_rates?.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                Customer: {requirement.customer_name}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                TAT: {new Date(requirement.tat_date || '').toLocaleDateString()}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>Submissions: {requirement.number_of_submissions}</div>
                <div>Visa: {requirement.visa_requested}</div>
                <div className="col-span-2">By: {requirement.submitted_by}</div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Posted: {new Date(requirement.postedDate).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewRequirement(requirement)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                    title="View Requirement Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditRequirement(requirement)}
                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors duration-200"
                    title="Edit Requirement"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteRequirement(requirement)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                    title="Delete Requirement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Positions</p>
              <p className="text-2xl font-bold text-green-600">
                {mockRequirements.filter(r => r.status === 'Open').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Hold</p>
              <p className="text-2xl font-bold text-yellow-600">
                {mockRequirements.filter(r => r.status === 'On Hold').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-red-600">
                {mockRequirements.filter(r => r.status === 'Closed').length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-blue-600">
                {mockRequirements.reduce((sum, r) => sum + (r.number_of_submissions || 0), 0)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* View Requirement Modal */}
      {isViewModalOpen && selectedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Requirement Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-gray-900">{selectedRequirement.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequirement.status)}`}>
                    {selectedRequirement.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{selectedRequirement.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{selectedRequirement.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-gray-900">{selectedRequirement.customer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Open Rate</label>
                  <p className="text-gray-900">${selectedRequirement.open_rates?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Requirement Modal */}
      {isEditModalOpen && selectedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Requirement</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={editFormData.status || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Open">Open</option>
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={editFormData.customer_name || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Open Rates</label>
                  <input
                    type="number"
                    name="open_rates"
                    value={editFormData.open_rates || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visa Requested</label>
                  <select
                    name="visa_requested"
                    value={editFormData.visa_requested || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="USC">USC</option>
                    <option value="Green Card">Green Card</option>
                    <option value="GC-EAD">GC-EAD</option>
                    <option value="H4-EAD">H4-EAD</option>
                    <option value="H1B">H1B</option>
                    <option value="L2/L2-EAD">L2/L2-EAD</option>
                    <option value="OPT/CPT">OPT/CPT</option>
                    <option value="Other">Other</option>
                    <option value="TN-Visa">TN-Visa</option>
                    <option value="Australian Visa">Australian Visa</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRequirement}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Requirements;
