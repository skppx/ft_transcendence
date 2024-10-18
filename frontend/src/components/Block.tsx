interface BlockProps {
  children: React.ReactNode;
}

export function Block({ children }: BlockProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      {children}
    </div>
  );
}
