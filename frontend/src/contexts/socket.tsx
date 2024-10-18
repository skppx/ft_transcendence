import React, { createContext, useContext, useMemo } from 'react';
import { PongSocket } from '../utils/hooks/useStatus.interfaces';
import { socket } from '../utils/functions/socket';
import { JwtContextProvider } from './jwt';

const SocketContext = createContext<{
  socket: PongSocket;
} | null>(null);

interface SocketContextProviderProps {
  children: React.ReactNode;
}

export function SocketContextProvider({
  children
}: SocketContextProviderProps) {
  const socketProviderValue = useMemo(() => ({ socket }), []);
  return (
    <JwtContextProvider>
      <SocketContext.Provider value={socketProviderValue}>
        {children}
      </SocketContext.Provider>
    </JwtContextProvider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      'useSocketContext must be used within a SocketContextProvider'
    );
  }
  return context;
}
