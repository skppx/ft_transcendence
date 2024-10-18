import { CONST_BACKEND_URL } from '@constant';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useJwtContext } from '../../contexts/jwt';

function MatchHistory() {
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { jwt, decodedToken } = useJwtContext();

  function formatUtcPlus1Date(timestamp: Date) {
    const date = new Date(timestamp);
    date.setHours(date.getHours());
    const formattedDate = `
${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}
    ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  }
  const { username } = useParams();

  useEffect(() => {
    const url = `${CONST_BACKEND_URL}/user/match-history/${
      !username ? decodedToken.username : username
    }`;

    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt!}` }
    };
    axios
      .get(url, config)
      .then((data: any) => {
        setMatchHistory(data.data);
        setLoading(false);
      })
      .catch(() => {});
  }, [username, jwt, decodedToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <table className="w-full rounded-xl bg-pong-blue-400 p-10 text-left">
        <thead className="flex w-full items-center justify-center rounded-t-xl bg-pong-blue-500 text-white">
          <tr className="flex w-full items-center justify-center rounded-t-xl bg-pong-blue-500 text-white">
            <th className="w-1/5 p-2">Player</th>
            <th className="w-1/5 p-2">Status</th>
            <th className="w-1/5 p-2">Mode</th>
            <th className="w-1/5 p-2">Score</th>
            <th className="w-1/5 p-2">Date</th>
          </tr>
        </thead>
        <tbody className="no-scrollbar flex h-80 w-full flex-col items-center justify-between overflow-y-scroll ">
          {matchHistory.map((match: any) => {
            const winOrLoose = () => {
              const name = !username ? decodedToken.username : username;
              if (name === match.playerWin) {
                return 'win';
              }
              return 'loose';
            };

            return (
              <tr
                key={match.id}
                className="mb-3 flex w-full border-b border-b-pong-blue-500 text-pong-white"
              >
                <td className="w-1/5 p-2">
                  {`${match.playerWin} vs ${match.playerLoose}`}
                </td>
                <td className="w-1/5 p-2">{winOrLoose()}</td>
                <td className="w-1/5 p-2">{match.mode}</td>
                <td className="w-1/5 p-2">
                  {`${match.winnerScore}/${match.looserScore}`}
                </td>
                <td className="w-1/5 p-2">
                  {formatUtcPlus1Date(match.timestamp)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MatchHistory;
