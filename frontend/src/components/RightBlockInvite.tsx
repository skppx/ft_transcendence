import { AiOutlineUserDelete, AiOutlineUserAdd } from 'react-icons/ai';
import { Block } from './Block';
import { Status } from './Profile/Status';
import { Separator } from './Separator';

interface RightBlockInviteProps {
  isFriend: boolean;
  handleClickOption: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function RightBlockInvite({
  isFriend,
  handleClickOption
}: RightBlockInviteProps) {
  return (
    <div className="flex flex-row items-center justify-end gap-3">
      <Block>
        <button type="button" onClick={handleClickOption}>
          {isFriend && <AiOutlineUserDelete className="text-pong-blue-100" />}
          {!isFriend && <AiOutlineUserAdd className="text-pong-blue-100" />}
        </button>
      </Block>
      <Separator />
      <Block>
        <Status />
      </Block>
    </div>
  );
}
