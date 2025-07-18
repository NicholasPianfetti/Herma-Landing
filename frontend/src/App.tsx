import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { usePaywall } from "./hooks/usePaywall";
import Home from "./components/Home.tsx";
import Login from "./components/Login";
import Paywall from "./components/Paywall";
import StandaloneUpdateManager from "./components/UI/StandaloneUpdateManager.tsx";
import "./App.css";
import './styles/Sidebar.css';
import './styles/Chat.css';
import './styles/Input.css';
import './styles/UI.css';

// Main app content with authentication and paywall logic
function AppContent() {
  const { user, loading } = useAuth();
  const { showPaywall, setShowPaywall } = usePaywall();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      {/* Standalone Update Manager - renders independently of routes */}
      <StandaloneUpdateManager />

      {/* Paywall overlay */}
      {showPaywall && (
        <Paywall
          onUpgrade={() => setShowPaywall(false)}
          onContinue={() => setShowPaywall(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}

export default App; 