// 9. Labs Provider for State Management
// providers/LabsProvider.tsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface Lab {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  category: string;
  isPremium: boolean;
  estimatedTime: string;
}

interface LabsContextType {
  labs: Lab[];
  userProgress: Record<string, number>;
  refreshLabs: () => Promise<void>;
  updateProgress: (labId: string, progress: number) => void;
}

const LabsContext = createContext<LabsContextType | undefined>(undefined);

export const LabsProvider = ({ children }: { children: React.ReactNode }) => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  const refreshLabs = async () => {
    try {
      const response = await fetch('/api/labs/public');
      const data = await response.json();
      setLabs(data.labs || []);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  };

  const updateProgress = (labId: string, progress: number) => {
    setUserProgress(prev => ({
      ...prev,
      [labId]: progress
    }));
  };

  useEffect(() => {
    refreshLabs();
  }, []);

  return (
    <LabsContext.Provider value={{ labs, userProgress, refreshLabs, updateProgress }}>
      {children}
    </LabsContext.Provider>
  );
};

export const useLabs = () => {
  const context = useContext(LabsContext);
  if (!context) {
    throw new Error('useLabs must be used within LabsProvider');
  }
  return context;
};