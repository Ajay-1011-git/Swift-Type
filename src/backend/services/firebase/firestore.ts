import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp,
    increment,
    Timestamp,
} from 'firebase/firestore';
import { db } from './config';

export interface UserProfile {
    email: string;
    createdAt: Timestamp;
    displayName: string;
    testsCompleted: number;
    testsStarted: number;
    totalTypingTime: number;
    bestWPM: number;
    averageWPM: number;
    bestAccuracy: number;
}

export interface TypingTestResult {
    userId: string;
    timestamp: Timestamp;
    mode: 'time' | 'words' | 'custom';
    duration: number;
    wordCount: number;
    wpm: number;
    rawWpm: number;
    accuracy: number;
    errors: number;
    correctChars: number;
    incorrectChars: number;
    extraChars: number;
    missedChars: number;
    consistency: number;
    wpmHistory: number[];
    errorHistory: number[];
}

export const createUserProfile = async (uid: string, email: string, displayName: string) => {
    const userRef = doc(db, 'users', uid);
    const profile: UserProfile = {
        email,
        createdAt: Timestamp.now(),
        displayName,
        testsCompleted: 0,
        testsStarted: 0,
        totalTypingTime: 0,
        bestWPM: 0,
        averageWPM: 0,
        bestAccuracy: 0,
    };
    await setDoc(userRef, profile);
    return profile;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
};

export const saveTypingTest = async (testResult: Omit<TypingTestResult, 'timestamp'>) => {
    const testWithTimestamp = {
        ...testResult,
        timestamp: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'typingTests'), testWithTimestamp);
    return docRef.id;
};

export const updateUserStats = async (
    uid: string,
    wpm: number,
    accuracy: number,
    duration: number
) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data() as UserProfile;
    const newTestsCompleted = userData.testsCompleted + 1;
    const newAverageWPM =
        (userData.averageWPM * userData.testsCompleted + wpm) / newTestsCompleted;

    const updates: Record<string, unknown> = {
        testsCompleted: increment(1),
        totalTypingTime: increment(duration),
        averageWPM: Math.round(newAverageWPM * 100) / 100,
    };

    if (wpm > userData.bestWPM) {
        updates.bestWPM = wpm;
    }
    if (accuracy > userData.bestAccuracy) {
        updates.bestAccuracy = accuracy;
    }

    await updateDoc(userRef, updates);
};

export const incrementTestsStarted = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { testsStarted: increment(1) });
};

export const getUserTests = async (uid: string, limitCount = 50) => {
    const q = query(
        collection(db, 'typingTests'),
        where('userId', '==', uid),
        orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    const tests: (TypingTestResult & { id: string })[] = [];
    let count = 0;
    snapshot.forEach((doc) => {
        if (count < limitCount) {
            tests.push({ id: doc.id, ...doc.data() } as TypingTestResult & { id: string });
            count++;
        }
    });
    return tests;
};

export const getUserTestsByDuration = async (uid: string, duration: number) => {
    const q = query(
        collection(db, 'typingTests'),
        where('userId', '==', uid),
        where('duration', '==', duration)
    );
    const snapshot = await getDocs(q);
    const tests: TypingTestResult[] = [];
    snapshot.forEach((doc) => {
        tests.push(doc.data() as TypingTestResult);
    });
    return tests;
};
