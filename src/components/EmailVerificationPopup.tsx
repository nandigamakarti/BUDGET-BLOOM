import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface EmailVerificationPopupProps {
  email: string;
  onClose: () => void;
}

const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({ email, onClose }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { checkEmailVerification, isEmailVerified } = useAuth();

  // Check verification status periodically
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        setIsChecking(true);
        
        // Use the AuthContext method to check verification
        const verified = await checkEmailVerification();
        
        if (verified) {
          setIsVerified(true);
          // Wait a moment to show success message before redirecting
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (err) {
        console.error('Error checking verification status:', err);
        setError('Failed to check verification status. Please try again.');
      } finally {
        setIsChecking(false);
      }
    };

    // Check immediately on mount
    checkVerificationStatus();
    
    // Then check every 5 seconds
    const interval = setInterval(checkVerificationStatus, 5000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const verified = await checkEmailVerification();
      
      if (verified) {
        setIsVerified(true);
        // Wait a moment to show success message before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Your email is not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (err) {
      console.error('Error during manual verification check:', err);
      setError('Failed to check verification status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      // Show success message
      setError('Verification email resent successfully!');
    } catch (err: any) {
      console.error('Error resending verification email:', err);
      setError(err.message || 'Failed to resend verification email');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <div className="absolute top-3 right-3">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
        
        <div className="text-center mb-6">
          {isVerified ? (
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-2" />
          ) : (
            <Mail className="w-16 h-16 mx-auto text-[#87a96b] mb-2" />
          )}
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isVerified ? 'Email Verified!' : 'Verify Your Email'}
          </h2>
          
          {!isVerified && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              We've sent a verification email to <span className="font-semibold">{email}</span>
            </p>
          )}
        </div>
        
        {!isVerified && (
          <>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Next steps:</h3>
              <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Check your email inbox</li>
                <li>Click the verification link in the email</li>
                <li>You'll be automatically redirected to your dashboard</li>
              </ol>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleManualCheck}
                disabled={isChecking}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#87a96b] hover:bg-[#87a96b]/90 text-white rounded-lg transition-all duration-300 disabled:opacity-70"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    I've verified my email
                  </>
                )}
              </button>
              
              <button
                onClick={handleResendEmail}
                className="text-[#87a96b] hover:text-[#87a96b]/80 text-sm font-medium"
              >
                Resend verification email
              </button>
            </div>
          </>
        )}
        
        {isVerified && (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Redirecting you to your dashboard...
          </p>
        )}
        
        {error && (
          <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${error.includes('success') ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
            {error.includes('success') ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPopup;
