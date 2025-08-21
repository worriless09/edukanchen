// components/ui/LoadingSpinner.tsx
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-super"></div>
    </div>
  );
};