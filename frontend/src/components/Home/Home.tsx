import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar/Navbar';

export default function Home() {
  return (
    <>
      <div className="grid h-screen grid-rows-6 bg-default bg-cover">
        <Navbar />
      </div>
      <Outlet />
    </>
  );
}
