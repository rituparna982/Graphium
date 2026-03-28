const express = require('express');
const ConferencePaper = require('../models/ConferencePaper');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/conference-papers — get my papers
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const papers = await ConferencePaper.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) { next(err); }
});

// POST /api/conference-papers — submit a new paper
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { title, abstract, conference, fileUrl } = req.body;
    if (!title || !conference) return res.status(400).json({ error: 'Title and conference are required.' });

    const paper = await ConferencePaper.create({
      author: req.user._id,
      title, abstract, conference,
      fileUrl: fileUrl || '',
      status: 'submitted',
      submittedAt: new Date(),
    });
    res.status(201).json(paper);
  } catch (err) { next(err); }
});

// PATCH /api/conference-papers/:id/revise — submit a revision
router.patch('/:id/revise', authMiddleware, async (req, res, next) => {
  try {
    const paper = await ConferencePaper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Paper not found.' });
    if (paper.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized.' });
    }
    const { note } = req.body;
    paper.revisionHistory.push({ note: note || '', submittedAt: new Date() });
    paper.status = 'resubmitted';
    await paper.save();
    res.json(paper);
  } catch (err) { next(err); }
});

// PATCH /api/conference-papers/:id/status — update status (admin/reviewer simulation)
router.patch('/:id/status', authMiddleware, async (req, res, next) => {
  try {
    const paper = await ConferencePaper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Paper not found.' });
    const { status, reviewerNotes } = req.body;
    if (status) paper.status = status;
    if (reviewerNotes) paper.reviewerNotes = reviewerNotes;
    await paper.save();
    res.json(paper);
  } catch (err) { next(err); }
});

// DELETE /api/conference-papers/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const paper = await ConferencePaper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Not found.' });
    if (paper.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized.' });
    }
    await paper.deleteOne();
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
});

module.exports = router;
