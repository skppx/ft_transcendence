import { CONST_BACKEND_URL } from '@constant';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Props {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  select?: boolean;
  chanID: string;
}

const style = Object.freeze({
  xs: 'h-[39px] w-[39px] border-[1.2px]',
  s: 'h-[50px] w-[50px] border-[1.7px]',
  m: 'h-[78px] w-[78px] border-[2.5px]',
  l: 'h-[110px] w-[110px] border-[3.5px]',
  xl: 'h-[155px] w-[155px] border-[5px]'
});

type ImageInfo = { img: string; chanName: string };

export function ChanPicture({ size = 'xl', select = false, chanID }: Props) {
  const [data, setData] = useState<ImageInfo | undefined>();

  useEffect(() => {
    const fetchData = (id: string) => {
      if (!chanID) return;
      const jwt = localStorage.getItem('jwt');
      axios
        .get(`${CONST_BACKEND_URL}/img/download_channel/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwt!}` }
        })
        .then((response) => {
          setData(response.data);
        })
        .catch(() => {});
    };
    fetchData(chanID);
  }, [chanID]);

  return (
    <img
      alt="channel"
      src={data ? data.img : ''}
      className={`object-contain ${
        style[size]
      } w-flex-shrink-0 relative flex items-end justify-center rounded-full ${
        select ? 'border-solid border-pong-purple-100' : 'border-none'
      } bg-cover bg-no-repeat`}
    />
  );
}
