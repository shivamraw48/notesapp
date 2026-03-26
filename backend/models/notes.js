const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const noteschema=new Schema({
    text :{
        type : String,
        required : true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: {
        type: [String],
        default: []
    }
}, { timestamps: true });
const Note = mongoose.model('Note', noteschema);
module.exports = Note;