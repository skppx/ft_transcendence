import { Block } from './Block';
import { Status } from './Profile/Status';
import { ProfileSettings } from './ProfileSettings';
import { Separator } from './Separator';

interface RightBlockProps {
  handleClickOption: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function RightBlock({ handleClickOption }: RightBlockProps) {
  return (
    <div className="flex flex-row items-center justify-end gap-3">
      <Block>
        <ProfileSettings handleClickOption={handleClickOption} />
      </Block>
      <Separator />
      <Block>
        <Status />
      </Block>
    </div>
  );
}
