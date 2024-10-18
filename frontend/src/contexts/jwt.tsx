import { createContext, useContext, useMemo } from 'react';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  username: string;
  email: string;
  iat: string;
  exp: string;
}

const getToken = () => {
  const jwt = localStorage.getItem('jwt');
  let decodedToken: DecodedToken = {
    username: '',
    email: '',
    iat: '',
    exp: ''
  };
  if (jwt) {
    decodedToken = jwt_decode(jwt);
  }
  return { jwt, decodedToken };
};

interface GetToken {
  jwt: string | null;
  decodedToken: DecodedToken;
}

const JwtContext = createContext<GetToken | null>(null);

interface JwtContextProviderProps {
  children: React.ReactNode;
}

export function JwtContextProvider({ children }: JwtContextProviderProps) {
  const jwtProviderValue = useMemo((): GetToken => getToken(), []);
  return (
    <JwtContext.Provider value={jwtProviderValue}>
      {children}
    </JwtContext.Provider>
  );
}

export function useJwtContext() {
  const context = useContext(JwtContext);
  if (!context) {
    throw new Error(
      'useJwtContext must be used within a SocketContextProvider'
    );
  }
  return context;
}
