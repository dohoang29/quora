var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var notiSchema = mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    creationDate: {
        type: 'Date',
        default: Date.now
    },
    isRead: false,
});
module.exports = mongoose.model('Notifi', notiSchema);