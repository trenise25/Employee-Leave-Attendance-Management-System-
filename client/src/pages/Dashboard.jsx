import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
    const { isAdmin } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAdmin()) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard/summary');
            setDashboardData(response.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner loading-spinner"></div>
            </div>
        );
    }

    if (!isAdmin()) {
        return (
            <div className="container" style={{ paddingTop: '3rem' }}>
                <div className="card">
                    <h2>Welcome to Employee Management System</h2>
                    <p className="mt-2">Use the navigation menu to access your features:</p>
                    <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                        <li>Apply for leave</li>
                        <li>View your leave history</li>
                        <li>Mark attendance (check-in/check-out)</li>
                        <li>View your attendance records</li>
                    </ul>
                </div>
            </div>
        );
    }

    const { overview, attendanceTrend, recentLeaves, departmentStats } = dashboardData || {};

    return (
        <div className="dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p className="text-muted">Overview of your organization</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-4">
                    <div className="stat-card">
                        <div className="stat-label">Total Employees</div>
                        <div className="stat-value">{overview?.totalEmployees || 0}</div>
                        <div className="stat-change positive">
                            Active employees
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Pending Leaves</div>
                        <div className="stat-value">{overview?.pendingLeaves || 0}</div>
                        <div className="stat-change">
                            Awaiting approval
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Approved This Month</div>
                        <div className="stat-value">{overview?.leavesApprovedThisMonth || 0}</div>
                        <div className="stat-change positive">
                            Leave requests
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-label">Today's Attendance</div>
                        <div className="stat-value">{overview?.attendancePercentage || 0}%</div>
                        <div className="stat-change">
                            {overview?.todayAttendance || 0} / {overview?.totalEmployees || 0} present
                        </div>
                    </div>
                </div>

                {/* Attendance Trend Chart */}
                <div className="card mt-4">
                    <div className="card-header">
                        <h3 className="card-title">Attendance Trend (Last 7 Days)</h3>
                    </div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={attendanceTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--text-muted)"
                                    tick={{ fill: 'var(--text-muted)' }}
                                />
                                <YAxis
                                    stroke="var(--text-muted)"
                                    tick={{ fill: 'var(--text-muted)' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="percentage"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--primary)', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-2 mt-4">
                    {/* Recent Leave Requests */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Recent Leave Requests</h3>
                        </div>
                        <div className="card-body">
                            {recentLeaves && recentLeaves.length > 0 ? (
                                <div className="leave-list">
                                    {recentLeaves.map((leave) => (
                                        <div key={leave._id} className="leave-item">
                                            <div className="leave-info">
                                                <div className="leave-name">{leave.userId?.name}</div>
                                                <div className="leave-type">{leave.type}</div>
                                            </div>
                                            <span className={`badge badge-${leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}`}>
                                                {leave.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No recent leave requests</p>
                            )}
                        </div>
                    </div>

                    {/* Department Statistics */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Employees by Department</h3>
                        </div>
                        <div className="card-body">
                            {departmentStats && departmentStats.length > 0 ? (
                                <div className="department-list">
                                    {departmentStats.map((dept, index) => (
                                        <div key={index} className="department-item">
                                            <div className="department-info">
                                                <div className="department-name">{dept._id || 'General'}</div>
                                                <div className="department-count">{dept.count} employees</div>
                                            </div>
                                            <div className="department-bar">
                                                <div
                                                    className="department-bar-fill"
                                                    style={{
                                                        width: `${(dept.count / overview?.totalEmployees) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No department data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
