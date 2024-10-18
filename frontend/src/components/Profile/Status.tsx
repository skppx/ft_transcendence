import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useJwtContext } from '../../contexts/jwt';

export function Status() {
  const { socket } = useSocketContext();
  const [color, setColor] = useState('bg-red-500');
  const { username: paramName } = useParams();
  const { decodedToken } = useJwtContext();

  useEffect(() => {
    const onConnect = () => {
      if (!paramName) {
        setColor('bg-green-300');
      }
    };

    const onDisconnect = () => {
      if (!paramName) {
        setColor('bg-red-500');
      }
    };

    const onUserConnected = ({
      username
    }: {
      userID: string;
      username: string;
    }) => {
      if (username === paramName) {
        setColor('bg-green-300');
      }
    };

    const onUserDisconnected = ({
      username
    }: {
      userID: string;
      username: string;
    }) => {
      if (username === paramName) {
        setColor('bg-red-500');
      }
    };

    const onGameStartStatus = ({ username }: { username: string }) => {
      if (username === paramName) {
        setColor('bg-yellow-500');
      }
    };

    const onGameOverStatus = ({ username }: { username: string }) => {
      if (username === paramName) {
        setColor('bg-green-300');
      }
    };

    const onIsConnected = (isConnected: boolean) => {
      if (isConnected) {
        setColor('bg-green-300');
      } else {
        setColor('bg-red-500');
      }
    };

    if (paramName) {
      socket.emit('isConnected', {
        username: paramName
      });
    }

    socket.on('isConnected', onIsConnected);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('userConnected', onUserConnected);
    socket.on('userDisconnected', onUserDisconnected);
    socket.on('gameStartStatus', onGameStartStatus);
    socket.on('gameOverStatus', onGameOverStatus);
    return () => {
      socket.off('isConnected', onIsConnected);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('userConnected', onUserConnected);
      socket.off('userDisconnected', onUserDisconnected);
      socket.off('gameStartStatus', onGameStartStatus);
      socket.off('gameOverStatus', onGameOverStatus);
    };
  }, [decodedToken, socket, paramName]);
  return (
    <div className="flex flex-row items-center gap-5">
      <span className={`h-4 w-4 rounded-full ${color}`} />
    </div>
  );
}
