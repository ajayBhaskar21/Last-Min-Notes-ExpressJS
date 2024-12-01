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

    if (adminUsername == 'admin' && adminPassword == 'admin') {
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