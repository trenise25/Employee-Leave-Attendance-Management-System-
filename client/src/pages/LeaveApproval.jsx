import { useState, useEffect } from 'react';
import api from '../api';

const LeaveApproval = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        fetchLeaves();
    }, [filter]);

    const fetchLeaves = async () => {
        try {
            const response = await api.get(`/leave?status=${filter}`);
            setLeaves(response.data.data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/leave/${id}/approve`);
            fetchLeaves();
        } catch (error) {
            alert('Error approving leave');
        }
    };

    const handleReject = async (id) => {
        const comment = prompt('Reason for rejection (optional):');
        try {
            await api.put(`/leave/${id}/reject`, { comment });
            fetchLeaves();
        } catch (error) {
            alert('Error rejecting leave');
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
            <h1>Leave Requests</h1>
            <p className="text-muted mb-3">Review and manage employee leave requests</p>

            <div className="card mb-3">
                <div className="flex gap-2">
                    <button
                        className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('approved')}
                    >
                        Approved
                    </button>
                    <button
                        className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            <div className="grid" style={{ gap: 'var(--spacing-lg)' }}>
                {leaves.length === 0 ? (
                    <div className="card text-center">
                        <p className="text-muted">No {filter} leave requests found</p>
                    </div>
                ) : (
                    leaves.map((leave) => (
                        <div key={leave._id} className="card">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h3>{leave.userId?.name}</h3>
                                    <p className="text-muted">{leave.userId?.email} • {leave.userId?.department}</p>
                                </div>
                                <span className={`badge badge-${leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}`}>
                                    {leave.status}
                                </span>
                            </div>

                            <div className="grid grid-2 mb-3">
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>Leave Type</div>
                                    <div>{leave.type}</div>
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>Duration</div>
                                    <div>{leave.totalDays} days</div>
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>Start Date</div>
                                    <div>{formatDate(leave.startDate)}</div>
                                </div>
                                <div>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>End Date</div>
                                    <div>{formatDate(leave.endDate)}</div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Reason</div>
                                <div>{leave.reason}</div>
                            </div>

                            {leave.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button className="btn btn-success" onClick={() => handleApprove(leave._id)}>
                                        Approve
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleReject(leave._id)}>
                                        Reject
                                    </button>
                                </div>
                            )}

                            {leave.reviewedBy && (
                                <div className="mt-3" style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--border)' }}>
                                    <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                                        Reviewed by {leave.reviewedBy.name} on {formatDate(leave.reviewedAt)}
                                    </div>
                                    {leave.reviewComment && <div className="mt-1">{leave.reviewComment}</div>}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LeaveApproval;
