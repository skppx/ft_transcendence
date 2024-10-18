import { useNavigate } from 'react-router-dom';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

/* Change the date type format */
interface ChatMessageProps {
  message: string;
  time: string;
  username: string;
  noBgColor?: boolean;
  userID: string;
}

function ChatMessage({
  message,
  time,
  username,
  userID,
  noBgColor
}: ChatMessageProps) {
  const navigate = useNavigate();
  return (
    <div
      className={`${noBgColor ? '' : 'bg-pong-blue-400'}
        mx-2 my-1 flex flex-shrink-0 rounded-lg p-3 text-left `}
      role="presentation"
    >
      <ProfilePicture
        size="xs"
        userID={userID}
        onClick={() => navigate(`/profile/${username}`)}
        username={username}
      />
      <div className="w-1 flex-grow cursor-pointer break-words px-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-pong-blue-100">{username}</p>
          <p className="text-sm font-bold text-pong-blue-100">{time}</p>
        </div>
        <p className="mt-3 text-base text-pong-white">{message}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
