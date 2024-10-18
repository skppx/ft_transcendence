interface BannerInfoProps {
  children: React.ReactNode;
}

export function BannerInfo({ children }: BannerInfoProps) {
  return (
    <div className="relative bottom-16 grid h-16 w-[78%] max-w-[1020px] grid-cols-3 content-center rounded-[20px] bg-pong-blue-400 bg-opacity-95 px-5 py-9">
      {children}
    </div>
  );
}
