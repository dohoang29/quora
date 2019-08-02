var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var notiSchema = mongoose.Schema({
    questionId: {
        type: ObjectId,
        ref: 'Question'
    },
    creationDate: {
        type: 'Date',
        default: Date.now
    }
});
module.exports = mongoose.model('Notifi', notiSchema);