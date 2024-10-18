interface BannerImageProps {
  children: React.ReactNode;
}

export function BannerImage({ children }: BannerImageProps) {
  return (
    <div className="flex h-44 w-3/4 max-w-[1000px] flex-col items-center justify-center rounded-[20px] bg-profile-default bg-cover bg-center md:h-52 ">
      {children}
    </div>
  );
}
