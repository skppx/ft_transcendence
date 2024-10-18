import { CONST_BACKEND_URL } from '@constant';
import axios from 'axios';
import { useEffect, useState } from 'react';

type ImageInfo = { username: string; uuid: string; img: string };

interface ProfilePictureProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  select?: boolean;
  userID: string;
  username: string;
  onClick: () => void;
}

const style = Object.freeze({
  xs: 'h-[39px] w-[39px] border-[1.2px]',
  s: 'h-[50px] w-[50px] border-[1.7px]',
  m: 'h-[78px] w-[78px] border-[2.5px]',
  l: 'h-[110px] w-[110px] border-[3.5px]',
  xl: 'h-[155px] w-[155px] border-[5px]'
});

function ProfilePicture({
  size = 'xl',
  select = false,
  userID,
  onClick,
  username
}: ProfilePictureProps) {
  const [data, setData] = useState<ImageInfo | undefined>(undefined);
  useEffect(() => {
    const fetchData = () => {
      const jwt = localStorage.getItem('jwt');
      const url = `${CONST_BACKEND_URL}/img/download/${username}`;
      const config = {
        withCredentials: true,
        headers: { Authorization: `Bearer ${jwt!}` }
      };
      axios
        .get(url, config)
        .then((response) => {
          setData(response.data);
        })
        .catch(() => {});
    };
    fetchData();
  }, [userID, username]);

  return (
    <div role="presentation" onClick={onClick}>
      <img
        alt="pp"
        src={data ? data.img : ''}
        className={`object-contain ${
          style[size]
        } w-flex-shrink-0 relative flex cursor-pointer items-end justify-center rounded-full ${
          select ? 'border-solid border-pong-purple-100' : 'border-none'
        } bg-cover bg-no-repeat`}
      />
    </div>
  );
}

export default ProfilePicture;
