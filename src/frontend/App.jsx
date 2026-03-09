import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUserStore } from "@/backend/store/userStore";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import About from "./pages/About/About";
function ProtectedRoute({ children }) {
  const { user, loading } = useUserStore();
  if (loading) {
    return <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#646669]">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" />
          </svg>
          Loading...
        </div>
      </div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
function App() {
  const { initialize } = useUserStore();
  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);
  return <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#323437]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route
    path="/profile"
    element={<ProtectedRoute>
                <Profile />
              </ProtectedRoute>}
  />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>;
}
export {
  App as default
};
