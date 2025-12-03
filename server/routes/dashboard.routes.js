import express from 'express';
import User from '../models/User.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/dashboard/summary
// @desc    Get dashboard summary and KPIs
// @access  Admin only
router.get('/summary', async (req, res) => {
    try {
        // Get current date info
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const today = now.toISOString().split('T')[0];

        // Total employees
        const totalEmployees = await User.countDocuments({ isActive: true });
        const totalInactive = await User.countDocuments({ isActive: false });

        // Pending leave requests
        const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

        // Leaves approved this month
        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0);

        const leavesApprovedThisMonth = await Leave.countDocuments({
            status: 'approved',
            reviewedAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // Today's attendance
        const todayAttendance = await Attendance.countDocuments({ date: today });
        const attendancePercentage = totalEmployees > 0
            ? Math.round((todayAttendance / totalEmployees) * 100)
            : 0;

        // Monthly attendance trend (last 7 days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const count = await Attendance.countDocuments({ date: dateStr });

            last7Days.push({
                date: dateStr,
                count: count,
                percentage: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0
            });
        }

        // Recent leave requests
        const recentLeaves = await Leave.find()
            .populate('userId', 'name email department')
            .sort({ createdAt: -1 })
            .limit(5);

        // Department-wise employee count
        const departmentStats = await User.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalEmployees,
                    totalInactive,
                    pendingLeaves,
                    leavesApprovedThisMonth,
                    todayAttendance,
                    attendancePercentage
                },
                attendanceTrend: last7Days,
                recentLeaves,
                departmentStats
            }
        });
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard data'
        });
    }
});

export default router;
