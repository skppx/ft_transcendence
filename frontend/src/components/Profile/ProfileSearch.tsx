import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate, Outlet } from 'react-router-dom';
import { CONST_BACKEND_URL } from '@constant';
import axios, { AxiosRequestConfig } from 'axios';
import MatchHistory from './MatchHistory';
import { Background } from '../Background';
import { MainContainer } from '../MainContainer';
import { BannerImage } from '../BannerImage';
import { ProfilePicture } from '../ProfilePicture';
import { BannerInfo } from '../BannerInfo';
import { LeftBlock } from '../LeftBlock';
import { CenterBlock } from '../CenterBlock';
import { RightBlockInvite } from '../RightBlockInvite';
import { useSocketContext } from '../../contexts/socket';

export default function ProfileSearch() {
  const [isFriend, setIsFriend] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { socket } = useSocketContext();
  const data = useLoaderData() as {
    img: string;
    username: string;
    tofind_uuid: string;
    userFriendList: string[];
  };
  useEffect(() => {
    if (data.userFriendList) {
      const findFriend = data.userFriendList.find(
        (value) => value === data.tofind_uuid
      );
      setIsFriend(findFriend);
    }
  }, [data.tofind_uuid, data.userFriendList]);

  useEffect(() => {
    socket.emit('users');
    socket.emit('usersBlocked');
  }, [socket, isFriend]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const jwt = localStorage.getItem('jwt');
    if (!jwt) navigate('/');

    const config: AxiosRequestConfig = {
      withCredentials: true,
      headers: { Authorization: `Bearer ${jwt!}` }
    };
    if (isFriend) {
      setIsFriend(undefined);
      socket.emit('users');
      axios
        .get(
          `${CONST_BACKEND_URL}/user/removeFriend/${data.tofind_uuid}`,
          config
        )
        .catch(() => {});
    } else {
      setIsFriend(data.tofind_uuid);
      socket.emit('users');
      axios
        .get(`${CONST_BACKEND_URL}/user/addFriend/${data.tofind_uuid}`, config)
        .catch(() => {});
    }
  };

  return (
    <>
      <Background>
        <MainContainer>
          <BannerImage>
            <ProfilePicture
              imagePreview={null}
              isFriend={isFriend !== undefined}
            />
          </BannerImage>
          <BannerInfo>
            <LeftBlock />
            <CenterBlock />
            <RightBlockInvite
              isFriend={isFriend !== undefined}
              handleClickOption={handleClick}
            />
          </BannerInfo>
          <MatchHistory />
        </MainContainer>
      </Background>
      <Outlet />
    </>
  );
}
