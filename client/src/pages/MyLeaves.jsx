import { useState, useEffect } from 'react';
import api from '../api';

const MyLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    const fetchMyLeaves = async () => {
        try {
            const response = await api.get('/leave/me');
            setLeaves(response.data.data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
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
            <h1>My Leave Requests</h1>
            <p className="text-muted mb-3">View your leave request history</p>

            {leaves.length === 0 ? (
                <div className="card text-center">
                    <p className="text-muted">You haven't submitted any leave requests yet</p>
                </div>
            ) : (
                <div className="grid" style={{ gap: 'var(--spacing-lg)' }}>
                    {leaves.map((leave) => (
                        <div key={leave._id} className="card">
                            <div className="flex justify-between items-center mb-3">
                                <h3>{leave.type}</h3>
                                <span className={`badge badge-${leave.status === 'approved' ? 'success' :
                                        leave.status === 'rejected' ? 'danger' : 'warning'
                                    }`}>
                                    {leave.status}
                                </span>
                            </div>

                            <div className="grid grid-3 mb-3">
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>Start Date</div>
                                    <div>{formatDate(leave.startDate)}</div>
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>End Date</div>
                                    <div>{formatDate(leave.endDate)}</div>
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>Duration</div>
                                    <div>{leave.totalDays} days</div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Reason</div>
                                <div>{leave.reason}</div>
                            </div>

                            {leave.reviewedBy && (
                                <div style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border)' }}>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                        Reviewed by {leave.reviewedBy.name} on {formatDate(leave.reviewedAt)}
                                    </div>
                                    {leave.reviewComment && (
                                        <div className="mt-1">
                                            <strong>Comment:</strong> {leave.reviewComment}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyLeaves;
