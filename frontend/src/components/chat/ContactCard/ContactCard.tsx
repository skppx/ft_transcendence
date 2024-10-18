import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { BiMessageDetail } from 'react-icons/bi';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { useState } from 'react';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import { useOutsideClick } from '../../../utils/hooks/useOutsideClick';
import { useSocketContext } from '../../../contexts/socket';
import SecondaryButton from '../../SecondaryButton/SecondaryButton';
import RenderIf from '../RenderIf/RenderIf';

interface ContactCardProps {
  sendMessage: () => any;
  blockUser: () => any;
  unblockUser: () => any;
  noBgColor?: boolean;
  username: string;
  blocked: boolean;
  userID: string;
}

export function ContactCard({
  sendMessage,
  username,
  noBgColor,
  blockUser,
  unblockUser,
  blocked,
  userID
}: ContactCardProps) {
  const [clicked, setClicked] = useState(false);
  const ref = useOutsideClick(() => setClicked(false));
  const navigate = useNavigate();
  const { socket } = useSocketContext();
  const handleInvite = () => {
    navigate(`/pong/${username}`);
  };
  return (
    <>
      <div
        className={`mx-2 my-1 flex ${
          clicked || blocked ? '' : 'cursor-pointer'
        } flex-shrink-0 items-center justify-between ${
          noBgColor ? 'bg-pong-blue-400' : ''
        } p-3 text-left`}
        role="presentation"
        onContextMenu={(e) => {
          e.preventDefault();
          setClicked(true);
        }}
      >
        <div className="flex flex-shrink-0 items-center justify-center gap-3">
          <ProfilePicture
            size="xs"
            userID={userID}
            onClick={() => navigate(`/profile/${username}`)}
            username={username}
          />
          <button
            type="button"
            onClick={clicked || blocked ? () => {} : sendMessage}
          >
            <p className="semibold max-w-[200px] break-all text-base text-pong-white">
              {username}
            </p>
          </button>
        </div>
        <div ref={ref} className="flex flex-row gap-4">
          {!clicked && !blocked ? (
            <button
              type="button"
              onClick={clicked || blocked ? () => {} : sendMessage}
            >
              <BiMessageDetail className="userMessage h-6 w-6 text-pong-blue-100 " />
            </button>
          ) : null}
          {clicked || blocked ? (
            <div>
              {blocked ? (
                <>
                  <BsEyeSlash
                    onClick={blocked ? unblockUser : blockUser}
                    className="userUnblock h-5 w-5 cursor-pointer text-pong-blue-100"
                  />
                  <Tooltip
                    disableStyleInjection
                    className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
                    anchorSelect=".userUnblock"
                    clickable
                    place="bottom"
                  >
                    <p className="font-semibold">Unblock user</p>
                  </Tooltip>
                </>
              ) : (
                <>
                  <div className="flex flex-row items-center gap-10">
                    <BsEye
                      onClick={blocked ? unblockUser : blockUser}
                      className="userBlock h-5 w-5 cursor-pointer text-pong-blue-100"
                    />
                    <RenderIf some={[username !== socket.username]}>
                      <SecondaryButton
                        onClick={handleInvite}
                        className="mt-3"
                        span="Invite"
                      />
                    </RenderIf>
                  </div>
                  <Tooltip
                    disableStyleInjection
                    className="z-50 flex flex-col rounded border-pong-blue-100 bg-pong-blue-500 bg-opacity-100 p-2 text-pong-white text-opacity-100 "
                    anchorSelect=".userBlock"
                    clickable
                    place="bottom"
                  >
                    <p className="font-semibold">Block user</p>
                  </Tooltip>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
