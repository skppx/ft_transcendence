import { CONST_BACKEND_URL } from '@constant';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ModifyProfile from './ModifyProfile';
import MatchHistory from './MatchHistory';
import { Background } from '../Background';
import { MainContainer } from '../MainContainer';
import { BannerImage } from '../BannerImage';
import { ProfilePicture } from '../ProfilePicture';
import { BannerInfo } from '../BannerInfo';
import { LeftBlock } from '../LeftBlock';
import { CenterBlock } from '../CenterBlock';
import { RightBlock } from '../RightBlock';

type DataUser = { img: string; username: string; uuid: string };

// will add other info when needed
export default function Profile() {
  const [option, setOption] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [data, setData] = useState<DataUser | null>();

  useEffect(() => {
    if (!data) {
      const jwt = localStorage.getItem('jwt');

      const fetchData = () => {
        const config: AxiosRequestConfig = {
          withCredentials: true,
          headers: { Authorization: `Bearer ${jwt}` }
        };
        axios
          .get(`${CONST_BACKEND_URL}/img/download`, config)
          .then((res: AxiosResponse) => setData(res.data))
          .catch(() => {});
      };

      fetchData();
    }
  }, [data]);

  useEffect(() => {
    const handleNavigation = () => {
      document.body.className = 'preload';
      setTimeout(() => {
        document.body.className = '';
      }, 500);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  const handleClickOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOption(true);
  };

  const handleClickClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOption(false);
  };

  return (
    <>
      <Background>
        <MainContainer>
          <BannerImage>
            <ProfilePicture imagePreview={imagePreview} isFriend={false} />
          </BannerImage>
          <BannerInfo>
            <LeftBlock />
            <CenterBlock />
            <RightBlock handleClickOption={handleClickOption} />
          </BannerInfo>
          <ModifyProfile
            option={option}
            username={data ? data.username : ''}
            setOption={setOption}
            handleClickClose={handleClickClose}
            setImagePreview={(prev: string) => setImagePreview(prev)}
          />
          <MatchHistory />
        </MainContainer>
      </Background>
      <Outlet />
    </>
  );
}
