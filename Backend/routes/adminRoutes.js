const express = require('express')
const router = express.Router()

const authenticateAdmin = (req, res, next) => {
    if (req.session && req.session.adminUser === 'admin') {
        next();
    }
    else {
        res.redirect('/admin/login');
    }
}

router.get('/login', (req, res) => {
    if (req.session && req.session.adminUser)
        res.redirect('home');
    res.render('adminLogin');
});

router.post('/login', (req, res) => {
    const { adminUsername, adminPassword } = req.body;

    if (adminUsername == 'admin' && adminPassword == 'a') {
        req.session.adminUser = adminUsername;
        res.redirect('home');
    }
    else {
        res.send('<h1>Invalid Credentials</h1> <br> <a href="">login</a>')
    }

});

router.get('/home', authenticateAdmin, (req, res) => {
    res.render('adminHome');
})

router.get('/addNotes', authenticateAdmin, (req, res) => {
    res.render('adminAddNotes');
})
let notes = [];
let id = 1;
router.post('/addNotes', authenticateAdmin, (req, res) => {
    const data = req.body;
    const listOfNotes = data['notes'];
    let end = notes.length;  
    notes = notes.concat(listOfNotes); // appending notes list from the frontend with the notes list
    for (let i = end; i < notes.length; i++) {
        notes[i]['id'] = id++;
    }
    res.redirect('/admin/home');
});

router.get('/displayNotes', authenticateAdmin, (req, res) => {
    res.render('adminDisplayNotes', {notes});
})

router.get('/editNote/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i]['id'] === Number(id)) {
            return res.render('adminEditNote', { note: notes[i] });
        }
    }
    res.send('notes id not found');
});

router.post('/editNote/:id', authenticateAdmin, (req, res) => {
    const { title, content } = req.body;
    const { id } = req.params;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i]['id'] === Number(id)) {
            notes[i]['title'] = title;
            notes[i]['content'] = content;

            return res.redirect('/admin/displayNotes');
        }
    }
    res.send('note id not found');
});




router.get('/deleteNote/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    // Find the note index
    const noteIndex = notes.findIndex(note => note.id === Number(id));

    // If the note is found, remove it
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        res.redirect('/admin/displayNotes');
    } else {
        res.status(404).send('Note not found');
    }
});


// Route to handle admin logout
router.get('/logout', authenticateAdmin, (req, res) => {
    // Destroy session and redirect to login page
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).send('Something went wrong while logging out.');
        }
        res.redirect('/admin/login');
    });
});

module.exports = router;