const express = require('express');
const router = express.Router();
const Note = require('../models/notes');

// Simple HTML escape function for input sanitization
const sanitizeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
};

// Note: The 'auth' middleware is applied in server.js, protecting all these routes.

// GET /home - Get all notes for the logged-in user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /home - Create a new note
router.post('/', async (req, res) => {
  try {
    const { text, tags } = req.body;
    const sanitizedText = sanitizeHtml(text);
    const sanitizedTags = Array.isArray(tags) ? tags.map(tag => sanitizeHtml(tag.trim()).toLowerCase()).filter(Boolean) : [];

    const newNote = new Note({
        text: sanitizedText,
        tags: sanitizedTags,
        user: req.user.id,
    });
    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 1. Add EDIT note functionality
// PUT /home/:id - Update a note
router.put('/:id', async (req, res) => {
  try {
    const { text, tags } = req.body;

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    // Make sure user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Sanitize and update fields
    if (text) {
      note.text = sanitizeHtml(text);
    }
    if (tags && Array.isArray(tags)) {
      note.tags = tags.map(tag => sanitizeHtml(tag.trim()).toLowerCase()).filter(Boolean);
    }

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /home/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({ msg: 'Note not found' });
    }

    // Make sure user owns the note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
