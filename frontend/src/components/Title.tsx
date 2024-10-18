interface TitleProps {
  children: React.ReactNode;
}

export function Title({ children }: TitleProps) {
  return <p className="text-xs font-bold text-pong-blue-100">{children}</p>;
}
