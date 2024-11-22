export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
        {children}
      </div>
    );
  }