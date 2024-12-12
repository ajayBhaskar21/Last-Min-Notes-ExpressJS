const express = require('express');
const router = express.Router()
const Student = require('../models/Student');
const Note = require('../models/Note');


const authenticateStudent = (req, res, next) => {
    if (req.session && req.session.studentEmail) {
        next();
    }
    else {
        res.redirect('/student/login');
    }
} 

router.get('/signup', (req, res) => {
    res.render('studentSignUp');
})

router.post('/signup', async (req, res) => {
    const { studentEmail, studentPassword } = req.body;
    let isEmailExists = await Student.findOne({ studentEmail: studentEmail });
    
    if (isEmailExists) {
        console.log('email is already taken!!');
        return res.redirect('signup');
    }

    let newStudent = new Student(req.body);
    await newStudent.save();
    return res.redirect('login');

})

router.get('/login', (req, res) => {

    if (req.session && req.session.studentEmail) {
        return res.redirect('/student/home');
    }
    res.render('studentLogin');
})

router.post('/login', async (req, res) => {
    const { studentEmail, studentPassword } = req.body;

    const isValidStudent = await Student.findOne({ studentEmail: studentEmail, studentPassword: studentPassword });
    if (isValidStudent) {
        req.session.studentEmail = studentEmail;
        return res.redirect('home');
    }

    console.log('invalid student credentials');
    res.redirect('login')
})

router.get('/home', authenticateStudent, (req, res) => {
    res.render('studentHome');
})

router.get('/displayNotes', authenticateStudent, async (req, res) => {
    try {
        const allNotes = await Note.find();
        res.render('studentDisplayNotes', { notes: allNotes});
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).send('Failed to fetch notes');
    }
})

router.get('/searchNotes', authenticateStudent, async (req, res) => {
    res.render('studentSearchNotes', { notes : []});
});

router.post('/searchNotes', authenticateStudent, async (req, res) => {
    const { title } = req.body;
    
    try {
        const allNotes = await Note.find();
        let notes = [];
        
        // Flatten all notes into a single array
        allNotes.forEach((obj) => {
            obj.notes.forEach((note) => {
                notes.push({
                    title: note.title,
                    content: note.content
                });
            });
        });
        
        // Filter notes that include the search term in their title
        notes = notes.filter(note => note.title.toLowerCase().includes(title.toLowerCase()));
        
        console.log('Filtered notes:', notes);
        res.render('studentSearchNotes', { notes: notes });
    } catch (err) {
        console.error('Error while searching notes:', err);
        res.status(500).send('Error occurred while searching notes');
    }
});



router.get('/logout', authenticateStudent, (req, res) => {
    // remove the session variable from the session obj
    delete req.session.studentEmail;
    res.redirect('login');
})


module.exports = router;

