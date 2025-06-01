import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface DismissedNudgesContextType {
  dismissedNudges: string[];
  dismissNudge: (id: string) => void;
}

const DismissedNudgesContext = createContext<DismissedNudgesContextType | undefined>(undefined);

export const DismissedNudgesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dismissedNudges, setDismissedNudges] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('dismissedNudges');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dismissedNudges', JSON.stringify(dismissedNudges));
  }, [dismissedNudges]);

  const dismissNudge = useCallback((id: string) => {
    setDismissedNudges(ids => {
      if (ids.includes(id)) return ids;
      const updated = [...ids, id];
      localStorage.setItem('dismissedNudges', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <DismissedNudgesContext.Provider value={{ dismissedNudges, dismissNudge }}>
      {children}
    </DismissedNudgesContext.Provider>
  );
};

export function useDismissedNudges() {
  const ctx = useContext(DismissedNudgesContext);
  if (!ctx) throw new Error('useDismissedNudges must be used within a DismissedNudgesProvider');
  return [ctx.dismissedNudges, ctx.dismissNudge] as const;
} 