import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, FileText, Calendar, Code, MessageSquare, DollarSign } from 'lucide-react';

interface ApplicantModalProps {
  applicant: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (id: string, updates: any) => void;
  mode: 'view' | 'edit';
}

const ApplicantModal: React.FC<ApplicantModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onUpdate,
  mode
}) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    visa_status: '',
    visa_validity: '',
    skills: '',
    comments: '',
    status: 'Applied'
  });

  const visaStatusOptions = [
    'USC', 'Green Card', 'H1B Holder', 'H4 EAD', 'GE-EAD',
    'L2S/L2-EAD', 'OPT/CPT', 'Australian Visa', 'TN Visa', 'Other Visas'
  ];

  const statusOptions = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'];

  useEffect(() => {
    if (applicant) {
      setFormData({
        full_name: applicant.full_name || '',
        email: applicant.email || '',
        phone: applicant.phone || '',
        location: applicant.location || '',
        visa_status: applicant.visa_status || '',
        visa_validity: applicant.visa_validity || '',
        skills: applicant.skills || '',
        comments: applicant.comments || '',
        status: applicant.status || 'Applied'
      });
    }
  }, [applicant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(applicant.id, formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: applicant.full_name || '',
      email: applicant.email || '',
      phone: applicant.phone || '',
      location: applicant.location || '',
      visa_status: applicant.visa_status || '',
      visa_validity: applicant.visa_validity || '',
      skills: applicant.skills || '',
      comments: applicant.comments || '',
      status: applicant.status || 'Applied'
    });
    setIsEditing(false);
  };

  if (!isOpen || !applicant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Applicant' : 'Applicant Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resume Section */}
          {applicant.resume_url && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Resume
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Resume Document</p>
                      <p className="text-xs text-gray-500">Click to view or download</p>
                    </div>
                  </div>
                  <a
                    href={applicant.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Supporting Documents Section */}
          {applicant.supporting_documents_urls && applicant.supporting_documents_urls.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Supporting Documents
              </h3>
              <div className="space-y-2">
                {applicant.supporting_documents_urls.map((url, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-6 h-6 text-green-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Document {index + 1}</p>
                          <p className="text-xs text-gray-500">Supporting document</p>
                        </div>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-orange-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-900">{applicant.full_name}</p>
                )}
              </div>
              {applicant.cn_number && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CN Number</label>
                  <p className="text-gray-900">{applicant.cn_number}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-900">{applicant.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-900">{applicant.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-900">{applicant.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Source and Financial Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
              Source & Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicant.source && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <p className="text-gray-900">{applicant.source}</p>
                </div>
              )}
              {applicant.taxTerm && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Term</label>
                  <p className="text-gray-900">{applicant.taxTerm}</p>
                </div>
              )}
              {applicant.payRate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pay Rate</label>
                  <p className="text-gray-900">${applicant.payRate}/hr</p>
                </div>
              )}
              {applicant.submissionRate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submission Rate</label>
                  <p className="text-gray-900">${applicant.submissionRate}/hr</p>
                </div>
              )}
            </div>
          </div>

          {/* Visa Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-orange-600" />
              Visa Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visa Status</label>
                {isEditing ? (
                  <select
                    name="visa_status"
                    value={formData.visa_status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {visaStatusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{applicant.visa_status}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visa Validity</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="visa_validity"
                    value={formData.visa_validity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {applicant.visa_validity ? new Date(applicant.visa_validity).toLocaleDateString() : 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2 text-orange-600" />
              Application Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    applicant.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                    applicant.status === 'Screening' ? 'bg-yellow-100 text-yellow-800' :
                    applicant.status === 'Interview' ? 'bg-purple-100 text-purple-800' :
                    applicant.status === 'Hired' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {applicant.status}
                  </span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                {isEditing ? (
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-900">{applicant.skills}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                {isEditing ? (
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-900">{applicant.comments || 'No comments'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantModal;
