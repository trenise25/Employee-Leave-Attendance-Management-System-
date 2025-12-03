import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date
    },
    status: {
        type: String,
        enum: ['present', 'late', 'half-day', 'absent'],
        default: 'present'
    },
    workHours: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Compound index to ensure one attendance record per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Method to calculate work hours
attendanceSchema.methods.calculateWorkHours = function () {
    if (this.checkIn && this.checkOut) {
        const diffMs = this.checkOut - this.checkIn;
        const diffHours = diffMs / (1000 * 60 * 60);
        this.workHours = Math.round(diffHours * 100) / 100; // Round to 2 decimals

        // Determine status based on work hours
        if (diffHours >= 8) {
            this.status = 'present';
        } else if (diffHours >= 4) {
            this.status = 'half-day';
        } else {
            this.status = 'late';
        }
    }
    return this.workHours;
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
