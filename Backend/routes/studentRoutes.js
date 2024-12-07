const express = require('express');
const router = express.Router()
const Student = require('../models/Student');

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

const students = [];

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


router.get('/logout', authenticateStudent, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).send('Something went wrong while logging out.');
        }
        res.redirect('login');
    })
})


module.exports = router;

