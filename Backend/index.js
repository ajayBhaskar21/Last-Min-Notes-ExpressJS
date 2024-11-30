const express = require('express');
const app = express()


const adminRoutes = require('./routes/adminRoutes');



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})




