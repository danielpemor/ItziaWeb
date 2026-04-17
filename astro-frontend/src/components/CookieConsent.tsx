import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div
            className="max-w-2xl mx-auto rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xl"
            style={{
              background: '#0f2d38',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                This website uses essential cookies and third-party cookies from
                Calendly for appointment booking. No advertising or tracking
                cookies are used.{' '}
                <a
                  href="/privacy"
                  className="underline underline-offset-2 transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={decline}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-colors duration-200"
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="px-5 py-2 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #1D4E5F, #2a6b82)',
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}