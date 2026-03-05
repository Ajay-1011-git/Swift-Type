export { auth, db } from './config';
export { signUp, signIn, logOut, onAuthChange } from './auth';
export {
    createUserProfile,
    getUserProfile,
    saveTypingTest,
    updateUserStats,
    incrementTestsStarted,
    getUserTests,
    getUserTestsByDuration,
    type UserProfile,
    type TypingTestResult,
} from './firestore';
