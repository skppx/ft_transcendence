import { useState } from 'react';
import { BanButton } from './BanButton';
import { ChanContact } from './ChanContact/ChanContact';
import { KickButton } from './KickButton';
import { MuteButton } from './MuteButton';
import { RemoveAdminButton } from './RemoveAdminButton';
import { useOutsideClick } from '../../utils/hooks/useOutsideClick';

interface AdminContactProps {
  username: string;
  userID: string;
  chanID: string;
  displayButtons: boolean;
}

export function AdminContact({
  username,
  userID,
  chanID,
  displayButtons
}: AdminContactProps) {
  const [display, setDisplay] = useState(false);
  const ref = useOutsideClick(() => setDisplay(false));
  const buttons = () => (
    <>
      <RemoveAdminButton userID={userID} chanID={chanID} />
      <KickButton userID={userID} chanID={chanID} />
      <BanButton userID={userID} chanID={chanID} />
      <MuteButton userID={userID} chanID={chanID} />
    </>
  );
  return (
    <ChanContact
      innerRef={ref}
      onContextMenu={(e) => {
        e.preventDefault();
        setDisplay(true);
      }}
      key={userID}
      username={username}
      hideUsername={display && displayButtons}
      userID={userID}
      showPointer={displayButtons && !display}
    >
      {displayButtons && display ? buttons() : null}
    </ChanContact>
  );
}
