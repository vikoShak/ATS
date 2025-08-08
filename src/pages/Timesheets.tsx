import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Edit, CheckCircle, XCircle, Clock, Calendar, User, Building, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';

const Timesheets: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Not Started':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const calculatePayable = (hours: number, rate: number) => {
    return hours * rate;
  };

  const calculateProjectEndDate = (startDate: string, durationMonths: number) => {
    const start = new Date(startDate);
    start.setMonth(start.getMonth() + durationMonths);
    return start.toISOString().split('T')[0];
  };
  
  const filteredCandidates = joinedCandidates.filter(candidate => {
    const matchesSearch = candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.requirement.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCandidateClick = (candidate: any) => {
    // Navigate to detailed timesheet page for the candidate
    navigate(`/timesheets/candidate/${candidate.id}`, { state: { candidate } });
  };

  const handleUpdateTimesheetStatus = (candidateId: string, month: string, newStatus: 'Approved' | 'Rejected') => {
    setJoinedCandidates(prevCandidates =>
      prevCandidates.map(candidate => {
        if (candidate.id === candidateId) {
          return {
            ...candidate,
            monthly_timesheets: {
              ...candidate.monthly_timesheets,
              [month]: {
                ...candidate.monthly_timesheets[month],
                status: newStatus,
              },
            },
          };
        }
        return candidate;
      })
    );
    // In a real application, you would call a backend service here, e.g.:
    // updateTimesheetStatus(timesheetId, newStatus);
    console.log(`Timesheet for candidate ${candidateId} for ${month} set to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
          <p className="mt-2 text-gray-600">Track and manage joined candidate work hours and payments</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Add Manual Entry</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-blue-600">{joinedCandidates.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours (This Month)</p>
              <p className="text-3xl font-bold text-green-600">
                {joinedCandidates.reduce((total, candidate) => {
                  const currentMonth = '2024-02'; // Example: current month
                  return total + (candidate.monthly_timesheets[currentMonth]?.hours || 0);
                }, 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-600">
                {joinedCandidates.reduce((total, candidate) => {
                  return total + Object.values(candidate.monthly_timesheets).filter(ts => ts.status === 'Pending').length;
                }, 0)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payable (This Month)</p>
              <p className="text-3xl font-bold text-purple-600">
                ${joinedCandidates.reduce((total, candidate) => {
                  const currentMonth = '2024-02'; // Example: current month
                  const hours = candidate.monthly_timesheets[currentMonth]?.hours || 0;
                  return total + calculatePayable(hours, candidate.pay_rate);
                }, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Joined Candidates with Timesheets */}
      <div className="space-y-6">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Candidate Header */}
            <div 
              className="flex items-center justify-between mb-6 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
              onClick={() => handleCandidateClick(candidate)}
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {candidate.full_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{candidate.full_name}</h3>
                  <p className="text-sm text-gray-600">{candidate.requirement} at {candidate.customer}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">
                      Start: {new Date(candidate.project_start_date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      End: {new Date(candidate.project_end_date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      Duration: {candidate.project_duration} months
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600">${candidate.pay_rate}/hr</div>
                <div className="text-sm text-gray-500">Pay Rate</div>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-2" />
              </div>
            </div>

            {/* Monthly Timesheets */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Monthly Timesheets</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(candidate.monthly_timesheets).map(([month, timesheet]) => (
                  <div key={month} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(timesheet.status)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(timesheet.status)}`}>
                          {timesheet.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Hours:</span>
                        <span className="text-sm font-medium">{timesheet.hours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Payable:</span>
                        <span className="text-sm font-medium text-green-600">
                          ${calculatePayable(timesheet.hours, candidate.pay_rate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {timesheet.status === 'Pending' && (
                      <div className="flex space-x-2 mt-3">
                        <button
                          className="flex-1 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          onClick={() => handleUpdateTimesheetStatus(candidate.id, month, 'Approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="flex-1 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                          onClick={() => handleUpdateTimesheetStatus(candidate.id, month, 'Rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Management */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Vendor Management
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Vendor Name:</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{candidate.vendor.name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Email:</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{candidate.vendor.email}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Phone:</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{candidate.vendor.phone}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Address:</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{candidate.vendor.address}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Signing Authority:</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{candidate.vendor.signing_authority}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Alt. Number:</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{candidate.vendor.alt_number}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Payment Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(candidate.monthly_timesheets).map(([month, timesheet]) => (
                  <div key={month} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${calculatePayable(timesheet.hours, candidate.pay_rate).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {timesheet.hours} hrs × ${candidate.pay_rate}/hr
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Joined Candidates</h3>
          <p className="text-gray-500">Candidates will appear here automatically when their status changes to "Joined"</p>
        </div>
      )}
    </div>
  );
};

export default Timesheets;
