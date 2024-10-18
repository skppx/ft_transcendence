import { useParams } from 'react-router-dom';
import { CONST_BACKEND_URL } from '@constant';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { Block } from './Block';
import { Separator } from './Separator';
import { Title } from './Title';
import { Value } from './Value';
import { useJwtContext } from '../contexts/jwt';

interface GameStats {
  nbWin: number;
  nbLoose: number;
}

export function LeftBlock() {
  const [gameStats, setGameStats] = useState<GameStats>({
    nbWin: 0,
    nbLoose: 0
  });
  const { jwt, decodedToken } = useJwtContext();
  const { username } = useParams();

  useEffect(() => {
    const url = `${CONST_BACKEND_URL}/user/game-stats/${
      !username ? decodedToken.username : username
    }`;

    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt!}` }
    };
    axios
      .get(url, config)
      .then((response: any) => {
        setGameStats(response.data);
      })
      .catch(() => {});
  }, [username, jwt, decodedToken]);

  const totalGames = gameStats.nbWin + gameStats.nbLoose;
  const winRatio = totalGames
    ? `${((gameStats.nbWin / totalGames) * 100).toFixed(0)}%`
    : '0%';
  const lossRatio = totalGames
    ? `${((gameStats.nbLoose / totalGames) * 100).toFixed(0)}%`
    : '0%';

  return (
    <div className="flex flex-row items-center justify-start gap-3">
      <Block>
        <Title>Total Game</Title>
        <Value>{gameStats.nbWin + gameStats.nbLoose}</Value>
      </Block>
      <Separator />
      <Block>
        <Title>Win</Title>
        <Value>{winRatio}</Value>
      </Block>
      <Separator />
      <Block>
        <Title>Loss</Title>
        <Value>{lossRatio}</Value>
      </Block>
    </div>
  );
}
