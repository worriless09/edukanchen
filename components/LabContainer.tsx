// 2. Lab Container Component
// components/LabContainer.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LabContainerProps {
  labName: string;
  labId: string;
  children: React.ReactNode;
  onSessionSave?: (data: any) => void;
}

export const LabContainer: React.FC<LabContainerProps> = ({
  labName,
  labId,
  children,
  onSessionSave
}) => {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleBackClick = () => {
    router.push('/labs');
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex h-screen w-screen flex-col gap-2.5 p-2.5 bg-offset">
      {/* Header */}
      <div className="flex min-h-10 justify-between items-center px-4">
        <button 
          onClick={handleBackClick}
          className="text-sm hover:text-super transition-colors"
        >
          <div className="flex items-center gap-2 font-mono text-foreground">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.23 7.134h-2.307V2.775a.772.772 0 0 0-.441-.697.795.795 0 0 0-.82.102l-4.893 4.072V1.775c0-.42-.348-.77-.769-.77-.42 0-.77.35-.77.77v4.487L6.339 2.18a.751.751 0 0 0-.82-.102.772.772 0 0 0-.441.697v4.36H2.769A.774.774 0 0 0 2 7.903v8.205c0 .42.349.77.77.77h2.307v4.359c0 .297.174.574.44.697a.73.73 0 0 0 .33.072.802.802 0 0 0 .491-.175l4.893-4.071v4.487c0 .42.348.77.769.77.42 0 .77-.35.77-.77V17.76l4.892 4.071a.802.802 0 0 0 .492.175.73.73 0 0 0 .328-.072.772.772 0 0 0 .441-.697v-4.36h2.308c.42 0 .769-.348.769-.769V7.903a.775.775 0 0 0-.77-.769Z"/>
            </svg>
            <span>Made with Kanchen Academy</span>
          </div>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">{labName}</span>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Lab Content */}
      <div className="relative isolate grow overflow-hidden rounded-lg shadow-sm border border-gray-200">
        <div className="absolute inset-0 z-20 hidden mix-blend-screen dark:block dark:border border-borderMainDark bg-transparent"></div>
        <div className="h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
};