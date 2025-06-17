const mongoose = require('mongoose')

const achievementSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    points: {
        type: Number,
        required: [true, 'Please add points']
    },
    refreshTime: {
        type: String,
        required: [true, 'Please add refresh time'],
        enum: ['daily', 'weekly', 'monthly']
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Challenge'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Coordinator'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Achievement', achievementSchema) 