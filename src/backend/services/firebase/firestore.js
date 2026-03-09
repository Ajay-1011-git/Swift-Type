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
































export const createUserProfile = async (uid, email, displayName) => {
    const userRef = doc(db, 'users', uid);
    const profile = {
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

export const getUserProfile = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};

export const saveTypingTest = async (testResult) => {
    const testWithTimestamp = {
        ...testResult,
        timestamp: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'typingTests'), testWithTimestamp);
    return docRef.id;
};

export const updateUserStats = async (
    uid,
    wpm,
    accuracy,
    duration
) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const newTestsCompleted = userData.testsCompleted + 1;
    const newAverageWPM =
        (userData.averageWPM * userData.testsCompleted + wpm) / newTestsCompleted;

    const updates = {
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

export const incrementTestsStarted = async (uid) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { testsStarted: increment(1) });
};

export const getUserTests = async (uid, limitCount = 50) => {
    const q = query(
        collection(db, 'typingTests'),
        where('userId', '==', uid)
    );
    const snapshot = await getDocs(q);
    const tests = [];
    snapshot.forEach((docSnap) => {
        tests.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort client-side (newest first) to avoid needing a Firestore composite index
    tests.sort((a, b) => {
        const aTime = a.timestamp?.toMillis?.() || 0;
        const bTime = b.timestamp?.toMillis?.() || 0;
        return bTime - aTime;
    });
    return tests.slice(0, limitCount);
};

export const getUserTestsByDuration = async (uid, duration) => {
    const q = query(
        collection(db, 'typingTests'),
        where('userId', '==', uid),
        where('duration', '==', duration)
    );
    const snapshot = await getDocs(q);
    const tests = [];
    snapshot.forEach((doc) => {
        tests.push(doc.data());
    });
    return tests;
};
