// components/lab/LabContainer.tsx
import { useRef, useEffect, useState } from 'react';

interface LabContainerProps {
  labUrl: string;
  labName: string;
  onSessionSave?: (data: any) => void;
}

export const LabContainer: React.FC<LabContainerProps> = ({ 
  labUrl, 
  labName, 
  onSessionSave 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, [labUrl]);

  // Auto-save session data periodically
  useEffect(() => {
    if (!onSessionSave) return;

    const interval = setInterval(() => {
      try {
        const sessionData = {
          timestamp: Date.now(),
          url: labUrl,
          labName: labName
        };
        onSessionSave(sessionData);
      } catch (error) {
        console.error('Failed to save session:', error);
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [labUrl, labName, onSessionSave]);

  if (hasError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Lab</h3>
          <p className="text-gray-600 mb-4">The lab content could not be loaded. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-super text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            Refresh Lab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-super"></div>
            <p className="mt-2 text-sm text-gray-600">Loading {labName}...</p>
          </div>
        </div>
      )}
      
      <iframe 
        ref={iframeRef}
        src={labUrl}
        title={labName}
        sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        width="100%" 
        height="100%"
        loading="eager"
        className="border-0 rounded-lg"
        style={{ colorScheme: 'normal' }}
      />
    </div>
  );
};
