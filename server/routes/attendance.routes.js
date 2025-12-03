import express from 'express';
import Attendance from '../models/Attendance.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/attendance/checkin
// @desc    Check-in for the day (Employee)
// @access  Employee/Admin
router.post('/checkin', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

        // Check if already checked in today
        const existingAttendance = await Attendance.findOne({
            userId: req.user._id,
            date: today
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: 'You have already checked in today'
            });
        }

        // Create check-in record
        const attendance = await Attendance.create({
            userId: req.user._id,
            date: today,
            checkIn: new Date()
        });

        await attendance.populate('userId', 'name email');

        res.status(201).json({
            success: true,
            message: 'Checked in successfully',
            data: attendance
        });
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during check-in'
        });
    }
});

// @route   POST /api/attendance/checkout
// @desc    Check-out for the day (Employee)
// @access  Employee/Admin
router.post('/checkout', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Find today's attendance record
        const attendance = await Attendance.findOne({
            userId: req.user._id,
            date: today
        });

        if (!attendance) {
            return res.status(400).json({
                success: false,
                message: 'You have not checked in today'
            });
        }

        if (attendance.checkOut) {
            return res.status(400).json({
                success: false,
                message: 'You have already checked out today'
            });
        }

        // Update check-out time
        attendance.checkOut = new Date();
        attendance.calculateWorkHours();
        await attendance.save();

        await attendance.populate('userId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Checked out successfully',
            data: attendance
        });
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during check-out'
        });
    }
});

// @route   GET /api/attendance/me
// @desc    Get my attendance records (Employee)
// @access  Employee/Admin
router.get('/me', async (req, res) => {
    try {
        const { month, year } = req.query;

        let query = { userId: req.user._id };

        // Filter by month and year if provided
        if (month && year) {
            const startDate = `${year}-${month.padStart(2, '0')}-01`;
            const endDate = new Date(year, month, 0).toISOString().split('T')[0];
            query.date = { $gte: startDate, $lte: endDate };
        }

        const attendance = await Attendance.find(query)
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        console.error('Get my attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching attendance'
        });
    }
});

// @route   GET /api/attendance
// @desc    Get all attendance records (Admin)
// @access  Admin only
router.get('/', authorize('admin'), async (req, res) => {
    try {
        const { userId, month, year, date } = req.query;

        let query = {};

        if (userId) {
            query.userId = userId;
        }

        if (date) {
            query.date = date;
        } else if (month && year) {
            const startDate = `${year}-${month.padStart(2, '0')}-01`;
            const endDate = new Date(year, month, 0).toISOString().split('T')[0];
            query.date = { $gte: startDate, $lte: endDate };
        }

        const attendance = await Attendance.find(query)
            .populate('userId', 'name email department position')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        console.error('Get all attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching attendance'
        });
    }
});

// @route   GET /api/attendance/today
// @desc    Get today's attendance summary (Admin)
// @access  Admin only
router.get('/today', authorize('admin'), async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.find({ date: today })
            .populate('userId', 'name email department')
            .sort({ checkIn: 1 });

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        console.error('Get today attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching today\'s attendance'
        });
    }
});

export default router;
