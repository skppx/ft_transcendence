import { useEffect } from 'react';
import {
  Contact,
  ContactList
} from '../../../utils/hooks/useStatus.interfaces';
import { useUsers } from '../../../utils/hooks/useUsers';
import { ContactCard } from '../ContactCard/ContactCard';
import { Scrollable } from '../Scrollable/Scrollable';
import { useSocketContext } from '../../../contexts/socket';
import { useStateContext } from '../../../contexts/state';

interface ContactListProps {
  setUserID: (p: any) => any;
}

export function ContactListFeed({ setUserID }: ContactListProps) {
  const { socket } = useSocketContext();
  const { contactList, blockedList } = useUsers();
  const { toggleConversationView } = useStateContext();

  useEffect(() => {
    socket.emit('users');
    socket.emit('usersBlocked');
  }, [socket]);

  const friend: ContactList = [];
  const online: ContactList = [];
  const offline: ContactList = [];

  contactList
    .filter((d) => d.userID !== socket.userID)
    .forEach((user) => {
      if (user.connected && user.isFriend) {
        friend.push(user);
      } else if (user.connected) {
        online.push(user);
      } else {
        offline.push(user);
      }
    });

  return (
    <Scrollable>
      {friend.length ? (
        <>
          <p className="pl-2 font-semibold text-pong-blue-100">
            {`ONLINE FRIENDS — ${friend.length}`}
          </p>
          {friend.map((user: Contact) => (
            <ContactCard
              key={user.userID}
              username={user.username}
              sendMessage={() => {
                setUserID(user.userID);
                toggleConversationView();
              }}
              blockUser={() => {
                socket.emit('blockUser', {
                  userID: user.userID
                });
              }}
              unblockUser={() => {
                socket.emit('unblockUser', {
                  userID: user.userID
                });
              }}
              blocked={false}
              userID={user.userID}
            />
          ))}
        </>
      ) : null}
      {online.length ? (
        <>
          <p className="pl-2 font-semibold text-pong-blue-100">
            {`ONLINE — ${online.length}`}
          </p>
          {online.map((user: Contact) => (
            <ContactCard
              key={user.userID}
              username={user.username}
              sendMessage={() => {
                setUserID(user.userID);
                toggleConversationView();
              }}
              blockUser={() => {
                socket.emit('blockUser', {
                  userID: user.userID
                });
              }}
              unblockUser={() => {
                socket.emit('unblockUser', {
                  userID: user.userID
                });
              }}
              blocked={false}
              userID={user.userID}
            />
          ))}
        </>
      ) : null}
      {offline.length ? (
        <>
          <p className="mt-3 pl-2 font-bold text-pong-blue-100">
            {`OFFLINE — ${offline.length}`}
          </p>
          {offline.map((user: Contact) => (
            <ContactCard
              key={user.userID}
              username={user.username}
              sendMessage={() => {
                setUserID(user.userID);
                toggleConversationView();
              }}
              blockUser={() => {
                socket.emit('blockUser', {
                  userID: user.userID
                });
              }}
              unblockUser={() => {
                socket.emit('unblockUser', {
                  userID: user.userID
                });
              }}
              blocked={false}
              userID={user.userID}
            />
          ))}
        </>
      ) : null}
      {blockedList.length ? (
        <>
          <p className="mt-3 pl-2 font-bold text-pong-blue-100">
            {`BLOCKED — ${blockedList.length}`}
          </p>
          {blockedList.map((user: Contact) => (
            <ContactCard
              key={user.userID}
              username={user.username}
              sendMessage={() => {
                setUserID(user.userID);
                toggleConversationView();
              }}
              blockUser={() => {
                socket.emit('blockUser', {
                  userID: user.userID
                });
              }}
              userID={user.userID}
              unblockUser={() => {
                socket.emit('unblockUser', {
                  userID: user.userID
                });
              }}
              blocked
            />
          ))}
        </>
      ) : null}
    </Scrollable>
  );
}
