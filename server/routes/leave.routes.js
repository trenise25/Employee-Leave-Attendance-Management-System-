import express from 'express';
import { body, validationResult } from 'express-validator';
import Leave from '../models/Leave.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/leave
// @desc    Apply for leave (Employee)
// @access  Employee/Admin
router.post('/', [
    body('type').notEmpty().withMessage('Leave type is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('reason').trim().notEmpty().withMessage('Reason is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { type, startDate, endDate, reason } = req.body;

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        // Create leave request
        const leave = await Leave.create({
            userId: req.user._id,
            type,
            startDate: start,
            endDate: end,
            reason
        });

        // Populate user details
        await leave.populate('userId', 'name email department');

        res.status(201).json({
            success: true,
            message: 'Leave request submitted successfully',
            data: leave
        });
    } catch (error) {
        console.error('Apply leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while applying for leave'
        });
    }
});

// @route   GET /api/leave/me
// @desc    Get my leave requests (Employee)
// @access  Employee/Admin
router.get('/me', async (req, res) => {
    try {
        const leaves = await Leave.find({ userId: req.user._id })
            .populate('reviewedBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves
        });
    } catch (error) {
        console.error('Get my leaves error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching leave requests'
        });
    }
});

// @route   GET /api/leave
// @desc    Get all leave requests (Admin)
// @access  Admin only
router.get('/', authorize('admin'), async (req, res) => {
    try {
        const { status, userId } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (userId) {
            query.userId = userId;
        }

        const leaves = await Leave.find(query)
            .populate('userId', 'name email department position')
            .populate('reviewedBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves
        });
    } catch (error) {
        console.error('Get all leaves error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching leave requests'
        });
    }
});

// @route   PUT /api/leave/:id/approve
// @desc    Approve leave request (Admin)
// @access  Admin only
router.put('/:id/approve', authorize('admin'), async (req, res) => {
    try {
        const { comment } = req.body;

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        if (leave.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Leave request has already been processed'
            });
        }

        leave.status = 'approved';
        leave.reviewedBy = req.user._id;
        leave.reviewedAt = new Date();
        if (comment) leave.reviewComment = comment;

        await leave.save();
        await leave.populate('userId', 'name email');
        await leave.populate('reviewedBy', 'name');

        res.status(200).json({
            success: true,
            message: 'Leave request approved successfully',
            data: leave
        });
    } catch (error) {
        console.error('Approve leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while approving leave'
        });
    }
});

// @route   PUT /api/leave/:id/reject
// @desc    Reject leave request (Admin)
// @access  Admin only
router.put('/:id/reject', authorize('admin'), async (req, res) => {
    try {
        const { comment } = req.body;

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        if (leave.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Leave request has already been processed'
            });
        }

        leave.status = 'rejected';
        leave.reviewedBy = req.user._id;
        leave.reviewedAt = new Date();
        if (comment) leave.reviewComment = comment;

        await leave.save();
        await leave.populate('userId', 'name email');
        await leave.populate('reviewedBy', 'name');

        res.status(200).json({
            success: true,
            message: 'Leave request rejected',
            data: leave
        });
    } catch (error) {
        console.error('Reject leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while rejecting leave'
        });
    }
});

export default router;
