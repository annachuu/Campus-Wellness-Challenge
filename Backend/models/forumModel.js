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
        enum: ['Participant', 'Coordinator']
    },
    userName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Challenge'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('ForumPost', forumPostSchema)