import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PaywallProps {
  onUpgrade: () => void;
  onContinue: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ onUpgrade, onContinue }) => {
  const { user } = useAuth();

  const handleUpgrade = () => {
    // Open the landing page upgrade URL in default browser
    const upgradeUrl = 'https://hermaai.com/upgrade';
    window.open(upgradeUrl, '_blank');
    onUpgrade();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Upgrade to Herma Pro
          </h2>
          <p className="text-gray-600 mb-6">
            Unlock advanced AI features and take your productivity to the next level.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Advanced AI models</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Large document processing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Extended responses</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Priority support</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-semibold">
              Only $9.99/month
            </p>
            <p className="text-blue-600 text-sm">
              Cancel anytime • No commitment
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleUpgrade}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Upgrade Now
            </button>
            <button
              onClick={onContinue}
              className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-300"
            >
              Continue with Free Version
            </button>
          </div>

          {user && (
            <p className="text-xs text-gray-500 mt-4">
              Logged in as: {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paywall; 