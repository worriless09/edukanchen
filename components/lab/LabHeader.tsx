// components/lab/LabHeader.tsx
import Link from 'next/link';
import { ArrowLeft, Settings, Share2 } from 'lucide-react';

interface LabHeaderProps {
  labName?: string;
  onBackClick?: () => void;
  showSettings?: boolean;
  showShare?: boolean;
}

export const LabHeader: React.FC<LabHeaderProps> = ({ 
  labName, 
  onBackClick, 
  showSettings = false, 
  showShare = false 
}) => {
  return (
    <div className="flex min-h-10 justify-between items-center px-4">
      <button 
        onClick={onBackClick}
        className="group flex items-center gap-2 hover:text-super transition-colors"
      >
        <Link href="https://kanchen.vercel.app" target="_blank">
          <div className="flex items-center gap-2 font-mono text-sm text-foreground">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              {/* Kanchen Academy Logo - Education/Learning Icon */}
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9.95 5.16-.21 9-4.4 9-9.95V7l-10-5zM12 4.2L19 8v9c0 4.64-3.36 8.74-7 8.95V4.2z"/>
              <path d="M12 6L6 9v6c0 2.77 1.79 5.14 4 5.83V9l2-1 2 1v11.83c2.21-.69 4-3.06 4-5.83V9l-6-3z"/>
            </svg>
            <span>Made with Kanchen Academy</span>
          </div>
        </Link>
      </button>
      
      <div className="flex items-center gap-2">
        {showShare && (
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
        )}
        {showSettings && (
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-foreground" />
          </button>
        )}
      </div>
    </div>
  );
};
