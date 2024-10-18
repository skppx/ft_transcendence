import { IoMdSettings } from 'react-icons/io';

interface ProfileSettingsProps {
  handleClickOption: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ProfileSettings({ handleClickOption }: ProfileSettingsProps) {
  return (
    <button type="button" onClick={handleClickOption}>
      <IoMdSettings className="text-pong-blue-100" />
    </button>
  );
}
