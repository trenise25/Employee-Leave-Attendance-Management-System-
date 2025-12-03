import { useState } from 'react';
import api from '../api';

const LeaveRequest = () => {
    const [formData, setFormData] = useState({
        type: 'Casual Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const leaveTypes = [
        'Sick Leave',
        'Casual Leave',
        'Annual Leave',
        'Maternity Leave',
        'Paternity Leave',
        'Unpaid Leave'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post('/leave', formData);
            setSuccess('Leave request submitted successfully!');
            setFormData({
                type: 'Casual Leave',
                startDate: '',
                endDate: '',
                reason: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error submitting leave request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <h1>Apply for Leave</h1>
            <p className="text-muted mb-3">Submit a leave request for approval</p>

            <div className="card" style={{ maxWidth: '700px' }}>
                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Leave Type</label>
                        <select
                            className="form-select"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            {leaveTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Reason</label>
                        <textarea
                            className="form-textarea"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Please provide a reason for your leave..."
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <><span className="spinner"></span> Submitting...</> : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LeaveRequest;
