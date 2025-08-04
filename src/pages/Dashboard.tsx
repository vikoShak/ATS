import React, { useEffect, useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { Applicant, Requirement, Timesheet } from '../types';

const Dashboard: React.FC = () => {
  const {
    loading,
    error,
    getApplicants,
    getRequirements,
    getTimesheets,
    getActivities,
  } = useSupabase();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedApplicants = await getApplicants();
      if (fetchedApplicants) {
        setApplicants(fetchedApplicants as Applicant[]);
      }

      const fetchedRequirements = await getRequirements();
      if (fetchedRequirements) {
        setRequirements(fetchedRequirements as Requirement[]);
      }

      const fetchedTimesheets = await getTimesheets();
      if (fetchedTimesheets) {
        setTimesheets(fetchedTimesheets as Timesheet[]);
      }

      const fetchedActivities = await getActivities(5); // Get latest 5 activities
      if (fetchedActivities) {
        setActivities(fetchedActivities);
      }
    };

    fetchData();
  }, []);

  // Calculate summary data
  const totalApplicants = applicants.length;
  const applicantsByStatus = applicants.reduce((acc, applicant) => {
    acc[applicant.status] = (acc[applicant.status] || 0) + 1;
    return acc;
  }, {} as Record<Applicant['status'], number>);

  const totalRequirements = requirements.length;
  const openRequirements = requirements.filter(req => req.status === 'Open').length;
  const requirementsByType = requirements.reduce((acc, req) => {
    acc[req.type] = (acc[req.type] || 0) + 1;
    return acc;
  }, {} as Record<Requirement['type'], number>);

  const totalTimesheets = timesheets.length;
  const pendingTimesheets = timesheets.filter(ts => ts.status === 'Pending').length;
  const approvedTimesheets = timesheets.filter(ts => ts.status === 'Approved').length;
  const rejectedTimesheets = timesheets.filter(ts => ts.status === 'Rejected').length;

  const recentApplicants = applicants.slice(0, 5).sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
  const recentRequirements = requirements.slice(0, 5).sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  const recentTimesheets = timesheets.slice(0, 5).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-[#171717] flex items-center justify-center">
        <p className="text-[#A3A3A3] text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-[#171717] flex items-center justify-center">
        <p className="text-[#ef4444] text-xl">Error: {error}</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-500';
      case 'Screening': return 'bg-yellow-500';
      case 'Interview': return 'bg-purple-500';
      case 'Hired': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500'; // Keep this one
      case 'Open': return 'bg-green-500';
      case 'Closed': return 'bg-red-500';
      case 'On Hold': return 'bg-yellow-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Approved': return 'bg-green-500';
      // Removed duplicate 'Rejected' case
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#171717] text-[#FFFFFF] font-sans">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-[#262626] overflow-hidden shadow-xl rounded-2xl p-8 border border-[#2F2F2F]">
          <h1 className="text-5xl font-extrabold mb-8 text-[#9E7FFF] tracking-tight">
            RecruitIQ Dashboard
          </h1>
          <p className="text-lg text-[#A3A3A3] mb-10 leading-relaxed">
            A comprehensive overview of your recruitment pipeline, job requirements, timesheet statuses, and recent system activities.
          </p>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#1F1F1F] p-6 rounded-xl shadow-lg border border-[#2F2F2F] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-[#38bdf8] mb-2">Total Applicants</h3>
              <p className="text-4xl font-bold text-[#FFFFFF]">{totalApplicants}</p>
              <p className="text-sm text-[#A3A3A3] mt-2">Candidates in your pipeline</p>
            </div>
            <div className="bg-[#1F1F1F] p-6 rounded-xl shadow-lg border border-[#2F2F2F] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-[#f472b6] mb-2">Open Requirements</h3>
              <p className="text-4xl font-bold text-[#FFFFFF]">{openRequirements}</p>
              <p className="text-sm text-[#A3A3A3] mt-2">Active job openings</p>
            </div>
            <div className="bg-[#1F1F1F] p-6 rounded-xl shadow-lg border border-[#2F2F2F] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-[#10b981] mb-2">Pending Timesheets</h3>
              <p className="text-4xl font-bold text-[#FFFFFF]">{pendingTimesheets}</p>
              <p className="text-sm text-[#A3A3A3] mt-2">Awaiting approval</p>
            </div>
            <div className="bg-[#1F1F1F] p-6 rounded-xl shadow-lg border border-[#2F2F2F] transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-[#9E7FFF] mb-2">Recent Activities</h3>
              <p className="text-4xl font-bold text-[#FFFFFF]">{activities.length}</p>
              <p className="text-sm text-[#A3A3A3] mt-2">Latest system updates</p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Applicants Overview */}
            <div className="bg-[#1F1F1F] p-8 rounded-2xl shadow-lg border border-[#2F2F2F]">
              <h2 className="text-3xl font-bold text-[#38bdf8] mb-6">Applicants Overview</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(applicantsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></span>
                    <p className="text-lg text-[#FFFFFF]">{status}: <span className="font-semibold">{count}</span></p>
                  </div>
                ))}
              </div>
              <h3 className="text-xl font-semibold text-[#A3A3A3] mb-4">Recent Applicants</h3>
              {recentApplicants.length > 0 ? (
                <ul className="space-y-3">
                  {recentApplicants.map((applicant) => (
                    <li key={applicant.id} className="flex justify-between items-center bg-[#262626] p-4 rounded-lg border border-[#2F2F2F]">
                      <span className="text-[#FFFFFF] font-medium">{applicant.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(applicant.status)}`}>
                        {applicant.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#A3A3A3]">No recent applicants.</p>
              )}
            </div>

            {/* Requirements Overview */}
            <div className="bg-[#1F1F1F] p-8 rounded-2xl shadow-lg border border-[#2F2F2F]">
              <h2 className="text-3xl font-bold text-[#f472b6] mb-6">Requirements Overview</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(requirementsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center space-x-3">
                    <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                    <p className="text-lg text-[#FFFFFF]">{type}: <span className="font-semibold">{count}</span></p>
                  </div>
                ))}
              </div>
              <h3 className="text-xl font-semibold text-[#A3A3A3] mb-4">Recent Requirements</h3>
              {recentRequirements.length > 0 ? (
                <ul className="space-y-3">
                  {recentRequirements.map((req) => (
                    <li key={req.id} className="flex justify-between items-center bg-[#262626] p-4 rounded-lg border border-[#2F2F2F]">
                      <span className="text-[#FFFFFF] font-medium">{req.title}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#A3A3A3]">No recent requirements.</p>
              )}
            </div>

            {/* Timesheets Overview */}
            <div className="bg-[#1F1F1F] p-8 rounded-2xl shadow-lg border border-[#2F2F2F]">
              <h2 className="text-3xl font-bold text-[#10b981] mb-6">Timesheets Overview</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor('Pending')}`}></span>
                  <p className="text-lg text-[#FFFFFF]">Pending: <span className="font-semibold">{pendingTimesheets}</span></p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor('Approved')}`}></span>
                  <p className="text-lg text-[#FFFFFF]">Approved: <span className="font-semibold">{approvedTimesheets}</span></p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor('Rejected')}`}></span>
                  <p className="text-lg text-[#FFFFFF]">Rejected: <span className="font-semibold">{rejectedTimesheets}</span></p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#A3A3A3] mb-4">Recent Timesheets</h3>
              {recentTimesheets.length > 0 ? (
                <ul className="space-y-3">
                  {recentTimesheets.map((ts) => (
                    <li key={ts.id} className="flex justify-between items-center bg-[#262626] p-4 rounded-lg border border-[#2F2F2F]">
                      <span className="text-[#FFFFFF] font-medium">{ts.employeeName} - {ts.project}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ts.status)}`}>
                        {ts.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#A3A3A3]">No recent timesheets.</p>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-[#1F1F1F] p-8 rounded-2xl shadow-lg border border-[#2F2F2F]">
              <h2 className="text-3xl font-bold text-[#9E7FFF] mb-6">Recent Activities</h2>
              {activities.length > 0 ? (
                <ul className="space-y-4">
                  {activities.map((activity) => (
                    <li key={activity.id} className="bg-[#262626] p-4 rounded-lg border border-[#2F2F2F] flex items-start space-x-4">
                      <div className="flex-shrink-0 w-2 h-2 bg-[#9E7FFF] rounded-full mt-2"></div>
                      <div>
                        <p className="text-[#FFFFFF] font-medium">{activity.action}</p>
                        <p className="text-sm text-[#A3A3A3] mt-1">
                          {activity.details?.name && `for ${activity.details.name}`}
                          {activity.details?.title && ` for "${activity.details.title}"`}
                          {activity.details?.status && ` (Status: ${activity.details.status})`}
                          {' '}
                          <span className="text-xs text-[#A3A3A3] opacity-75">
                            {new Date(activity.created_at).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#A3A3A3]">No recent activities.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
