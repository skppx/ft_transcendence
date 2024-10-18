import Header from './Header';
import Authorize42 from './Authorize42';

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center bg-default bg-cover">
      <div className="mb-4 flex w-[350px] flex-col items-center divide-y-[1px] divide-gray-400 rounded-[25px] border border-blue-pong-1 bg-blue-pong-2 px-8 py-10">
        <Header />
        <Authorize42 />
      </div>
    </div>
  );
}
