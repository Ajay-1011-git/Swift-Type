# SwiftType

A beautiful, high-performance, and minimalist typing speed test application inspired by Monkeytype. SwiftType helps you measure, track, and improve your typing speed and accuracy in a distraction-free environment.

## ✨ Features

- **Real-time Typing Metrics**: Instantly track your WPM (Words Per Minute), Raw WPM, Accuracy, and Consistency as you type.
- **Multiple Test Modes**:
  - ⏱️ **Time Mode**: Test your speed in 15, 30, 60, or 120-second intervals.
  - 📝 **Word Mode**: Test your speed by typing 10, 25, 50, or 100 words.
- **Detailed Post-test Analysis**: View a comprehensive breakdown of your performance, including correct, incorrect, extra, and missed keystrokes.
- **Performance History Graphs**: Visualize your typing speed and errors over the duration of the test.
- **User Accounts & Tracking**: Create an account to save your tests, view your past performance, and track your personal bests over time.
- **Global Leaderboards**: Compare your typing speed with other SwiftType users.
- **Beautiful UI**: A modern, dark-themed interface built with Tailwind CSS, featuring smooth animations and a premium look and feel.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Backend/Database**: [Firebase (Auth & Firestore)](https://firebase.google.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/swifttype.git
   cd swifttype
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase configuration:**
   - Create a project on the [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password) and Firestore Database.
   - Copy your Firebase configuration.
   - Create a `.env` file in the root directory based on `.env.example` (or use the following format):
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser** and visit `http://localhost:5173`.

## 📈 Firestore Database Rules

To ensure your application can read/write data properly, apply these basic security rules in your Firebase Firestore console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Users can read/write their own typing tests
    match /typingTests/{testId} {
      allow create: if request.auth != null && request.data.userId == request.auth.uid;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    // Anyone can read top scores for leaderboards
    match /leaderboard/{entryId} {
      allow read: if true;
    }
  }
}
```

## 🤝 Contributing

Contributions are welcome! If you have an idea for a new feature or have found a bug, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
