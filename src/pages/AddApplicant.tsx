import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, FileText, Calendar, Code, MessageSquare, Save, X, DollarSign, Plus, Search, UploadCloud, File, XCircle } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';

const AddApplicant: React.FC = () => {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<any[]>([]);
  const [requirementSearchTerm, setRequirementSearchTerm] = useState('');
  const [selectedRequirements, setSelectedRequirements] = useState<any[]>([]);
  const [showTagRequirements, setShowTagRequirements] = useState(false);
  
  // New states for file uploads
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [supportingDocumentFiles, setSupportingDocumentFiles] = useState<File[]>([]);

  const { getRequirements, createApplicant, loading: supabaseLoading } = useSupabase();
  
  const [formData, setFormData] = useState({
    fullName: '',
    cnNumber: '',
    email: '',
    phone: '',
    location: '',
    visaStatus: '',
    visaValidity: '',
    submissionDate: new Date().toISOString().split('T')[0],
    skills: '',
    requirementName: '', // This will now primarily be used to quickly add a requirement to selectedRequirements
    comments: '',
    source: '',
    taxTerm: '',
    payRate: '',
    submissionRate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const visaStatusOptions = [
    'USC',
    'Green Card',
    'H1B Holder',
    'H4 EAD',
    'GE-EAD',
    'L2S/L2-EAD',
    'OPT/CPT',
    'Australian Visa',
    'TN Visa',
    'Other Visas'
  ];

  const sourceOptions = [
    'LinkedIn',
    'Monster',
    'Dice',
    'Tech Fetch',
    'Social Media',
    'Others'
  ];

  const taxTermOptions = [
    'Corp-to-Corp',
    'W-2',
    '1099',
    'FTE (Full Time)'
  ];

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      const data = await getRequirements();
      if (data) {
        // Filter for open requirements only
        const openRequirements = data.filter((req: any) => req.status === 'Open' || req.status === 'Active');
        setRequirements(openRequirements);
      }
    } catch (error) {
      console.error('Error loading requirements:', error);
    }
  };

  const handleTagRequirement = (requirement: any) => {
    const isAlreadySelected = selectedRequirements.find(r => r.id === requirement.id);
    if (isAlreadySelected) {
      setSelectedRequirements(prev => prev.filter(r => r.id !== requirement.id));
    } else {
      setSelectedRequirements(prev => [...prev, requirement]);
    }
  };

  const handleRemoveRequirement = (requirementId: string) => {
    setSelectedRequirements(prev => prev.filter(r => r.id !== requirementId));
  };

  const filteredRequirements = requirements.filter(req => {
    if (!requirementSearchTerm) return true;
    const searchLower = requirementSearchTerm.toLowerCase();
    return req.title?.toLowerCase().includes(searchLower) ||
           req.requirement_number?.toLowerCase().includes(searchLower) ||
           req.customer_name?.toLowerCase().includes(searchLower);
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.visaStatus) newErrors.visaStatus = 'Visa status is required';
    
    // Ensure at least one requirement is tagged
    if (selectedRequirements.length === 0) {
      newErrors.requirementName = 'At least one requirement must be tagged.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
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

    // Special handling for requirementName to sync with selectedRequirements
    if (name === 'requirementName' && value) {
      const selectedReq = requirements.find(req => req.title === value);
      if (selectedReq && !selectedRequirements.find(r => r.id === selectedReq.id)) {
        setSelectedRequirements(prev => [...prev, selectedReq]);
      }
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setErrors(prev => ({ ...prev, resumeFile: '' })); // Clear error if any
    } else {
      setResumeFile(null);
    }
  };

  const handleSupportingDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSupportingDocumentFiles(Array.from(e.target.files));
    } else {
      setSupportingDocumentFiles([]);
    }
  };

  const removeSupportingDocument = (indexToRemove: number) => {
    setSupportingDocumentFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const applicantData = {
        full_name: formData.fullName,
        cn_number: formData.cnNumber,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        visa_status: formData.visaStatus,
        visa_validity: formData.visaValidity || null,
        skills: formData.skills,
        comments: formData.comments,
        status: 'Applied', // Default status for new applicant
        applied_date: formData.submissionDate,
        source: formData.source,
        taxTerm: formData.taxTerm,
        payRate: parseFloat(formData.payRate) || 0,
        submissionRate: parseFloat(formData.submissionRate) || 0,
      };

      // Pass files and selected requirements to createApplicant
      const result = await createApplicant(applicantData, resumeFile, supportingDocumentFiles, selectedRequirements);
      
      if (result) {
        // Navigate back with success message
        navigate('/applicants', { state: { message: 'Applicant added successfully!' } });
      }
    } catch (error) {
      console.error('Error saving applicant:', error);
    }
  };

  const handleCancel = () => {
    navigate('/applicants');
  };

  const calculateMargin = () => {
    const submission = parseFloat(formData.submissionRate) || 0;
    const pay = parseFloat(formData.payRate) || 0;
    return (submission - pay).toFixed(2);
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
            Back to Applicants
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Add New Applicant</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CN Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="cnNumber"
                    value={formData.cnNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter CN number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter location"
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Visa Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Visa Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visa Status *
                  </label>
                  <select
                    name="visaStatus"
                    value={formData.visaStatus}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.visaStatus ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select visa status</option>
                    {visaStatusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.visaStatus && <p className="text-red-500 text-sm mt-1">{errors.visaStatus}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visa Validity
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="visaValidity"
                      value={formData.visaValidity}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Source and Tax Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Source & Tax Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source
                  </label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select source</option>
                    {sourceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Term
                  </label>
                  <select
                    name="taxTerm"
                    value={formData.taxTerm}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select tax term</option>
                    {taxTermOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Rate Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                Rate Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pay Rate ($/hr)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="payRate"
                      value={formData.payRate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Rate ($/hr)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="submissionRate"
                      value={formData.submissionRate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margin ($/hr)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={calculateMargin()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="0.00"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Auto-calculated: Submission Rate - Pay Rate</p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <UploadCloud className="w-5 h-5 mr-2 text-orange-600" />
                Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume (PDF, DOCX)
                  </label>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="resume-upload" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors text-gray-700">
                      <UploadCloud className="w-4 h-4 mr-2" />
                      {resumeFile ? 'Change File' : 'Upload Resume'}
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        className="hidden"
                      />
                    </label>
                    {resumeFile && (
                      <span className="text-sm text-gray-600 flex items-center">
                        <File className="w-4 h-4 mr-1 text-gray-500" />
                        {resumeFile.name}
                        <button
                          type="button"
                          onClick={() => setResumeFile(null)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Remove resume"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </span>
                    )}
                  </div>
                  {errors.resumeFile && <p className="text-red-500 text-sm mt-1">{errors.resumeFile}</p>}
                </div>

                {/* Supporting Documents Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents (Multiple files)
                  </label>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="supporting-docs-upload" className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors text-gray-700">
                      <UploadCloud className="w-4 h-4 mr-2" />
                      Upload Documents
                      <input
                        id="supporting-docs-upload"
                        type="file"
                        multiple
                        onChange={handleSupportingDocumentsChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {supportingDocumentFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {supportingDocumentFiles.map((file, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <File className="w-4 h-4 mr-1 text-gray-500" />
                          {file.name}
                          <button
                            type="button"
                            onClick={() => removeSupportingDocument(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                            title="Remove document"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tagged Requirements Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-orange-600" />
                Tag Requirements
              </h2>
              
              {/* Selected Requirements Display */}
              {selectedRequirements.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagged Requirements ({selectedRequirements.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequirements.map(req => (
                      <div key={req.id} className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                        <span>{req.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(req.id)}
                          className="ml-2 text-orange-600 hover:text-orange-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Requirements Button */}
              <button
                type="button"
                onClick={() => setShowTagRequirements(!showTagRequirements)}
                className="flex items-center space-x-2 px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tag Requirements</span>
              </button>

              {/* Requirements Selection Modal */}
              {showTagRequirements && (
                <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
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
                      const isTagged = selectedRequirements.find(r => r.id === requirement.id);
                      return (
                        <div
                          key={requirement.id}
                          onClick={() => handleTagRequirement(requirement)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            isTagged 
                              ? 'bg-orange-100 border-orange-300 border' 
                              : 'bg-white hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-900">{requirement.title}</div>
                          <div className="text-xs text-gray-600">
                            {requirement.requirement_number} • {requirement.customer_name}
                          </div>
                        </div>
                      );
                    })}
                    {filteredRequirements.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No requirements found
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowTagRequirements(false)}
                      className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Application Details Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-orange-600" />
                Application Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="submissionDate"
                      value={formData.submissionDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Requirement *
                  </label>
                  <select
                    name="requirementName"
                    value={formData.requirementName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.requirementName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select primary requirement</option>
                    {requirements.map(req => (
                      <option key={req.id} value={req.title}>
                        {req.title} - {req.customer_name || req.departments?.name || 'General'}
                      </option>
                    ))}
                  </select>
                  {errors.requirementName && <p className="text-red-500 text-sm mt-1">{errors.requirementName}</p>}
                  {requirements.length === 0 && (
                    <p className="text-gray-500 text-sm mt-1">No open requirements available</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter relevant skills and technologies"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Additional comments or notes"
                    />
                  </div>
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
                disabled={supabaseLoading}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center disabled:opacity-50"
              >
                {supabaseLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Applicant
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

export default AddApplicant;
