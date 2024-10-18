interface BackgroundProps {
  children?: React.ReactNode;
}

export function Background({ children }: BackgroundProps) {
  return <div className="bg-default bg-cover pt-10 ">{children}</div>;
}
