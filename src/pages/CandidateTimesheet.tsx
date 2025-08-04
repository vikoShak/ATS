import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Calendar, Clock, Save, DollarSign } from 'lucide-react';

const CandidateTimesheet: React.FC = () => {
  const { candidateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const candidate = location.state?.candidate;

  const [timesheetData, setTimesheetData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  // Generate months for the current year
  const generateMonths = () => {
    const months = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, i, 1);
      const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
      months.push({
        key: monthKey,
        name: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        shortName: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return months;
  };

  const months = generateMonths();

  useEffect(() => {
    if (candidate) {
      // Load existing timesheet data
      const existingData: Record<string, number> = {};
      Object.entries(candidate.monthly_timesheets || {}).forEach(([month, data]: [string, any]) => {
        existingData[month] = data.hours || 0;
      });
      setTimesheetData(existingData);
    }
  }, [candidate]);

  const handleHoursChange = (monthKey: string, hours: string) => {
    const numericHours = parseFloat(hours) || 0;
    setTimesheetData(prev => ({
      ...prev,
      [monthKey]: numericHours
    }));
  };

  const calculateMonthlyPayable = (hours: number) => {
    return hours * (candidate?.pay_rate || 0);
  };

  const calculateTotalHours = () => {
    return Object.values(timesheetData).reduce((sum, hours) => sum + hours, 0);
  };

  const calculateTotalPayable = () => {
    return calculateTotalHours() * (candidate?.pay_rate || 0);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call to save timesheet data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      const alertDiv = document.createElement('div');
      alertDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      alertDiv.innerHTML = '✓ Timesheet data saved successfully';
      document.body.appendChild(alertDiv);
      
      setTimeout(() => {
        document.body.removeChild(alertDiv);
      }, 3000);
    } catch (error) {
      console.error('Error saving timesheet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h2>
          <button
            onClick={() => navigate('/timesheets')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Back to Timesheets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/timesheets')}
            className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Timesheets
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Candidate Timesheet</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Candidate Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-600" />
                Candidate Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {candidate.full_name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{candidate.full_name}</h3>
                    <p className="text-sm text-gray-600">{candidate.requirement}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {candidate.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {candidate.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {candidate.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    {candidate.customer}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Rate Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pay Rate:</span>
                      <span className="text-sm font-medium text-green-600">${candidate.pay_rate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Joined Date:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(candidate.joined_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vendor Details */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Vendor Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 text-gray-900">{candidate.vendor?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{candidate.vendor?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{candidate.vendor?.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 text-gray-900">{candidate.vendor?.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Signing Authority:</span>
                      <span className="ml-2 text-gray-900">{candidate.vendor?.signing_authority}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Timesheet */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Monthly Timesheet - {new Date().getFullYear()}
                </h2>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Timesheet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Monthly Hours Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {months.map((month) => (
                  <div key={month.key} className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {month.name}
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        min="0"
                        max="744"
                        step="0.5"
                        value={timesheetData[month.key] || ''}
                        onChange={(e) => handleHoursChange(month.key, e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Payable: ${calculateMonthlyPayable(timesheetData[month.key] || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Hours</p>
                        <p className="text-2xl font-bold text-blue-700">{calculateTotalHours()}</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Hourly Rate</p>
                        <p className="text-2xl font-bold text-green-700">${candidate.pay_rate}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Total Payable</p>
                        <p className="text-2xl font-bold text-purple-700">${calculateTotalPayable().toLocaleString()}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateTimesheet;
