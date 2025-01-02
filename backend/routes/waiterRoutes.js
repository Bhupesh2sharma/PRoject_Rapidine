const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const waiters = await Waiter.find();
    res.json(waiters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/active', async (req, res) => {
  try {
    const waiters = await Waiter.find({ status: 'active' });
    res.json(waiters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const waiter = new Waiter(req.body);
    const savedWaiter = await waiter.save();
    res.status(201).json(savedWaiter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedWaiter = await Waiter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedWaiter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedWaiter = await Waiter.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedWaiter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Waiter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Waiter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 