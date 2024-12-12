const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const mongoose = require('mongoose');
require('dotenv').config();



const app = express()

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {secure : false} // Set secure: true if using HTTPS
    })
)

// routes
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);

// db connection
const connectionUrl = process.env.CONN_URL;
mongoose.connect(connectionUrl)
    .then(() => console.log('mongodb connected'))
    .catch((e) => console.log(e));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})




