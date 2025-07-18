import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isProUser } from '../services/subscriptionService';

export const usePaywall = () => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  // Check subscription status when user changes
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsPro(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const proStatus = await isProUser(user.uid);
        setIsPro(proStatus);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setIsPro(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  // Function to trigger paywall for specific features
  const requirePro = (featureName: string) => {
    if (!isPro) {
      console.log(`Pro feature "${featureName}" requires subscription`);
      setShowPaywall(true);
      return false;
    }
    return true;
  };

  // Function to check if user can access a feature
  const canAccessFeature = (featureName: string): boolean => {
    if (loading) return false;
    if (!user) return false;
    if (isPro) return true;
    
    // For free users, you can define which features are available
    const freeFeatures = [
      'basic_chat',
      'simple_questions',
      'basic_file_upload'
    ];
    
    return freeFeatures.includes(featureName);
  };

  return {
    isPro,
    loading,
    showPaywall,
    setShowPaywall,
    requirePro,
    canAccessFeature
  };
}; 