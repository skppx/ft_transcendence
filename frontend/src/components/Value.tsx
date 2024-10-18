import { ReactNode } from 'react';

interface ValueProps {
  children: ReactNode;
}

export function Value({ children }: ValueProps) {
  return <p className="text-xs font-bold text-pong-white">{children}</p>;
}
