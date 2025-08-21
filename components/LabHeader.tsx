// components/LabHeader.tsx
interface LabHeaderProps {
  labName?: string;
  onBackClick?: () => void;
}

const LabHeader: React.FC<LabHeaderProps> = ({ labName, onBackClick }) => {
  return (
    <div className="flex h-10 justify-between items-center px-4 py-2 border-b border-gray-200">
      <button 
        onClick={onBackClick} 
        className="text-sm hover:text-blue-600 transition-colors"
      >
        <div className="flex items-center gap-2 font-mono text-foreground">
          <KanchenLogo className="w-5 h-5" />
          <span>Made with Kanchen Academy</span>
        </div>
      </button>
      <div className="flex items-center gap-2">
        <UserProfileMenu />
        <ThemeToggle />
      </div>
    </div>
  );
};