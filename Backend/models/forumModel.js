const mongoose = require('mongoose')

const forumPostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userRole'
    },
    userRole: {
        type: String,
        required: true,
        enum:['Participant', 'Coordinator']
    },
    userName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Participant'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('ForumPost', forumPostSchema)