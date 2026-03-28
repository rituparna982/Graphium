const express = require('express');
const Collaboration = require('../models/Collaboration');
const Profile = require('../models/Profile');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/collaborations — get my collaborations (sent + received)
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const collabs = await Collaboration.find({
      $or: [{ requester: userId }, { recipient: userId }]
    })
      .populate('requester', 'nameEncrypted avatar')
      .populate('recipient', 'nameEncrypted avatar')
      .sort({ createdAt: -1 });
    res.json(collabs);
  } catch (err) { next(err); }
});

// POST /api/collaborations — send a collaboration request
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { recipientId, message, topic } = req.body;
    if (!recipientId) return res.status(400).json({ error: 'Recipient required.' });
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot collaborate with yourself.' });
    }

    const existing = await Collaboration.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id }
      ]
    });
    if (existing) return res.status(409).json({ error: 'Collaboration request already exists.', collab: existing });

    const collab = await Collaboration.create({
      requester: req.user._id,
      recipient: recipientId,
      message: message || '',
      topic: topic || '',
    });
    await collab.populate('requester', 'nameEncrypted avatar');
    await collab.populate('recipient', 'nameEncrypted avatar');
    res.status(201).json(collab);
  } catch (err) { next(err); }
});

// PATCH /api/collaborations/:id — accept or decline
router.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Status must be accepted or declined.' });
    }
    const collab = await Collaboration.findById(req.params.id);
    if (!collab) return res.status(404).json({ error: 'Collaboration not found.' });
    if (collab.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the recipient can respond.' });
    }
    collab.status = status;
    await collab.save();
    await collab.populate('requester', 'nameEncrypted avatar');
    await collab.populate('recipient', 'nameEncrypted avatar');
    res.json(collab);
  } catch (err) { next(err); }
});

// DELETE /api/collaborations/:id — cancel/remove
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const collab = await Collaboration.findById(req.params.id);
    if (!collab) return res.status(404).json({ error: 'Not found.' });
    if (collab.requester.toString() !== req.user._id.toString() &&
        collab.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized.' });
    }
    await collab.deleteOne();
    res.json({ message: 'Removed.' });
  } catch (err) { next(err); }
});

module.exports = router;
