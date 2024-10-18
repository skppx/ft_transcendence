import { useMachine } from '@xstate/react';
import { ReactNode, createContext, useContext, useMemo } from 'react';
import { pongInviteMachine } from '../machines/pongInviteMachine';

interface PongInviteState {
  isChoosingMode: boolean;
  isClassicModeWaitingRoom: boolean;
  isSpeedModeWaitingRoom: boolean;
  isClassicModePartyLobby: boolean;
  isClassicReady: boolean;
  isClassicNotReady: boolean;
  isSpeedReady: boolean;
  isSpeedNotReady: boolean;
  isClassicMatchMode: boolean;
  isClassicMatchModeEnd: boolean;
  isSpeedModePartyLobby: boolean;
  isSpeedModeMatch: boolean;
  isSpeedModeMatchEnd: boolean;
  CLASSIC_MODE: () => void;
  JOIN_PARTY_LOBBY: () => void;
  SET_READY: () => void;
  SET_NOTREADY: () => void;
  START_MATCH: () => void;
  END_MATCH: () => void;
  CHANGE_MODE: () => void;
  PLAY_AGAIN: () => void;
  SPEED_MODE: () => void;
  send: (arg: any) => void;
}

const PongInviteStateContext = createContext<PongInviteState | null>(null);

interface PongInviteStateContextProviderProps {
  children: ReactNode;
}

export function PongInviteStateContextProvider({
  children
}: PongInviteStateContextProviderProps) {
  const [state, send] = useMachine(pongInviteMachine);

  // console.log('here is the state: ', state.value);

  const stateProviderValue = useMemo(
    (): PongInviteState => ({
      isChoosingMode: state.matches('Choosing Mode'),
      isClassicModeWaitingRoom: state.matches('Classic Mode Waiting Room'),
      isSpeedModeWaitingRoom: state.matches('Speed Mode Waiting Room'),
      isClassicModePartyLobby: state.matches({
        'Classic Mode Party Lobby': 'Classic Mode Party Lobby'
      }),
      isClassicReady: state.matches({ 'Classic Mode Party Lobby': 'Ready' }),
      isClassicNotReady: state.matches({
        'Classic Mode Party Lobby': 'Not Ready'
      }),
      isSpeedReady: state.matches({ 'Speed Mode Party Lobby': 'Ready' }),
      isSpeedNotReady: state.matches({ 'Speed Mode Party Lobby': 'Not Ready' }),
      isClassicMatchMode: state.matches({
        'Classic Mode Party Lobby': 'Classic Mode Match'
      }),
      isClassicMatchModeEnd: state.matches({
        'Classic Mode Party Lobby': 'Classic Mode Match End'
      }),
      isSpeedModePartyLobby: state.matches('Speed Mode Party Lobby'),
      isSpeedModeMatch: state.matches({
        'Speed Mode Party Lobby': 'Speed Mode Match'
      }),
      isSpeedModeMatchEnd: state.matches({
        'Speed Mode Party Lobby': 'Speed Mode Match End'
      }),
      CLASSIC_MODE: () => send('CLASSIC_MODE'),
      JOIN_PARTY_LOBBY: () => send('JOIN_PARTY_LOBBY'),
      SET_READY: () => send('SET_READY'),
      SET_NOTREADY: () => send('SET_NOTREADY'),
      START_MATCH: () => send('START_MATCH'),
      END_MATCH: () => send('END_MATCH'),
      CHANGE_MODE: () => send('CHANGE_MODE'),
      PLAY_AGAIN: () => send('PLAY_AGAIN'),
      SPEED_MODE: () => send('SPEED_MODE'),
      send: (arg: any) => send(arg)
    }),
    [state, send]
  );
  return (
    <PongInviteStateContext.Provider value={stateProviderValue}>
      {children}
    </PongInviteStateContext.Provider>
  );
}

export function useInvitePongStateContext() {
  const context = useContext(PongInviteStateContext);
  if (!context) {
    throw new Error(
      'useInvitePongStateContext must be used within a PongInviteStateContextProvider'
    );
  }
  return context;
}
