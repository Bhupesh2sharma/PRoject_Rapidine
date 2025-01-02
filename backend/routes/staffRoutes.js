const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const auth = require('../middleware/auth'); // Assuming you have auth middleware
const Attendance = require('../models/Attendance');

// Debug logging
router.use((req, res, next) => {
    console.log('Staff route accessed:', req.method, req.path);
    next();
});

// Get all staff members
router.get('/staff', auth, async (req, res) => {
    try {
        const staffMembers = await Staff.find().sort({ createdAt: -1 });
        res.json(staffMembers);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Error fetching staff members' });
    }
});

// Add new staff member
router.post('/staff', auth, async (req, res) => {
    try {
        const { name, email, phone, role, status } = req.body;

        // Check if email already exists
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const newStaff = new Staff({
            name,
            email,
            phone,
            role,
            status
        });

        const savedStaff = await newStaff.save();
        res.status(201).json(savedStaff);
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).json({ message: 'Error adding staff member' });
    }
});

// Update staff member
router.put('/staff/:id', auth, async (req, res) => {
    try {
        const { name, email, phone, role, status } = req.body;

        // Check if email exists for other staff members
        const existingStaff = await Staff.findOne({ 
            email, 
            _id: { $ne: req.params.id } 
        });
        
        if (existingStaff) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, role, status },
            { new: true }
        );

        if (!updatedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        res.json(updatedStaff);
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).json({ message: 'Error updating staff member' });
    }
});

// Delete staff member
router.delete('/staff/:id', auth, async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        
        if (!deletedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        res.json({ message: 'Staff member deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ message: 'Error deleting staff member' });
    }
});

// Mark attendance (check-in)
router.post('/staff/attendance/check-in/:staffId', auth, async (req, res) => {
    console.log('Check-in request for staff:', req.params.staffId);
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Verify staff exists
        const staff = await Staff.findById(req.params.staffId);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        // Check for existing attendance
        const existingAttendance = await Attendance.findOne({
            staffId: req.params.staffId,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Already checked in for today' });
        }

        // Create new attendance record
        const attendance = new Attendance({
            staffId: req.params.staffId,
            date: today,
            checkIn: new Date(),
            status: 'present'
        });

        const savedAttendance = await attendance.save();
        console.log('Created attendance record:', savedAttendance);

        // Populate staff details and return
        const populatedAttendance = await Attendance.findById(savedAttendance._id)
            .populate('staffId', 'name role');

        res.status(201).json(populatedAttendance);
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Mark attendance (check-out)
router.put('/staff/attendance/check-out/:staffId', auth, async (req, res) => {
    console.log('Check-out request for staff:', req.params.staffId);
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            staffId: req.params.staffId,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (!attendance) {
            return res.status(404).json({ message: 'No check-in found for today' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already checked out for today' });
        }

        attendance.checkOut = new Date();
        const updatedAttendance = await attendance.save();
        console.log('Updated attendance record:', updatedAttendance);

        // Populate staff details and return
        const populatedAttendance = await Attendance.findById(updatedAttendance._id)
            .populate('staffId', 'name role');

        res.json(populatedAttendance);
    } catch (error) {
        console.error('Check-out error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get attendance for a specific date range
router.get('/staff/attendance', auth, async (req, res) => {
    console.log('Fetching attendance records:', req.query);
    try {
        const { startDate, endDate } = req.query;
        const query = {};
        
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lt: new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000)
            };
        }

        const attendance = await Attendance.find(query)
            .populate('staffId', 'name role')
            .sort({ date: -1, checkIn: -1 });
        
        console.log(`Found ${attendance.length} attendance records`);
        res.json(attendance);
    } catch (error) {
        console.error('Fetch attendance error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 