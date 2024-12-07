const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const mongoose = require('mongoose');


const app = express()

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: 'hfdjsujdlkak',
        resave: false,
        saveUninitialized: true,
        cookie: {secure : false} // Set secure: true if using HTTPS
    })
)

// routes
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);

// db connection
mongoose.connect('mongodb://localhost:27017/LastMinNotes')
    .then(() => console.log('mongodb connected'))
    .catch((e) => console.log(e));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})




