const mongoose = require('mongoose')

const achievementClaimSchema = mongoose.Schema({
    achievement: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Achievement'
    },
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Participant'
    },
    lastClaimed: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
})

// Create a compound index to ensure one claim per achievement per participant
achievementClaimSchema.index({ achievement: 1, participant: 1 }, { unique: true })

module.exports = mongoose.model('AchievementClaim', achievementClaimSchema) 