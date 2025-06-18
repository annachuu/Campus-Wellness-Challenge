import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import challengeReducer from '../features/challenges/challengeSlice'
import participantReducer from '../features/participants/participantSlice'
import leaderboardReducer from '../features/leaderboard/leaderboardSlice'
import participantChallengesReducer from '../features/participantChallenges/participantChallengesSlice'
import resourceReducer from '../features/resources/resourceSlice'
import achievementReducer from '../features/achievements/achievementSlice'
import achievementClaimReducer from '../features/achievements/achievementClaimSlice'
import forumReducer from '../features/forum/forumSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    challenge: challengeReducer,
    participants: participantReducer,
    leaderboard: leaderboardReducer,
    participantChallenges: participantChallengesReducer,
    resources: resourceReducer,
    achievements: achievementReducer,
    achievementClaims: achievementClaimReducer,
    forum: forumReducer
  },
});
