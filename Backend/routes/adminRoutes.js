const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

// Middleware for admin authentication
const authenticateAdmin = (req, res, next) => {
    if (req.session && req.session.adminUser === 'admin') {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Admin login routes
router.get('/login', (req, res) => {
    if (req.session && req.session.adminUser) {
        return res.redirect('home');
    }
    res.render('adminLogin');
});

router.post('/login', (req, res) => {
    const { adminUsername, adminPassword } = req.body;

    if (adminUsername === 'admin' && adminPassword === 'a') {
        req.session.adminUser = adminUsername;
        res.redirect('home');
    } else {
        res.send('<h1>Invalid Credentials</h1> <br> <a href="">login</a>');
    }
});

// Admin home route
router.get('/home', authenticateAdmin, (req, res) => {
    res.render('adminHome');
});

// Add notes routes
router.get('/addNotes', authenticateAdmin, (req, res) => {
    res.render('adminAddNotes');
});

router.post('/addNotes', authenticateAdmin, async (req, res) => {
    try {
        const data = req.body.notes;
        if (!data || !Array.isArray(data)) {
            return res.status(400).send('Invalid notes data');
        }
        
        const note = new Note({ notes: data });
        await note.save();

        res.redirect('/admin/displayNotes');
    } catch (err) {
        console.error('Error saving notes:', err);
        res.status(500).send('Failed to save notes');
    }
});

// Display notes route
router.get('/displayNotes', authenticateAdmin, async (req, res) => {
    try {
        const allNotes = await Note.find();
        res.render('adminDisplayNotes', { notes: allNotes});
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).send('Failed to fetch notes');
    }
});

// Edit note routes
router.get('/editNote/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Find the document containing the specific note by its ID
        const noteDoc = await Note.findOne({ 'notes._id': id });

        if (!noteDoc) {
            return res.status(404).send('Note not found');
        }

        // Extract the specific note from the `notes` array
        const specificNote = noteDoc.notes.find(note => note._id.toString() === id);

        if (!specificNote) {
            return res.status(404).send('Note not found');
        }

        // Respond with the specific note
        res.render('adminEditNote', { note: specificNote });
    } catch (err) {
        console.error('Error fetching note:', err);
        res.status(500).send('Failed to fetch note');
    }
});


router.post('/editNote/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        // Find the document containing the specific note by its ID
        const noteDoc = await Note.findOne({ 'notes._id': id });
        
        if (!noteDoc) {
            return res.status(404).send('Note not found');
        }

        // Extract the specific note from the `notes` array
        const specificNote = noteDoc.notes.find(note => note._id.toString() === id);

        if (!specificNote) {
            return res.status(404).send('Note not found');
        }

        specificNote.title = title;
        specificNote.content = content;
        await noteDoc.save();  // nested obj save does not update global obj
        res.redirect('/admin/displayNotes');
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).send('Failed to update note');
    }
});

// Delete note route
router.get('/deleteNote/:id', authenticateAdmin, async (req, res) => {
    try {
        // Extract `id` from route parameters
        const { id } = req.params;

        // Find the document containing the specific note by its ID
        const noteDoc = await Note.findOne({ 'notes._id': id });

        if (!noteDoc) {
            return res.status(404).send('Note not found');
        }

        // Remove the specific note from the `notes` array
        noteDoc.notes = noteDoc.notes.filter(note => note._id.toString() !== id);

        // Save the updated document
        await noteDoc.save();
        res.redirect('/admin/displayNotes');
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).send('Failed to delete note');
    }
});


// Admin logout route
router.get('/logout', authenticateAdmin, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).send('Something went wrong while logging out.');
        }
        res.redirect('/admin/login');
    });
});

module.exports = router;
