const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create Event
router.post('/', authMiddleware, async (req, res) => {
    try {
        const event = new Event({ ...req.body, owner: req.userId });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get User Events
router.get('/', authMiddleware, async (req, res) => {
    try {
        const events = await Event.find({ owner: req.userId });
        res.json(events);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update Event
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, owner: req.userId },
            req.body,
            { new: true }
        );
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Event
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, owner: req.userId });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
