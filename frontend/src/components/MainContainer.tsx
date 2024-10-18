interface MainContainerProps {
  children: React.ReactNode;
}

export function MainContainer({ children }: MainContainerProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-start">
      {children}
    </div>
  );
}
