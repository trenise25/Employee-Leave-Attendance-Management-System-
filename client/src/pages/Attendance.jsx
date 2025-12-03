import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Attendance = () => {
    const { isAdmin } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
        checkTodayAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const endpoint = isAdmin() ? '/attendance' : '/attendance/me';
            const response = await api.get(endpoint);
            setAttendance(response.data.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkTodayAttendance = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await api.get('/attendance/me');
            const todayRecord = response.data.data.find(a => a.date === today);
            setTodayAttendance(todayRecord || null);
        } catch (error) {
            console.error('Error checking today attendance:', error);
        }
    };

    const handleCheckIn = async () => {
        try {
            await api.post('/attendance/checkin');
            fetchAttendance();
            checkTodayAttendance();
        } catch (error) {
            alert(error.response?.data?.message || 'Error checking in');
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.post('/attendance/checkout');
            fetchAttendance();
            checkTodayAttendance();
        } catch (error) {
            alert(error.response?.data?.message || 'Error checking out');
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner loading-spinner"></div></div>;
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <h1>Attendance</h1>
            <p className="text-muted mb-3">Track your daily attendance</p>

            {!isAdmin() && (
                <div className="card mb-4">
                    <h3 className="mb-3">Today's Attendance</h3>

                    {!todayAttendance ? (
                        <div>
                            <p className="text-muted mb-3">You haven't checked in today</p>
                            <button className="btn btn-primary" onClick={handleCheckIn}>
                                Check In
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="grid grid-3 mb-3">
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>Check In</div>
                                    <div className="text-primary" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                                        {formatTime(todayAttendance.checkIn)}
                                    </div>
                                </div>
                                {todayAttendance.checkOut && (
                                    <>
                                        <div>
                                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Check Out</div>
                                            <div className="text-success" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                                                {formatTime(todayAttendance.checkOut)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Work Hours</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                                                {todayAttendance.workHours} hrs
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {!todayAttendance.checkOut && (
                                <button className="btn btn-success" onClick={handleCheckOut}>
                                    Check Out
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="card">
                <h3 className="mb-3">Attendance History</h3>

                {attendance.length === 0 ? (
                    <p className="text-muted">No attendance records found</p>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    {isAdmin() && <th>Employee</th>}
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Work Hours</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record) => (
                                    <tr key={record._id}>
                                        <td>{formatDate(record.date)}</td>
                                        {isAdmin() && <td>{record.userId?.name}</td>}
                                        <td>{formatTime(record.checkIn)}</td>
                                        <td>{record.checkOut ? formatTime(record.checkOut) : '-'}</td>
                                        <td>{record.workHours ? `${record.workHours} hrs` : '-'}</td>
                                        <td>
                                            <span className={`badge badge-${record.status === 'present' ? 'success' :
                                                    record.status === 'late' ? 'warning' :
                                                        record.status === 'half-day' ? 'info' : 'danger'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
