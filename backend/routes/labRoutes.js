const express = require('express');
const Lab = require('../models/Lab');
const Profile = require('../models/Profile');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/labs — list all public labs
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const labs = await Lab.find({ isPublic: true })
      .populate('host', 'nameEncrypted avatar')
      .populate('members', 'nameEncrypted avatar')
      .sort({ createdAt: -1 });
    res.json(labs);
  } catch (err) { next(err); }
});

// POST /api/labs — create a new lab
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name, description, researchFocus, tags, isPublic } = req.body;
    if (!name) return res.status(400).json({ error: 'Lab name is required.' });

    const lab = await Lab.create({
      name, description, researchFocus,
      tags: tags || [],
      isPublic: isPublic !== false,
      host: req.user._id,
      members: [req.user._id],
    });
    await lab.populate('host', 'nameEncrypted avatar');
    await lab.populate('members', 'nameEncrypted avatar');
    res.status(201).json(lab);
  } catch (err) { next(err); }
});

// POST /api/labs/:id/join — join a lab
router.post('/:id/join', authMiddleware, async (req, res, next) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ error: 'Lab not found.' });

    const userId = req.user._id.toString();
    if (lab.members.map(m => m.toString()).includes(userId)) {
      return res.status(400).json({ error: 'Already a member.' });
    }
    lab.members.push(req.user._id);
    lab.joinRequests = lab.joinRequests.filter(r => r.toString() !== userId);
    await lab.save();
    await lab.populate('host', 'nameEncrypted avatar');
    await lab.populate('members', 'nameEncrypted avatar');
    res.json(lab);
  } catch (err) { next(err); }
});

// POST /api/labs/:id/leave — leave a lab
router.post('/:id/leave', authMiddleware, async (req, res, next) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ error: 'Lab not found.' });

    if (lab.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Host cannot leave. Delete the lab instead.' });
    }
    lab.members = lab.members.filter(m => m.toString() !== req.user._id.toString());
    await lab.save();
    res.json({ message: 'Left lab successfully.' });
  } catch (err) { next(err); }
});

// POST /api/labs/:id/announce — host posts an announcement
router.post('/:id/announce', authMiddleware, async (req, res, next) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ error: 'Lab not found.' });
    if (lab.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the host can post announcements.' });
    }
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content required.' });
    lab.announcements.push({ content, author: req.user._id });
    await lab.save();
    res.json(lab);
  } catch (err) { next(err); }
});

// DELETE /api/labs/:id — delete a lab (host only)
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ error: 'Lab not found.' });
    if (lab.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the host can delete this lab.' });
    }
    await lab.deleteOne();
    res.json({ message: 'Lab deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
