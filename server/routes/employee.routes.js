import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/employees
// @desc    Get all employees
// @access  Admin only
router.get('/', async (req, res) => {
    try {
        const { search, department, status } = req.query;

        // Build query
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (department) {
            query.department = department;
        }

        if (status) {
            query.isActive = status === 'active';
        }

        const employees = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching employees'
        });
    }
});

// @route   GET /api/employees/:id
// @desc    Get single employee
// @access  Admin only
router.get('/:id', async (req, res) => {
    try {
        const employee = await User.findById(req.params.id).select('-password');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching employee'
        });
    }
});

// @route   POST /api/employees
// @desc    Add new employee
// @access  Admin only
router.post('/', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'employee']).withMessage('Invalid role')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { name, email, password, role, department, position } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new employee
        const employee = await User.create({
            name,
            email,
            password,
            role,
            department: department || 'General',
            position: position || 'Employee'
        });

        res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            data: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                department: employee.department,
                position: employee.position
            }
        });
    } catch (error) {
        console.error('Add employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding employee'
        });
    }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Admin only
router.put('/:id', async (req, res) => {
    try {
        const { name, email, role, department, position, isActive } = req.body;

        const employee = await User.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Update fields
        if (name) employee.name = name;
        if (email) employee.email = email;
        if (role) employee.role = role;
        if (department) employee.department = department;
        if (position) employee.position = position;
        if (typeof isActive !== 'undefined') employee.isActive = isActive;

        await employee.save();

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                department: employee.department,
                position: employee.position,
                isActive: employee.isActive
            }
        });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating employee'
        });
    }
});

// @route   DELETE /api/employees/:id
// @desc    Deactivate employee
// @access  Admin only
router.delete('/:id', async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Deactivate instead of delete
        employee.isActive = false;
        await employee.save();

        res.status(200).json({
            success: true,
            message: 'Employee deactivated successfully'
        });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deactivating employee'
        });
    }
});

export default router;
