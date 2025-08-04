import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, MapPin, Building, User, Calendar, Target, Users, Code, Save, X, Plus, Trash2, Search, DollarSign } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [showTagCandidates, setShowTagCandidates] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([]);
  const [candidateSearchTerm, setCandidateSearchTerm] = useState('');
  
  const { getApplicants, createRequirement } = useSupabase();

  const [formData, setFormData] = useState({
    submittedBy: '',
    requirementName: '',
    requirementLocation: '',
    requirementTerms: '',
    customerName: '',
    pocName: '',
    openDate: new Date().toISOString().split('T')[0],
    tatDate: '',
    numberOfSubmissions: '',
    keySkills: '',
    status: 'Active',
    openRates: '',
    visaRequested: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const requirementTermsOptions = [
    'Hybrid',
    'Remote',
    'On-Site'
  ];

  const statusOptions = [
    'Active',
    'On-Hold',
    'Closed'
  ];

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    const data = await getApplicants();
    if (data) {
      setApplicants(data);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.submittedBy.trim()) newErrors.submittedBy = 'Submitted by is required';
    if (!formData.requirementName.trim()) newErrors.requirementName = 'Requirement name is required';
    if (!formData.requirementLocation.trim()) newErrors.requirementLocation = 'Location is required';
    if (!formData.requirementTerms) newErrors.requirementTerms = 'Requirement terms are required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.pocName.trim()) newErrors.pocName = 'POC name is required';
    if (!formData.tatDate) newErrors.tatDate = 'TAT date is required';
    if (!formData.numberOfSubmissions.trim()) newErrors.numberOfSubmissions = 'Number of submissions is required';
    if (!formData.openRates.trim()) newErrors.openRates = 'Open rates is required';
    if (!formData.visaRequested.trim()) newErrors.visaRequested = 'Visa requested is required';

    // Validate number of submissions is a positive number
    if (formData.numberOfSubmissions && isNaN(Number(formData.numberOfSubmissions))) {
      newErrors.numberOfSubmissions = 'Must be a valid number';
    }

    // Validate TAT date is after open date
    if (formData.tatDate && formData.openDate && new Date(formData.tatDate) <= new Date(formData.openDate)) {
      newErrors.tatDate = 'TAT date must be after open date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagCandidate = (candidate: any) => {
    const isAlreadySelected = selectedCandidates.find(c => c.id === candidate.id);
    if (isAlreadySelected) {
      setSelectedCandidates(prev => prev.filter(c => c.id !== candidate.id));
    } else {
      setSelectedCandidates(prev => [...prev, candidate]);
    }
  };

  const handleRemoveCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => prev.filter(c => c.id !== candidateId));
  };

  const filteredCandidates = applicants.filter(candidate => {
    if (!candidateSearchTerm) return true;
    const searchLower = candidateSearchTerm.toLowerCase();
    return candidate.full_name.toLowerCase().includes(searchLower) ||
           candidate.email.toLowerCase().includes(searchLower) ||
           candidate.phone.toLowerCase().includes(searchLower);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const requirementData = {
        title: formData.requirementName,
        requirement_number: formData.submittedBy,
        location: formData.requirementLocation,
        type: 'Full-time', // Default type
        terms: formData.requirementTerms,
        customer_name: formData.customerName,
        poc_name: formData.pocName,
        open_date: formData.openDate,
        tat_date: formData.tatDate,
        number_of_submissions: parseInt(formData.numberOfSubmissions),
        key_skills: formData.keySkills,
        status: formData.status,
        tagged_candidates: selectedCandidates.map(c => c.id),
        description: `Customer: ${formData.customerName}\nPOC: ${formData.pocName}\nKey Skills: ${formData.keySkills}`
      };

      const result = await createRequirement(requirementData);
      
      if (result) {
        // Navigate back with success message
        navigate('/requirements', { state: { message: 'Job requirement posted successfully!' } });
      }
    } catch (error) {
      console.error('Error saving requirement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/requirements');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Requirements
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Post New Job</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submitted By *
                  </label>
                  <select
                    name="submittedBy"
                    value={formData.submittedBy}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.submittedBy ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select submitter</option>
                    <option value="Vivek Sharma">Vivek Sharma</option>
                    <option value="Meenakshi Sharma">Meenakshi Sharma</option>
                    <option value="Other">Other</option>
                    <option value="Recruiter">Recruiter</option>
                  </select>
                  {errors.submittedBy && <p className="text-red-500 text-sm mt-1">{errors.submittedBy}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Rates *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="openRates"
                      value={formData.openRates}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.openRates ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter rate amount"
                      min="0"
                      step="1000"
                    />
                  </div>
                  {errors.openRates && <p className="text-red-500 text-sm mt-1">{errors.openRates}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visa Requested *
                  </label>
                  <select
                    name="visaRequested"
                    value={formData.visaRequested}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.visaRequested ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select visa type</option>
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
                  {errors.visaRequested && <p className="text-red-500 text-sm mt-1">{errors.visaRequested}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirement Name *
                  </label>
                  <input
                    type="text"
                    name="requirementName"
                    value={formData.requirementName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.requirementName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter job title"
                  />
                  {errors.requirementName && <p className="text-red-500 text-sm mt-1">{errors.requirementName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirement Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="requirementLocation"
                      value={formData.requirementLocation}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.requirementLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter job location"
                    />
                  </div>
                  {errors.requirementLocation && <p className="text-red-500 text-sm mt-1">{errors.requirementLocation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirement Terms *
                  </label>
                  <select
                    name="requirementTerms"
                    value={formData.requirementTerms}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.requirementTerms ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select work arrangement</option>
                    {requirementTermsOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.requirementTerms && <p className="text-red-500 text-sm mt-1">{errors.requirementTerms}</p>}
                </div>
              </div>
            </div>

            {/* Client Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-orange-600" />
                Client Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.customerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter customer/client name"
                    />
                  </div>
                  {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    POC Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="pocName"
                      value={formData.pocName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.pocName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter point of contact name"
                    />
                  </div>
                  {errors.pocName && <p className="text-red-500 text-sm mt-1">{errors.pocName}</p>}
                </div>
              </div>
            </div>

            {/* Timeline & Submissions Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                Timeline & Submissions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="openDate"
                      value={formData.openDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TAT Date *
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="tatDate"
                      value={formData.tatDate}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.tatDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.tatDate && <p className="text-red-500 text-sm mt-1">{errors.tatDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Submissions *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="numberOfSubmissions"
                      value={formData.numberOfSubmissions}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.numberOfSubmissions ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter number"
                      min="1"
                    />
                  </div>
                  {errors.numberOfSubmissions && <p className="text-red-500 text-sm mt-1">{errors.numberOfSubmissions}</p>}
                </div>
              </div>
            </div>

            {/* Skills & Status Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-orange-600" />
                Skills & Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Skills
                  </label>
                  <textarea
                    name="keySkills"
                    value={formData.keySkills}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter required skills and technologies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Job
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
