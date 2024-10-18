import { useParams } from 'react-router-dom';
import { useJwtContext } from '../contexts/jwt';

export function CenterBlock() {
  const { decodedToken } = useJwtContext();
  const { username } = useParams();
  return (
    <div className="flex items-center justify-center gap-3 ">
      <p className="text-xs font-bold text-pong-white md:text-xl">
        {!username ? decodedToken.username : username}
      </p>
    </div>
  );
}
