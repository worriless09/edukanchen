// 3. Lab Session Hook
// hooks/useLabSession.ts
import { useState, useEffect, useCallback } from 'react';

interface LabSessionData {
  labId: string;
  progress: number;
  data: any;
  timeSpent: number;
  lastSaved: string;
}

export const useLabSession = (labId: string) => {
  const [sessionData, setSessionData] = useState<LabSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  // Load existing session
  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`/api/labs/sessions?labId=${labId}`);
        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
        }
      } catch (error) {
        console.error('Error loading session:', error);
        // Fallback to localStorage
        const localData = localStorage.getItem(`lab_${labId}`);
        if (localData) {
          setSessionData(JSON.parse(localData));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
    
    // Track lab start
    trackEvent('lab_start');
    
    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (sessionData) {
        saveSession(sessionData);
      }
    }, 30000);

    return () => {
      clearInterval(autoSaveInterval);
      // Track lab end and total time spent
      const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
      trackEvent('lab_end', { timeSpent });
    };
  }, [labId]);

  const saveSession = useCallback(async (data: any) => {
    const sessionData = {
      labId,
      progress: data.progress || 0,
      data: data,
      timeSpent: Math.floor((Date.now() - startTime) / 1000 / 60),
      lastSaved: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/labs/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      
      if (response.ok) {
        setSessionData(sessionData);
      }
    } catch (error) {
      console.error('Error saving session:', error);
      // Fallback to localStorage
      localStorage.setItem(`lab_${labId}`, JSON.stringify(sessionData));
      setSessionData(sessionData);
    }
  }, [labId, startTime]);

  const trackEvent = useCallback(async (eventType: string, eventData: any = {}) => {
    try {
      await fetch('/api/labs/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labId,
          eventType,
          eventData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, [labId]);

  const updateProgress = useCallback((progress: number, additionalData: any = {}) => {
    const updatedData = {
      ...sessionData?.data,
      ...additionalData,
      progress
    };
    saveSession(updatedData);
  }, [sessionData, saveSession]);

  return {
    sessionData,
    isLoading,
    saveSession,
    trackEvent,
    updateProgress
  };
};