const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentEmail: { type: String, required :true, unique : true},
    studentPassword: { type: String, required : true}
});

module.exports = mongoose.model('Student', studentSchema);
