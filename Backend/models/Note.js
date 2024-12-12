const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    notes : [
        {
            title: { type: String, required: true },
            content: {type: String}
        }
    ]
})

module.exports = mongoose.model('Notes', noteSchema);

